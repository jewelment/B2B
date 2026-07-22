import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
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

    // Fetch enrollments for this client
    const enrollments = await prisma.enrollment.findMany({
      where: {
        tenantId,
        clientId: userId,
      },
      include: {
        scheme: true,
        installments: {
          orderBy: { monthNumber: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, enrollments });
  } catch (error) {
    console.error("Customer Schemes GET Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}
