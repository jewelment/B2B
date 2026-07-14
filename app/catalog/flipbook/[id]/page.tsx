import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import FlipbookClient from './FlipbookClient';

const prisma = new PrismaClient();

// CHANGE 1: Type the params parameter as a Promise to comply with Next.js 16+ Turbopack routing
export default async function ImmersiveFlipbookPage({ params }: { params: Promise<{ id: string }> }) {
  
  // CHANGE 2: Await the params object before destructuring the ID
  const { id } = await params;

  if (id === 'preview') {
    return <FlipbookClient catalog={{ id: 'preview', items: [] }} />;
  }

  // 1. Secure Server-Side Fetch
  const catalog = await prisma.catalog.findUnique({
    where: { id },
    include: {
      items: { orderBy: { sequence: 'asc' } }
    }
  });

  if (!catalog || !catalog.isActive) {
    notFound();
  }

  // 2. Fetch all corresponding Master Inventory SKUs
  const designCodes = catalog.items.map(item => item.designCode);
  const rawProducts = await prisma.product.findMany({
    where: { designCode: { in: designCodes } },
    select: {
      designCode: true,
      title: true,
      metalPurity: true,
      grossWeight: true,
      pureWeight: true,
      price: true,
      estimatedPrice: true,
      media: {
        orderBy: { sequence: 'asc' }
      },
      description: true,
      igiCertNumber: true
    }
  });

  // Fetch store settings for proxy and webp logic
  const settings = await prisma.storeSettings.findUnique({
    where: { tenantId: catalog.tenantId }
  });
  const useProxy = settings?.enableSecureMediaProxy !== false;
  const appendWebp = settings?.enableWebpOptimization === true;

  // 3. Enqueue the products directly into the catalog items
  const enrichedItems = catalog.items.map(item => {
    const productData = rawProducts.find(p => p.designCode === item.designCode);
    
    // Map the media relation back to the legacy flat fields expected by FlipbookClient
    let mappedProduct = productData ? { ...productData, mainImage: null } : null;
    if (mappedProduct && mappedProduct.media && mappedProduct.media.length > 0) {
      mappedProduct.media = mappedProduct.media.map(m => {
        let finalUrl = m.url;
        if (m.url) {
          const originalFilename = m.url.split('/').pop() || 'image.jpg';
          const baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.')) || originalFilename;
          
          if (useProxy) {
            finalUrl = `/api/media/${m.id}` + (appendWebp ? `/${baseName}.webp` : `/${originalFilename}`);
          } else if (appendWebp) {
            finalUrl = m.url.substring(0, m.url.lastIndexOf('.')) + '.webp';
          }
        }
        return { ...m, url: finalUrl };
      });
      // @ts-ignore - dynamic injection for client component compatibility
      mappedProduct.mainImage = mappedProduct.media[0].url;
    }
    
    return { ...item, product: mappedProduct || null };
  });

  const parsedConfig = catalog.configuration ? JSON.parse(catalog.configuration) : {};

  // 4. Pass sanitized data to the Client UI
  return (
    <FlipbookClient 
      catalog={{
        id: catalog.id,
        name: catalog.name,
        theme: catalog.theme,
        clientId: catalog.clientId,
        configuration: parsedConfig,
        items: enrichedItems
      }} 
    />
  );
}