const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create the Master Tenant
  const ashokTenant = await prisma.tenant.upsert({
    where: { domain: 'ashokjewels' },
    update: {},
    create: {
      name: 'Ashok Jewels',
      domain: 'ashokjewels',
      brandPrimary: '#d97706', // Amber-600
      viewerBackground: 'DARK'
    }
  });
  console.log('Created Tenant:', ashokTenant.name);

  // 2. Create the Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: ashokTenant.id,
        email: 'admin@ashokjewels.com'
      }
    },
    update: {},
    create: {
      tenantId: ashokTenant.id,
      email: 'admin@ashokjewels.com',
      passwordHash: passwordHash,
      name: 'Ashok Master Admin',
      role: 'ADMIN',
      status: 'APPROVED',
      isApproved: true,
      companyName: 'Ashok Jewels HQ'
    }
  });
  console.log('Created Admin User:', adminUser.email);

  // 3. Create a Sample Product for the Matrix Cart
  const sampleProduct = await prisma.product.upsert({
    where: {
      tenantId_designCode: {
        tenantId: ashokTenant.id,
        designCode: 'AJ-RING-001'
      }
    },
    update: {},
    create: {
      tenantId: ashokTenant.id,
      handle: 'aj-ring-001',
      designCode: 'AJ-RING-001',
      title: 'Diamond Eternity Ring',
      price: 1500,
      status: 'ACTIVE',
      category: 'Rings',
      metalPurity: '18K',
      weightGrams: 5.2
    }
  });
  console.log('Created Sample Product:', sampleProduct.designCode);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });