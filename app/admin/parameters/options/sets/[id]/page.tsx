'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OptionSetEditor() {
  const [title, setTitle] = useState('chain bracelet gemstone os');
  const [isSingleVariant, setIsSingleVariant] = useState(false);
  
  const [options, setOptions] = useState([
    { id: '1', name: 'metal', type: 'Drop-Down List', isOpen: true },
    { id: '2', name: 'diamond', type: 'Drop-Down List', isOpen: true },
    { id: '3', name: 'gemstone', type: 'Drop-Down List', isOpen: true },
    { id: '4', name: 'size', type: 'Drop-Down List', isOpen: true }
  ]);

  const toggleOption = (id: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, isOpen: !o.isOpen } : o));
  };

  const [metalState, setMetalState] = useState({
    goldActive: true,
    goldPurities: ['14KT', '18KT'],
    defaultPurity: '14KT',
    goldColors: ['Yellow', 'White', 'Rose'],
    defaultColor: 'Yellow',
    platinumActive: false
  });

  const [diamondState, setDiamondState] = useState({
    sihi: true,
    vvsfg: false
  });

  const handleSaveNotification = () => {
    alert('Settings Saved Successfully!');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8">
      <div className="w-full space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Link href="/admin/parameters/options/sets" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>

        {/* SHARED OPTIONS */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Enter Shared options Title *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full max-w-md px-4 py-2.5 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
              />
            </div>
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setIsSingleVariant(!isSingleVariant)}
                className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${isSingleVariant ? 'bg-[var(--brand-primary)]' : 'bg-black/20 dark:bg-white/20'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSingleVariant ? 'translate-x-4' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-medium text-[var(--text-main)]">Is Single Variant</span>
            </div>
          </div>
        </div>

        {/* MAKE OPTION SETS */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between bg-black/5 dark:bg-white/5">
            <div>
              <h2 className="text-lg font-bold">Make Option Sets</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">If this product has options, like size or color then add option</p>
            </div>
            <button className="px-4 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
              + Add Options
            </button>
          </div>

          <div className="p-6 space-y-6">
            {options.map((opt) => (
              <div key={opt.id} className="border border-[var(--border-color)] rounded-lg p-5 bg-[var(--bg-base)]">
                
                {/* OPTION HEADER */}
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleOption(opt.id)}>
                  <div className="flex items-center gap-8 w-full max-w-2xl">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase block mb-1">Option Name</span>
                      <span className="text-sm font-medium capitalize">{opt.name}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase block mb-1">Input Field Type</span>
                      <span className="text-sm font-medium text-[var(--text-muted)]">{opt.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <div className={`transform transition-transform ${opt.isOpen ? 'rotate-180' : ''} text-[var(--text-muted)]`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                {/* METAL CONFIGURATION */}
                {opt.isOpen && opt.name === 'metal' && (
                  <div className="mt-6 pt-6 border-t border-[var(--border-color)] space-y-6" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Gold Block */}
                    <div className="flex flex-col md:flex-row items-start gap-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
                      <div className="pt-1 flex-shrink-0">
                        <input type="checkbox" checked={metalState.goldActive} onChange={(e) => setMetalState({...metalState, goldActive: e.target.checked})} className="w-4 h-4 text-[var(--brand-primary)] border-[var(--border-color)] rounded focus:ring-[var(--brand-primary)]" />
                      </div>
                      <div className="space-y-5 w-full">
                        <span className="text-sm font-bold block">Gold</span>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                          <div className="bg-[var(--bg-base)] p-4 rounded-lg border border-[var(--border-color)]">
                            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Select Gold Purity *</label>
                            <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
                              {metalState.goldPurities.map(purity => (
                                <span key={purity} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                                  {purity} <button className="ml-2 hover:text-red-500">×</button>
                                </span>
                              ))}
                            </div>
                            <select className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg outline-none text-[var(--text-main)]">
                              <option>14KT</option>
                              <option>18KT</option>
                            </select>
                          </div>
                          <div className="bg-[var(--bg-base)] p-4 rounded-lg border border-[var(--border-color)] flex flex-col justify-end">
                            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Select Default Purity *</label>
                            <select 
                              value={metalState.defaultPurity}
                              onChange={(e) => setMetalState({...metalState, defaultPurity: e.target.value})}
                              className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg outline-none text-[var(--text-main)]">
                              <option>14KT</option>
                              <option>18KT</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                          <div className="bg-[var(--bg-base)] p-4 rounded-lg border border-[var(--border-color)]">
                            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Select Gold Color *</label>
                            <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
                              {metalState.goldColors.map(color => (
                                <span key={color} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                                  {color} <button className="ml-2 hover:text-red-500">×</button>
                                </span>
                              ))}
                            </div>
                            <select className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg outline-none text-[var(--text-main)]">
                              <option>Yellow</option>
                              <option>White</option>
                              <option>Rose</option>
                            </select>
                          </div>
                          <div className="bg-[var(--bg-base)] p-4 rounded-lg border border-[var(--border-color)] flex flex-col justify-end">
                            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Select Default Color *</label>
                            <select 
                              value={metalState.defaultColor}
                              onChange={(e) => setMetalState({...metalState, defaultColor: e.target.value})}
                              className="w-full px-3 py-2 text-sm bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg outline-none text-[var(--text-main)]">
                              <option>Yellow</option>
                              <option>White</option>
                              <option>Rose</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Platinum Block */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-[var(--border-color)]">
                      <input type="checkbox" checked={metalState.platinumActive} onChange={(e) => setMetalState({...metalState, platinumActive: e.target.checked})} className="w-4 h-4 text-[var(--brand-primary)] rounded border-[var(--border-color)] focus:ring-[var(--brand-primary)]" />
                      <span className="text-sm font-bold">Platinum</span>
                    </div>

                  </div>
                )}
                
                {/* DIAMOND CONFIGURATION */}
                {opt.isOpen && opt.name === 'diamond' && (
                  <div className="mt-6 pt-6 border-t border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-lg p-6 relative">
                      <h4 className="text-sm font-bold mb-4 text-[var(--text-main)]">Diamond Clarities</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] cursor-pointer hover:border-[var(--brand-primary)] transition-colors">
                          <input type="checkbox" checked={diamondState.sihi} onChange={(e) => setDiamondState({...diamondState, sihi: e.target.checked})} className="w-4 h-4 text-[var(--brand-primary)] rounded border-[var(--border-color)] focus:ring-[var(--brand-primary)]" />
                          <span className="text-sm font-medium">SI-HI</span>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] cursor-pointer hover:border-[var(--brand-primary)] transition-colors">
                          <input type="checkbox" checked={diamondState.vvsfg} onChange={(e) => setDiamondState({...diamondState, vvsfg: e.target.checked})} className="w-4 h-4 text-[var(--brand-primary)] rounded border-[var(--border-color)] focus:ring-[var(--brand-primary)]" />
                          <span className="text-sm font-medium">VVS-FG</span>
                        </label>
                      </div>

                      {/* Anchored Save CTA */}
                      <div className="mt-8 flex justify-end border-t border-[var(--border-color)] pt-6">
                        <button onClick={handleSaveNotification} className="px-6 py-2.5 bg-[var(--brand-primary)] text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-[var(--brand-primary)]/20 hover:opacity-90 transition-all flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Save Configuration
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* GEMSTONE CONFIGURATION */}
                {opt.isOpen && opt.name === 'gemstone' && (
                  <div className="mt-6 pt-6 border-t border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-lg p-6">
                      <h4 className="text-sm font-bold mb-4 text-[var(--text-main)]">Gemstone Selections</h4>
                      <p className="text-xs text-[var(--text-muted)] mb-5">Select applicable gemstone configurations for this option set. These define the available attributes for custom orders.</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] cursor-pointer hover:border-[var(--brand-primary)] transition-colors">
                          <input type="checkbox" defaultChecked className="w-4 h-4 text-[var(--brand-primary)] rounded border-[var(--border-color)] focus:ring-[var(--brand-primary)]" />
                          <span className="text-sm font-medium">Gemstone Default</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* SIZE CONFIGURATION */}
                {opt.isOpen && opt.name === 'size' && (
                  <div className="mt-6 pt-6 border-t border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-lg p-6">
                      <h4 className="text-sm font-bold mb-4 text-[var(--text-main)]">Size Variants</h4>
                      <div className="flex flex-wrap gap-3">
                        {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(size => (
                          <span key={size} className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 shadow-sm cursor-default hover:bg-[var(--brand-primary)]/20 transition-colors">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
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
