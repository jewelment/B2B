import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const media = await prisma.productMedia.findMany({ take: 5 });
  console.log(media);
}
main().then(() => prisma.$disconnect());
