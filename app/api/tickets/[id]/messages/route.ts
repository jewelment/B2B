import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const messages = await prisma.ticketMessage.findMany({
      where: { ticketId: params.id },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, messages });
  } catch (error: any) {
    console.error('Fetch Messages Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const senderId = (session.user as any).id;
    const body = await req.json();
    const { content, isInternal } = body;

    if (!content) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: params.id,
        senderId,
        content,
        isInternal: isInternal || false
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error('Create Message Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
