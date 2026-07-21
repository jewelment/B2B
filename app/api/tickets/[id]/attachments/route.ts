import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const attachments = await prisma.ticketAttachment.findMany({
      where: { ticketId: params.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, attachments });
  } catch (error: any) {
    console.error('Fetch Attachments Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { url, filename, fileSize } = body;

    if (!url || !filename) {
      return NextResponse.json({ error: 'URL and filename are required.' }, { status: 400 });
    }

    const newAttachment = await prisma.ticketAttachment.create({
      data: {
        ticketId: params.id,
        url,
        filename,
        fileSize
      }
    });

    return NextResponse.json({ success: true, attachment: newAttachment });
  } catch (error: any) {
    console.error('Create Attachment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
