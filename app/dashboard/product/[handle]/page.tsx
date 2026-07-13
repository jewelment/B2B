import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ProductClient from './ProductClient';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  // Wait for params in Next.js 15+ (if applicable, but safe to await)
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams.handle;

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  let tenantId = (session.user as any).tenantId;
  if (!tenantId && session.user.email) {
    const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
    if (dbUser) tenantId = dbUser.tenantId;
  }

  if (!tenantId) {
    redirect('/auth/signin');
  }

  const product = await prisma.product.findFirst({
    where: { tenantId, handle },
    include: {
      components: true,
      media: {
        orderBy: { sequence: 'asc' }
      }
    }
  });

  if (!product) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-2">Product Not Found</h1>
          <p className="text-sm">The requested product does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      <ProductClient product={product} />
    </div>
  );
}
