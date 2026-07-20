'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CategoriesDashboard() {
  const [activeTab, setActiveTab] = useState('categories');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'categories', label: 'Categories (27)' },
    { id: 'sub-categories', label: 'Sub Categories (136)' },
    { id: 'archived-categories', label: 'Archived Categories (4)' },
    { id: 'archived-sub-categories', label: 'Archived Sub Categories (1)' }
  ];

  const mockCategories = [
    { id: '1', name: 'Rings', products: 1240, subCategories: 12, status: 'Active' },
    { id: '2', name: 'Necklaces', products: 856, subCategories: 8, status: 'Active' },
    { id: '3', name: 'Earrings', products: 2100, subCategories: 15, status: 'Active' },
    { id: '4', name: 'Bracelets', products: 430, subCategories: 6, status: 'Draft' },
    { id: '5', name: 'Pendants', products: 920, subCategories: 10, status: 'Active' },
    { id: '6', name: 'Bangles', products: 150, subCategories: 3, status: 'Inactive' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Draft': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Inactive': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8">
      <div className="w-full space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Manage product taxonomy tree and nested sub-categories.</p>
          </div>
          <button className="px-5 py-2.5 bg-[var(--brand-primary)] text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-[var(--brand-primary)]/20 hover:opacity-90 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Category
          </button>
        </div>

        {/* MAIN PANEL */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
          
          {/* TABS */}
          <div className="flex overflow-x-auto border-b border-[var(--border-color)] scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold tracking-wide whitespace-nowrap transition-all border-b-2 ${
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
                placeholder="Search categories by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] text-[var(--text-main)]"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase tracking-widest border border-[var(--border-color)] bg-[var(--bg-base)] rounded-lg hover:bg-[var(--text-muted)]/10 transition-colors">
                Filters
              </button>
              <button className="flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase tracking-widest border border-[var(--border-color)] bg-[var(--bg-base)] rounded-lg hover:bg-[var(--text-muted)]/10 transition-colors">
                Export
              </button>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-base)] border-b border-[var(--border-color)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                  <th className="p-4 w-12 text-center">
                    <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]" />
                  </th>
                  <th className="p-4">Category Name</th>
                  <th className="p-4 text-center">No. of Products</th>
                  <th className="p-4 text-center">No. of Sub-Categories</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {mockCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]" />
                    </td>
                    <td className="p-4 font-medium text-[var(--text-main)] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                        <svg className="w-5 h-5 text-[var(--text-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      {cat.name}
                    </td>
                    <td className="p-4 text-center font-mono text-sm text-[var(--text-muted)]">{cat.products.toLocaleString()}</td>
                    <td className="p-4 text-center font-mono text-sm text-[var(--text-muted)]">{cat.subCategories}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(cat.status)}`}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors rounded-lg hover:bg-[var(--brand-primary)]/10" title="Add Products">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                      <button className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors rounded-lg hover:bg-[var(--brand-primary)]/10" title="Edit">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10" title="Delete">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* PAGINATION */}
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-base)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-muted)] font-medium">Showing 1 to 6 of 27 entries</p>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-[var(--border-color)] rounded text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors">Prev</button>
              <button className="px-3 py-1 border border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white rounded text-xs font-bold transition-colors">1</button>
              <button className="px-3 py-1 border border-[var(--border-color)] rounded text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors">2</button>
              <button className="px-3 py-1 border border-[var(--border-color)] rounded text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors">3</button>
              <button className="px-3 py-1 border border-[var(--border-color)] rounded text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors">Next</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
