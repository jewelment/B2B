import type { Metadata } from 'next';
import './globals.css'; 
import GlobalCart from '@/components/GlobalCart'; // <-- The new Global Cart Import
import SessionProviderWrapper from '@/components/auth/SessionProviderWrapper';

export const metadata: Metadata = {
  title: 'Ashok Jewels | B2B Portal',
  description: 'Exclusive Wholesale Partner Portal for Ashok Jewels',
  icons: {
    icon: [
      // If the user's OS is in Light Mode, show the Maroon icon
      {
        media: '(prefers-color-scheme: light)',
        url: '/brand/favicon-maroon.png',
        href: '/brand/favicon-maroon.png',
      },
      // If the user's OS is in Dark Mode, show the Golden icon
      {
        media: '(prefers-color-scheme: dark)',
        url: '/brand/favicon-gold.png',
        href: '/brand/favicon-gold.png',
      },
    ],
  },
};

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