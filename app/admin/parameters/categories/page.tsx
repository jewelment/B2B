'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CategoryItem {
  id: string;
  name: string;
  products: number;
  subCategories: number;
  status: string;
  hasSub: boolean;
}

export default function CategoriesDashboard() {
  const [activeTab, setActiveTab] = useState('categories');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'categories', label: 'Categories (27)' },
    { id: 'sub-categories', label: 'Sub Categories (136)' },
    { id: 'archived-categories', label: 'Archived Categories (4)' },
    { id: 'archived-sub-categories', label: 'Archived Sub Categories (1)' }
  ];

  const mockCategories: CategoryItem[] = [
    { id: '1', name: 'Rakhi Pendants', products: 0, subCategories: 0, status: 'Active', hasSub: false },
    { id: '2', name: 'Bangle - Bracelet', products: 0, subCategories: 2, status: 'Active', hasSub: true },
    { id: '3', name: 'Setting Rings', products: 0, subCategories: 1, status: 'Active', hasSub: true }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-[#00B060]/10 text-[#00B060] border-[#00B060]/20 shadow-sm';
      case 'Draft': return 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm';
      case 'Inactive': return 'bg-red-500/10 text-red-600 border-red-500/20 shadow-sm';
      default: return 'bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20 shadow-sm';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8">
      <div className="w-full space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] transition-all shadow-none text-xs font-bold uppercase tracking-wide">
              View Logs
            </button>
            <button className="px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] transition-all shadow-none text-xs font-bold uppercase tracking-wide">
              Import
            </button>
            <button className="px-5 py-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all shadow-sm shimmer-hover text-xs font-bold uppercase tracking-wide">
              Export
            </button>
            <button className="px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover text-xs font-bold uppercase tracking-wide">
              + Create
            </button>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="surface-panel overflow-hidden mt-8">
          
          {/* TABS */}
          <div className="flex overflow-x-auto border-b border-[var(--border-color)] scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5' 
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SEARCH & FILTERS */}
          <div className="p-4 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-transparent outline-none focus:ring-0 text-[var(--text-main)] placeholder-[var(--text-muted)]"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="px-4 py-1.5 text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md hover:text-[var(--text-main)] flex items-center gap-2">
                Status
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button className="px-4 py-1.5 text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md hover:text-[var(--text-main)] flex items-center gap-2">
                Sort
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
              </button>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-base)] border-b border-[var(--border-color)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                  <th className="p-4 w-12 text-center">
                    <input type="checkbox" className="rounded border-[var(--border-color)] bg-transparent focus:ring-0 cursor-pointer" />
                  </th>
                  <th className="p-4">CATEGORIES NAME</th>
                  <th className="p-4">NO. OF PRODUCTS</th>
                  <th className="p-4">NO. OF SUB-CATEGORIES</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {mockCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-[var(--border-color)] bg-transparent focus:ring-0 cursor-pointer" />
                    </td>
                    <td className="p-4 font-medium text-sm text-[var(--text-main)] flex items-center gap-3">
                      <div className="w-4 h-4 flex items-center justify-center">
                        {cat.hasSub && (
                          <svg className="w-3 h-3 text-[var(--text-muted)] cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                      {cat.name}
                    </td>
                    <td className="p-4 text-sm text-[var(--text-muted)]">{cat.products}</td>
                    <td className="p-4 text-sm text-[var(--text-muted)]">{cat.subCategories}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(cat.status)}`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 text-[var(--text-muted)]">
                      <button className="p-1.5 hover:text-[var(--brand-primary)] transition-colors rounded-lg hover:bg-[var(--brand-primary)]/10" title="Edit">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button className="p-1.5 hover:text-[var(--brand-primary)] transition-colors rounded-lg hover:bg-[var(--brand-primary)]/10" title="Duplicate">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
}
