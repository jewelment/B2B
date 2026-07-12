import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Strict B2B Gatekeeper: Only logged-in, approved clients can view the catalog
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    // 2. Fetch only ACTIVE products, including ordered local media and dynamic attributes
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      include: {
        media: {
          orderBy: { sequence: 'asc' } // Ensures SKU_1.jpg is always the cover image
        },
        customFieldValues: {
          include: {
            customField: true
          }
        }
      }
    });

    // 3. Flatten and format the payload for the Flipbook UI
    const storefrontCatalog = products.map(product => {
      const formattedProduct: any = {
        id: product.id,
        designCode: product.designCode,
        title: product.title,
        category: product.category,
        price: product.price, // Will be overridden by real-time matrix pricing later
        
        // Asset Pipeline: Map local server paths
        primaryImage: product.media.find(m => m.isPrimary)?.url || product.media[0]?.url || null,
        gallery: product.media.map(m => m.url),
      };

      // Inject dynamic custom fields (e.g., Metal Purity, Diamond Pcs) for UI filtering
      product.customFieldValues.forEach(cfv => {
        formattedProduct[cfv.customField.name] = cfv.value;
      });

      return formattedProduct;
    });

    return NextResponse.json({ success: true, data: storefrontCatalog }, { status: 200 });

  } catch (error: any) {
    console.error('Storefront API Crash:', error);
    return NextResponse.json({ error: 'Failed to load catalog data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}