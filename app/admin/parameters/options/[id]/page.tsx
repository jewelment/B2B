'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OptionEditor() {
  const router = useRouter();
  
  // Mock data representing the "Metal" option
  const [optionName, setOptionName] = useState('Metal');
  const [frontendName, setFrontendName] = useState('Metal');
  const [includeInFilters, setIncludeInFilters] = useState(true);
  const [includeInPriceMaster, setIncludeInPriceMaster] = useState(true);
  const [frontendAppearance, setFrontendAppearance] = useState('Drop-Down List');

  // Nested values structure for the UI representation
  const [values, setValues] = useState([
    {
      id: 'v1',
      name: 'Gold',
      isExpanded: true,
      innerGroups: [
        {
          id: 'ig1',
          name: 'Gold Purity',
          tags: ['14KT', '18KT', '22KT', '916CN', '24KT']
        },
        {
          id: 'ig2',
          name: 'Gold Color',
          tags: ['Yellow', 'White', 'Rose']
        }
      ]
    },
    {
      id: 'v2',
      name: 'Platinum',
      isExpanded: false,
      innerGroups: [
        {
          id: 'ig3',
          name: 'Platinum Purity',
          tags: ['950 PT']
        }
      ]
    }
  ]);

  const toggleExpand = (id: string) => {
    setValues(values.map(v => v.id === id ? { ...v, isExpanded: !v.isExpanded } : v));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8 pb-32">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <h1 className="text-2xl font-bold tracking-tight">{optionName || 'New Option'}</h1>
          </div>
          <button className="px-6 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover text-xs font-bold uppercase tracking-wide">
            Save Changes
          </button>
        </div>

        {/* GENERAL SETTINGS */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Option Name *</label>
                <input 
                  type="text" 
                  value={optionName}
                  onChange={(e) => setOptionName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Frontend Name</label>
                <input 
                  type="text" 
                  value={frontendName}
                  onChange={(e) => setFrontendName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeInFilters}
                    onChange={(e) => setIncludeInFilters(e.target.checked)}
                    className="w-5 h-5 rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-transparent" 
                  />
                  <span className="text-sm font-medium">Include in Filters</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeInPriceMaster}
                    onChange={(e) => setIncludeInPriceMaster(e.target.checked)}
                    className="w-5 h-5 rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-transparent" 
                  />
                  <span className="text-sm font-medium">Include in Price Master</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Frontend Appearance</label>
                <select 
                  value={frontendAppearance}
                  onChange={(e) => setFrontendAppearance(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] appearance-none"
                >
                  <option value="Drop-Down List">Drop-Down List</option>
                  <option value="Radio Buttons">Radio Buttons</option>
                  <option value="Checkbox">Checkbox</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* VALUES SECTION (NESTED ACCORDION) */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wider uppercase text-[var(--text-muted)]">Values</h2>
            <button className="px-4 py-1.5 bg-transparent border border-[var(--border-color)] text-[var(--text-main)] rounded-lg text-xs font-bold uppercase hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Value
            </button>
          </div>

          <div className="p-6 space-y-4">
            {values.map(val => (
              <div key={val.id} className="border border-[var(--border-color)] rounded-lg overflow-hidden bg-black/5 dark:bg-white/5">
                
                {/* VALUE HEADER */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => toggleExpand(val.id)}
                >
                  <div className="flex items-center gap-4">
                    <svg className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${val.isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-bold text-[var(--text-main)]">{val.name}</span>
                    <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-xs text-[var(--text-muted)]">
                      Inner Groups: {val.innerGroups.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-[var(--text-muted)] hover:text-blue-500 transition-colors" title="Edit Value Name" onClick={(e) => e.stopPropagation()}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors" title="Delete Value" onClick={(e) => e.stopPropagation()}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

                {/* INNER GROUPS LIST (EXPANDED STATE) */}
                {val.isExpanded && (
                  <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-base)] space-y-4">
                    {val.innerGroups.map(group => (
                      <div key={group.id} className="border border-[var(--border-color)] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="min-w-[150px]">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase block mb-1">Group Name</span>
                          <span className="text-sm font-medium text-[var(--text-main)]">{group.name}</span>
                        </div>
                        <div className="flex-1 flex flex-wrap gap-2">
                          {group.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 text-xs font-medium">
                              {tag}
                              <button className="hover:text-[var(--text-main)]">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </span>
                          ))}
                          <button className="inline-flex items-center justify-center w-6 h-6 rounded bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 text-[var(--text-muted)] hover:text-red-500 transition-colors bg-black/5 dark:bg-white/5 rounded" title="Delete Group">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    ))}

                    <button className="w-full py-3 border border-dashed border-[var(--border-color)] rounded-lg text-sm text-[var(--text-muted)] font-medium hover:text-[var(--text-main)] hover:border-[var(--text-muted)] transition-all flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Inner Group
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
