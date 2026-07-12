'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalHeader() {
  const pathname = usePathname();

  // CONTEXTUAL SEARCH LOGIC
  let searchPlaceholder = "";
  let showSearch = true;

  if (pathname === '/dashboard') {
    searchPlaceholder = "Search Catalog by Design Code or Matrix...";
  } else if (pathname === '/dashboard/history') {
    searchPlaceholder = "Search by PO Number or Invoice Date...";
  } else {
    showSearch = false;
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--bg-surface)]/80 backdrop-blur-2xl border-b border-[var(--border-color)] transition-all duration-300">
      {/* THE FIX: Matched the exact padding (px-6 md:px-8) and max-width (max-w-7xl mx-auto) of the main content */}
      <div className="h-20 w-full px-6 md:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-6">
          
          {/* LEFT: Contextual Search Bar - Now perfectly aligned with the grid below */}
          <div className="flex-1 max-w-2xl relative">
            {showSearch && (
              <>
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder={searchPlaceholder} 
                  className="w-full pl-12 pr-4 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all shadow-sm"
                />
              </>
            )}
          </div>

          {/* RIGHT: Bullion Market Prices (Gold First) */}
          <div className="flex items-center gap-4">
            
            <div className="flex items-center space-x-2 bg-[var(--bg-base)] px-4 py-2 rounded-lg border border-[var(--border-color)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Gold: ₹7,150/g</span>
            </div>

            <div className="flex items-center space-x-2 bg-[var(--bg-base)] px-4 py-2 rounded-lg border border-[var(--border-color)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Silver: ₹89/g</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}