import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    let userId = (session.user as any).id;
    if (!userId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) {
        tenantId = dbUser.tenantId;
        userId = dbUser.id;
      }
    }

    if (!tenantId || !userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Missing context.' }, { status: 401 });
    }

    const enrollmentId = params.id;

    // Verify ownership
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        tenantId,
        clientId: userId
      }
    });

    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Enrollment not found' }, { status: 404 });
    }

    if (enrollment.status === 'WITHDRAWAL_REQUESTED' || enrollment.status === 'CLOSED') {
      return NextResponse.json({ success: false, error: 'Cannot request withdrawal for this enrollment' }, { status: 400 });
    }

    // Update status to WITHDRAWAL_REQUESTED
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'WITHDRAWAL_REQUESTED'
      }
    });

    // We can also create a SystemLog for the admin panel
    await prisma.systemLog.create({
      data: {
        tenantId,
        user: session.user.name || 'Customer',
        initials: (session.user.name || 'CU').substring(0,2).toUpperCase(),
        avatarColor: 'bg-orange-500',
        module: 'CRM',
        activity: `Requested early withdrawal for enrollment ${enrollmentId}`
      }
    });

    return NextResponse.json({ success: true, message: 'Withdrawal requested successfully' });
  } catch (error) {
    console.error("Customer Schemes Withdraw Error:", error);
    return NextResponse.json({ success: false, error: 'Withdrawal request failed' }, { status: 500 });
  }
}
