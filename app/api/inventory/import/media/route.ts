import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
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
    const syncMode = (formData as any).get('syncMode') as string || 'APPEND';
    const files = (formData as any).getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No media files provided.' }, { status: 400 });
    }

    // Ensure target directory exists
    const localDir = path.join(process.cwd(), 'public', 'assets', 'products');
    try {
      await fs.access(localDir);
    } catch {
      await fs.mkdir(localDir, { recursive: true });
    }

    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const file of files) {
      // Regex to extract the base SKU from filenames like "AJ-101_1.jpg" or "AJ-101__2.png"
      // It captures everything before the first underscore
      const match = file.name.match(/^([^_\.]+)/);
      
      if (!match) {
        errorCount++;
        continue;
      }

      const designCode = match[1].toUpperCase();

      try {
        // Find the corresponding product in the database for THIS tenant
        const product = await prisma.product.findFirst({
          where: { tenantId, designCode },
        });

        // QC Gate: If product doesn't exist, skip the image to prevent "orphaned" media
        if (!product) {
          skippedCount++;
          continue;
        }

        // Apply Business Logic (Conflict Resolution)
        const hasExistingImage = !!product.description;
        let shouldUpdate = false;

        if (syncMode === 'OVERWRITE') {
          shouldUpdate = true;
        } else if (syncMode === 'SKIP' && !hasExistingImage) {
          shouldUpdate = true;
        } else if (syncMode === 'APPEND') {
          // For now, mapping the primary image (e.g. if it ends in _1)
          if (file.name.includes('_1.') || !hasExistingImage) {
            shouldUpdate = true;
          }
        }

        // Write the physical file to the local directory
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(localDir, file.name);
        await fs.writeFile(filePath, buffer);

        // Update Database Link if authorized by logic
        if (shouldUpdate) {
          await prisma.product.update({
            where: { id: product.id },
            data: { description: `/assets/products/${file.name}` }
          });
          processedCount++;
        } else {
          // File saved locally, but DB wasn't overwritten (e.g. SKIP mode)
          skippedCount++; 
        }

      } catch (err) {
        console.error(`❌ Failed to process image ${file.name}:`, err);
        errorCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Media Sync Complete! Mapped: ${processedCount}. Skipped: ${skippedCount}. Errors: ${errorCount}.` 
    }, { status: 200 });

  } catch (error) {
    console.error('Fatal Media Import Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error during media synchronization.' }, { status: 500 });
  }
}