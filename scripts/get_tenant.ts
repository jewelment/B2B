import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'Default Tenant',
        domain: 'wholesale.localhost'
      }
    });
    console.log('Created new Tenant:', tenant.id);
  } else {
    console.log('Found Tenant:', tenant.id);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
