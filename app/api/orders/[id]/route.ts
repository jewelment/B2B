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

    // 2. Unwrap Params (Next.js 16 requirement)
    const { id } = await params;
    
    // 3. Parse Payload
    const body = await req.json();
    const { status } = body;

    if (!['PENDING', 'APPROVED', 'PROCESSING', 'SHIPPED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status provided.' }, { status: 400 });
    }

    // 4. Execute Atomic Update
    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({ 
      success: true, 
      message: `PO updated to ${status}`, 
      poNumber: updatedOrder.poNumber 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Status Mutation Error:', error);
    return NextResponse.json({ error: 'Failed to update the ledger.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}