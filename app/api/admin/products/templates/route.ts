import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 


export async function GET(req: NextRequest) {
  try {
    // 1. Auth Check
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Safe URL Parsing via NextRequest
    const type = req.nextUrl.searchParams.get('type') || 'empty';

    // 3. Database Query
    const customFields = await prisma.customField.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const coreHeaders = [
      'Handle', 'DesignCode', 'Title', 'Description', 
      'Category', 'Price', 'CompareAtPrice', 'WeightGrams'
    ];

    const dynamicHeaders = customFields.map(field => field.name);
    const allHeaders = [...coreHeaders, ...dynamicHeaders];

    let csvContent = allHeaders.join(',') + '\n';

    if (type === 'data') {
      const products = await prisma.product.findMany({
        include: { customFieldValues: { include: { customField: true } } }
      });

      products.forEach(product => {
        const row = [
          product.handle,
          product.designCode,
          `"${(product.title || '').replace(/"/g, '""')}"`,
          `"${(product.description || '').replace(/"/g, '""')}"`,
          product.category || '',
          product.price,
          product.compareAtPrice || '',
          product.weightGrams || ''
        ];

        const fieldMap = new Map();
        product.customFieldValues.forEach(cfv => {
          fieldMap.set(cfv.customField.name, cfv.value);
        });

        dynamicHeaders.forEach(header => {
          const val = fieldMap.get(header) || '';
          row.push(`"${String(val).replace(/"/g, '""')}"`);
        });

        csvContent += row.join(',') + '\n';
      });
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="AshokJewels_Master_Catalog_${type}.csv"`,
      },
    });

  } catch (error: any) {
    console.error('Template Generation Error:', error);
    // CRITICAL: We are now sending the exact error directly to the browser
    return NextResponse.json({ 
      error: 'CRASH TRACE', 
      message: error.message, 
      stack: error.stack 
    }, { status: 500 });
  } finally {
  }
}