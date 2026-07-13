import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: 'Missing tenant context.' }, { status: 400 });
    }

    const storeSettings = await prisma.storeSettings.findUnique({
      where: { tenantId }
    });

    if (!storeSettings) {
      return NextResponse.json({ success: true, layoutData: null });
    }

    // Since Prisma client might not be generated yet, we use a raw query if it fails or use any cast
    let layoutData = null;
    try {
      layoutData = (storeSettings as any).layoutData;
    } catch(e) {}

    // Fallback: If layoutData is missing because of Prisma cache, we can query it directly using $queryRaw
    if (layoutData === undefined) {
      const rawSettings: any[] = await prisma.$queryRaw`SELECT "layoutData" FROM "StoreSettings" WHERE "tenantId" = ${tenantId}`;
      if (rawSettings && rawSettings.length > 0) {
        layoutData = rawSettings[0].layoutData;
      }
    }

    const defaultLayout = {
      web: { draft: { "/": [] }, staging: { "/": [] }, prod: { "/": [] } },
      app: { draft: { "/": [] }, staging: { "/": [] }, prod: { "/": [] } }
    };
    let parsedLayout = defaultLayout;
    if (layoutData) {
      try {
        const parsed = typeof layoutData === 'string' ? JSON.parse(layoutData) : layoutData;
        
        // Migration logic
        if (Array.isArray(parsed)) {
          // Legacy V1 (Array only)
          parsedLayout.web.draft["/"] = parsed;
        } else if (parsed.web && Array.isArray(parsed.web)) {
          // Legacy V2 (Object with arrays)
          parsedLayout.web.draft["/"] = parsed.web;
          parsedLayout.app.draft["/"] = parsed.app || [];
        } else {
          // V3 (Fully nested)
          parsedLayout = {
            web: { ...defaultLayout.web, ...parsed.web },
            app: { ...defaultLayout.app, ...parsed.app }
          };
        }
      } catch(e) {}
    }

    return NextResponse.json({ success: true, layoutData: parsedLayout });
  } catch (error: any) {
    console.error('Fetch Theme Builder Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: 'Missing tenant context.' }, { status: 400 });
    }

    const body = await req.json();
    const { layoutData } = body;

    if (!layoutData) {
      return NextResponse.json({ error: 'Missing layout data.' }, { status: 400 });
    }

    const layoutDataString = typeof layoutData === 'string' ? layoutData : JSON.stringify(layoutData);

    // Use $executeRaw to bypass Prisma Client schema cache if it hasn't been generated yet
    const updateResult = await prisma.$executeRaw`
      UPDATE "StoreSettings" 
      SET "layoutData" = ${layoutDataString}, "updatedAt" = NOW() 
      WHERE "tenantId" = ${tenantId}
    `;
    
    // If no row was updated, it means StoreSettings doesn't exist for this tenant, insert it
    if (updateResult === 0) {
      await prisma.$executeRaw`
        INSERT INTO "StoreSettings" ("id", "tenantId", "layoutData", "updatedAt") 
        VALUES (gen_random_uuid(), ${tenantId}, ${layoutDataString}, NOW())
      `;
    }

    return NextResponse.json({ success: true, message: 'Layout updated successfully.' });
  } catch (error: any) {
    console.error('Update Theme Builder Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
