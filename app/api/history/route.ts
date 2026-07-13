import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';


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

    // 1. Fetch all orders for this tenant, explicitly including the nested line items array
    const orders = await prisma.purchaseOrder.findMany({
      where: { tenantId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc' // Newest orders first
      }
    });

    return NextResponse.json({ success: true, orders });
    
  } catch (error) {
    console.error('Order History Fetch Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve order history.' },
      { status: 500 }
    );
  } finally {
  }
}