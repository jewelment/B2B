import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const TENANT_ID = 'cmribdv8h000013rvd0844ep5';
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');

async function main() {
  console.log('Starting Inventory Reset for Tenant:', TENANT_ID);

  try {
    // 1. Delete all products for this tenant (Cascade will delete ProductMedia and Component)
    const deleteProducts = await prisma.product.deleteMany({
      where: { tenantId: TENANT_ID },
    });
    console.log(`Deleted ${deleteProducts.count} products from the database.`);

    // 2. Delete local files
    if (fs.existsSync(UPLOAD_DIR)) {
      const files = fs.readdirSync(UPLOAD_DIR);
      let deletedFiles = 0;
      for (const file of files) {
        fs.unlinkSync(path.join(UPLOAD_DIR, file));
        deletedFiles++;
      }
      console.log(`Deleted ${deletedFiles} files from local gallery.`);
    } else {
      console.log('Local gallery directory does not exist. Skipping file deletion.');
    }

    console.log('--- RESET COMPLETE ---');
  } catch (error) {
    console.error('Failed to reset inventory:', error);
  }
}

main()
  .catch((e) => {
    console.error('Fatal Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
