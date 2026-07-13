import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const fields = [
    { name: 'IGI certificate number', dataType: 'TEXT', isMandatory: false },
    { name: 'IGI certificate', dataType: 'TEXT', isMandatory: false },
    { name: 'Price Breakdown slt', dataType: 'TEXT', isMandatory: false },
    { name: 'Discount savings', dataType: 'TEXT', isMandatory: false },
    { name: 'Offer text', dataType: 'TEXT', isMandatory: false },
    { name: 'Metal color', dataType: 'TEXT', isMandatory: false },
    { name: 'Diamond pcs', dataType: 'NUMBER', isMandatory: false },
    { name: 'Stone pcs', dataType: 'NUMBER', isMandatory: false }
  ];

  for (const field of fields) {
    try {
      await prisma.customField.upsert({
        where: { name: field.name },
        update: {},
        create: field
      });
      console.log(`Upserted CustomField: ${field.name}`);
    } catch (e) {
      console.error(`Failed to upsert ${field.name}:`, e);
    }
  }

  console.log('Done seeding Custom Fields.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
