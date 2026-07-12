import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route'; // Verify path
import Papa from 'papaparse';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // 1. Strict Admin Gatekeeper
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the Multipart FormData payload
    const formData = await req.formData();
    const csvFile = formData.get('csv') as File;
    const mediaZip = formData.get('mediaBulk') as File | null;
    const conflictRule = formData.get('conflictRule') as string || 'SKIP';

    if (!csvFile) {
      return NextResponse.json({ error: 'CSV payload missing.' }, { status: 400 });
    }

    // 3. Fetch active Custom Fields to map dynamic columns
    const customFields = await prisma.customField.findMany();
    const customFieldMap = new Map(customFields.map(cf => [cf.name, cf.id]));

    // 4. Read & Parse CSV
    const csvText = await csvFile.text();
    const parsedCsv = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    
    let processedCount = 0;

    // 5. Ingestion Loop (Data Sync)
    for (const row of parsedCsv.data as any[]) {
      const designCode = row['DesignCode'] || row['Variant SKU'];
      if (!designCode) continue;

      // Upsert Core Product Model
      const product = await prisma.product.upsert({
        where: { designCode },
        update: {
          title: row['Title'] || undefined,
          description: row['Description'] || row['Body (HTML)'] || undefined,
          price: parseFloat(row['Price'] || row['Variant Price']) || 0,
          category: row['Category'] || row['Type'] || undefined,
        },
        create: {
          handle: row['Handle'] || designCode.toLowerCase(),
          designCode,
          title: row['Title'] || 'Untitled SKU',
          description: row['Description'] || row['Body (HTML)'] || '',
          price: parseFloat(row['Price'] || row['Variant Price']) || 0,
          category: row['Category'] || row['Type'] || '',
        }
      });

      // Sync Dynamic Custom Fields
      for (const [headerName, cellValue] of Object.entries(row)) {
        if (cellValue && customFieldMap.has(headerName)) {
          const fieldId = customFieldMap.get(headerName)!;
          await prisma.productFieldValue.upsert({
            where: { productId_fieldId: { productId: product.id, fieldId } },
            update: { value: String(cellValue) },
            create: { productId: product.id, fieldId, value: String(cellValue) }
          });
        }
      }
      processedCount++;
    }

    // 6. Media Pipeline: ZIP Extraction & Regex Mapping
    if (mediaZip) {
      // Ensure the local storage directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Read ZIP into memory
      const zipBuffer = Buffer.from(await mediaZip.arrayBuffer());
      const zip = new AdmZip(zipBuffer);
      const zipEntries = zip.getEntries();

      for (const entry of zipEntries) {
        if (entry.isDirectory) continue;
        
        const fileName = entry.entryName.split('/').pop();
        if (!fileName || !fileName.match(/\.(jpg|jpeg|png|webp)$/i)) continue;

        // REGEX: Matches "SKU_1.jpg", extracts "SKU" (Group 1) and "1" (Group 2)
        const match = fileName.match(/^(.+)_(\d+)\.(jpg|jpeg|png|webp)$/i);
        
        if (match) {
          const sku = match[1];
          const sequence = parseInt(match[2], 10);
          
          // Find the product by DesignCode
          const product = await prisma.product.findUnique({ where: { designCode: sku } });
          
          if (product) {
            // Write the physical file to the local server
            const savePath = path.join(uploadDir, fileName);
            fs.writeFileSync(savePath, entry.getData());
            const localUrl = `/uploads/products/${fileName}`;

            // Handle Conflict Rules
            if (conflictRule === 'OVERWRITE') {
               await prisma.productMedia.deleteMany({ where: { productId: product.id } });
            }
            
            const existingMedia = await prisma.productMedia.findFirst({ 
              where: { productId: product.id, url: localUrl } 
            });

            if (!existingMedia || conflictRule === 'OVERWRITE' || conflictRule === 'APPEND') {
              await prisma.productMedia.create({
                data: {
                  productId: product.id,
                  url: localUrl,
                  sequence,
                  isPrimary: sequence === 1 // Set _1 as the main thumbnail
                }
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: processedCount,
      message: 'Pipeline executed successfully.'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Execution Engine Crash:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}