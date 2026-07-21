const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testEngine() {
  console.log('Testing Variant Engine...');

  const product = await prisma.product.findFirst({ where: { handle: 'gradiant-triangle-diamond-ring' } });
  const optionSet = await prisma.optionSet.findFirst({ where: { title: 'Ladies Diamond Rings 6-20 All Os' }});

  if (!product || !optionSet) {
    console.error('Missing seed data');
    return;
  }

  console.log(`Attaching OptionSet ${optionSet.title} to Product ${product.title}`);

  // 1. Attach Option Set
  await prisma.productOptionSet.deleteMany({ where: { productId: product.id }});
  await prisma.productOptionSet.create({
    data: {
      productId: product.id,
      optionSetId: optionSet.id
    }
  });

  // 2. Fetch Attached
  const productOptionSets = await prisma.productOptionSet.findMany({
    where: { productId: product.id },
    include: {
      optionSet: {
        include: {
          items: {
            include: {
              option: {
                include: {
                  values: true
                }
              }
            }
          }
        }
      }
    }
  });

  const optionArrays = [];
  productOptionSets.forEach(pos => {
    pos.optionSet.items.forEach(item => {
      if (item.option.values && item.option.values.length > 0) {
        optionArrays.push(item.option.values);
      }
    });
  });

  console.log(`Found ${optionArrays.length} options to combine.`);

  const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
  const combinations = cartesian(...optionArrays);

  console.log(`Generated ${combinations.length} Cartesian combinations!`);

  await prisma.productVariant.deleteMany({ where: { productId: product.id } });

  let count = 0;
  for (const combo of combinations) {
    const skuSuffix = combo.map(c => c.name.toUpperCase().replace(/\s+/g, '')).join('-');
    const sku = `PROD-${product.id.substring(0, 5).toUpperCase()}-${skuSuffix}`;

    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku,
        price: 15000 + Math.random() * 50000,
        optionValues: {
          create: combo.map(c => ({
            optionValueId: c.id
          }))
        }
      }
    });
    count++;
  }

  console.log(`Successfully persisted ${count} variants to database!`);
}

testEngine()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
