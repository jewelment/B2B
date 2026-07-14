import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';


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

    let settings = await prisma.storeSettings.findUnique({ where: { tenantId } });
    
    // Ensure settings exist
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          tenantId,
          pricingMode: 'MANUAL',
          manualGoldRate24K: 7250,
          manualSilverRate: 88,
          enableSecureMediaProxy: true,
          enableWebpOptimization: false
        }
      });
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  } finally {
  }
}

export async function PATCH(request: Request) {
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

    const body = await request.json();
    const { pricingMode, manualGoldRate24K, manualSilverRate, enableSecureMediaProxy, enableWebpOptimization } = body;

    let settings = await prisma.storeSettings.findUnique({ where: { tenantId } });
    
    if (settings) {
      settings = await prisma.storeSettings.update({
        where: { tenantId },
        data: { 
          pricingMode, 
          manualGoldRate24K: manualGoldRate24K !== undefined ? Number(manualGoldRate24K) : undefined, 
          manualSilverRate: manualSilverRate !== undefined ? Number(manualSilverRate) : undefined,
          enableSecureMediaProxy: enableSecureMediaProxy !== undefined ? Boolean(enableSecureMediaProxy) : undefined,
          enableWebpOptimization: enableWebpOptimization !== undefined ? Boolean(enableWebpOptimization) : undefined
        }
      });
    } else {
      settings = await prisma.storeSettings.create({
        data: { 
          tenantId,
          pricingMode, 
          manualGoldRate24K: manualGoldRate24K !== undefined ? Number(manualGoldRate24K) : 7250, 
          manualSilverRate: manualSilverRate !== undefined ? Number(manualSilverRate) : 88,
          enableSecureMediaProxy: enableSecureMediaProxy !== undefined ? Boolean(enableSecureMediaProxy) : true,
          enableWebpOptimization: enableWebpOptimization !== undefined ? Boolean(enableWebpOptimization) : false
        }
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings PATCH Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  } finally {
  }
}