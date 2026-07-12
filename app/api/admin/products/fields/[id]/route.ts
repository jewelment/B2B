import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route'; 

const prisma = new PrismaClient();

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.customField.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Field deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete field. It may be linked to active products.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}