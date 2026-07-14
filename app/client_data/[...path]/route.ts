import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  try {
    const session = await getServerSession(authOptions);
    let tenantId = null;

    if (session && session.user) {
      tenantId = (session.user as any).tenantId;
      if (!tenantId && session.user.email) {
        const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
        if (dbUser) tenantId = dbUser.tenantId;
      }
    }

    if (tenantId) {
      const settings = await prisma.storeSettings.findUnique({
        where: { tenantId }
      });
      
      if (settings?.enableSecureMediaProxy !== false) {
        return new NextResponse('Not Found', { status: 404 });
      }
    } else {
      return new NextResponse('Not Found', { status: 404 });
    }

    const params = await context.params;
    const filePathArray = params.path || [];
    
    // The base directory for all client data (isolated from the main codebase)
    // E.g. we store them in Jewelment B2B Dev V1/b2b-portal/client_data
    const baseDir = path.resolve(process.cwd(), 'client_data');
    
    // Safely join the requested path to prevent directory traversal attacks
    let requestedPath = path.join(baseDir, ...filePathArray);
    
    // Security Check: Ensure the resolved path is still inside the baseDir
    if (!requestedPath.startsWith(baseDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Handle on-the-fly WebP conversion for public route
    let isWebpRequest = false;
    if (!fs.existsSync(requestedPath) && requestedPath.endsWith('.webp')) {
      const jpgPath = requestedPath.replace(/\.webp$/, '.jpg');
      const pngPath = requestedPath.replace(/\.webp$/, '.png');
      
      if (fs.existsSync(jpgPath)) {
        requestedPath = jpgPath;
        isWebpRequest = true;
      } else if (fs.existsSync(pngPath)) {
        requestedPath = pngPath;
        isWebpRequest = true;
      }
    }

    // Check if file exists
    if (!fs.existsSync(requestedPath)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Read file
    const ext = path.extname(requestedPath).toLowerCase();
    const fileBuffer = fs.readFileSync(requestedPath);
    let outputBuffer = fileBuffer;
    let contentType = 'application/octet-stream';
    
    if (isWebpRequest || ext === '.webp') {
      try {
        if (!requestedPath.endsWith('.webp')) {
          outputBuffer = await sharp(fileBuffer).webp({ quality: 80 }).toBuffer();
        }
        contentType = 'image/webp';
      } catch (err) {
        console.error('Sharp optimization failed for public route:', err);
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
      }
    } else {
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.csv') contentType = 'text/csv';
    }

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache images aggressively to improve performance
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Error serving client data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
