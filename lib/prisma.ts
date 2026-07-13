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

// 11.2 BYODB (Bring Your Own Database) Routing Engine
// If an enterprise client has their own isolated database, this router spins up a dedicated connection
export function getTenantPrisma(tenantId: string | null): PrismaClient {
  if (!tenantId) return prisma;

  // Prototype: Dictionary mapping Enterprise tenants to their private DB URLs
  const enterpriseDatabases: Record<string, string> = {
    'tenant-tiffany': process.env.TIFFANY_DATABASE_URL || '',
    'tenant-cartier': process.env.CARTIER_DATABASE_URL || ''
  };

  const customUrl = enterpriseDatabases[tenantId];

  // If this tenant does not have a custom BYODB string, return the global pooled database
  if (!customUrl) {
    return prisma;
  }

  // If they do, check if we already have a warm connection pool for them
  if (globalForPrisma.tenantClients[tenantId]) {
    return globalForPrisma.tenantClients[tenantId];
  }

  // Otherwise, instantiate a new isolated Prisma Client pointed at their private hardware
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