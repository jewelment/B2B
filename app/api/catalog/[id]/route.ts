import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Parse body for pin if provided
    let pin = '';
    try {
      const body = await request.json();
      pin = body.pin || '';
    } catch (e) {
      // Body might be empty
    }

    // Fetch the catalog and its items
    const catalog = await prisma.catalog.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { sequence: 'asc' }
        }
      }
    });

    if (!catalog) {
      return NextResponse.json({ success: false, error: 'Catalog not found.' }, { status: 404 });
    }

    if (!catalog.isActive) {
      return NextResponse.json({ success: false, error: 'This catalog link has been deactivated.' }, { status: 403 });
    }

    // Parse configuration
    let config: any = {};
    if (catalog.configuration) {
      try {
        config = JSON.parse(catalog.configuration);
      } catch (e) {
        console.error("Failed to parse catalog configuration", e);
      }
    }

    // --- GATEKEEPER LOGIC ---
    if (config.password && config.password.trim() !== '') {
      if (!pin) {
        return NextResponse.json({ 
          success: false, 
          requiresAuth: true, 
          error: 'This catalog is protected by a secure PIN.' 
        }, { status: 401 });
      }

      if (pin !== config.password) {
        return NextResponse.json({ 
          success: false, 
          requiresAuth: true, 
          error: 'Incorrect PIN provided.' 
        }, { status: 401 });
      }
    }

    // If we pass the gatekeeper, fetch the actual product data for the items
    // Since catalog items only store designCode, we need to join the Product table
    const designCodes = catalog.items.map(item => item.designCode);
    
    const products = await prisma.product.findMany({
      where: {
        designCode: { in: designCodes }
      },
      include: {
        media: {
          orderBy: { sequence: 'asc' }
        }
      }
    });

    // Map products to the ordered catalog items
    const populatedItems = catalog.items.map(item => {
      const product = products.find(p => p.designCode === item.designCode);
      return {
        ...item,
        product
      };
    });

    // We don't want to expose the password to the frontend after validation
    const safeConfig = { ...config };
    delete safeConfig.password;

    return NextResponse.json({
      success: true,
      catalog: {
        ...catalog,
        configuration: safeConfig,
        items: populatedItems
      }
    });

  } catch (error) {
    console.error('Catalog fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve catalog.' },
      { status: 500 }
    );
  }
}