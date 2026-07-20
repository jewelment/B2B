'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function OptionSetEditor() {
  const [title, setTitle] = useState('ladies diamond gemstone ring all os');
  const [isSingleVariant, setIsSingleVariant] = useState(false);
  const [options, setOptions] = useState([
    { id: '1', name: 'metal', type: 'Drop-Down List', isOpen: true },
    { id: '2', name: 'diamond', type: 'Drop-Down List', isOpen: false },
    { id: '3', name: 'gemstone', type: 'Drop-Down List', isOpen: false },
    { id: '4', name: 'size', type: 'Drop-Down List', isOpen: true }
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Link href="/admin/parameters/options" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
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
                className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full transition-colors ${isSingleVariant ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-color)]'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSingleVariant ? 'translate-x-4' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-medium text-[var(--text-main)]">Is Single Variant</span>
            </div>
          </div>
        </div>

        {/* MAKE OPTION SETS */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
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
              <div key={opt.id} className="border border-[var(--border-color)] rounded-lg p-5 space-y-5 bg-black/5 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8 w-full max-w-2xl">
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase block mb-1">Option Name</span>
                      <span className="text-sm font-medium">{opt.name}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase block mb-1">Input Field Type</span>
                      <span className="text-sm font-medium text-[var(--text-muted)]">{opt.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-[var(--text-muted)] hover:text-[var(--brand-primary)]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                    <button className="text-[var(--text-muted)] hover:text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>

                {opt.isOpen && opt.name === 'metal' && (
                  <div className="pl-6 border-l-2 border-[var(--border-color)] space-y-5 pt-4">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" checked readOnly className="mt-1 w-4 h-4 text-[var(--brand-primary)] border-[var(--border-color)] rounded focus:ring-[var(--brand-primary)]" />
                      <div className="space-y-4 w-full max-w-sm">
                        <span className="text-sm font-bold block">Gold</span>
                        
                        <div>
                          <label className="block text-xs font-bold text-[var(--text-muted)] mb-2">Select Gold Purity *</label>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--brand-primary)] text-white">14KT <span className="ml-1 cursor-pointer">×</span></span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--brand-primary)] text-white">18KT <span className="ml-1 cursor-pointer">×</span></span>
                          </div>
                          <select className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] outline-none">
                            <option>14KT</option>
                            <option>18KT</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-[var(--text-muted)] mb-2">Select Gold Color *</label>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--brand-primary)] text-white">Yellow <span className="ml-1 cursor-pointer">×</span></span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--brand-primary)] text-white">White <span className="ml-1 cursor-pointer">×</span></span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--brand-primary)] text-white">Rose <span className="ml-1 cursor-pointer">×</span></span>
                          </div>
                          <select className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] outline-none">
                            <option>Yellow</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {opt.isOpen && opt.name === 'size' && (
                  <div className="pl-6 border-l-2 border-[var(--border-color)] pt-4">
                    <div className="flex flex-wrap gap-2">
                      {[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(size => (
                        <span key={size} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">
                          {size}
                        </span>
                      ))}
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
