'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({ companyName: '', gst: '', email: '', password: '', name: 'Representative', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] p-4">
        <div className="w-full max-w-md bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-10 text-center shadow-lg animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-2xl font-light text-[var(--text-main)] mb-3">Application Received</h2>
          <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
            Thank you for applying for wholesale access. Our onboarding team will review your GSTIN and corporate details. You will receive an email once your matrix access is approved.
          </p>
          <Link href="/" className="inline-block px-8 py-3.5 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[var(--text-muted)]/5 transition-all">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] p-4">
      <div className="w-full max-w-xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-10 shadow-lg animate-in fade-in duration-500">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-light tracking-wide text-[var(--text-main)] mb-2">Corporate Access</h1>
          <p className="text-sm text-[var(--text-muted)]">Apply for access to the Ashok Jewels wholesale matrix.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Company Name *</label>
              <input required type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">GSTIN / Tax ID *</label>
              <input required type="text" value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all uppercase" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Registered Corporate Email *</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Create Password *</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all" />
            {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
          </div>

          <button 
            disabled={isSubmitting}
            className="w-full py-4 mt-4 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-md disabled:opacity-50 disabled:transform-none flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
               <svg className="animate-spin h-4 w-4 text-[var(--brand-text)]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'Submit B2B Application'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-[var(--text-muted)]">
          Already approved? <Link href="/login" className="font-bold text-[var(--brand-primary)] hover:underline">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}