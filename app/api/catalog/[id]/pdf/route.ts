import { NextResponse } from 'next/server';
import React from 'react';
import { renderToStream } from '@react-pdf/renderer';
import { PdfTemplate } from './PdfTemplate';
import { prisma } from '@/lib/prisma';


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // 1. Fetch catalog data
    const catalog = await prisma.catalog.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { sequence: 'asc' }
        }
      }
    });

    if (!catalog) {
      return new NextResponse("Catalog not found", { status: 404 });
    }

    // 2. Parse Config
    let config: any = {};
    if (catalog.configuration) {
      try {
        config = JSON.parse(catalog.configuration);
      } catch (e) {}
    }

    // 3. Fetch products
    const designCodes = catalog.items.map(i => i.designCode);
    const products = await prisma.product.findMany({
      where: { designCode: { in: designCodes } },
      include: { media: { orderBy: { sequence: 'asc' } } }
    });

    // 4. Generate PDF Stream using React.createElement so we don't need .tsx extension for the route
    const pdfStream = await renderToStream(
      React.createElement(PdfTemplate, { catalog, products, config, baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' }) as any
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
        'Content-Disposition': `attachment; filename="Catalog-${catalog.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`,
      }
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}