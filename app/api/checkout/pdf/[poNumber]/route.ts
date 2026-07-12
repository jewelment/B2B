import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { PurchaseOrderPDF } from '@/components/PurchaseOrderPDF';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ poNumber: string }> }) {
  try {
    const { poNumber } = await params;
    
    // 1. Fetch Purchase Order from Database
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { poNumber },
      include: {
        items: true
      }
    });

    if (!purchaseOrder) {
      return new NextResponse("Purchase Order not found", { status: 404 });
    }

    // 2. Fetch live product data (to get images and descriptions for the PDF)
    const designCodes = purchaseOrder.items.map(item => item.designCode);
    const products = await prisma.product.findMany({
      where: { designCode: { in: designCodes } },
      include: { media: { orderBy: { sequence: 'asc' }, take: 1 } }
    });

    // 3. Map items to include images
    const enrichedItems = purchaseOrder.items.map(item => {
      const p = products.find(prod => prod.designCode === item.designCode);
      let imageUrl = null;
      if (p) {
        if (p.media && p.media.length > 0) {
          imageUrl = p.media[0].url;
        } else if (p.description && (p.description.startsWith('http') || p.description.startsWith('data:image'))) {
          imageUrl = p.description;
        }
      }
      return {
        ...item,
        title: p?.title || 'Unknown Item',
        imageUrl
      };
    });

    const orderData = {
      poNumber: purchaseOrder.poNumber,
      totalUnits: purchaseOrder.totalUnits,
      totalValue: purchaseOrder.totalAmount,
      items: enrichedItems
    };

    // 4. Generate PDF Stream
    const pdfStream = await renderToStream(
      React.createElement(PurchaseOrderPDF, { orderData })
    );

    // 5. Convert Node Stream to Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        pdfStream.on('data', (chunk) => controller.enqueue(chunk));
        pdfStream.on('end', () => controller.close());
        pdfStream.on('error', (err) => controller.error(err));
      }
    });

    // 6. Return response
    return new NextResponse(readableStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="PurchaseOrder_${purchaseOrder.poNumber}.pdf"`,
      }
    });

  } catch (error) {
    console.error('PO PDF Generation Error:', error);
    return new NextResponse("Failed to generate Purchase Order PDF", { status: 500 });
  }
}
