'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ReviewsWorkflowPage() {
  const [search, setSearch] = useState('');
  
  // Mock data for reviews
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: { name: 'Sarah Jenkins', company: 'Jenkins Fine Jewelry', avatar: 'SJ' },
      product: { name: 'Classic Solitaire Ring', sku: 'RNG-SOL-14KY' },
      rating: 5,
      reviewText: 'Exceptional clarity on the diamond and the setting is flawless. Our clients love this piece.',
      date: '2026-07-20',
      status: 'Pending'
    },
    {
      id: 2,
      user: { name: 'Michael Chen', company: 'Chen & Co. Imports', avatar: 'MC' },
      product: { name: 'Diamond Tennis Bracelet', sku: 'BRC-TEN-18KW' },
      rating: 4,
      reviewText: 'Good quality overall, but the clasp feels slightly stiff out of the box. Beautiful stones.',
      date: '2026-07-18',
      status: 'Approved'
    },
    {
      id: 3,
      user: { name: 'Elena Rossi', company: 'Rossi Milano', avatar: 'ER' },
      product: { name: 'Emerald Drop Earrings', sku: 'EAR-EMD-18KY' },
      rating: 2,
      reviewText: 'The color of the emeralds did not match the CAD renderings provided in the catalog.',
      date: '2026-07-15',
      status: 'Denied'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Denied': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse';
    }
  };

  const updateStatus = (id: number, newStatus: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Product Reviews Workflow</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Moderate client feedback before publishing to the storefront</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-[var(--brand-primary)] text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover">
            AUTO-APPROVE SETTINGS
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-black/5 dark:bg-white/5">
          <div className="relative w-72">
            <input 
              type="text" 
              placeholder="Search reviewer or product..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all"
            />
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex gap-2 text-sm">
            <select className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] cursor-pointer shadow-sm">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Denied</option>
            </select>
          </div>
        </div>

        {/* Master Data Grid */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[25%]">Reviewer</th>
                <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[25%]">Product Linked</th>
                <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[30%]">Feedback</th>
                <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[10%] text-center">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[10%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {reviews.map(review => (
                <tr key={review.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                  <td className="py-5 px-6 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-sm text-[var(--text-muted)] border border-[var(--border-color)]">
                        {review.user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[var(--text-main)]">{review.user.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{review.user.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 align-top">
                    <p className="font-bold text-sm text-[var(--text-main)] mb-1">{review.product.name}</p>
                    <p className="text-xs text-[var(--text-muted)] font-mono">{review.product.sku}</p>
                  </td>
                  <td className="py-5 px-6 align-top whitespace-normal">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-sm text-[var(--text-main)] italic">"{review.reviewText}"</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-2 font-mono">{new Date(review.date).toLocaleDateString()}</p>
                  </td>
                  <td className="py-5 px-6 align-top text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(review.status)}`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 align-top">
                    {review.status === 'Pending' ? (
                      <div className="flex flex-col gap-2 items-end">
                        <button onClick={() => updateStatus(review.id, 'Approved')} className="px-4 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                          APPROVE
                        </button>
                        <button onClick={() => updateStatus(review.id, 'Denied')} className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                          DENY
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button onClick={() => updateStatus(review.id, 'Pending')} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors active:scale-95" title="Revert to Pending">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                        </button>
                      </div>
                    )}
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
