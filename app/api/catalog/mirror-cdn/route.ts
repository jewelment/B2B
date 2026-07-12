import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Fetch batch of 50 products currently relying on Shopify CDN
    const products = await prisma.product.findMany({
      where: {
        description: { contains: 'cdn.shopify.com' }
      },
      take: 50 
    });

    if (products.length === 0) {
      return NextResponse.json({ success: true, message: 'All CDN images are already mirrored locally.' }, { status: 200 });
    }

    const localDir = path.join(process.cwd(), 'public', 'assets', 'products');
    
    // 2. Ensure local directory exists
    try {
      await fs.access(localDir);
    } catch {
      await fs.mkdir(localDir, { recursive: true });
    }

    let downloadedCount = 0;
    const updates = [];

    // 3. Process the batch
    for (const product of products) {
      if (!product.description) continue;

      try {
        // Fetch binary image data
        const response = await fetch(product.description);
        if (!response.ok) continue;

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Standardized nomenclature: SKU_1.extension
        const urlObj = new URL(product.description);
        const extension = path.extname(urlObj.pathname) || '.jpg'; 
        const fileName = `${product.designCode}_1${extension}`;
        const localFilePath = path.join(localDir, fileName);
        const localDbUrl = `/assets/products/${fileName}`;

        // Write file locally
        await fs.writeFile(localFilePath, buffer);

        // Queue database update to point to local file
        updates.push(
          prisma.product.update({
            where: { id: product.id },
            data: { description: localDbUrl }
          })
        );

        downloadedCount++;
      } catch (imgError) {
        console.error(`Failed to download image for ${product.designCode}:`, imgError);
      }
    }

    // 4. Execute all DB updates in a single transaction
    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully mirrored ${downloadedCount} Shopify images to local storage.` 
    }, { status: 200 });

  } catch (error) {
    console.error('CDN Mirror Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to mirror CDN images.' }, { status: 500 });
  }
}