import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, metal, gemstone } = body;

    // 1. Fetch matching master inventory products
    // Note: Since we are using a simplified schema, we'll just grab some products
    let products = await prisma.product.findMany({
       take: 12 
    });

    // 2. Create the unique Flipbook Catalog
    const catalogName = `Bespoke Collection: ${metal.toUpperCase()}`;
    const newCatalog = await prisma.catalog.create({
      data: {
        name: catalogName,
        theme: 'DARK',
        itemsPerPage: 4,
        clientId: 'temp-client-id', // Would be session user ID
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
