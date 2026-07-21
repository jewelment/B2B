'use server'

import { prisma } from '@/lib/prisma'

export async function submitAccessRequest(formData: FormData) {
  const gstin = formData.get('gstin') as string;
  const salesCode = formData.get('salesCode') as string;

  if (!gstin) {
    return { success: false, error: 'GSTIN is mandatory for B2B verification.' };
  }

  try {
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          domain: 'default.localhost',
          name: 'Default Tenant',
        }
      });
    }

    await prisma.accessRequest.create({
      data: {
        tenantId: tenant.id,
        gstin,
        salesCode: salesCode || null,
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: 'System error. Please try again later.' };
  }
}