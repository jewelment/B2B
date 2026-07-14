import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let tenantId = session?.user ? (session.user as any).tenantId : null;
    let userId = session?.user ? (session.user as any).id : null;

    if (!tenantId && session?.user?.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) {
        tenantId = dbUser.tenantId;
        userId = dbUser.id;
      }
    }

    if (!tenantId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { catalogId, eventType, eventData } = body;

    if (!eventType) {
      return new NextResponse('Bad Request: eventType is required', { status: 400 });
    }

    const event = await prisma.analyticsEvent.create({
      data: {
        tenantId,
        catalogId: catalogId || null,
        userId: userId || null,
        eventType,
        eventData: eventData ? JSON.stringify(eventData) : null,
      }
    });

    // If it's a CATALOG_VIEW, let's also increment the Catalog view count
    if (eventType === 'CATALOG_VIEW' && catalogId) {
      await prisma.catalog.update({
        where: { id: catalogId },
        data: { views: { increment: 1 } }
      }).catch(console.error); // Catch error if catalog doesn't exist
    }

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
