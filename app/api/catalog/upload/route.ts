import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Papa from 'papaparse';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Strict RBAC: Ensure only Admins can alter the Master Catalog
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    // 2. Extract the uploaded CSV file
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file provided.' }, { status: 400 });
    }

    // 3. Read and parse the CSV data
    const fileText = await file.text();
    const parsedData = Papa.parse(fileText, {
      header: true,
      skipEmptyLines: true,
    });

    const rows = parsedData.data as any[];
    let processedCount = 0;

    // 4. Map Shopify Data to Prisma Schema
    for (const row of rows) {
      // Ensure essential fields exist before processing
      if (!row['Handle'] || !row['Title']) continue;

      const handle = row['Handle'];
      
      // Mapping logic: Targeting specific Metafield headers from your updated export format
      const igiNumber = row['custom.igi_certificate_number'] || null;
      const metalPurity = row['custom.metal_purity'] || '18KT'; // Default fallback
      
      // Parse numerical values safely
      const grossWeight = parseFloat(row['custom.gross_weight']) || 0;
      const pureWeight = parseFloat(row['custom.pure_weight']) || 0;
      const estimatedPrice = parseFloat(row['Variant Price']) || 0;

      // Extract the exact Design Code and the Shopify CDN Image link
      const designCode = row['Variant SKU'] || row['SKU'] || `AJ-${handle.substring(0, 8).toUpperCase()}`;
      const imageSrc = row['Image Src'] || null;

      await prisma.product.upsert({
        where: { handle },
        update: {
          title: row['Title'],
          // description: row['Body (HTML)'], (omitted, description is used for imageSrc)
          metalPurity,
          grossWeight,
          pureWeight,
          igiCertNumber: igiNumber,
          estimatedPrice,
          // Safely attach the CDN link without overwriting existing local 8K renders if the CSV cell is blank
          ...(imageSrc && { description: imageSrc }), 
        },
        create: {
          handle,
          designCode,
          title: row['Title'],
          // description: row['Body (HTML)'], (omitted, description is used for imageSrc)
          metalPurity,
          grossWeight,
          pureWeight,
          igiCertNumber: igiNumber,
          estimatedPrice,
          description: imageSrc, // Instantly attach Shopify CDN Image on creation
        }
      });

      processedCount++;
    }

    return NextResponse.json(
      { message: `Successfully processed ${processedCount} products with image links.` },
      { status: 200 }
    );

  } catch (error) {
    console.error('Catalog Upload Error:', error);
    return NextResponse.json(
      { message: 'Internal server error during CSV upload.' },
      { status: 500 }
    );
  }
}