import type { Metadata } from 'next';
import './globals.css'; 
import GlobalCart from '@/components/GlobalCart'; // <-- The new Global Cart Import
import SessionProviderWrapper from '@/components/auth/SessionProviderWrapper';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateMetadata(): Promise<Metadata> {
  let tenantId = null;
  const session = await getServerSession(authOptions);
  
  if (session && session.user) {
    tenantId = (session.user as any).tenantId;
    if (!tenantId && session.user.email) {
      const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
      if (dbUser) tenantId = dbUser.tenantId;
    }
  }

  // Fallback to the first available settings if not logged in (e.g., login page)
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
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#fcfcfc] text-gray-900 font-sans antialiased" suppressHydrationWarning>
        <SessionProviderWrapper>
          {children}
          
          {/* Injecting the persistent B2B Cart at the root level */}
          <GlobalCart /> 
        </SessionProviderWrapper>
      </body>
    </html>
  );
}