'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; 

// 1. The Core Form Component
function AuthGatewayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [view, setView] = useState<'LOGIN' | 'REQUEST_ACCESS' | 'FORGOT_PASSWORD'>('LOGIN');
  
  // App State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gst, setGst] = useState('');
  const [phone, setPhone] = useState<string | undefined>(''); 
  
  // UI UX State
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred during authentication.');
      setIsLoading(false);
    }
  };

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setError('You must accept the Partner Terms and Conditions.');
      return;
    }
    if (!phone) {
      setError('Contact number is required.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, companyName, gst, phone })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Registration failed');
      }

      setSuccess(`Application submitted for ${companyName}. Our team will review your details shortly.`);
      
      setTimeout(() => {
        setView('LOGIN');
        setSuccess('');
        setIsLoading(false);
        setAcceptedTerms(false);
        setName(''); setEmail(''); setPassword(''); setCompanyName(''); setGst(''); setPhone('');
      }, 4000);

    } catch (err: any) {
      setError(err.message || 'Registration failed');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      
      // We always show success to prevent email enumeration attacks
      setSuccess('If an account exists, a password reset link has been sent to your email.');
      
      setTimeout(() => {
        setView('LOGIN');
        setSuccess('');
        setIsLoading(false);
      }, 5000);

    } catch (err: any) {
      setError('An error occurred. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md my-auto py-10">
      
      {error && <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-red-500/20 animate-in fade-in">{error}</div>}
      {success && <div className="mb-6 p-4 bg-emerald-500/10 backdrop-blur-sm text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-xl border border-emerald-500/20 animate-in fade-in">{success}</div>}
      
      {view === 'LOGIN' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <div className="mb-10 text-left">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-main)] mb-3">Welcome.</h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">Enter your credentials to access the exclusive B2B portal.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium text-[var(--text-main)]"
              placeholder="Corporate Email Address"
            />
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium pr-12 text-[var(--text-main)]"
                placeholder="Password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors p-1">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                <span className="text-[11px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">Remember me</span>
              </label>
              <button type="button" onClick={() => { setView('FORGOT_PASSWORD'); setError(''); setSuccess(''); }} className="text-[11px] font-semibold text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">Forgot Password?</button>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 mt-2 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none">
              {isLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>

          <div className="mt-12 text-left">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2">New to our wholesale network?</p>
            <button onClick={() => { setView('REQUEST_ACCESS'); setError(''); setSuccess(''); setShowPassword(false); }} className="text-[11px] font-bold uppercase tracking-widest text-[var(--brand-primary)] hover:opacity-70 transition-colors border-b border-[var(--brand-primary)]/30 pb-0.5">
              Request Access
            </button>
          </div>
        </div>
      ) : view === 'REQUEST_ACCESS' ? (
        <div className="animate-in fade-in slide-in-from-right-8 duration-700 ease-out">
          <div className="mb-8 text-left">
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-[var(--text-main)] mb-3">Partner Application</h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">Provide your corporate details. Approvals are typically processed within 24 hours.</p>
          </div>

          <form onSubmit={handleRequestAccess} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                required type="text" value={name} onChange={(e) => setName(e.target.value)} 
                placeholder="Full Name"
                className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium text-[var(--text-main)]" 
              />
              <input 
                required type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder="Corporate Email"
                className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium text-[var(--text-main)]" 
              />
            </div>

            <div className="relative">
              <input 
                required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="Create a Secure Password"
                className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium pr-12 text-[var(--text-main)]" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors p-1">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input 
                required type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} 
                placeholder="Registered Company Name"
                className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium text-[var(--text-main)]" 
              />
              <input 
                type="text" value={gst} onChange={(e) => setGst(e.target.value)} 
                placeholder="GSTIN / Tax ID (Optional)"
                className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-mono text-[var(--text-main)] uppercase" 
              />
            </div>

            <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl focus-within:bg-[var(--bg-base)] focus-within:border-[var(--brand-primary)]/40 focus-within:ring-4 focus-within:ring-[var(--brand-primary)]/10 transition-all duration-300 px-5 py-4">
              <PhoneInput
                international
                defaultCountry="IN"
                value={phone}
                onChange={setPhone}
                placeholder="Contact Number"
                className="flex items-center gap-3 outline-none [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:ring-0 [&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:font-medium [&_.PhoneInputInput]:text-[var(--text-main)] [&_.PhoneInputCountryIcon--border]:border-none [&_.PhoneInputCountryIcon--border]:shadow-none"
              />
            </div>

            <div className="pt-2 pb-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                <span className="text-[11px] font-medium text-[var(--text-muted)] leading-relaxed group-hover:text-[var(--text-main)] transition-colors">
                  By proceeding, I agree to the <span className="font-bold text-[var(--brand-primary)] hover:underline">B2B Terms of Service</span> and <span className="font-bold text-[var(--brand-primary)] hover:underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={() => { setView('LOGIN'); setError(''); setSuccess(''); setShowPassword(false); }} className="px-6 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-[var(--bg-base)] active:scale-[0.98] transition-all duration-300">
                Back
              </button>
              <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50">
                {isLoading ? 'Processing...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      ) : view === 'FORGOT_PASSWORD' ? (
        <div className="animate-in fade-in slide-in-from-left-8 duration-700 ease-out">
          <div className="mb-10 text-left">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--text-main)] mb-3">Recover Access</h1>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">Enter your registered email address to receive a secure password reset link.</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-5">
            <input 
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl text-sm focus:outline-none focus:bg-[var(--bg-base)] focus:border-[var(--brand-primary)]/40 focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all duration-300 placeholder-[var(--text-muted)] font-medium text-[var(--text-main)]"
              placeholder="Corporate Email Address"
            />
            
            <div className="flex space-x-3 pt-4">
              <button type="button" onClick={() => { setView('LOGIN'); setError(''); setSuccess(''); }} className="px-6 py-4 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-[var(--bg-base)] active:scale-[0.98] transition-all duration-300">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="flex-1 py-4 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

// 2. The Main Page Wrapper
export default function B2BLoginPortal() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex font-sans text-[var(--text-main)] overflow-hidden">
      
      {/* LEFT COLUMN: Exactly 50% Width with unified left alignment */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between min-h-screen px-8 sm:px-16 lg:px-24 xl:px-32 py-10 overflow-y-auto custom-scrollbar">
        
        {/* LOGO: Pinned to the top left */}
        <div className="flex-shrink-0">
          <Image 
            src="/logo.png" 
            alt="Ashok Jewels Logo" 
            width={160} 
            height={45} 
            className="object-contain origin-left" 
            priority 
          />
        </div>

        {/* FORM: Centers vertically, but respects left-padding of the column */}
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div></div>}>
          <AuthGatewayContent />
        </Suspense>

        {/* FOOTER: Pinned to the bottom left */}
        <div className="flex-shrink-0 text-left">
          <p className="text-[10px] text-[var(--text-muted)] font-medium tracking-wider">© 2026 ASHOK JEWELS. ALL RIGHTS RESERVED.</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Exactly 50% Width */}
      <div className="hidden lg:block lg:w-1/2 relative h-screen sticky top-0">
        <Image src="/images/LoginPage_SideImage.jpg" alt="Luxury Jewelry Collection" fill sizes="(max-width: 1024px) 0vw, 50vw" className="object-cover object-center" priority quality={90} />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2a0408]/60 via-[#4e080f]/20 to-black/10 mix-blend-multiply"></div>
        
        {/* SCALED DOWN OVERLAY BOX */}
        <div className="absolute bottom-12 right-12 max-w-[340px] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden group hover:bg-white/15 transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <svg className="w-6 h-6 text-[#f58a42]/80 mb-4 group-hover:rotate-180 transition-transform duration-1000 ease-in-out" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <h3 className="text-2xl font-light text-white tracking-wide leading-snug mb-3">The New Standard in <br/><span className="font-semibold text-[#f58a42]">Wholesale Excellence.</span></h3>
            <p className="text-xs text-white/80 leading-relaxed font-light">Gain access to our exclusive B2B catalog featuring real-time matrix pricing, component-level discounts, and instant Proforma generation.</p>
          </div>
        </div>
      </div>

    </div>
  );
}