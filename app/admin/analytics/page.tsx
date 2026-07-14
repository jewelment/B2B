import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function AnalyticsPage(props: { searchParams: Promise<{ catalogId?: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role === 'CLIENT') {
    redirect('/dashboard');
  }

  const { catalogId } = await props.searchParams;

  let tenantId = (session.user as any).tenantId;
  if (!tenantId && session.user?.email) {
    const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
    if (dbUser) tenantId = dbUser.tenantId;
  }

  if (!tenantId) {
    return <div className="p-8">Error: Missing tenant context.</div>;
  }



  // Fetch Flipbook Analytics
  const analyticsEvents = await prisma.analyticsEvent.findMany({
    where: { 
      tenantId,
      ...(catalogId ? { catalogId } : {})
    }
  });
  
  const totalViews = analyticsEvents.filter(e => e.eventType === 'CATALOG_VIEW').length;
  const totalPageTurns = analyticsEvents.filter(e => e.eventType === 'PAGE_TURN').length;
  const totalAddsToCart = analyticsEvents.filter(e => e.eventType === 'ADD_TO_CART').length;
  const totalCheckouts = analyticsEvents.filter(e => e.eventType === 'CHECKOUT').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      
      {/* ========================================== */}
      {/* FLIPBOOK ANALYTICS SECTION                 */}
      {/* ========================================== */}
      <section>
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Flipbook Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Catalog Views</p>
            <p className="text-3xl font-bold text-gray-900">{totalViews}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-purple-200 bg-purple-50/50 shadow-sm">
            <p className="text-sm font-medium text-purple-600 mb-1">Page Turns</p>
            <p className="text-3xl font-bold text-purple-900">{totalPageTurns}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm">
            <p className="text-sm font-medium text-blue-600 mb-1">Items Added to Cart</p>
            <p className="text-3xl font-bold text-blue-900">{totalAddsToCart}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-sm">
            <p className="text-sm font-medium text-emerald-600 mb-1">Matrix Checkouts</p>
            <p className="text-3xl font-bold text-emerald-900">{totalCheckouts}</p>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Conversion Funnel</h2>
          <div className="relative pt-4">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 shadow-sm">{totalViews}</div>
                <span className="text-sm font-medium text-gray-600 mt-3">Catalog Views</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 shadow-sm">{totalAddsToCart}</div>
                <span className="text-sm font-medium text-blue-600 mt-3">Cart Adds</span>
              </div>
              <div className="flex-1 h-1 bg-blue-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-700 shadow-sm">{totalCheckouts}</div>
                <span className="text-sm font-medium text-emerald-600 mt-3">Checkouts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
