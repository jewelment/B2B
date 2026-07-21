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
    
    // Parse query params for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const variants = await prisma.productVariant.findMany({
      where: { productId },
      skip,
      take: limit,
      include: {
        optionValues: {
          include: {
            optionValue: {
              include: {
                option: true
              }
            }
          }
        }
      },
      orderBy: { sku: 'asc' }
    });

    const total = await prisma.productVariant.count({ where: { productId } });

    return NextResponse.json({ 
      success: true, 
      data: variants,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching variants:', error);
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

    // Fetch all attached OptionSets and their Options/Values
    const productOptionSets = await prisma.productOptionSet.findMany({
      where: { productId },
      include: {
        optionSet: {
          include: {
            items: {
              include: {
                option: {
                  include: {
                    values: true // Fetching all values for simplicity. Real logic might filter by OptionSetItem config.
                  }
                }
              }
            }
          }
        }
      }
    });

    if (productOptionSets.length === 0) {
      return NextResponse.json({ error: 'No OptionSets attached to this product.' }, { status: 400 });
    }

    // Advanced Cartesian Product Logic
    // Step 1: Extract arrays of Option Values for each Option across all sets
    const optionArrays: any[][] = [];
    
    productOptionSets.forEach(pos => {
      pos.optionSet.items.forEach(item => {
        if (item.option.values && item.option.values.length > 0) {
          optionArrays.push(item.option.values);
        }
      });
    });

    if (optionArrays.length === 0) {
      return NextResponse.json({ error: 'Attached OptionSets have no values.' }, { status: 400 });
    }

    // Step 2: Generate Cartesian Product combinations
    const cartesian = (...a: any[][]) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    const combinations = cartesian(...optionArrays) as any[][];

    // Step 3: Delete existing variants before regenerating
    // WARNING: In production, you might want to merge or soft-delete instead of nuking.
    await prisma.productVariant.deleteMany({
      where: { productId }
    });

    // Step 4: Bulk create ProductVariants
    const createdVariants = [];
    for (const combo of combinations) {
      // Build an SKU string by concatenating the names of the values
      const skuSuffix = combo.map(c => c.name.toUpperCase().replace(/\s+/g, '')).join('-');
      const sku = `PROD-${productId.substring(0, 5).toUpperCase()}-${skuSuffix}`;

      const newVariant = await prisma.productVariant.create({
        data: {
          productId,
          sku,
          price: 0,
          optionValues: {
            create: combo.map(c => ({
              optionValueId: c.id
            }))
          }
        }
      });
      createdVariants.push(newVariant);
    }

    return NextResponse.json({ success: true, count: createdVariants.length });
  } catch (error) {
    console.error('Error generating variants:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
