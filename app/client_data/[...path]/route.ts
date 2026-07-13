import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  try {
    // In Next.js 15+, params is a Promise. We handle both sync and async for safety.
    const params = await context.params;
    const filePathArray = params.path || [];
    
    // The base directory for all client data (isolated from the main codebase)
    const baseDir = path.resolve(process.cwd(), '../client_data');
    
    // Safely join the requested path to prevent directory traversal attacks
    const requestedPath = path.join(baseDir, ...filePathArray);
    
    // Security Check: Ensure the resolved path is still inside the baseDir
    if (!requestedPath.startsWith(baseDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if file exists
    if (!fs.existsSync(requestedPath)) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Determine content type
    const ext = path.extname(requestedPath).toLowerCase();
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.csv') contentType = 'text/csv';

    // Read and serve the file
    const fileBuffer = fs.readFileSync(requestedPath);
    
    return new NextResponse(fileBuffer, {
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
