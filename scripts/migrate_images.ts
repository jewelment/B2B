import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const OLD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery');
const NEW_DIR = path.resolve(process.cwd(), 'client_data/Ashok_Jewels/images');

async function main() {
  console.log('Starting Local Image Migration...');
  if (!fs.existsSync(NEW_DIR)) fs.mkdirSync(NEW_DIR, { recursive: true });

  const mediaItems = await prisma.productMedia.findMany({
    include: { product: true }
  });

  let movedCount = 0;
  let deletedCount = 0;

  for (const media of mediaItems) {
    if (!media.product) continue;

    if (media.url.startsWith('http')) {
      // These are the images that 404'd in the previous Shopify sync
      // We delete the DB record so the frontend doesn't render an empty box!
      await prisma.productMedia.delete({ where: { id: media.id } });
      deletedCount++;
    } else if (media.url.startsWith('/uploads/gallery/')) {
      // Physical Migration
      const oldFilename = media.url.split('/').pop()!;
      const oldPath = path.join(OLD_DIR, oldFilename);
      
      const ext = oldFilename.split('.').pop() || 'jpg';
      const newFilename = `${media.product.handle}_${media.sequence}.${ext}`;
      const newPath = path.join(NEW_DIR, newFilename);

      if (fs.existsSync(oldPath)) {
        // Move the file to the new isolated client directory
        fs.renameSync(oldPath, newPath);
        
        // Update DB
        await prisma.productMedia.update({
          where: { id: media.id },
          data: { url: `/client_data/Ashok_Jewels/images/${newFilename}` }
        });
        movedCount++;
      } else {
        // File is missing locally, clean up DB
        await prisma.productMedia.delete({ where: { id: media.id } });
        deletedCount++;
      }
    }
  }

  console.log('--- MIGRATION COMPLETE ---');
  console.log(`Successfully moved and renamed ${movedCount} images.`);
  console.log(`Cleaned up ${deletedCount} broken/404 image records.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
