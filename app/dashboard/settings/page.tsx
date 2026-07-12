'use client';

import React, { useState } from 'react';

type Tab = 'BUSINESS' | 'CONTACTS' | 'ADDRESS' | 'SECURITY';

const BUSINESS_TYPES = [
  'Manufacturer', 'Wholesaler', 'Retailer', 'Distributor', 
  'Chain Store', 'Marketplace Seller', 'Online Store', 
  'Importer', 'Exporter', 'Jewelry Designer', 'Other'
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('BUSINESS');
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  // Security State
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setResetLinkSent(true);
    // Hide the toast after 5 seconds
    setTimeout(() => setResetLinkSent(false), 5000);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-[var(--text-main)] mb-2">Account Settings</h1>
        <p className="text-sm text-[var(--text-muted)]">Manage your corporate profile, addresses, and account security.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 border-b border-[var(--border-color)] mb-8">
        {[
          { id: 'BUSINESS', label: 'Business Profile' },
          { id: 'CONTACTS', label: 'Points of Contact' },
          { id: 'ADDRESS', label: 'Addresses' },
          { id: 'SECURITY', label: 'Security' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors relative ${
              activeTab === tab.id 
                ? 'text-[var(--brand-primary)]' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--brand-primary)] rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* ========================================== */}
      {/* TAB 1: BUSINESS PROFILE                    */}
      {/* ========================================== */}
      {activeTab === 'BUSINESS' && (
        <div className="max-w-3xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-8 shadow-sm transition-all hover:shadow-md">
          <h2 className="text-lg font-light text-[var(--text-main)] mb-6">Corporate Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Company Name</label>
              <input type="text" disabled value="Luxury Jewels LLC" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-muted)] opacity-70 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Registered Email</label>
              <input type="email" disabled value="buyer@test.com" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-muted)] opacity-70 cursor-not-allowed" />
            </div>

            {/* THE FIX: Sleek Custom Dropdown Chevron */}
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Business Type</label>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all cursor-pointer">
                  <option value="">Select Business Type...</option>
                  {BUSINESS_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Year Established</label>
              <input type="number" placeholder="YYYY" className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-end">
            <button className="px-8 py-3.5 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: POINTS OF CONTACT                   */}
      {/* ========================================== */}
      {activeTab === 'CONTACTS' && (
        <div className="max-w-4xl space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-light text-[var(--text-main)]">Authorized Representatives</h2>
            <button className="px-5 py-2.5 bg-[var(--brand-primary)] text-[var(--brand-text)] text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm">
              + Add New POC
            </button>
          </div>

          <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--border-color)] rounded-[2rem] p-6 shadow-sm relative overflow-hidden group hover:border-[var(--brand-primary)]/40 transition-colors">
            <div className="absolute top-0 right-0 bg-[var(--brand-primary)] text-[var(--brand-text)] text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-sm">Primary Contact</div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Full Name</label>
                <input type="text" defaultValue="Rajesh Kumar" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Designation</label>
                <input type="text" defaultValue="Director of Purchasing" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Email Address</label>
                <input type="email" defaultValue="rajesh@luxuryjewels.com" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Mobile Number</label>
                <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">WhatsApp</label>
                <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
              </div>
            </div>
            
            {/* THE FIX: Upgraded Ghost Button */}
            <div className="mt-6 flex justify-end">
              <button className="px-5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[var(--text-muted)]/5 transition-all shadow-sm flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Update POC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 3: ADDRESSES                           */}
      {/* ========================================== */}
      {activeTab === 'ADDRESS' && (
        <div className="max-w-5xl grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-lg font-light text-[var(--text-main)] mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Billing Address
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Country</label>
                  <input type="text" placeholder="e.g. India" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">State</label>
                  <input type="text" placeholder="e.g. Maharashtra" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">City</label>
                  <input type="text" placeholder="e.g. Mumbai" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">ZIP / Postal Code</label>
                  <input type="text" placeholder="400001" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Complete Address</label>
                <textarea rows={3} placeholder="Suite, Building, Street Name..." className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-light text-[var(--text-main)] flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                Shipping Address
              </h2>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} className="w-4 h-4 rounded border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                <span className="text-[11px] font-bold text-[var(--text-muted)] group-hover:text-[var(--text-main)] uppercase tracking-wider transition-colors">Same as Billing</span>
              </label>
            </div>
            {sameAsBilling ? (
              <div className="h-56 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-surface)] text-[var(--text-muted)]">
                <svg className="w-8 h-8 mb-2 opacity-50 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                <p className="text-sm font-medium">Mirroring Billing Details</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Country</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">State</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">City</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">ZIP / Postal Code</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">Complete Address</label>
                  <textarea rows={3} className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]/50 transition-colors resize-none"></textarea>
                </div>
              </div>
            )}
          </div>

          <div className="xl:col-span-2 flex justify-end pt-4">
            <button className="px-8 py-3.5 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm">
              Save Addresses
            </button>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* TAB 4: SECURITY                            */}
      {/* ========================================== */}
      {activeTab === 'SECURITY' && (
        <div className="max-w-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-8 shadow-sm">
          <h2 className="text-lg font-light text-[var(--text-main)] mb-8 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Change Password
          </h2>
          
          <div className="space-y-6 max-w-md">
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Current Password</label>
                
                {/* THE FIX: Forgot Password Trigger */}
                <button 
                  onClick={handleForgotPassword}
                  className="text-[10px] font-bold text-[var(--brand-primary)] hover:underline tracking-wide transition-all"
                >
                  Forgot Current Password?
                </button>
              </div>
              
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all" />
              
              {/* Toast Notification */}
              {resetLinkSent && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-3 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Secure reset link sent to registered email.
                </p>
              )}
            </div>
            
            <div className="pt-4 border-t border-[var(--border-color)]">
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all" />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-start">
            <button className="px-8 py-3.5 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sm">
              Update Password
            </button>
          </div>
        </div>
      )}

    </div>
  );
}