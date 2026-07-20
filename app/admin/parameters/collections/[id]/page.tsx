'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CollectionEditor() {
  const router = useRouter();
  const [title, setTitle] = useState('Echo');
  const [description, setDescription] = useState('A sleek, modern collection defined by minimalistic shapes and geometric precision.');
  const [status, setStatus] = useState(true);
  const [seoTitle, setSeoTitle] = useState('Echo Collection - Ashok Jewels');
  const [seoDescription, setSeoDescription] = useState('Explore our minimalistic Echo Collection featuring sleek, modern jewelry designs.');

  const mockAssignedProducts = [
    { id: '1', name: 'Echo Minimalist Gold Ring', priority: 1, status: 'Active', price: '$450.00' },
    { id: '2', name: 'Echo Geometric Pendant', priority: 2, status: 'Active', price: '$320.00' },
    { id: '3', name: 'Echo Slim Bangle', priority: 3, status: 'Draft', price: '$550.00' }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-8">
      <div className="w-full space-y-8 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/parameters/collections" className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] hover:bg-[var(--text-muted)]/10 transition-colors text-[var(--text-muted)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              <p className="text-xs text-[var(--text-muted)] mt-1">Configure primary data, product bindings, and search engine optimization.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-muted)]/10 transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 bg-[var(--brand-primary)] text-white rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg shadow-[var(--brand-primary)]/20 hover:opacity-90 transition-all">
              Save Collection
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: MAIN CONFIGURATION */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PRIMARY INFORMATION CARD */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">Primary Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Collection Title *</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] text-[var(--text-main)]"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Description</label>
                  <div className="border border-[var(--border-color)] rounded-lg overflow-hidden flex flex-col">
                    <div className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)] p-2 flex items-center gap-2">
                      <button className="p-1.5 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg></button>
                      <button className="p-1.5 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg></button>
                      <button className="p-1.5 rounded hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg></button>
                    </div>
                    <textarea 
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[var(--bg-base)] focus:outline-none text-[var(--text-main)] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MANUAL PRODUCT ASSIGNMENT CARD */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)]">Products (Manual Assignment)</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Assign products and define priority overrides.</p>
                </div>
                <button className="px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[var(--text-muted)]/10 transition-colors">
                  Browse Products
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-base)] border-b border-[var(--border-color)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                      <th className="p-4 pl-6">Product Name</th>
                      <th className="p-4 text-center">Priority</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-right">Price</th>
                      <th className="p-4 pr-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {mockAssignedProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-medium text-[var(--text-main)] text-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center">
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          {prod.name}
                        </td>
                        <td className="p-4 text-center">
                          <input type="number" defaultValue={prod.priority} className="w-16 px-2 py-1 text-xs text-center border border-[var(--border-color)] bg-[var(--bg-base)] rounded-md outline-none focus:border-[var(--brand-primary)]" />
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${prod.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                            {prod.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-sm text-[var(--text-muted)]">{prod.price}</td>
                        <td className="p-4 pr-6 text-right">
                          <button className="text-[var(--text-muted)] hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 px-2 py-1 rounded">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SEO & GEO OPTIMIZATION CARD */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)]">Search Engine Optimisation</h2>
                <span className="text-[10px] font-bold tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase">GEO Ready</span>
              </div>
              
              <div className="space-y-5">
                {/* Search Engine Preview */}
                <div className="p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border-color)]">
                  <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Preview</h4>
                  <div className="space-y-1">
                    <p className="text-[#1a0dab] dark:text-[#8ab4f8] text-lg font-medium cursor-pointer hover:underline">{seoTitle}</p>
                    <p className="text-[#006621] dark:text-[#81c995] text-sm">https://b2b.ashokjewels.com/collections/{title.toLowerCase().replace(' ', '-')}</p>
                    <p className="text-[var(--text-main)] text-sm mt-1">{seoDescription}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Page Title</label>
                  <input 
                    type="text" 
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    maxLength={70}
                    className="w-full px-4 py-2.5 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] text-[var(--text-main)]"
                  />
                  <p className="text-right text-[10px] text-[var(--text-muted)] mt-1">{seoTitle.length} of 70 characters used</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Meta Description</label>
                  <textarea 
                    rows={3}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    maxLength={320}
                    className="w-full px-4 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] text-[var(--text-main)] resize-none"
                  />
                  <p className="text-right text-[10px] text-[var(--text-muted)] mt-1">{seoDescription.length} of 320 characters used</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SECONDARY CONFIGURATION */}
          <div className="space-y-8">
            
            {/* STATUS CARD */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">Status</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Collection is Active</span>
                <div 
                  onClick={() => setStatus(!status)}
                  className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${status ? 'bg-emerald-500' : 'bg-[var(--border-color)]'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${status ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>
            </div>

            {/* MEDIA UPLOAD CARD */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">Collection Image</h2>
              
              <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all bg-[var(--bg-base)]">
                <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <p className="text-sm font-bold text-[var(--text-main)]">Click to upload media</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">PNG, JPG, WebP up to 5MB</p>
              </div>
            </div>

            {/* NOTES CARD */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">Notes</h2>
              <textarea 
                placeholder="Internal notes regarding this collection..."
                rows={4}
                className="w-full px-4 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] text-[var(--text-main)] resize-none"
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
