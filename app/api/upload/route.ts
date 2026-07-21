import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  console.log('[UPLOAD API] Started');
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      console.log('[UPLOAD API] No session found');
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = (formData as any).get('file') as File;
    
    if (!file) {
      console.log('[UPLOAD API] No file received in form data');
      return NextResponse.json({ error: 'No file received.' }, { status: 400 });
    }

    console.log(`[UPLOAD API] Received file: ${file.name}, size: ${file.size}`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${uniqueSuffix}-${originalName}`;

    // Define upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'tickets');
    
    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    // Save the file
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    
    console.log(`[UPLOAD API] File saved successfully at ${filePath}`);

    // Return the accessible URL
    const fileUrl = `/uploads/tickets/${filename}`;

    return NextResponse.json({ success: true, url: fileUrl, filename: originalName, size: buffer.length });

  } catch (error: any) {
    console.error('[UPLOAD API] File Upload Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
