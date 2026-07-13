import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ZipArchive } from 'archiver';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // We try to find the tenant context from the URL if passed, or default to the first
    // In a multi-tenant Edge environment, the tenantId would be a header.
    const url = new URL(req.url);
    const tenantIdParam = url.searchParams.get('tenantId');

    let settings = null;
    
    if (tenantIdParam) {
      settings = await prisma.storeSettings.findUnique({ where: { tenantId: tenantIdParam } });
    } else {
      settings = await prisma.storeSettings.findFirst();
    }

    const publicDir = path.join(process.cwd(), 'public');

    const assetsToZip = [
      { name: 'logo-light', url: settings?.logoLight || '/brand/logo-maroon.png' },
      { name: 'logo-dark', url: settings?.logoDark || '/brand/logo-gold.png' },
      { name: 'favicon-light', url: settings?.faviconLight || '/brand/favicon-maroon.png' },
      { name: 'favicon-dark', url: settings?.faviconDark || '/brand/favicon-gold.png' },
    ];

    // Create an Archiver stream
    const archive = new ZipArchive({
      zlib: { level: 9 } 
    });

    // Create a pass-through stream to pipe the archive to Next's NextResponse
    const stream = new ReadableStream({
      start(controller) {
        archive.on('data', (chunk) => controller.enqueue(chunk));
        archive.on('end', () => controller.close());
        archive.on('error', (err) => controller.error(err));
      }
    });

    for (const asset of assetsToZip) {
      // Remove any leading slashes or URL query params to get the absolute path
      const cleanUrl = asset.url.split('?')[0];
      const filePath = path.join(publicDir, cleanUrl);
      
      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath) || '.png';
        archive.file(filePath, { name: `${asset.name}${ext}` });
      }
    }

    archive.finalize();

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="brand_assets.zip"`,
      }
    });

  } catch (error) {
    console.error("ZIP Generation Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to generate asset bundle.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
