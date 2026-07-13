import React from 'react';
import { prisma } from '@/lib/prisma';
import BuilderClient from '@/app/admin/pages/[id]/builder/BuilderClient';
import { notFound } from 'next/navigation';

export default async function AppBuilderRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const page = await prisma.sduiPage.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!page) {
    return notFound();
  }

  return <BuilderClient pageData={page} />;
}
