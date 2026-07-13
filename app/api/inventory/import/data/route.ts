import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }

    if (!tenantId) {
      return NextResponse.json({ success: false, message: 'Unauthorized. Missing tenant context.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const overwriteData = formData.get('overwriteData') === 'true';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided.' }, { status: 400 });
    }

    const fileText = await file.text();
    const parsedData = Papa.parse(fileText, { header: true, skipEmptyLines: true });
    const rows = parsedData.data as any[];
    
    let processedCount = 0;
    let skippedCount = 0;

    for (const row of rows) {
      try {
        const handle = row['Handle'];
        const title = row['Title'];
        if (!handle || !title) continue; 

        const designCode = row['Design code (product.metafields.custom.design_code)'] || row['Variant SKU'] || `AJ-${handle.substring(0, 8).toUpperCase()}`;
        const description = row['Body (HTML)'] || '';
        const metalPurity = row['Metal color (product.metafields.custom.metal_color)'] || '18KT';
        const grossWeight = parseFloat(row['Variant Grams']) || 0;
        const pureWeight = 0; 
        const igiCertNumber = row['IGI certificate number (product.metafields.custom.igi_certificate_number)'] || null;
        const estimatedPrice = parseFloat(row['Variant Price']) || 0;
        const imageSrc = row['Image Src'] || null;

        if (overwriteData) {
          await prisma.product.upsert({
            where: { tenantId_handle: { tenantId, handle } }, 
            update: {
              designCode, title, description, metalPurity, grossWeight, pureWeight, igiCertNumber, estimatedPrice,
              ...(imageSrc && { description: imageSrc }), 
            },
            create: {
              tenantId, handle, designCode, title, description, metalPurity, grossWeight, pureWeight, igiCertNumber, estimatedPrice
            }
          });
          processedCount++;
        } else {
          const existingProduct = await prisma.product.findUnique({ where: { tenantId_handle: { tenantId, handle } } });
          if (existingProduct) {
            skippedCount++;
            continue; 
          }
          await prisma.product.create({
            data: { tenantId, handle, designCode, title, description, metalPurity, grossWeight, pureWeight, igiCertNumber, estimatedPrice }
          });
          processedCount++;
        }
      } catch (rowError) {
        console.error(`❌ DB Error on Handle [${row['Handle']}]:`, rowError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Master Matrix Updated cleanly! Added/Updated: ${processedCount} SKUs. Skipped: ${skippedCount} SKUs.` 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}