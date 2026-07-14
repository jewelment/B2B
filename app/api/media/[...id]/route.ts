import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string[] }> | { id: string[] } }) {
  try {
    // 1. Authentication Check
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }

    if (!tenantId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch Store Settings
    const settings = await prisma.storeSettings.findUnique({
      where: { tenantId }
    });

    // 2. Resolve Parameters
    const params = await context.params;
    const mediaId = params.id && params.id.length > 0 ? params.id[0] : null;

    if (!mediaId) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    // 3. Database Lookup and Authorization
    const media = await prisma.productMedia.findUnique({
      where: { id: mediaId },
      include: { product: true }
    });

    if (!media) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Security Check: Does this media belong to the user's tenant?
    if (media.product.tenantId !== tenantId) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 4. File Resolution
    const cleanUrl = media.url.startsWith('/') ? media.url.substring(1) : media.url;
    const baseDir = path.resolve(process.cwd(), '..'); 
    const requestedPath = path.join(baseDir, cleanUrl);
    const clientDataDir = path.join(baseDir, 'client_data');

    if (!requestedPath.startsWith(clientDataDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    if (!fs.existsSync(requestedPath)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    let ext = path.extname(requestedPath).toLowerCase();
    const fileBuffer = fs.readFileSync(requestedPath);
    let outputBuffer = fileBuffer;
    let contentType = 'application/octet-stream';

    // 5. On-the-fly WebP Optimization
    if (settings?.enableWebpOptimization && (ext === '.jpg' || ext === '.jpeg' || ext === '.png')) {
      try {
        outputBuffer = await sharp(fileBuffer).webp({ quality: 80 }).toBuffer();
        contentType = 'image/webp';
      } catch (err) {
        console.error('Sharp optimization failed, falling back to original:', err);
        // Fallback to original content type if sharp fails
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
      }
    } else {
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.csv') contentType = 'text/csv';
    }
    
    const isWebp = contentType === 'image/webp';
    const downloadFilename = isWebp 
      ? `${path.parse(requestedPath).name}.webp` 
      : path.basename(requestedPath);

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${downloadFilename}"`,
        // Cache images aggressively in the browser but keep it private to the user
        'Cache-Control': 'private, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Error serving secure media:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
