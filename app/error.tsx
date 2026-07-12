'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js Error Boundary Caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Intense Animated Error Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-[var(--brand-primary)]/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-amber-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '7s' }}></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-6 animate-in zoom-in-95 fade-in duration-700">
        
        <div className="bg-[var(--glass-bg)] backdrop-blur-3xl border border-[var(--glass-border)] rounded-[2rem] p-8 md:p-14 shadow-2xl overflow-hidden relative">
          
          {/* Top glow line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent opacity-50"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-light text-[var(--text-main)] tracking-wide">System Exception</h1>
              <p className="text-[10px] text-[var(--text-muted)] font-mono tracking-widest uppercase mt-1">Status: CRITICAL_FAULT (500)</p>
            </div>
          </div>

          <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8">
            An unexpected runtime error has occurred in the platform. The system successfully caught the exception to prevent further instability.
          </p>

          <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-4 mb-10 overflow-x-auto shadow-inner">
             <code className="text-[10px] text-[var(--text-main)] font-mono whitespace-pre-wrap opacity-80">
               {error.message || 'Unknown internal server error.'}
             </code>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-8 py-4 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              Reboot Process
            </button>
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[var(--bg-base)] transition-colors text-center"
            >
              Return to Safe Mode
            </Link>
          </div>
          
        </div>

      </div>
    </div>
  );
}
