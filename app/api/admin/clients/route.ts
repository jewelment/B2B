import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; 

const prisma = new PrismaClient();

// GET: Fetch all clients AND the sales roster for the CRM dashboard
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Strict RBAC: Only Admins can view the master client list
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 403 });
    }

    // Fetch Clients with required commercial and compliance fields
    const clients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,            
        companyName: true,
        email: true,
        phoneNumber: true,    
        gstin: true,          
        status: true,
        createdAt: true,
        assignedSalesmanId: true, 
        salesman: {
          select: { name: true }
        }
      }
    });

    // Fetch active Sales Representatives for the assignment dropdown
    const salesReps = await prisma.user.findMany({
      where: { role: 'SALES' },
      select: { id: true, name: true, email: true }
    });

    // Standardized response contract matching the frontend expectations
    return NextResponse.json({ success: true, clients, salesReps }, { status: 200 });
  } catch (error) {
    console.error('Admin CRM Fetch Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// PATCH: Approve, Suspend, Reject, or Re-assign a client
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized access' }, { status: 403 });
    }

    const body = await req.json();
    
    // UPDATED: Destructure both potential keys to safely handle the frontend payload
    const { id, userId, status, assignedSalesmanId } = body;
    
    // Map the correct ID regardless of which key the frontend sends
    const targetId = userId || id;

    if (!targetId) {
      return NextResponse.json({ success: false, message: 'Client ID is required' }, { status: 400 });
    }

    // Build the dynamic update payload
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      // CRITICAL FIX: Synchronize the string status with the Gatekeeper boolean
      updateData.isApproved = status === 'APPROVED';
    }
    
    if (assignedSalesmanId !== undefined) {
      updateData.assignedSalesmanId = assignedSalesmanId === 'UNASSIGNED' ? null : assignedSalesmanId;
    }

    const updatedClient = await prisma.user.update({
      where: { id: targetId },
      data: updateData,
    });

    return NextResponse.json({ success: true, client: updatedClient }, { status: 200 });
  } catch (error) {
    console.error('Admin CRM Update Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}