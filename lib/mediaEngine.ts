import { promises as fs } from 'fs';
import path from 'path';

interface ProcessMediaArgs {
  sourceType: 'url' | 'upload';
  fileBuffer?: Buffer;         // If it's a direct upload
  fileUrl?: string;            // If it's a URL from the CSV
  isProductImage: boolean;
  
  // Naming Parameters
  designCode?: string;         // e.g., 'AJRG89140'
  purity?: string;             // e.g., '18K'
  colorCode?: string;          // e.g., 'YG', 'RG', 'WG'
  imageIndex?: number;         // e.g., 1, 2, 3
  originalName?: string;       // For non-product banners
}

export async function processAndSaveMedia(args: ProcessMediaArgs): Promise<string> {
  let buffer: Buffer;

  // 1. ACQUIRE THE IMAGE BUFFER
  if (args.sourceType === 'url' && args.fileUrl) {
    try {
      const response = await fetch(args.fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch URL: ${args.fileUrl}`);
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (error) {
      console.error("URL Download Error:", error);
      throw new Error("Could not download image from the provided URL.");
    }
  } else if (args.sourceType === 'upload' && args.fileBuffer) {
    buffer = args.fileBuffer;
  } else {
    throw new Error("Invalid media source provided.");
  }

  // 2. APPLY THE NOMENCLATURE ENGINE
  let finalFileName = '';
  let subFolder = '';

  if (args.isProductImage) {
    // Generate: AJRG89140 + 18K + YG + _1 + .jpg
    if (!args.designCode || !args.purity || !args.colorCode || !args.imageIndex) {
      throw new Error("Missing required metadata for product image nomenclature.");
    }
    finalFileName = `${args.designCode}${args.purity}${args.colorCode}_${args.imageIndex}.jpg`;
    subFolder = 'products';
  } else {
    // Keep original name for banners, logos, etc.
    finalFileName = args.originalName || `media_${Date.now()}.jpg`;
    subFolder = 'marketing';
  }

  // 3. SECURE LOCAL STORAGE PIPELINE
  // This paths it to your public/uploads/... folder
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subFolder);
  const filePath = path.join(uploadDir, finalFileName);

  try {
    // Ensure the folder exists, if not, create it
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write the actual file to the hard drive
    await fs.writeFile(filePath, buffer);
    
    // Return the relative URL path to save into the database
    return `/uploads/${subFolder}/${finalFileName}`;
  } catch (error) {
    console.error("File System Error:", error);
    throw new Error("Failed to save the image to internal storage.");
  }
}