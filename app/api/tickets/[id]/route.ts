import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

function logToFile(msg: string) {
  try {
    const logPath = path.join(process.cwd(), 'api-debug.log');
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${msg}\n`);
  } catch (e) {}
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  logToFile(`[PATCH /api/tickets/${params.id}] Started`);
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      logToFile(`[PATCH] No session found`);
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    let role = (session.user as any).role || 'CLIENT';
    
    if (session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) {
        tenantId = dbUser.tenantId;
        role = dbUser.role;
      }
    }

    const isSuperUser = role === 'ADMIN' || role === 'MASTER_ADMIN' || role === 'SUPER_ADMIN';
    logToFile(`[PATCH] User role: ${role}, tenantId: ${tenantId}, isSuperUser: ${isSuperUser}`);
    
    if (role === 'CLIENT') {
      logToFile(`[PATCH] Rejected: User is CLIENT`);
      return NextResponse.json({ error: 'Clients cannot modify ticket properties directly.' }, { status: 403 });
    }

    const body = await req.json();
    logToFile(`[PATCH] Body: ${JSON.stringify(body)}`);
    const { status, assigneeId, dueDate, labels, title, description } = body;

    if (status === 'TRASH' && !isSuperUser) {
      logToFile(`[PATCH] Rejected: Non-admin trying to trash`);
      return NextResponse.json({ error: 'Only administrators can move tickets to trash.' }, { status: 403 });
    }

    if (!tenantId && !isSuperUser) {
      logToFile(`[PATCH] Rejected: Missing tenant context`);
      return NextResponse.json({ error: 'Missing tenant context.' }, { status: 401 });
    }

    const ticketId = params.id;
    const existingTicket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (!existingTicket) {
      logToFile(`[PATCH] Rejected: Ticket not found: ${ticketId}`);
      return NextResponse.json({ error: 'Ticket not found.' }, { status: 404 });
    }
    
    if (role === 'CLIENT' && existingTicket.clientId !== (session.user as any).id) {
      logToFile(`[PATCH] Rejected: Unauthorized CLIENT ownership mismatch`);
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (assigneeId !== undefined) dataToUpdate.assigneeId = assigneeId;
    if (dueDate !== undefined) dataToUpdate.dueDate = dueDate;
    if (labels !== undefined) dataToUpdate.labels = labels;
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;

    logToFile(`[PATCH] Updating ticket with: ${JSON.stringify(dataToUpdate)}`);

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: dataToUpdate
    });

    logToFile(`[PATCH] Success!`);
    return NextResponse.json({ success: true, ticket: updatedTicket });

  } catch (error: any) {
    logToFile(`[PATCH] ERROR: ${error.message}`);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let role = (session.user as any).role || 'CLIENT';
    if (session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) role = dbUser.role;
    }

    const isSuperUser = role === 'ADMIN' || role === 'MASTER_ADMIN' || role === 'SUPER_ADMIN';
    
    if (!isSuperUser) {
      return NextResponse.json({ error: 'Only administrators can permanently delete tickets.' }, { status: 403 });
    }

    const ticketId = params.id;
    await prisma.ticket.delete({ where: { id: ticketId } });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete Ticket Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
