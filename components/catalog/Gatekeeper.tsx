'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface GatekeeperProps {
  onSubmit: (pin: string) => Promise<void>;
  error?: string | null;
  isLoading?: boolean;
}

export default function Gatekeeper({ onSubmit, error, isLoading = false }: GatekeeperProps) {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim()) {
      onSubmit(pin.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center font-sans relative overflow-hidden px-4">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] sm:w-[80vw] sm:h-[80vw] bg-[var(--brand-primary)]/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-[var(--bg-surface)]/80 backdrop-blur-2xl border border-[var(--glass-border)] rounded-3xl shadow-2xl p-8 sm:p-12 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="flex justify-center mb-10">
          <Image 
            src="/brand/favicon-maroon.png" 
            alt="Ashok Jewels" 
            width={48} 
            height={48} 
            className="object-contain" 
            priority
          />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/10 text-red-600 rounded-full mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-light text-[var(--text-main)] tracking-wide mb-2">Secure Link</h1>
          <p className="text-sm text-[var(--text-muted)]">This B2B catalog is highly confidential and requires a secure PIN to access.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN..."
              className="w-full px-6 py-4 text-center tracking-[0.5em] text-lg bg-[var(--bg-base)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent transition-all shadow-inner text-[var(--text-main)]"
              required
            />
          </div>

          {error && (
            <div className="text-center animate-in fade-in slide-in-from-top-2">
              <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading || !pin.trim()}
            className="w-full py-4 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center"
          >
            {isLoading ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              'Unlock Catalog'
            )}
          </button>
        </form>

        <p className="text-[10px] text-[var(--text-muted)] text-center mt-8 font-medium tracking-wider">
          © 2026 ASHOK JEWELS. B2B PORTAL.
        </p>

      </div>
    </div>
  );
}
