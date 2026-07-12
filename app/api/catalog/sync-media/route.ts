import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Define the target directory where your batch-renamed renders are stored
    // Standard path: /public/assets/renders/
    const rendersDir = path.join(process.cwd(), 'public', 'assets', 'renders');
    
    // Ensure directory exists
    try {
      await fs.access(rendersDir);
    } catch {
      return NextResponse.json({ success: false, message: 'Media directory not found. Please create /public/assets/renders/' }, { status: 400 });
    }

    const files = await fs.readdir(rendersDir);
    let syncCount = 0;
    const updates = [];

    // 2. Scan and Match
    for (const file of files) {
      // Assuming nomenclature like: AJ-1024_8K.jpg or AJ-1024.png
      // This Regex extracts the base Design Code before any underscores or extensions
      const match = file.match(/^([A-Za-z0-9-]+)/); 
      
      if (match && match[1]) {
        const designCode = match[1].toUpperCase();
        const fileUrl = `/assets/renders/${file}`;

        // 3. Prepare the database update transaction
        updates.push(
          prisma.product.updateMany({
            where: { designCode: designCode },
            data: { description: fileUrl } 
          })
        );
        syncCount++;
      }
    }

    // 4. Execute all updates simultaneously for maximum performance
    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synchronized ${syncCount} 3D assets to the Product Matrix.` 
    }, { status: 200 });

  } catch (error) {
    console.error('Media Sync Error:', error);
    return NextResponse.json({ success: false, message: 'Server error during media synchronization.' }, { status: 500 });
  }
}