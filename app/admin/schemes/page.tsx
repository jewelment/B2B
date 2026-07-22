'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SchemesPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'ACTIVE', 'INACTIVE', 'DRAFT'];

  const [searchQuery, setSearchQuery] = useState('');
  const [schemes, setSchemes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [showViewModal, setShowViewModal] = useState<any | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any | null>(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch('/api/schemes');
        const data = await res.json();
        if (data.success) {
          setSchemes(data.schemes);
        }
      } catch (error) {
        console.error("Failed to fetch schemes", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || scheme.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-main)]">11+1 Schemes</h1>
        <Link href="/admin/schemes/create" className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
          + Create Scheme
        </Link>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1 min-h-[600px]">
        {/* Tabs */}
        <div className="flex items-center border-b border-[var(--border-color)] px-6 pt-4 gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              {tab} {tab === 'All' ? '(1)' : ''}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-primary)] rounded-t-full shadow-[0_0_8px_var(--brand-primary)] animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center gap-4 bg-black/5 dark:bg-black/20">
          <div className="flex items-center gap-2 bg-[var(--bg-base)] rounded-lg px-4 py-2 border border-[var(--border-color)] focus-within:border-[var(--brand-primary)] transition-colors w-72">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" />
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Scheme Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Tenure</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Bonus Installments</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Discount (1st)</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Min Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Max Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Grace (Days)</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-[var(--text-muted)]">
                    <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    Loading schemes...
                  </td>
                </tr>
              ) : filteredSchemes.map((scheme, idx) => (
                <tr key={scheme.id} className="border-b border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[var(--text-main)]">{scheme.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 max-w-[200px] truncate">{scheme.shortDescription}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{scheme.totalTenureMonths} Months</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{scheme.bonusInstallments}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{scheme.bonusDiscountPct}%</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{formatCurrency(scheme.minInstallment)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{formatCurrency(scheme.maxInstallment)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{scheme.gracePeriodDays}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wide ${scheme.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : scheme.status === 'DRAFT' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                      {scheme.status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                      {scheme.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3 text-[var(--text-muted)] transition-opacity">
                       <Link href={`/admin/schemes/${scheme.id}`} className="hover:text-[var(--brand-primary)] transition-colors">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                       </Link>
                       <Link href={`/admin/schemes/${scheme.id}`} className="hover:text-blue-400 transition-colors">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                       </Link>
                       <button onClick={() => setShowDeleteModal(scheme)} className="hover:text-red-400 transition-colors">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-end bg-black/5 dark:bg-black/20">
           <div className="flex items-center gap-2">
             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--brand-primary)] transition-colors">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--brand-primary)] text-black font-bold text-sm shadow-sm">
               1
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--brand-primary)] transition-colors">
               2
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--brand-primary)] transition-colors">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
           </div>
        </div>
      </div>

      {/* Modals */}
      
      {/* Delete Restriction Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[var(--bg-surface)] border-2 border-red-500/50 rounded-2xl w-[450px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Cannot Delete Scheme</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">
                The scheme <strong>{showDeleteModal.name}</strong> currently has active enrollments and financial timelines attached to it. You cannot delete this scheme while customers are invested.
              </p>
              <button onClick={() => setShowDeleteModal(null)} className="w-full py-3 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-wide border border-red-500/20">
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Scheme Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200" onClick={() => setShowViewModal(null)}>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl w-[400px] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[var(--brand-primary)] mb-4">{showViewModal.name}</h3>
            <div className="space-y-3 text-sm text-[var(--text-main)]">
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span className="text-[var(--text-muted)]">Status</span> <span className="text-green-500 font-bold">{showViewModal.status}</span></div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span className="text-[var(--text-muted)]">Tenure</span> <span>{showViewModal.tenure} Months</span></div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span className="text-[var(--text-muted)]">Bonus</span> <span>{showViewModal.bonus} Installment</span></div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2"><span className="text-[var(--text-muted)]">Discount</span> <span>{showViewModal.discount}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Limits</span> <span>{showViewModal.minAmount} - {showViewModal.maxAmount}</span></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
