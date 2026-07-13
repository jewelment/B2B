import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  tenantClients: Record<string, PrismaClient>;
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

if (!globalForPrisma.tenantClients) {
  globalForPrisma.tenantClients = {};
}

import path from 'path';
import fs from 'fs';

// 11.2 BYODB (Bring Your Own Database) Routing Engine
// If an enterprise client has their own isolated database, this router spins up a dedicated connection
export function getTenantPrisma(tenantId: string | null): PrismaClient {
  if (!tenantId) return prisma;

  // Map tenant IDs to their isolated physical folders in the external volume
  const clientMap: Record<string, string> = {
    'tenant-ashok': 'Ashok_Jewels',
    'tenant-vaibhav': 'Vaibhav_Global',
    'tenant-angara': 'Angara_eCommerce'
  };

  const folderName = clientMap[tenantId];
  let customUrl = '';

  if (folderName) {
    // Construct the path to the isolated client_data folder
    // E.g., D:\Google AJ Drive - home\Maste B2B Jewelement Project\Jewelment B2B Dev V1\client_data\Ashok_Jewels\database.sqlite
    const dbPath = path.resolve(process.cwd(), `../client_data/${folderName}/database.sqlite`);
    
    // In Phase 2, this will use a dedicated SQLite Prisma Client (e.g., @prisma/tenant-client)
    customUrl = `file:${dbPath}`;
  }

  // If this tenant does not have an isolated DB string, return the global database
  if (!customUrl) {
    return prisma;
  }

  // If they do, check if we already have a warm connection pool for them
  if (globalForPrisma.tenantClients[tenantId]) {
    return globalForPrisma.tenantClients[tenantId];
  }

  // NOTE: This currently requires splitting schema.prisma into schema.master.prisma (Postgres) 
  // and schema.tenant.prisma (SQLite). For now, it scaffolds the routing logic.
  const tenantClient = new PrismaClient({
    datasources: {
      db: {
        url: customUrl
      }
    }
  });

  globalForPrisma.tenantClients[tenantId] = tenantClient;
  return tenantClient;
}