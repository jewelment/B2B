const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Injecting Master Catalog Data...');

  // Clear existing data for a fresh start
  await prisma.component.deleteMany();
  await prisma.product.deleteMany();

  // Inject a flagship product mapping to your Shopify/ERP structure
  await prisma.product.create({
    data: {
      handle: 'diamond-floral-ring-18kt',
      designCode: 'AJ-RNG-2041',
      title: 'Diamond Floral Ring',
      description: '18KT Daily wear diamond floral ring.',
      metalPurity: '18KT',
      grossWeight: 4.50,
      pureWeight: 3.37,
      igiCertNumber: 'IGI-123456789', // Mapped from custom.igi_certificate_number
      estimatedPrice: 45000,
      components: {
        create: [
          { type: 'Metal', details: '18KT Rose Gold', rate: 5362, finalCost: 24129 },
          { type: 'Diamond', details: 'VVS-EF (0.25ct)', rate: 65000, finalCost: 16250 },
          { type: 'Making Charges', details: 'Standard Labor', rate: 800, finalCost: 3600 }
        ]
      }
    }
  });

  console.log('Database successfully seeded with Ashok Jewels inventory.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });