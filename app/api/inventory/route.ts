import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';


// Your original mock data, kept here just for the initial database seed
const MOCK_INVENTORY = [
  {
    designCode: 'AJ-RG-001',
    title: 'Rose Gold Diamond Floral Leaf Ring',
    metalPurity: '18KT',
    estimatedPrice: 45000,
    description: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=800&q=80',
    igiCertNumber: 'IGI-123456789',
    components: [
      { type: 'Metal', details: '18K Rose Gold', rate: 5500, finalCost: 24129 },
      { type: 'Diamond', details: 'VVS-VS (0.25ct)', rate: 65000, finalCost: 16250 },
      { type: 'Labor', details: 'Making Charges', rate: 4621, finalCost: 4621 }
    ]
  },
  {
    designCode: 'AJ-ER-042',
    title: 'Yellow Gold Open Leaf Diamond Studs',
    metalPurity: '14KT',
    estimatedPrice: 32000,
    description: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    igiCertNumber: 'IGI-987654321',
    components: [
      { type: 'Metal', details: '14K Yellow Gold', rate: 4200, finalCost: 15000 },
      { type: 'Diamond', details: 'SI1 (0.15ct)', rate: 50000, finalCost: 13000 },
      { type: 'Labor', details: 'Making Charges', rate: 4000, finalCost: 4000 }
    ]
  },
  {
    designCode: 'AJ-PT-088',
    title: 'Emerald Cut Tanzanite Halo Pendant',
    metalPurity: '18KT',
    estimatedPrice: 85000,
    description: 'https://images.unsplash.com/photo-1599643478514-4a4e09b52342?auto=format&fit=crop&w=800&q=80',
    igiCertNumber: 'IGI-456123789',
    components: [
      { type: 'Metal', details: '18K White Gold', rate: 5500, finalCost: 18000 },
      { type: 'Gemstone', details: 'Tanzanite (1.2ct)', rate: 45000, finalCost: 54000 },
      { type: 'Labor', details: 'Making Charges', rate: 13000, finalCost: 13000 }
    ]
  },
  {
    designCode: 'AJ-BR-112',
    title: 'Classic Ruby Tennis Bracelet',
    metalPurity: '18KT',
    estimatedPrice: 125000,
    description: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    igiCertNumber: null,
    components: [
      { type: 'Metal', details: '18K Yellow Gold', rate: 5500, finalCost: 45000 },
      { type: 'Gemstone', details: 'Ruby (3.0ct)', rate: 20000, finalCost: 60000 },
      { type: 'Labor', details: 'Making Charges', rate: 20000, finalCost: 20000 }
    ]
  }
];

export async function GET() {
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

    // 1. Check if the database has any products for this tenant
    const productCount = await prisma.product.count({ where: { tenantId } });

    // 2. AUTO-SEEDING: If empty, inject the mock data into the database
    if (productCount === 0) {
      console.log('Database empty. Auto-seeding initial inventory...');
      
      for (const item of MOCK_INVENTORY) {
        await prisma.product.create({
          data: {
            tenantId, // Inject tenant isolation
            handle: item.designCode.toLowerCase(),
            designCode: item.designCode,
            title: item.title,
            metalPurity: item.metalPurity,
            estimatedPrice: item.estimatedPrice,
            description: item.description,
            igiCertNumber: item.igiCertNumber,
            // Dummy weights required by schema
            grossWeight: 5.0, 
            pureWeight: 4.5,  
            components: {
              create: item.components.map(c => ({
                type: c.type,
                details: c.details,
                rate: c.rate,
                finalCost: c.finalCost
              }))
            }
          }
        });
      }
      console.log('Auto-seeding complete.');
    }

    // 3. Fetch the LIVE inventory directly from the database for this specific tenant
    const liveInventory = await prisma.product.findMany({
      where: { tenantId },
      include: {
        components: true,
      },
      orderBy: {
        createdAt: 'asc' // Keeps them in consistent order
      }
    });

    // CRITICAL FIX: Wrapped the array in an object so the frontend can destructure `data.products`
    return NextResponse.json({ success: true, products: liveInventory });

  } catch (error) {
    console.error('Database Fetch Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch inventory from the database.' },
      { status: 500 }
    );
  } finally {
    // Prevent connection exhaustion
  }
}