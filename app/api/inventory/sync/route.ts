import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';


// Standardized Internal Pricing Variables
const BASE_GOLD_RATE_18K = 5500;
const BASE_DIAMOND_RATE = 65000;
const MAKING_CHARGE_PER_GRAM = 850;

export async function POST(req: Request) {
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

    const body = await req.json();
    const { products } = body;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload structure. Expected an array of products.' }, 
        { status: 400 }
      );
    }

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const item of products) {
      try {
        const handle = item.designCode.toLowerCase();

        // 1. Rebuild Cost Logic from JSON Payload
        const metalCost = item.pureWeight * BASE_GOLD_RATE_18K;
        const makingCost = item.grossWeight * MAKING_CHARGE_PER_GRAM;
        
        // Note: The FSM parser does not currently extract diamond weight, so we default to 0 here.
        const diamondWeight = 0; 
        const diamondCost = diamondWeight * BASE_DIAMOND_RATE;
        
        const estimatedPrice = item.estimatedPrice > 0 
          ? item.estimatedPrice 
          : (metalCost + diamondCost + makingCost);

        const productData = {
          title: item.title,
          description: item.description,
          metalPurity: item.metalPurity,
          grossWeight: item.grossWeight,
          pureWeight: item.pureWeight,
          igiCertNumber: item.igiCertNumber,
          estimatedPrice: estimatedPrice,
        };

        // 2. Transactional Upsert
        const existingProduct = await prisma.product.findFirst({
          where: { tenantId, designCode: item.designCode }
        });

        let productId;

        if (existingProduct) {
          const updatedProduct = await prisma.product.update({
            where: { id: existingProduct.id },
            data: productData
          });
          productId = updatedProduct.id;
          updated++;
        } else {
          const newProduct = await prisma.product.create({
            data: {
              tenantId,
              handle: handle,
              designCode: item.designCode,
              ...productData
            }
          });
          productId = newProduct.id;
          created++;
        }

        // 3. Clear and Rebuild PO Matrix Components
        await prisma.component.deleteMany({
          where: { productId: productId }
        });

        const componentsData = [];
        if (item.pureWeight > 0) {
          componentsData.push({ productId, type: 'Metal', details: item.metalPurity, weight: item.pureWeight, rate: BASE_GOLD_RATE_18K, finalCost: metalCost });
        }
        if (item.grossWeight > 0) {
          componentsData.push({ productId, type: 'Making Charges', details: 'Labor & Processing', weight: item.grossWeight, rate: MAKING_CHARGE_PER_GRAM, finalCost: makingCost });
        }

        if (componentsData.length > 0) {
          await prisma.component.createMany({ data: componentsData });
        }

      } catch (rowError) {
        console.error(`❌ DB Error on SKU [${item.designCode}]:`, rowError);
        errors++;
      }
    }

    // Return the exact statistics required by the UI dashboard
    return NextResponse.json({
      success: true,
      stats: {
        created,
        updated,
        errors
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Fatal Sync Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during synchronization.' }, 
      { status: 500 }
    );
  }
}