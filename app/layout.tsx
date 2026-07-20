import type { Metadata } from 'next';
import './globals.css'; 
import GlobalCart from '@/components/GlobalCart'; // <-- The new Global Cart Import
import SessionProviderWrapper from '@/components/auth/SessionProviderWrapper';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

import { headers } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host');
  const enterpriseTenantId = headersList.get('x-enterprise-tenant-id');

  let tenantId = null;

  // 1. Prioritize Enterprise Tenant ID from Middleware
  if (enterpriseTenantId) {
    tenantId = enterpriseTenantId;
  } 
  // 2. Resolve by mapping the domain name
  else if (host) {
    const domainOnly = host.split(':')[0]; // Remove port (e.g., localhost:3000 -> localhost)
    const tenant = await prisma.tenant.findUnique({
      where: { domain: domainOnly }
    });
    if (tenant) {
      tenantId = tenant.id;
    }
  }

  // Fallback to the first available settings if we still don't have a tenant (e.g. fresh DB)
  let settings = tenantId 
    ? await prisma.storeSettings.findUnique({ where: { tenantId } }) 
    : await prisma.storeSettings.findFirst();

  return {
    title: settings?.brandName || 'B2B Wholesale Portal',
    description: settings?.brandDescription || 'Exclusive Wholesale Partner Portal',
    icons: {
      icon: [
        {
          media: '(prefers-color-scheme: light)',
          url: settings?.faviconLight || '/brand/favicon-maroon.png',
          href: settings?.faviconLight || '/brand/favicon-maroon.png',
        },
        {
          media: '(prefers-color-scheme: dark)',
          url: settings?.faviconDark || '/brand/favicon-gold.png',
          href: settings?.faviconDark || '/brand/favicon-gold.png',
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-[var(--bg-base)] text-[var(--text-main)] font-sans antialiased" suppressHydrationWarning>
        <SessionProviderWrapper>
          {children}
          
          {/* Injecting the persistent B2B Cart at the root level */}
          <GlobalCart /> 
        </SessionProviderWrapper>
      </body>
    </html>
  );
}