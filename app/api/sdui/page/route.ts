import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path') || '/';
    const platform = searchParams.get('platform') || 'WEB';
    const tenantId = (session.user as any).tenantId;

    const page = await prisma.sduiPage.findFirst({
      where: { tenantId, platform, path }
    });

    if (!page || !page.layoutData) {
      return NextResponse.json({ layoutData: [] });
    }

    return NextResponse.json({ layoutData: JSON.parse(page.layoutData) });
  } catch (error) {
    console.error('Fetch SDUI Page Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
