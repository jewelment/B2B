'use client';

import React from 'react';
import Link from 'next/link';

export default function PODetailsPage({ params }: { params: { id: string } }) {
  const poId = params.id;

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen">
      
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mb-3">
          <Link href="/admin/orders/all-pos" className="hover:text-[var(--brand-primary)] transition-colors">Master PO Ledger</Link>
          <span className="text-[var(--border-color)]">/</span>
          <span className="text-[var(--text-main)]">{poId}</span>
        </nav>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[var(--text-main)]">{poId}</h1>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-amber-500/20 bg-amber-500/10 text-amber-500">Pending Approval</span>
            </div>
            <p className="text-sm text-[var(--text-muted)]">July 22, 2026 at 2:05 PM from Draft POs</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-full border border-[var(--border-color)] text-xs font-bold uppercase tracking-widest text-[var(--text-main)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors">
              Export PDF
            </button>
            <button className="px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-widest shadow-md shimmer-hover hover:opacity-90 transition-all">
              Approve PO
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Details */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm text-center">
             <h2 className="text-lg font-bold text-[var(--text-main)] mb-2">Purchase Order Details</h2>
             <p className="text-sm text-[var(--text-muted)] mb-6">Detailed view under development.</p>
             <div className="inline-flex w-24 h-24 rounded-full bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20 items-center justify-center text-[var(--brand-primary)]">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
          </div>
        </div>

        {/* Right Column: Customer Info */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">Client Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Company Name</p>
                <p className="text-sm font-medium text-[var(--text-main)]">Ashok Kumar Jewellers</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Email</p>
                <p className="text-sm font-medium text-[var(--brand-primary)] hover:underline cursor-pointer">ashok@example.com</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
