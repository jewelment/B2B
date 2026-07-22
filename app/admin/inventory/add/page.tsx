'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddStorePage() {
  const router = useRouter();

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate save
    router.push('/admin/inventory');
  };

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] mb-2">
             <Link href="/admin/inventory" className="hover:text-[var(--brand-primary)] transition-colors">Inventory</Link>
             <span>/</span>
             <span className="text-[var(--text-main)]">Add New Store</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Add New Store</h1>
        </div>
      </div>

      <form onSubmit={handleSaveStore} className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Info Column */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Bento Box: General Information */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl space-y-6">
               <h3 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">General Information</h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-main)]">Store Name</label>
                    <input required type="text" placeholder="e.g. Kisna Diamond Jewellery" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-semibold text-[var(--text-main)]">Branch Code</label>
                      <input required type="text" placeholder="e.g. F188" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-semibold text-[var(--text-main)]">GST / Tax ID</label>
                      <input required type="text" placeholder="e.g. 27AADCA1234F1Z5" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-main)]">Store Type</label>
                    <select className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner appearance-none cursor-pointer">
                       <option>Retail Branch</option>
                       <option>Wholesale Partner</option>
                       <option>Franchise Store</option>
                    </select>
                 </div>
               </div>
            </div>

            {/* Bento Box: Location */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl space-y-6">
               <h3 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">Location Details</h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-main)]">Full Address</label>
                    <textarea required placeholder="Unit No, Building, Street..." rows={3} className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner resize-none" />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-xs font-semibold text-[var(--text-main)]">City</label>
                      <input required type="text" placeholder="e.g. Pune" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-semibold text-[var(--text-main)]">State / Province</label>
                      <input required type="text" placeholder="e.g. Maharashtra" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-semibold text-[var(--text-main)]">ZIP / Pin Code</label>
                      <input required type="text" placeholder="e.g. 411028" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-semibold text-[var(--text-main)]">Country</label>
                      <input required type="text" defaultValue="India" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                   </div>
                 </div>
               </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Bento Box: Contact */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl space-y-6">
               <h3 className="text-lg font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">Contact Person</h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-main)]">Manager Name</label>
                    <input required type="text" placeholder="Full Name" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-main)]">Email Address</label>
                    <input required type="email" placeholder="manager@store.com" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-main)]">Phone Number</label>
                    <input required type="tel" placeholder="+91 00000 00000" className="w-full p-3.5 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner" />
                 </div>
               </div>
            </div>

            {/* Action Card */}
            <div className="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-2xl p-8 flex flex-col gap-4">
               <button type="button" onClick={() => router.push('/admin/inventory')} className="w-full px-6 py-3.5 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                 Cancel Creation
               </button>
               <button type="submit" className="w-full px-6 py-3.5 bg-[var(--brand-primary)] text-white dark:text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover">
                 Save & Create Store
               </button>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
