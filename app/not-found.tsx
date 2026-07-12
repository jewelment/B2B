'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--brand-primary)]/10 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-[150px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-2xl px-6 text-center animate-in zoom-in-95 fade-in duration-1000 slide-in-from-bottom-8">
        
        <div className="flex justify-center mb-8">
          <div className="relative w-20 h-20 bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-2xl shadow-xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="absolute -top-3 -right-3 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 border-2 border-[var(--bg-base)]"></span>
            </span>
            <Image src="/brand/favicon-maroon.png" alt="Logo" width={40} height={40} className="object-contain opacity-80" />
          </div>
        </div>

        <h1 className="text-[12rem] font-light text-[var(--text-main)] leading-none tracking-tighter mix-blend-overlay opacity-20 select-none">
          404
        </h1>
        
        <div className="-mt-16 relative z-20 bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--glass-border)] rounded-[2rem] p-10 md:p-14 shadow-2xl">
          <h2 className="text-3xl font-light text-[var(--text-main)] tracking-wide mb-4">
            Destination Unknown
          </h2>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-md mx-auto mb-10">
            The digital asset or route you are looking for has been moved, deleted, or never existed in the Master Catalog. 
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-bold uppercase tracking-widest text-[var(--text-main)] rounded-xl hover:bg-[var(--brand-primary)] hover:text-white hover:border-transparent transition-all duration-300"
            >
              Go Back
            </button>
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-[var(--brand-primary)] border border-transparent text-xs font-bold uppercase tracking-widest text-[var(--brand-text)] rounded-xl hover:opacity-90 shadow-[0_10px_20px_-10px_rgba(78,8,15,0.5)] transition-all duration-300"
            >
              Return Home
            </Link>
          </div>
        </div>

        <div className="mt-12 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.3em]">
          System Diagnostics: <span className="text-[var(--brand-primary)]">Route Not Found</span>
        </div>
      </div>
    </div>
  );
}
