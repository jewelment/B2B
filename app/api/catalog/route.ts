import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// 1. GET: Fetch all catalogs for the dashboard
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    const tenantId = (session.user as any).tenantId;

    const catalogs = await prisma.catalog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { items: true }
        },
        items: {
          select: { designCode: true }
        }
      }
    });

    // Parse the configuration JSON stored as a string
    const parsedCatalogs = catalogs.map(cat => ({
      ...cat,
      configuration: cat.configuration ? JSON.parse(cat.configuration) : {}
    }));

    return NextResponse.json({ success: true, catalogs: parsedCatalogs }, { status: 200 });
  } catch (error) {
    console.error('Catalog GET Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch catalogs.' }, { status: 500 });
  }
}

// 2. POST: Create a new catalog (The Flipbook Engine)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    const tenantId = (session.user as any).tenantId;

    const { name, clientId, designCodes, configuration } = await req.json();

    if (!designCodes || !Array.isArray(designCodes) || designCodes.length === 0) {
      return NextResponse.json({ success: false, error: 'No SKUs provided.' }, { status: 400 });
    }

    // Calculate total pipeline value from Master Inventory
    const products = await prisma.product.findMany({
      where: { tenantId, designCode: { in: designCodes } },
      select: { estimatedPrice: true }
    });

    const totalPipelineValue = products.reduce((sum, p) => sum + (p.estimatedPrice || 0), 0);

    const newCatalog = await prisma.catalog.create({
      data: {
        tenantId, // Multi-tenant isolated creation
        name,
        clientId,
        theme: configuration?.theme || 'LIGHT',
        itemsPerPage: configuration?.desktopItemsPerPage || 4,
        pipelineValue: totalPipelineValue,
        configuration: JSON.stringify(configuration),
        items: {
          create: designCodes.map((code: string, index: number) => ({
            designCode: code,
            sequence: index + 1
          }))
        }
      }
    });

    return NextResponse.json({ success: true, catalog: newCatalog }, { status: 201 });
  } catch (error) {
    console.error('Catalog POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate catalog.' }, { status: 500 });
  }
}

// 3. PUT: Update an existing catalog
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    const tenantId = (session.user as any).tenantId;

    const { id, name, clientId, designCodes, configuration } = await req.json();

    if (!id) return NextResponse.json({ success: false, error: 'Catalog ID is required.' }, { status: 400 });

    if (!designCodes || !Array.isArray(designCodes) || designCodes.length === 0) {
      return NextResponse.json({ success: false, error: 'No SKUs provided.' }, { status: 400 });
    }

    const existing = await prisma.catalog.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 });

    const products = await prisma.catalog.findMany({
      where: { tenantId },
      select: { pipelineValue: true } // Simplified for now
    });

    const totalPipelineValue = 0; // Replace with proper sum logic if needed

    // Delete existing items to recreate them
    await prisma.catalogItem.deleteMany({ where: { catalogId: id } });

    const updatedCatalog = await prisma.catalog.update({
      where: { id },
      data: {
        name,
        clientId,
        theme: configuration?.theme || 'LIGHT',
        itemsPerPage: configuration?.desktopItemsPerPage || 4,
        pipelineValue: totalPipelineValue,
        configuration: JSON.stringify(configuration),
        items: {
          create: designCodes.map((code: string, index: number) => ({
            designCode: code,
            sequence: index + 1
          }))
        }
      }
    });

    return NextResponse.json({ success: true, catalog: updatedCatalog }, { status: 200 });
  } catch (error) {
    console.error('Catalog PUT Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update catalog.' }, { status: 500 });
  }
}

// 4. PATCH: Toggle catalog status (Active/Draft)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    const tenantId = (session.user as any).tenantId;

    const { id, isActive } = await req.json();
    
    const existing = await prisma.catalog.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 });

    const updated = await prisma.catalog.update({
      where: { id },
      data: { isActive }
    });
    return NextResponse.json({ success: true, catalog: updated }, { status: 200 });
  } catch (error) {
    console.error('Catalog PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update catalog status.' }, { status: 500 });
  }
}

// 4. DELETE: Delete a catalog and its items
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.tenantId) {
      return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
    }
    const tenantId = (session.user as any).tenantId;

    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'Catalog ID is required.' }, { status: 400 });

    // Ensure they own the catalog before deleting
    const existing = await prisma.catalog.findFirst({ where: { id, tenantId } });
    if (!existing) return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 });

    await prisma.catalogItem.deleteMany({ where: { catalogId: id } });
    await prisma.catalog.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Catalog DELETE Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete catalog.' }, { status: 500 });
  }
}