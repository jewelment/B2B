'use server'

import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';
import { processAndSaveMedia } from '@/lib/mediaEngine';

export async function processInventoryCSV(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No file uploaded.' };

    // Read the CSV text
    const text = await file.text();
    
    // Parse the CSV using PapaParse
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data as any[];
    let processedCount = 0;

    // Loop through each row in your CSV
    for (const row of rows) {
      // 1. Setup metadata from your specific columns
      const designCode = row['Design Code'] || row['SKU'];
      const purity = row['Metal Purity'] || '18K';
      const colorCode = row['Metal Color'] === 'Yellow Gold' ? 'YG' : row['Metal Color'] === 'Rose Gold' ? 'RG' : 'WG';
      const imageUrl = row['Image URL'] || row['Image Src'];

      if (!designCode) continue;

      let localImagePath = null;

      // 2. Trigger the Media Engine if an image URL exists
      if (imageUrl) {
        try {
          localImagePath = await processAndSaveMedia({
            sourceType: 'url',
            fileUrl: imageUrl,
            isProductImage: true,
            designCode: designCode,
            purity: purity,
            colorCode: colorCode,
            imageIndex: 1
          });
        } catch (mediaErr) {
          console.error(`Failed to process image for ${designCode}:`, mediaErr);
        }
      }

      // 3. Write/Update the Database
      // Using upsert so it updates existing products instead of creating duplicates
      await prisma.product.upsert({
        where: { designCode: designCode },
        update: {
          title: row['Title'] || designCode,
          estimatedPrice: parseFloat(row['Price']) || 0,
          // If a new image was downloaded, update the path. Otherwise keep the old one.
          ...(localImagePath && { description: localImagePath }) // Temporarily storing image path in description for UI rendering
        },
        create: {
          handle: designCode.toLowerCase(),
          designCode: designCode,
          title: row['Title'] || `Jewelry Piece ${designCode}`,
          description: localImagePath || 'No image available', // Storing image path here temporarily
          metalPurity: purity,
          grossWeight: parseFloat(row['Gross Weight']) || 5.0,
          pureWeight: parseFloat(row['Net Weight']) || 4.0,
          igiCertNumber: row['custom.igi_certificate_number'] || null,
          estimatedPrice: parseFloat(row['Price']) || 0,
        }
      });
      
      processedCount++;
    }

    return { success: true, count: processedCount };
  } catch (error) {
    console.error("CSV Processing Error:", error);
    return { success: false, error: 'Failed to process CSV file.' };
  }
}