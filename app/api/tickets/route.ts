import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }

    const clientId = (session.user as any).id;
    const role = (session.user as any).role;

    if (!tenantId) {
      return NextResponse.json({ error: 'Missing tenant context.' }, { status: 401 });
    }

    // Admins see all tickets for the tenant; Clients only see their own
    const whereClause: any = { tenantId };
    if (role === 'CLIENT') {
      whereClause.clientId = clientId;
    }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        client: { select: { id: true, name: true, email: true, companyName: true } },
        assignee: { select: { id: true, name: true, email: true } },
        _count: { select: { messages: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, tickets });

  } catch (error: any) {
    console.error('Fetch Tickets Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }

    const clientId = (session.user as any).id;

    if (!tenantId) {
      return NextResponse.json({ error: 'Missing tenant context.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, priority, type, status } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 });
    }

    const newTicket = await prisma.ticket.create({
      data: {
        tenantId,
        clientId,
        title,
        description,
        priority: priority || 'NORMAL',
        type: type || 'BUG',
        status: status || 'OPEN'
      }
    });

    return NextResponse.json({ success: true, ticket: newTicket });

  } catch (error: any) {
    console.error('Create Ticket Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
