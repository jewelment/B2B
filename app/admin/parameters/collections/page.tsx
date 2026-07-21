'use client';

import React, { useState } from 'react';

interface CollectionItem {
  id: string;
  name: string;
  products: number;
  status: string;
  image: string;
}

export default function CollectionsDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'all', label: 'All (60)' },
    { id: 'active', label: 'Active (52)' },
    { id: 'inactive', label: 'In-Active (8)' },
    { id: 'archived', label: 'Archived (0)' }
  ];

  const mockCollections: CollectionItem[] = [
    { id: '1', name: 'Mangalyam Collection', products: 48, status: 'Active', image: '' },
    { id: '2', name: 'Esme', products: 49, status: 'Active', image: '' },
    { id: '3', name: 'Nura Collection', products: 142, status: 'Active', image: '' },
    { id: '4', name: 'Heart String', products: 17, status: 'Active', image: '' },
    { id: '5', name: 'Valentines Specials', products: 639, status: 'In-Active', image: '' },
    { id: '6', name: 'House of 14KT', products: 0, status: 'Active', image: '' }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-[#00B060]/10 text-[#00B060] border-[#00B060]/20 shadow-sm';
      case 'In-Active': return 'bg-gray-500/10 text-gray-400 border-gray-500/20 shadow-sm';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20 shadow-sm';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8">
      <div className="w-full space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
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
              + Create Collection
            </button>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden mt-8">
          
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
          <div className="p-4 border-b border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-md bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg">
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
                  <th className="p-4">COLLECTION NAME</th>
                  <th className="p-4">NO. OF PRODUCTS</th>
                  <th className="p-4">STATUS</th>
                  <th className="p-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {mockCollections.map(col => (
                  <tr key={col.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-center">
                      <input type="checkbox" className="rounded border-[var(--border-color)] bg-transparent focus:ring-0 cursor-pointer" />
                    </td>
                    <td className="p-4 font-medium text-sm text-[var(--text-main)] flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[var(--bg-base)] border border-[var(--border-color)] flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-black/20 dark:bg-white/10" />
                      </div>
                      {col.name}
                    </td>
                    <td className="p-4 text-sm text-[var(--text-muted)]">{col.products}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(col.status)}`}>
                        {col.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 text-[var(--text-muted)]">
                      <button className="p-1.5 hover:text-[var(--brand-primary)] transition-colors rounded-lg hover:bg-[var(--brand-primary)]/10" title="Edit">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button className="p-1.5 hover:text-[var(--brand-primary)] transition-colors rounded-lg hover:bg-[var(--brand-primary)]/10" title="Duplicate">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                      </button>
                      <button className="p-1.5 hover:text-[var(--brand-primary)] transition-colors rounded-lg hover:bg-[var(--brand-primary)]/10" title="Delete">
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
            <p className="text-xs text-[var(--text-muted)] font-medium">Showing {mockCollections.length} entries</p>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-[var(--border-color)] rounded text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors">Prev</button>
              <button className="px-3 py-1 border border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-text)] rounded text-xs font-bold transition-colors">1</button>
              <button className="px-3 py-1 border border-[var(--border-color)] rounded text-xs font-bold text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors">Next</button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
