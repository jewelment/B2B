'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function OptionsDashboard() {
  const [activeTab, setActiveTab] = useState<'AllOptions' | 'OptionSets'>('AllOptions');
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking the fetch for now until API is built
    setTimeout(() => {
      setOptions([
        { id: '1', optionName: 'Solitaire', appearance: 'Drop-Down List', values: ['Solitaire'] },
        { id: '2', optionName: 'Gemstone', appearance: 'Drop-Down List', values: ['Gemstone'] },
        { id: '3', optionName: 'Pearl', appearance: 'Drop-Down List', values: [] },
        { id: '4', optionName: 'Metal', appearance: 'Drop-Down List', values: ['Gold (2)', 'Platinum (2)'] },
        { id: '5', optionName: 'Size', appearance: 'Drop-Down List', values: ['7', '8', '9', '10', '11'] },
        { id: '6', optionName: 'Diamond', appearance: 'Drop-Down List', values: ['SI-HI', 'VVS-FG'] }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Options</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] rounded-lg text-xs font-bold uppercase tracking-widest hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all shadow-sm shimmer-hover">
              Export
            </button>
            <button className="px-4 py-2 bg-[var(--brand-primary)] text-[var(--brand-text)] rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm shimmer-hover">
              + Create Options
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex space-x-6 border-b border-[var(--border-color)]">
          <button 
            onClick={() => setActiveTab('AllOptions')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'AllOptions' ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
          >
            All Options (6)
          </button>
          <button 
            onClick={() => setActiveTab('OptionSets')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${activeTab === 'OptionSets' ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
          >
            Option Sets (320)
          </button>
        </div>

        {/* SEARCH & DATA TABLE */}
        <div className="surface-panel overflow-hidden mt-8">
          <div className="p-4 border-b border-[var(--border-color)]">
            <div className="relative max-w-md">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
              <svg className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                  <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">Option Name</th>
                  <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">Appearance</th>
                  <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase">Option Values</th>
                  <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-[var(--text-muted)]">
                      <div className="animate-pulse flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
                        Loading parameters...
                      </div>
                    </td>
                  </tr>
                ) : (
                  options.map((opt) => (
                    <tr key={opt.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 text-sm font-bold text-[var(--text-main)]">
                        {opt.optionName}
                      </td>
                      <td className="py-4 px-6 text-sm text-[var(--text-muted)]">
                        {opt.appearance}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2 max-w-md">
                          {opt.values.length > 0 ? (
                            opt.values.map((v: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                                {v}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[var(--text-muted)] italic">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
