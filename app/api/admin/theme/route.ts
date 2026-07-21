import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';


// Ensure directory exists
async function ensureDir(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (err: any) {
    if (err.code !== 'EEXIST') throw err;
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Missing tenant context.' }, { status: 401 });
    }

    let settings = await prisma.storeSettings.findUnique({ where: { tenantId } });
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: { tenantId }
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Theme Settings GET Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch theme settings' }, { status: 500 });
  } finally {
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Missing tenant context.' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    
    // Handle JSON updates (Fonts & SEO)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { primaryFont, secondaryFont, brandName, brandDescription, brandSubheading } = body;

      const updated = await prisma.storeSettings.upsert({
        where: { tenantId },
        update: { primaryFont, secondaryFont, brandName, brandDescription, brandSubheading },
        create: { tenantId, primaryFont, secondaryFont, brandName, brandDescription, brandSubheading }
      });
      return NextResponse.json({ success: true, settings: updated });
    }

    // Handle Multipart Form Data (File Uploads)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      const assetType = (formData as any).get('assetType') as string; // 'logoLight', 'logoDark', 'faviconLight', 'faviconDark', 'componentAsset'
      const file = (formData as any).get('file') as File;

      if (!assetType || !file) {
        return NextResponse.json({ success: false, error: 'Missing file or assetType.' }, { status: 400 });
      }

      // Secure physical storage boundary
      const uploadDir = path.join(process.cwd(), 'public', 'assets', 'brands', tenantId);
      await ensureDir(uploadDir);

      const extension = file.name.split('.').pop() || 'png';
      const safeFilename = `${assetType}-${Date.now()}.${extension}`;
      const filePath = path.join(uploadDir, safeFilename);
      const publicUrl = `/assets/brands/${tenantId}/${safeFilename}`;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      if (assetType === 'componentAsset') {
        return NextResponse.json({ success: true, url: publicUrl });
      }

      // Update Database
      const updateData: any = {};
      updateData[assetType] = publicUrl;

      const updated = await prisma.storeSettings.upsert({
        where: { tenantId },
        update: updateData,
        create: { tenantId, ...updateData }
      });

      return NextResponse.json({ success: true, url: publicUrl, settings: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid Content-Type.' }, { status: 400 });

  } catch (error) {
    console.error("Theme Settings POST Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to process theme update' }, { status: 500 });
  } finally {
  }
}
