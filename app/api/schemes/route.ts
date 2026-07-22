import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = { tenantId };
    if (status) {
      whereClause.status = status;
    }

    const schemes = await prisma.savingsScheme.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, schemes });
  } catch (error) {
    console.error("Schemes GET Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const { 
      name, 
      status, 
      totalTenureMonths, 
      bonusInstallments, 
      shortDescription, 
      minInstallment, 
      maxInstallment, 
      bonusDiscountPct, 
      gracePeriodDays, 
      termsAndConditions, 
      faqs,
      desktopBannerUrl,
      mobileBannerUrl
    } = body;

    const newScheme = await prisma.savingsScheme.create({
      data: {
        tenantId,
        name: name || "New 11+1 Scheme",
        status: status || "DRAFT",
        totalTenureMonths: totalTenureMonths ? Number(totalTenureMonths) : 12,
        bonusInstallments: bonusInstallments ? Number(bonusInstallments) : 1,
        shortDescription,
        minInstallment: minInstallment ? Number(minInstallment) : 1000,
        maxInstallment: maxInstallment ? Number(maxInstallment) : 100000,
        bonusDiscountPct: bonusDiscountPct ? Number(bonusDiscountPct) : 100.0,
        gracePeriodDays: gracePeriodDays ? Number(gracePeriodDays) : 7,
        termsAndConditions,
        faqs,
        desktopBannerUrl,
        mobileBannerUrl
      }
    });

    return NextResponse.json({ success: true, scheme: newScheme });
  } catch (error) {
    console.error("Schemes POST Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to create scheme' }, { status: 500 });
  }
}
