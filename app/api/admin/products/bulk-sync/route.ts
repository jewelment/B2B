import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  try {
    // 1. Intercept Multipart FormData
    const formData = await req.formData();
    const editsString = (formData as any).get('edits') as string;
    
    if (!editsString) {
      return NextResponse.json({ error: 'Empty payload.' }, { status: 400 });
    }

    const edits = JSON.parse(editsString);
    const updatePromises = [];

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/uploads/gallery');
    await mkdir(uploadDir, { recursive: true });

    // 2. Process the Matrix Payload
    for (const edit of edits) {
      const { id, gallery, price, stock, ...fieldsToUpdate } = edit;
      
      const dataToUpdate: any = { ...fieldsToUpdate };

      // PRISMA SAFETY: Strict Type Casting for SQLite
      if (price !== undefined) dataToUpdate.price = parseFloat(price);
      if (stock !== undefined) dataToUpdate.stock = parseInt(stock, 10);

      // 3. Media Processing Engine
      if (gallery) {
        const finalGallery = [];
        
        for (let i = 0; i < gallery.length; i++) {
          const item = gallery[i];
          
          if (typeof item === 'string' && item.startsWith('UPLOADED:')) {
            const fieldName = item.replace('UPLOADED:', '');
            const file = (formData as any).get(fieldName) as File;
            
            if (file) {
              const bytes = await file.arrayBuffer();
              const buffer = Buffer.from(bytes);
              
              const ext = file.name.split('.').pop() || 'jpg';
              const fileName = `${fieldsToUpdate.designCode || id}_${i + 1}.${ext}`;
              const filePath = path.join(uploadDir, fileName);
              
              await writeFile(filePath, buffer);
              finalGallery.push(`/uploads/gallery/${fileName}`);
            }
          } else {
            finalGallery.push(item); 
          }
        }

        // 4. Schema Mapping for SQLite
        if (finalGallery.length > 0) {
          dataToUpdate.primaryImage = finalGallery.find(img => img !== null) || null;
          // SQLite requires arrays to be stored as JSON strings
          dataToUpdate.gallery = JSON.stringify(finalGallery); 
        }
      }

      // 5. Queue the Atomic Database Update
      updatePromises.push(
        prisma.product.update({
          where: { id: String(id) }, // Ensures ID is a string for CUID/UUID
          data: dataToUpdate
        })
      );
    }

    // 6. Execute Transaction
    await prisma.$transaction(updatePromises);

    return NextResponse.json({ success: true, message: `Synced ${edits.length} SKUs.` }, { status: 200 });

  } catch (error: any) {
    console.error('Bulk Sync Error:', error);
    // Extract the specific Prisma failure reason to show on the frontend
    const errorMessage = error.meta?.cause || error.message || 'Database transaction failed.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  } finally {
  }
}