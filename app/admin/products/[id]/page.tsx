'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SingleProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="p-8 max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
      
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => router.push('/admin/products')} className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Master Catalog
        </button>
      </div>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Edit Product Master: {id}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Manage global variants, pricing logic, and inventory allocations.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 rounded-full text-sm font-medium border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors shadow-sm">
            Archive Product
          </button>
          <button className="px-6 py-2.5 bg-[var(--brand-primary)] text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover">
            Save Changes
          </button>
        </div>
      </div>

      <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl p-16 flex flex-col items-center justify-center text-center">
        <svg className="w-16 h-16 text-[var(--brand-primary)] mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">Single Product Editing Engine</h2>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">This complex Bento Grid UI will be constructed in the next development sprint, featuring live INR pricing, dynamic variants, and branch sub-ledgers.</p>
      </div>

    </div>
  );
}
