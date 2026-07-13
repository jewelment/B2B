import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { pageId, layoutData, environment } = await req.json();

    if (!pageId || !layoutData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify ownership
    const tenantId = (session.user as any).tenantId;
    const page = await prisma.sduiPage.findUnique({ where: { id: pageId } });
    
    if (!page || page.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Save the layout
    const updatedPage = await prisma.sduiPage.update({
      where: { id: pageId },
      data: { 
        layoutData,
        ...(environment && { environment }) 
      }
    });

    return NextResponse.json({ success: true, page: updatedPage });
  } catch (error: any) {
    console.error('SDUI Save Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
