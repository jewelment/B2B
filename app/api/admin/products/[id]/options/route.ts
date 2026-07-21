import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await context.params;
    
    // Fetch attached option sets for this product
    const optionSets = await prisma.productOptionSet.findMany({
      where: { productId },
      include: {
        optionSet: {
          include: {
            items: {
              include: {
                option: {
                  include: {
                    values: {
                      include: {
                        children: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: optionSets });
  } catch (error) {
    console.error('Error fetching product option sets:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: productId } = await context.params;
    const { optionSetId } = await req.json();

    if (!optionSetId) {
      return NextResponse.json({ error: 'OptionSet ID is required' }, { status: 400 });
    }

    // Attach OptionSet to Product
    const newAssignment = await prisma.productOptionSet.create({
      data: {
        productId,
        optionSetId
      }
    });

    return NextResponse.json({ success: true, data: newAssignment });
  } catch (error) {
    console.error('Error assigning option set:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
