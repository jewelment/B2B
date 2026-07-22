import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        media: {
          where: { isPrimary: true },
          take: 1
        },
        customFieldValues: {
          include: {
            customField: true
          }
        }
      }
    });

    // Flatten the custom fields into standard object properties for the data grid
    const flattenedProducts = products.map(product => {
      const flatProduct: any = {
        id: product.id,
        handle: product.handle,
        designCode: product.designCode,
        title: product.title,
        category: product.category,
        price: product.price,
        status: product.status,
        image: product.media[0] ? `/api/media/${product.media[0].id}` : null,
      };

      // Inject custom attributes directly into the row data
      product.customFieldValues.forEach(cfv => {
        flatProduct[cfv.customField.name] = cfv.value;
      });

      return flatProduct;
    });

    return NextResponse.json({ success: true, data: flattenedProducts }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = (session.user as any).tenantId;
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID missing from session' }, { status: 400 });
    }

    const { id, title, description, category, price, status, grossWeight, media } = await req.json();
    
    // Generate unique handle and design code for new products
    const baseHandle = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'untitled-product';
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const handle = `${baseHandle}-${randomSuffix}`;
    const designCode = `DC-${Math.floor(Math.random() * 900000) + 100000}`;

    const productData = {
      tenantId,
      title: title || 'Untitled Product',
      description: description || '',
      category: category || 'Jewellery',
      price: parseFloat(price) || 0,
      status: status || 'DRAFT',
      weightGrams: parseFloat(grossWeight) || 0,
    };

    let product;
    if (id && !id.startsWith('NEW')) {
      product = await prisma.product.update({
        where: { id },
        data: productData
      });
    } else {
      product = await prisma.product.create({
        data: {
          ...productData,
          handle,
          designCode
        }
      });
    }

    if (media && Array.isArray(media)) {
      await prisma.productMedia.deleteMany({ where: { productId: product.id } });
      await prisma.productMedia.createMany({
        data: media.map((m: any, idx: number) => ({
          productId: product.id,
          url: m.url || `/assets/mock-library/${Math.random().toString(36).substring(7)}.jpg`,
          isPrimary: m.active || false,
          sequence: idx + 1,
          color: m.color || null
        }))
      });
    }

    return NextResponse.json({ success: true, product }, { status: 201 });

  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, field, value } = await req.json();

    if (!id || !field) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    // Define which fields belong to the core Product table
    const coreFields = ['title', 'category', 'price', 'status', 'weightGrams', 'compareAtPrice'];

    if (coreFields.includes(field)) {
      // Update core table
      const updateData: any = {};
      updateData[field] = field === 'price' ? parseFloat(value) || 0 : value;
      
      await prisma.product.update({
        where: { id },
        data: updateData
      });
    } else {
      // Update dynamic Custom Field
      const customField = await prisma.customField.findUnique({
        where: { name: field }
      });

      if (!customField) {
        return NextResponse.json({ error: `Custom field ${field} not found in schema.` }, { status: 404 });
      }

      await prisma.productFieldValue.upsert({
        where: {
          productId_fieldId: {
            productId: id,
            fieldId: customField.id
          }
        },
        update: { value: String(value) },
        create: {
          productId: id,
          fieldId: customField.id,
          value: String(value)
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Cell updated successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to patch product:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
  }
}