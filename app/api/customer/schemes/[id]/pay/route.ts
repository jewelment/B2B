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
    const body = await request.json();
    const { installmentId } = body;

    if (!installmentId) {
      return NextResponse.json({ success: false, error: 'Missing installment ID' }, { status: 400 });
    }

    // Verify ownership
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        tenantId,
        clientId: userId
      },
      include: {
        installments: {
          where: { id: installmentId }
        }
      }
    });

    if (!enrollment || enrollment.installments.length === 0) {
      return NextResponse.json({ success: false, error: 'Enrollment or installment not found' }, { status: 404 });
    }

    const installment = enrollment.installments[0];
    if (installment.status === 'PAID') {
      return NextResponse.json({ success: false, error: 'Installment already paid' }, { status: 400 });
    }

    // Process Mock Payment
    // Update installment
    await prisma.installment.update({
      where: { id: installmentId },
      data: {
        status: 'PAID',
        paidDate: new Date(),
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        receiptUrl: `/receipts/mock-${installmentId}.pdf`
      }
    });

    // Update totalPaid on enrollment
    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        totalPaid: enrollment.totalPaid + installment.amount
      }
    });

    return NextResponse.json({ success: true, message: 'Payment successful' });
  } catch (error) {
    console.error("Customer Schemes Pay Error:", error);
    return NextResponse.json({ success: false, error: 'Payment processing failed' }, { status: 500 });
  }
}
