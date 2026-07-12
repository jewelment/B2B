import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { renderToBuffer } from '@react-pdf/renderer';
import { ProformaInvoicePDF } from '@/components/ProformaInvoicePDF';
import React from 'react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, selectedSkus } = body;

    if (!selectedSkus || !Array.isArray(selectedSkus) || selectedSkus.length === 0) {
      return NextResponse.json({ error: 'No SKUs provided for invoice generation.' }, { status: 400 });
    }

    // 1. Fetch live product data for the selected items
    const liveProducts = await prisma.product.findMany({
      where: { designCode: { in: selectedSkus } },
      select: {
        designCode: true,
        title: true,
        estimatedPrice: true,
        metalPurity: true
      }
    });

    // 2. Calculate dynamic pipeline total
    const totalValue = liveProducts.reduce((acc, p) => acc + (p.estimatedPrice || 0), 0);

    // 3. Render the PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(ProformaInvoicePDF, { 
        clientName: clientId, 
        items: liveProducts, 
        totalValue 
      })
    );

    // 4. Return as a downloadable file buffer
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Proforma_Invoice_${new Date().getTime()}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Invoice Generation Error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF document.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}