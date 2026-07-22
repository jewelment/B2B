import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const schemeId = params.id;

    // Fetch scheme with nested enrollments, client details, and installments
    const scheme = await prisma.savingsScheme.findUnique({
      where: { id: schemeId, tenantId },
      include: {
        enrollments: {
          include: {
            client: true,
            installments: {
              orderBy: { monthNumber: 'asc' }
            }
          }
        }
      }
    });

    if (!scheme) {
      return NextResponse.json({ success: false, error: 'Scheme not found' }, { status: 404 });
    }

    // Compute aggregate statistics
    let totalActiveUsers = 0;
    let totalPaidRevenue = 0;
    let totalPendingBalance = 0;

    scheme.enrollments.forEach(enrollment => {
      if (enrollment.status === 'ACTIVE') totalActiveUsers++;
      
      totalPaidRevenue += enrollment.totalPaid;
      
      const totalExpected = enrollment.monthlyInstallment * scheme.totalTenureMonths;
      totalPendingBalance += (totalExpected - enrollment.totalPaid);
    });

    return NextResponse.json({
      success: true,
      scheme,
      stats: {
        totalActiveUsers,
        totalPaidRevenue,
        totalPendingBalance
      }
    });

  } catch (error) {
    console.error("Admin Scheme Details GET Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch scheme details' }, { status: 500 });
  }
}
