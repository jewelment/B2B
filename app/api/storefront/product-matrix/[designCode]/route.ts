import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ designCode: string }> }
) {
  try {
    const { designCode } = await params;
    
    // We should ideally filter by tenantId, but for storefront we'll just query by designCode
    // In a true multi-tenant we'd extract tenantId from domain or headers
    const product = await prisma.product.findFirst({
      where: { designCode },
      include: {
        optionSets: {
          include: {
            optionSet: {
              include: {
                items: {
                  include: {
                    option: true
                  }
                }
              }
            }
          }
        },
        variants: {
          include: {
            optionValues: {
              include: {
                optionValue: {
                  include: {
                    option: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Attempt to extract dynamic options
    let sizes: string[] = [];
    let purities: string[] = [];
    const rtsVariants: string[] = [];

    // Strategy 1: Extract from explicitly generated variants
    if (product.variants && product.variants.length > 0) {
      const uniqueSizes = new Set<string>();
      const uniquePurities = new Set<string>();

      product.variants.forEach(variant => {
        let size = '';
        let purity = '';
        
        variant.optionValues.forEach(ov => {
          const optName = ov.optionValue.option.optionName.toLowerCase();
          if (optName.includes('size')) {
            size = ov.optionValue.name;
            uniqueSizes.add(size);
          }
          if (optName.includes('purity') || optName.includes('metal') || optName.includes('color')) {
            purity = ov.optionValue.name;
            uniquePurities.add(purity);
          }
        });
        
        // If the variant is ACTIVE, mark it as Ready to Ship (RTS)
        if (variant.status === 'ACTIVE' && purity && size) {
          rtsVariants.push(`${purity}_${size}`);
        }
      });

      sizes = Array.from(uniqueSizes);
      purities = Array.from(uniquePurities);
    } 

    // Strategy 2: Fallback Matrix
    if (sizes.length === 0 || purities.length === 0) {
      sizes = ['6', '7', '8', '9', '10', '11'];
      purities = ['14K YG', '14K RG', '14K WG', '18K YG', '18K RG', '18K WG'];
    }

    // Sort sizes numerically if possible
    sizes.sort((a, b) => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    return NextResponse.json({
      success: true,
      data: {
        designCode: product.designCode,
        title: product.title,
        basePrice: product.price || product.estimatedPrice || 0,
        matrix: {
          columns: sizes.map(s => ({ id: s, label: s })),
          rows: purities.map(p => ({ id: p, label: p })),
          rtsVariants // Ready to Ship variant keys
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching product matrix:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
