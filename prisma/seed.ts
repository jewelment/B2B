const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old users...');
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 12);

  console.log('Creating Admin User...');
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@ajb2b.com',
      passwordHash,
      role: 'ADMIN',
      status: 'APPROVED',
      isApproved: true,
      companyName: 'Ashok Jewels',
    }
  });

  console.log('Creating Sales User...');
  const salesUser = await prisma.user.create({
    data: {
      name: 'John Sales',
      email: 'sales@ajb2b.com',
      passwordHash,
      role: 'SALES',
      status: 'APPROVED',
      isApproved: true,
      companyName: 'Ashok Jewels',
    }
  });

  console.log('Creating Approved Client User...');
  await prisma.user.create({
    data: {
      name: 'Client Partner',
      email: 'client@ajb2b.com',
      passwordHash,
      role: 'CLIENT',
      status: 'APPROVED',
      isApproved: true,
      companyName: 'Partner Corp',
      assignedSalesmanId: salesUser.id
    }
  });

  console.log('Creating Pending Client User...');
  await prisma.user.create({
    data: {
      name: 'Pending Client',
      email: 'pending@ajb2b.com',
      passwordHash,
      role: 'CLIENT',
      status: 'PENDING',
      isApproved: false,
      companyName: 'Pending Corp'
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });