import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    let settings = await prisma.storeSettings.findFirst();
    
    // Ensure settings exist
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          pricingMode: 'MANUAL',
          manualGoldRate24K: 7250,
          manualSilverRate: 88
        }
      });
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings GET Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { pricingMode, manualGoldRate24K, manualSilverRate } = body;

    let settings = await prisma.storeSettings.findFirst();
    
    if (settings) {
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: { 
          pricingMode, 
          manualGoldRate24K: Number(manualGoldRate24K), 
          manualSilverRate: Number(manualSilverRate) 
        }
      });
    } else {
      settings = await prisma.storeSettings.create({
        data: { 
          pricingMode, 
          manualGoldRate24K: Number(manualGoldRate24K), 
          manualSilverRate: Number(manualSilverRate) 
        }
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings PATCH Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}