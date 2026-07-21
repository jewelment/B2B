'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function StoreAllocationPage() {
  const [search, setSearch] = useState('');

  // Mock data for stores and inventory
  const storeData = [
    {
      id: 1,
      variantName: 'Classic Solitaire Ring - 14K Yellow Gold / Size 6',
      sku: 'RNG-SOL-14KY-6',
      totalStock: 45,
      stores: [
        { name: 'Fifth Avenue, NY', stock: 15, status: 'Active', reorderLevel: 5 },
        { name: 'Mayfair, London', stock: 20, status: 'Active', reorderLevel: 10 },
        { name: 'Dubai Mall, UAE', stock: 10, status: 'Low Stock', reorderLevel: 12 },
      ]
    },
    {
      id: 2,
      variantName: 'Diamond Tennis Bracelet - 18K White Gold / 7 inch',
      sku: 'BRC-TEN-18KW-7',
      totalStock: 12,
      stores: [
        { name: 'Fifth Avenue, NY', stock: 5, status: 'Active', reorderLevel: 3 },
        { name: 'Mayfair, London', stock: 7, status: 'Active', reorderLevel: 5 },
        { name: 'Dubai Mall, UAE', stock: 0, status: 'Out of Stock', reorderLevel: 4 },
      ]
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Store Allocation Grid</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Manage physical inventory distribution across retail branches</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-[var(--text-main)] rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-sm">
            EXPORT CSV
          </button>
          <button className="px-6 py-2.5 bg-[var(--brand-primary)] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover">
            NEW ALLOCATION
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Active Branches</p>
          <h3 className="text-3xl font-black text-[var(--text-main)]">14</h3>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[var(--brand-primary)]">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Allocated Variants</p>
          <h3 className="text-3xl font-black text-[var(--text-main)]">4,291</h3>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-amber-500">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Low Stock Alerts</p>
          <h3 className="text-3xl font-black text-amber-500">18</h3>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-black/5 dark:bg-white/5">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search SKU or Variant..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all"
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex gap-2 text-sm">
            <select className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] cursor-pointer shadow-sm">
              <option>All Branches</option>
              <option>Fifth Avenue, NY</option>
              <option>Mayfair, London</option>
              <option>Dubai Mall, UAE</option>
            </select>
          </div>
        </div>

        {/* Master Data Grid */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase">Variant / SKU</th>
                <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase text-center">Global Stock</th>
                <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase">Branch Distribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {storeData.map(item => (
                <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-5 px-6 align-top">
                    <p className="font-bold text-sm text-[var(--text-main)] mb-1">{item.variantName}</p>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{item.sku}</p>
                  </td>
                  <td className="py-5 px-6 align-top text-center">
                    <span className="text-lg font-black text-[var(--text-main)]">{item.totalStock}</span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="space-y-3">
                      {item.stores.map((store, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] shadow-sm hover:shadow-md transition-shadow group/store cursor-default">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--text-muted)]">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-[var(--text-main)]">{store.name}</p>
                              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Reorder Level: {store.reorderLevel}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm font-bold text-[var(--text-main)]">{store.stock} <span className="text-[10px] font-normal text-[var(--text-muted)] uppercase">Units</span></p>
                            </div>
                            <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border w-24 text-center ${
                              store.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                              store.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse' : 
                              'bg-red-500/10 text-red-600 border-red-500/20'
                            }`}>
                              {store.status}
                            </span>
                            <button className="opacity-0 group-hover/store:opacity-100 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-all">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
