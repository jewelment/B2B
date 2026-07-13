import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Strict Admin Gatekeeper
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized access.' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }

    if (!tenantId) {
      return NextResponse.json({ error: 'Unauthorized. Missing tenant context.' }, { status: 401 });
    }

    // 2. Unwrap Params (Next.js 16 requirement)
    const { id } = await params;
    
    // 3. Parse Payload
    const body = await req.json();
    const { status } = body;

    if (!['PENDING', 'APPROVED', 'PROCESSING', 'SHIPPED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status provided.' }, { status: 400 });
    }

    // 4. Execute Atomic Update with Tenant Ownership Verification
    const updatedOrder = await prisma.purchaseOrder.updateMany({
      where: { id, tenantId },
      data: { status }
    });

    if (updatedOrder.count === 0) {
       return NextResponse.json({ error: 'Order not found or unauthorized.' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `PO updated to ${status}`
    }, { status: 200 });

  } catch (error: any) {
    console.error('Status Mutation Error:', error);
    return NextResponse.json({ error: 'Failed to update the ledger.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}