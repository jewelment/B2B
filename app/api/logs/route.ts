import { NextResponse } from 'next/server'; // Forced recompile
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleName = searchParams.get('module');
    
    // In a real multi-tenant app, we'd get the tenantId from the user's session
    // For this dev environment, we use a default logic or fetch the first active tenant
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    
    let tenantId = user?.tenantId;
    if (!tenantId) {
       const defaultTenant = await prisma.tenant.findFirst();
       tenantId = defaultTenant?.id;
    }

    if (!tenantId) {
       return NextResponse.json({ error: 'Tenant not found' }, { status: 400 });
    }

    const logs = await prisma.systemLog.findMany({
      where: {
        tenantId,
        ...(moduleName ? { module: moduleName.toUpperCase() } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to recent logs
    });

    // Transform to match the UI LogEntry format expected by ViewLogsDrawer
    const formattedLogs = logs.map(log => {
       const dateObj = new Date(log.createdAt);
       return {
         id: log.id,
         user: log.user,
         initials: log.initials,
         avatarColor: log.avatarColor,
         activity: log.activity,
         date: dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
         time: dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
       };
    });

    return NextResponse.json(formattedLogs);
  } catch (error) {
    console.error('[LOGS_GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, initials, avatarColor, module, activity, tenantId } = body;

    if (!module || !activity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Determine Tenant
    let activeTenantId = tenantId;
    if (!activeTenantId) {
       const session = await getServerSession(authOptions);
       const currentUser = session?.user as any;
       activeTenantId = currentUser?.tenantId;
    }
    if (!activeTenantId) {
       const defaultTenant = await prisma.tenant.findFirst();
       activeTenantId = defaultTenant?.id;
    }

    const log = await prisma.systemLog.create({
      data: {
        tenantId: activeTenantId,
        user: user || 'System Generated',
        initials: initials || 'SYS',
        avatarColor: avatarColor || 'bg-slate-500/20 text-slate-500',
        module: module.toUpperCase(),
        activity
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('[LOGS_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
