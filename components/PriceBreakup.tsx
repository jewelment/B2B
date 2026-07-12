'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ComponentData {
  id: string;
  type: string;
  details: string;
  rate: number;
  finalCost: number;
}

interface PriceBreakupProps {
  estimatedPrice: number;
  components: ComponentData[];
}

export default function PriceBreakup({ estimatedPrice, components }: PriceBreakupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure portal only runs on the client to avoid Next.js hydration errors
  useEffect(() => {
    setMounted(true);
    // Lock background scrolling when open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const DrawerContent = () => (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Background Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Spatial Drawer Panel */}
      <div className={`relative w-full sm:w-[450px] h-full bg-[var(--bg-surface)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-[var(--border-color)]`}>
        
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center border-b border-[var(--border-color)]">
          <h3 className="text-xs font-bold tracking-[0.2em] text-[var(--text-main)] uppercase">Cost Breakdown</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] p-2 rounded-full hover:bg-[var(--text-muted)]/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content (The Math) */}
        <div className="flex-1 overflow-y-auto p-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-left text-[var(--text-muted)]">
                <th className="pb-4 font-semibold tracking-wide">Component</th>
                <th className="pb-4 font-semibold tracking-wide text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {components.map((comp) => (
                <tr key={comp.id}>
                  <td className="py-5">
                    <div className="font-medium text-[var(--text-main)]">{comp.type}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">{comp.details}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">Rate: {formatPrice(comp.rate)}</div>
                  </td>
                  <td className="py-5 text-right text-[var(--text-main)] font-medium">
                    {formatPrice(comp.finalCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-[var(--border-color)] bg-[var(--bg-base)]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wide">Wholesale Total</span>
            <span className="text-2xl font-light text-[var(--brand-primary)] tracking-wide">{formatPrice(estimatedPrice)}</span>
          </div>
          <button className="w-full py-4 bg-[var(--brand-primary)] text-white text-sm font-semibold tracking-wide rounded-xl shadow-md hover:shadow-lg hover:bg-[var(--brand-primary-hover)] hover:-translate-y-0.5 transition-all duration-300">
            Proceed to Matrix Setup
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Trigger Button in the Card */}
      <div className="flex justify-between items-center relative z-10">
        <span className="text-lg font-light text-[var(--brand-primary)]">
          {formatPrice(estimatedPrice)}
        </span>
        <button 
          onClick={(e) => { e.preventDefault(); setIsOpen(true); }}
          className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[var(--brand-primary)]/20"
        >
          View Breakup
        </button>
      </div>

      {/* Teleport the Drawer out of the Grid */}
      {mounted && isOpen && createPortal(<DrawerContent />, document.body)}
    </>
  );
}