import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import FlipbookClient from './FlipbookClient';

const prisma = new PrismaClient();

// CHANGE 1: Type the params parameter as a Promise to comply with Next.js 16+ Turbopack routing
export default async function ImmersiveFlipbookPage({ params }: { params: Promise<{ id: string }> }) {
  
  // CHANGE 2: Await the params object before destructuring the ID
  const { id } = await params;

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
      estimatedPrice: true,
      media: {
        orderBy: { sequence: 'asc' },
        take: 1
      },
      description: true,
      igiCertNumber: true
    }
  });

  // 3. Enqueue the products directly into the catalog items
  const enrichedItems = catalog.items.map(item => {
    const productData = rawProducts.find(p => p.designCode === item.designCode);
    
    // Map the media relation back to the legacy flat fields expected by FlipbookClient
    let mappedProduct = productData ? { ...productData, mainImage: null } : null;
    if (mappedProduct && mappedProduct.media && mappedProduct.media.length > 0) {
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