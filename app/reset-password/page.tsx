'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md my-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-main)] mb-3">Password Updated.</h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium mb-8">Your corporate credentials have been successfully updated. You may now access the B2B portal using your new password.</p>
        <button onClick={() => router.push('/login')} className="w-full py-4 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:opacity-90 transition-all duration-300">
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md my-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {error && <div className="mb-6 p-4 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-500/20 animate-in fade-in">{error}</div>}
      
      <div className="mb-10 text-left">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-main)] mb-3">Secure Reset.</h1>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">Please enter and confirm your new password to regain access to the portal.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
        
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium pr-12 text-[var(--text-main)]"
            placeholder="New Password"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors p-1">
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        </div>

        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium pr-12 text-[var(--text-main)]"
            placeholder="Confirm New Password"
          />
        </div>

        <button type="submit" disabled={isLoading} className="w-full py-4 mt-2 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none">
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans text-[var(--text-main)] overflow-hidden">
      
      {/* LEFT COLUMN: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between min-h-screen px-8 sm:px-16 lg:px-24 xl:px-32 py-10 overflow-y-auto custom-scrollbar">
        <div className="flex-shrink-0">
          <Image src="/logo.png" alt="Ashok Jewels Logo" width={160} height={45} className="object-contain origin-left" priority />
        </div>

        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div></div>}>
          <ResetPasswordForm />
        </Suspense>

        <div className="flex-shrink-0 text-left">
          <p className="text-[10px] text-[var(--text-muted)] font-medium tracking-wider">© 2026 ASHOK JEWELS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Luxury Side Image */}
      <div className="hidden lg:block lg:w-1/2 relative h-screen sticky top-0">
        <Image src="/images/LoginPage_SideImage.jpg" alt="Luxury Jewelry Collection" fill sizes="(max-width: 1024px) 0vw, 50vw" className="object-cover object-center scale-x-[-1]" priority quality={90} />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2a0408]/60 via-[#4e080f]/20 to-black/10 mix-blend-multiply"></div>
      </div>

    </div>
  );
}
