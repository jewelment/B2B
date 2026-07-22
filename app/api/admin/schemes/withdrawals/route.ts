import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
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

    const withdrawals = await prisma.enrollment.findMany({
      where: {
        tenantId,
        status: 'WITHDRAWAL_REQUESTED'
      },
      include: {
        scheme: true,
        client: true,
        installments: true
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ success: true, withdrawals });
  } catch (error) {
    console.error("Admin Withdrawals GET Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { enrollmentId, action } = body; // action: 'APPROVE', 'REJECT'

    if (!enrollmentId || !action) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: { id: enrollmentId, tenantId, status: 'WITHDRAWAL_REQUESTED' }
    });

    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Withdrawal request not found' }, { status: 404 });
    }

    const newStatus = action === 'APPROVE' ? 'CLOSED' : 'ACTIVE';

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: newStatus }
    });

    return NextResponse.json({ success: true, message: `Withdrawal ${action.toLowerCase()}ed` });
  } catch (error) {
    console.error("Admin Withdrawals PATCH Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to update withdrawal status' }, { status: 500 });
  }
}
