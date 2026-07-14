import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';

const prisma = new PrismaClient();
const UPLOAD_DIR = path.resolve(process.cwd(), 'client_data/Ashok_Jewels/images');

async function downloadImage(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        if (response.headers.location) {
          downloadImage(response.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else if (response.statusCode === 404) {
        resolve(false);
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Starting Image Mirroring Process...');
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const mediaItems = await prisma.productMedia.findMany({
    where: { url: { startsWith: 'http' } },
    include: { product: true }
  });

  let successCount = 0; let missingCount = 0; let errorCount = 0;

  for (let i = 0; i < mediaItems.length; i++) {
    const media = mediaItems[i];
    const { product } = media;
    if (!product) continue;

    const urlObj = new URL(media.url);
    const pathname = urlObj.pathname;
    let ext = pathname.split('.').pop() || 'jpg';
    if (ext.length > 4 || ext.includes('/')) ext = 'jpg';

    // Exact Naming Convention: [SKU]_[Position].jpg
    const fileName = `${product.handle}_${media.sequence}.${ext}`;
    const localPath = path.join(UPLOAD_DIR, fileName);
    
    // In the future Phase 2 architecture, the web server would serve this from the client_data mount
    // But for the DB record right now, we can store the logical path or filename
    const dbUrl = `/client_data/Ashok_Jewels/images/${fileName}`;

    try {
      const downloaded = await downloadImage(media.url, localPath);
      if (downloaded) {
        await prisma.productMedia.update({
          where: { id: media.id },
          data: { url: dbUrl }
        });
        successCount++;
      } else {
        // DELETE the record if the image 404s so the UI never renders empty boxes
        await prisma.productMedia.delete({
          where: { id: media.id }
        });
        missingCount++;
        console.log(`Deleted 404 Image Record for ${product.handle}: ${media.url}`);
      }
    } catch (err) {
      console.error(`Failed to mirror image for ${product.handle}:`, err);
      errorCount++;
    }
  }

  console.log('--- MIRRORING COMPLETE ---');
  console.log(`Successfully mirrored ${successCount} images.`);
  if (missingCount > 0) console.log(`Skipped ${missingCount} missing (404) images.`);
  if (errorCount > 0) console.log(`Failed to mirror ${errorCount} images.`);
}

main()
  .catch(e => {
    console.error('Fatal Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
