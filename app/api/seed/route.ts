import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    // 1. Clear existing test catalogs to prevent duplicates during testing
    await prisma.catalogItem.deleteMany({});
    await prisma.catalog.deleteMany({});
    await prisma.product.deleteMany({});

    // 2. Inject Luxury Jewelry SKUs
    const product1 = await prisma.product.create({
      data: {
        handle: 'classic-gold-solitaire-ring',
        designCode: 'AJ-R-1001',
        title: 'Classic 18K Gold Solitaire Ring',
        description: 'A timeless daily-wear solitaire ring.',
        metalPurity: '18K',
        grossWeight: 4.5,
        pureWeight: 3.375,
        estimatedPrice: 35000.0,
      }
    });

    const product2 = await prisma.product.create({
      data: {
        handle: 'emerald-cut-diamond-studs',
        designCode: 'AJ-E-2050',
        title: 'Emerald Cut Diamond Stud Earrings',
        description: 'Premium gifting segment diamond studs.',
        metalPurity: '14K',
        grossWeight: 3.2,
        pureWeight: 1.86,
        estimatedPrice: 85000.0,
      }
    });

    const product3 = await prisma.product.create({
      data: {
        handle: 'rose-gold-floral-pendant',
        designCode: 'AJ-P-3022',
        title: 'Rose Gold Floral Leaf Pendant',
        description: 'Lightweight modern design for retail.',
        metalPurity: '18K',
        grossWeight: 2.8,
        pureWeight: 2.1,
        estimatedPrice: 22000.0,
      }
    });

    // 3. Create a Flipbook Catalog
    const masterCatalog = await prisma.catalog.create({
      data: {
        name: 'Summer Wholesale Master Collection',
        theme: 'LIGHT',
        itemsPerPage: 4,
        isActive: true,
      }
    });

    // 4. Bind the SKUs to the Flipbook
    await prisma.catalogItem.createMany({
      data: [
        { catalogId: masterCatalog.id, designCode: product1.designCode, sequence: 1 },
        { catalogId: masterCatalog.id, designCode: product2.designCode, sequence: 2 },
        { catalogId: masterCatalog.id, designCode: product3.designCode, sequence: 3 },
      ]
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Database seeded successfully. Virtual shelves are stocked.',
        catalogId: masterCatalog.id
      }, 
      { status: 200 }
    );

  } catch (error) {
    console.error('Seeding Error:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}