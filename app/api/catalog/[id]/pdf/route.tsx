import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import React from 'react';
import { renderToStream, Document, Page, Text, View, StyleSheet, Image as PdfImage } from '@react-pdf/renderer';

const prisma = new PrismaClient();

// Create styles for the PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  coverPage: {
    backgroundColor: '#ffffff',
    padding: 0,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 10,
  },
  brandName: {
    fontSize: 24,
    color: '#4e080f', // brand primary
    fontWeight: 'bold',
  },
  catalogName: {
    fontSize: 14,
    color: '#666666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  itemCard: {
    width: '48%', // 2 items per row
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eeeeee',
    padding: 10,
  },
  itemImage: {
    width: '100%',
    height: 200,
    objectFit: 'contain',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  itemDetails: {
    flexDirection: 'column',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    maxLines: 1,
  },
  itemCode: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 8,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 8,
  },
  itemPurity: {
    fontSize: 9,
    backgroundColor: '#f0f0f0',
    padding: 3,
  },
  itemPrice: {
    fontSize: 12,
    color: '#4e080f',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    right: 30,
    color: 'grey',
  }
});

// The React-PDF Component
const CatalogDocument = ({ catalog, products, config }: { catalog: any, products: any[], config: any }) => {
  const itemsPerPage = config.desktopItemsPerPage || 4;
  const hidePricing = config.hidePricing || false;

  const formatPrice = (amount: number) => `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;

  return (
    <Document>
      {/* Cover Page */}
      {config.frontCover && (
        <Page size="A4" style={styles.coverPage}>
          <PdfImage src={config.frontCover} style={styles.coverImage} />
        </Page>
      )}

      {/* Product Pages */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brandName}>ASHOK JEWELS</Text>
          <Text style={styles.catalogName}>{catalog.name}</Text>
        </View>

        <View style={styles.grid}>
          {catalog.items.map((catItem: any, idx: number) => {
            const p = products.find(prod => prod.designCode === catItem.designCode);
            if (!p) return null;

            // Safe image resolution
            let imgSrc = '';
            if (p.media && p.media.length > 0 && p.media[0].url) {
               // Only absolute URLs or valid base64 work well in React-PDF Server.
               // Assuming the media URL is absolute or data URI
               imgSrc = p.media[0].url;
            } else if (p.description && (p.description.startsWith('http') || p.description.startsWith('data:image'))) {
               // Fallback to Shopify CDN link stored in description
               imgSrc = p.description;
            }

            return (
              <View key={idx} style={styles.itemCard} wrap={false}>
                {imgSrc ? (
                  <PdfImage src={imgSrc} style={styles.itemImage} />
                ) : (
                  <View style={styles.itemImage} />
                )}
                <View style={styles.itemDetails}>
                  <Text style={styles.itemCode}>{p.designCode}</Text>
                  <Text style={styles.itemTitle}>{p.title}</Text>
                  
                  <View style={styles.itemPriceRow}>
                    <Text style={styles.itemPurity}>{p.metalPurity || '18KT'}</Text>
                    {!hidePricing && (
                      <Text style={styles.itemPrice}>{formatPrice(p.price || p.estimatedPrice || 0)}</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
        
        <Text style={styles.footer} fixed>
          Confidential B2B Wholesale Catalog - Generated via Ashok Jewels Digital Portal
        </Text>
      </Page>
      
      {/* Back Cover */}
      {config.backCover && (
        <Page size="A4" style={styles.coverPage}>
          <PdfImage src={config.backCover} style={styles.coverImage} />
        </Page>
      )}
    </Document>
  );
};

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

    // 4. Generate PDF Stream
    const pdfStream = await renderToStream(
      <CatalogDocument catalog={catalog} products={products} config={config} />
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
