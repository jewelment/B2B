import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId) {
      const tenant = await prisma.tenant.findFirst();
      if (!tenant) return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
      tenantId = tenant.id;
    }

    const collections = await prisma.collection.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, data: collections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let tenantId = (session.user as any).tenantId;
    if (!tenantId) {
      const tenant = await prisma.tenant.findFirst();
      if (!tenant) return NextResponse.json({ error: 'No tenant found' }, { status: 400 });
      tenantId = tenant.id;
    }

    const { name, handle, description } = await req.json();

    if (!name || !handle) {
      return NextResponse.json({ error: 'Name and handle are required' }, { status: 400 });
    }

    const collection = await prisma.collection.create({
      data: {
        tenantId,
        name,
        handle,
        description
      }
    });

    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
