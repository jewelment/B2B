import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    console.error('Fetch banners error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.imageUrl || !data.placement) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    let banner;
    if (data.id) {
      banner = await prisma.banner.update({
        where: { id: data.id },
        data: {
          title: data.title,
          imageUrl: data.imageUrl,
          mobileImageUrl: data.mobileImageUrl || null,
          linkUrl: data.linkUrl || null,
          placement: data.placement,
          status: data.status || 'ACTIVE'
        }
      });
    } else {
      banner = await prisma.banner.create({
        data: {
          title: data.title,
          imageUrl: data.imageUrl,
          mobileImageUrl: data.mobileImageUrl || null,
          linkUrl: data.linkUrl || null,
          placement: data.placement,
          status: data.status || 'ACTIVE'
        }
      });
    }

    return NextResponse.json({ success: true, data: banner });
  } catch (error: any) {
    console.error('Save banner error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
