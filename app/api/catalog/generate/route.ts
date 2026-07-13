import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    
    let tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Missing tenant context.' }, { status: 401 });
    }

    const body = await req.json();
    const { category, metal, gemstone } = body;

    // 1. Fetch matching master inventory products (filtered by tenant)
    let products = await prisma.product.findMany({
       where: { tenantId },
       take: 12 
    });

    // 2. Create the unique Flipbook Catalog
    const catalogName = `Bespoke Collection: ${metal ? metal.toUpperCase() : 'Premium'}`;
    const newCatalog = await prisma.catalog.create({
      data: {
        tenantId, // INJECT TENANT ID HERE
        name: catalogName,
        theme: 'DARK',
        itemsPerPage: 4,
        clientId: (session.user as any).id, 
        configuration: JSON.stringify({
          poMatrix: true,
          hidePricing: false,
        })
      }
    });

    // 3. Attach the items to the Catalog in sequence
    if (products.length > 0) {
      const catalogItems = products.map((prod, index) => ({
        catalogId: newCatalog.id,
        designCode: prod.designCode,
        sequence: index + 1
      }));
      
      await prisma.catalogItem.createMany({
        data: catalogItems
      });
    }

    return NextResponse.json({ success: true, catalogId: newCatalog.id });
  } catch (error) {
    console.error("Failed to generate catalog:", error);
    return NextResponse.json({ success: false, error: 'Failed to generate catalog' }, { status: 500 });
  }
}
