import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get('placement');

    const banners = await prisma.banner.findMany({
      where: {
        status: 'ACTIVE',
        ...(placement ? { placement } : {})
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: banners });
  } catch (error: any) {
    console.error('Fetch storefront banners error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
