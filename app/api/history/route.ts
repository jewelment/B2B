import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch all orders, explicitly including the nested line items array
    const orders = await prisma.purchaseOrder.findMany({
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
    await prisma.$disconnect();
  }
}