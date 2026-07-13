import React from 'react';
import { prisma } from '@/lib/prisma';
import BuilderClient from './BuilderClient';
import { notFound } from 'next/navigation';

export default async function PageBuilderRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const page = await prisma.sduiPage.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!page) {
    return notFound();
  }

  return <BuilderClient pageData={page} />;
}
