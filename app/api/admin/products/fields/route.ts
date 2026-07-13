import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../../auth/[...nextauth]/route'; // Adjust relative path if needed


export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fields = await prisma.customField.findMany({
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ success: true, fields }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, dataType, isMandatory } = body;

    if (!name || !dataType) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const newField = await prisma.customField.create({
      data: {
        name,
        dataType,
        isMandatory: isMandatory || false,
      }
    });

    return NextResponse.json({ success: true, field: newField }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A field with this exact name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
  }
}