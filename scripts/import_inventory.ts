import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csvParser from 'csv-parser';

const prisma = new PrismaClient();

const TENANT_ID = 'cmribdv8h000013rvd0844ep5';
const CSV_FILE = 'D:\\Google AJ Drive - home\\Maste B2B Jewelement Project\\Jewelment B2B Dev V1\\Testing data\\Inventory data.csv';

interface CSVRow {
  Handle: string;
  'Design code (product.metafields.custom.design_code)'?: string;
  Title?: string;
  'Body (HTML)'?: string;
  'Product Category'?: string;
  'Variant Grams'?: string;
  'Variant Price'?: string;
  'Variant Compare At Price'?: string;
  Published?: string;
  'Image Src'?: string;
  'Image Position'?: string;
  'Price Breakdown slt (product.metafields.custom.price_breakdown_slt)'?: string;
  'IGI certificate number (product.metafields.custom.igi_certificate_number)'?: string;
}

async function main() {
  console.log('Starting Inventory Import for Tenant:', TENANT_ID);

  const rawRows: CSVRow[] = [];
  
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(CSV_FILE)
      .pipe(csvParser())
      .on('data', (data) => rawRows.push(data))
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  console.log(`Parsed ${rawRows.length} total rows from CSV.`);

  // Group rows by Handle
  const productsMap = new Map<string, CSVRow[]>();
  for (const row of rawRows) {
    // Find the handle key (it might have a BOM or quotes like '﻿"Handle"')
    const handleKey = Object.keys(row).find(k => k.includes('Handle')) || 'Handle';
    const handleValue = (row as any)[handleKey];

    if (!handleValue) continue;
    if (!productsMap.has(handleValue)) {
      productsMap.set(handleValue, []);
    }
    productsMap.get(handleValue)!.push(row);
  }

  console.log(`Found ${productsMap.size} unique products.`);

  let createdCount = 0;
  let errorCount = 0;

  for (const [handle, rows] of productsMap.entries()) {
    try {
      // The first row for a handle usually contains all the primary product info
      const mainRow = rows.find(r => r.Title && r.Title.trim() !== '') || rows[0];

      // Extract basic fields
      const designCode = handle;
      const title = mainRow.Title || handle;
      const description = mainRow['Body (HTML)'] || '';
      const category = mainRow['Product Category'] || '';
      const price = parseFloat(mainRow['Variant Price'] || '0') || 0;
      const compareAtPrice = parseFloat(mainRow['Variant Compare At Price'] || '0') || null;
      const weightGrams = parseFloat(mainRow['Variant Grams'] || '0') || null;
      const status = String(mainRow.Published).toUpperCase() === 'TRUE' ? 'ACTIVE' : 'DRAFT';
      const igiCertNumber = mainRow['IGI certificate number (product.metafields.custom.igi_certificate_number)'] || null;

      // Extract components from Price Breakdown
      const componentsData: any[] = [];
      const priceBreakdownStr = mainRow['Price Breakdown slt (product.metafields.custom.price_breakdown_slt)'];
      
      if (priceBreakdownStr) {
        try {
          const pb = JSON.parse(priceBreakdownStr);
          
          if (pb.metals && Array.isArray(pb.metals)) {
            for (const metal of pb.metals) {
              componentsData.push({
                type: 'Metal',
                details: metal.name || '',
                weight: parseFloat(metal.wt?.replace(/[^0-9.]/g, '') || '0') || null,
                rate: parseFloat(metal.rate?.replace(/[^0-9.]/g, '') || '0') || 0,
                finalCost: parseFloat(metal.net?.replace(/[^0-9.]/g, '') || '0') || 0,
              });
            }
          }
          
          if (pb.diamonds && Array.isArray(pb.diamonds)) {
            for (const dia of pb.diamonds) {
              componentsData.push({
                type: 'Diamond',
                details: dia.name || '',
                weight: parseFloat(dia.wt?.replace(/[^0-9.]/g, '') || '0') || null,
                rate: 0, // Not provided directly per unit
                finalCost: parseFloat(dia.net?.replace(/[^0-9.]/g, '') || '0') || 0,
              });
            }
          }

          if (pb.making && pb.making.net) {
            componentsData.push({
              type: 'Making Charges',
              details: 'Labor & Making',
              weight: null,
              rate: 0,
              finalCost: parseFloat(pb.making.net?.replace(/[^0-9.]/g, '') || '0') || 0,
            });
          }
        } catch (e) {
          console.error(`Error parsing JSON for ${handle}:`, e);
        }
      }

      // Extract Media
      const mediaData: any[] = [];
      for (const row of rows) {
        const imgSrc = row['Image Src'];
        if (imgSrc && imgSrc.trim() !== '') {
          const sequence = parseInt(row['Image Position'] || '0') || (mediaData.length + 1);
          let ext = imgSrc.split('?')[0].split('.').pop() || 'jpg';
          if (ext.length > 4 || ext.includes('/')) ext = 'jpg';
          
          mediaData.push({
            // Future-proofing: We map it to the local physical path. The user can manually override these files.
            url: `/client_data/Ashok_Jewels/images/${handle}_${sequence}.${ext}`,
            isPrimary: mediaData.length === 0,
            sequence: sequence
          });
        }
      }

      try {
        await upsertProduct(handle, designCode, title, description, category, price, compareAtPrice, weightGrams, status, igiCertNumber, componentsData, mediaData);
      } catch (upsertError: any) {
        console.log(`Error on handle ${handle}. Code: ${upsertError.code}`);
        if (upsertError.code === 'P2002') {
          const newDesignCode = `${designCode}-${Math.random().toString(36).substring(7)}`;
          console.log(`Retrying ${handle} with new designCode: ${newDesignCode}`);
          await upsertProduct(handle, newDesignCode, title, description, category, price, compareAtPrice, weightGrams, status, igiCertNumber, componentsData, mediaData);
        } else {
          throw upsertError;
        }
      }
      
      // If it existed, we didn't recreate components in upsert.update, so let's force sync them.
      // Easiest is to just wipe components and media and recreate them.
      const prod = await prisma.product.findUnique({ where: { tenantId_handle: { tenantId: TENANT_ID, handle } } });
      if (prod) {
        await prisma.component.deleteMany({ where: { productId: prod.id } });
        await prisma.productMedia.deleteMany({ where: { productId: prod.id } });
        
        if (componentsData.length > 0) {
          await prisma.component.createMany({
            data: componentsData.map((c: any) => ({ ...c, productId: prod.id }))
          });
        }
        if (mediaData.length > 0) {
          await prisma.productMedia.createMany({
            data: mediaData.map((m: any) => ({ ...m, productId: prod.id }))
          });
        }
      }

      createdCount++;
      if (createdCount % 50 === 0) {
        console.log(`Processed ${createdCount} products...`);
      }

    } catch (error) {
      console.error(`Failed to insert product ${handle}:`, error);
      errorCount++;
    }
  }

  console.log('--- IMPORT COMPLETE ---');
  console.log(`Successfully processed ${createdCount} products.`);
  if (errorCount > 0) {
    console.log(`Encountered ${errorCount} errors.`);
  }
}

async function upsertProduct(handle: string, designCode: string, title: string, description: string, category: string, price: number, compareAtPrice: number | null, weightGrams: number | null, status: string, igiCertNumber: string | null, componentsData: any[], mediaData: any[]) {
  return prisma.product.upsert({
    where: {
      tenantId_handle: {
        tenantId: TENANT_ID,
        handle: handle
      }
    },
    update: {
      designCode,
      title,
      description,
      category,
      price,
      compareAtPrice,
      weightGrams,
      status,
      igiCertNumber,
    },
    create: {
      tenantId: TENANT_ID,
      handle,
      designCode,
      title,
      description,
      category,
      price,
      compareAtPrice,
      weightGrams,
      status,
      igiCertNumber,
      components: {
        create: componentsData
      },
      media: {
        create: mediaData
      }
    }
  });
}

main()
  .catch((e) => {
    console.error('Fatal Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
