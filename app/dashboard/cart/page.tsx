'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSelected = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = items.reduce((acc, item) => acc + (item.quantity * item.estimatedPrice), 0);

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, totalValue, totalUnits: totalSelected })
      });

      const data = await response.json();
      
      if (data.success) {
        clearCart();
        // Redirect to history with success banner
        router.push('/dashboard/history?success=true');
      } else {
        setError(data.error || 'Failed to submit Purchase Order.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-wide uppercase mb-2">Purchase Order Cart</h1>
        <p className="text-sm text-[var(--text-muted)]">Review your B2B cart before submitting for manufacturing.</p>
      </div>

      {error && (
        <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl p-4 text-sm font-bold shadow-sm">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="w-full bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--text-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-[var(--text-main)] mb-3">Your Matrix is Empty</h2>
          <p className="text-sm text-[var(--text-muted)] mb-8">Add items from the Wholesale Catalog to build your PO.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 bg-[var(--brand-primary)] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:opacity-90 transition-all"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT: Line Items */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={`${item.designCode}-${item.size}-${item.metal}`} className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-2xl p-4 flex items-center gap-6 shadow-sm group">
                <div className="w-20 h-20 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.designCode} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  ) : (
                    <span className="text-[10px] text-[var(--text-muted)] tracking-widest uppercase">No Img</span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-[var(--text-main)] truncate">{item.designCode}</h3>
                  <p className="text-xs text-[var(--text-muted)] truncate mb-2">{item.title}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                      {item.purity}
                    </span>
                    <span className="px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                      {item.metal}
                    </span>
                    {item.size && (
                      <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                        SZ: {item.size}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <p className="text-sm font-bold text-[var(--brand-primary)]">
                    {formatPrice(item.estimatedPrice * item.quantity)}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.designCode, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--text-muted)]/5 rounded-l-lg transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[var(--text-main)]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.designCode, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--text-muted)]/5 rounded-r-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.designCode)}
                      className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT: PO Summary */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-6 shadow-sm sticky top-6">
              <h3 className="text-sm font-bold tracking-widest text-[var(--text-main)] uppercase mb-6">PO Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between items-center text-[var(--text-muted)]">
                  <span>Total Matrix Units</span>
                  <span className="font-bold text-[var(--text-main)]">{totalSelected}</span>
                </div>
                <div className="flex justify-between items-center text-[var(--text-muted)] pb-4 border-b border-[var(--border-color)]">
                  <span>Manufacturing SLA</span>
                  <span className="font-bold text-[var(--text-main)]">14-21 Days</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Est. Pipeline Value</span>
                  <span className="text-2xl font-light text-[var(--brand-primary)]">{formatPrice(totalValue)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isSubmitting || totalSelected === 0}
                className="w-full py-4 bg-[var(--brand-primary)] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md hover:bg-[var(--brand-primary-hover)] hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex justify-center items-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating PO...
                  </>
                ) : (
                  <>
                    Confirm & Submit PO
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-[var(--text-muted)] mt-4 text-center leading-relaxed">
                By submitting this draft PO, you agree to our wholesale manufacturing terms. Real-time bullion rates will be locked upon final SLA approval.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
