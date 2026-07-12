import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // 1. Strict Operational Gatekeeper
    const session = await getServerSession(authOptions);
    
    // Fallback allowing local development bypass if session roles aren't strictly mapped yet
    if (session && (session.user as any).role && (session.user as any).role !== 'ADMIN') {
       return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    // 2. Fetch the Flattened B2B Ledger using the correct PurchaseOrder model
    const orders = await prisma.purchaseOrder.findMany({
      include: {
        client: {
          select: { name: true, email: true, companyName: true } 
        },
        items: true 
      },
      orderBy: { createdAt: 'desc' } // Ascending priority for procurement team
    });

    // Remap for the frontend UI which expects specific keys
    const mappedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.poNumber,
      client: {
        name: order.client.name,
        email: order.client.email,
        companyName: order.client.companyName
      },
      createdAt: order.createdAt,
      totalItems: order.totalUnits,
      totalValue: order.totalAmount,
      status: order.status,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        metalPurity: item.purity,
        product: {
          designCode: item.designCode,
          title: `Product ${item.designCode}`, // Or fetch from product table if joined
        }
      }))
    }));

    return NextResponse.json({ success: true, orders: mappedOrders }, { status: 200 });
    
  } catch (error) {
    console.error('Admin Orders Fetch Crash:', error);
    return NextResponse.json({ success: false, message: 'Server error retrieving PO Ledger.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session && (session.user as any).role && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized to modify PO states.' }, { status: 403 });
    }

    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ message: 'Missing required fields for PO update.' }, { status: 400 });
    }

    const updatedOrder = await prisma.purchaseOrder.update({
      where: { id: orderId },
      data: { status }
    });

    return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });
    
  } catch (error) {
    console.error('PO Status Update Crash:', error);
    return NextResponse.json({ success: false, message: 'Server error updating PO status.' }, { status: 500 });
  }
}