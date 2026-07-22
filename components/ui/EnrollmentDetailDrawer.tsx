'use client';

import React, { useEffect, useRef } from 'react';

export type Installment = {
  month: number;
  dueDate: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Bonus';
  paymentDate?: string;
  mode?: string;
};

interface EnrollmentDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  enrollment: any | null;
}

export const EnrollmentDetailDrawer: React.FC<EnrollmentDetailDrawerProps> = ({ isOpen, onClose, enrollment }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!enrollment) return null;

  // Mock 12-month timeline data based on opening date
  const mockInstallments: Installment[] = Array.from({ length: 12 }).map((_, i) => {
    const isBonus = i === 11;
    const isPaid = i < 3;
    const isPending = i >= 3 && i < 11;
    
    return {
      month: i + 1,
      dueDate: `15/${7 + i > 12 ? 7 + i - 12 : 7 + i}/${7 + i > 12 ? 2027 : 2026}`,
      amount: isBonus ? '₹0 (Bonus)' : enrollment.monthlyAmt,
      status: isBonus ? 'Bonus' : (isPaid ? 'Paid' : 'Pending'),
      paymentDate: isPaid ? `12/${7 + i > 12 ? 7 + i - 12 : 7 + i}/${7 + i > 12 ? 2027 : 2026}` : undefined,
      mode: isPaid ? 'UPI' : undefined
    };
  });

  return (
    <>
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 z-[100] w-[600px] bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_50px_rgba(0,0,0,0.7)] flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-black/5 dark:bg-black/20">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-main)]">Enrollment Details</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">ID: #ENR-{Math.floor(Math.random() * 100000)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Plan Info Card */}
          <div className="bg-black/5 dark:bg-[#121212] rounded-xl p-5 border border-[var(--border-color)]">
            <h4 className="text-sm font-bold text-[var(--brand-primary)] uppercase tracking-wider mb-4">Plan Information</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Customer</p>
                <p className="text-sm font-bold text-[var(--text-main)] mt-1">{enrollment.customer}</p>
                <p className="text-xs text-[var(--text-muted)]">{enrollment.phone}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Scheme Name</p>
                <p className="text-sm font-bold text-[var(--text-main)] mt-1">{enrollment.scheme}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20">11+1 PLAN</span>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Monthly Installment</p>
                <p className="text-lg font-bold text-[var(--text-main)] mt-1">{enrollment.monthlyAmt}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Maturity Value</p>
                <p className="text-lg font-bold text-green-500 mt-1">{enrollment.totalAmt}</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-surface)] rounded-xl p-5 border border-[var(--border-color)] shadow-sm">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-bold">Total Paid</p>
              <h2 className="text-2xl font-bold text-[var(--text-main)] mt-1">₹{parseInt(enrollment.monthlyAmt.replace(/[^0-9]/g, '')) * 3}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">3 Installments</p>
            </div>
            <div className="bg-[var(--bg-surface)] rounded-xl p-5 border border-[var(--border-color)] shadow-sm">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-bold">Pending Dues</p>
              <h2 className="text-2xl font-bold text-orange-500 mt-1">₹{parseInt(enrollment.monthlyAmt.replace(/[^0-9]/g, '')) * 8}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">8 Installments remaining</p>
            </div>
          </div>

          {/* Installment Timeline */}
          <div>
            <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider mb-4 border-b border-[var(--border-color)] pb-2">12-Month Timeline</h4>
            <div className="space-y-3">
              {mockInstallments.map((inst, idx) => (
                <div key={idx} className={`relative flex items-center justify-between p-4 rounded-xl border ${inst.status === 'Paid' ? 'bg-green-500/5 border-green-500/20' : inst.status === 'Bonus' ? 'bg-[var(--brand-primary)]/5 border-[var(--brand-primary)]/20' : 'bg-black/5 dark:bg-white/5 border-[var(--border-color)]'}`}>
                  {/* Visual Node Connection Line */}
                  {idx !== 11 && <div className="absolute left-[31px] top-[48px] bottom-[-12px] w-0.5 bg-[var(--border-color)] z-0" />}
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${inst.status === 'Paid' ? 'bg-green-500 text-white' : inst.status === 'Bonus' ? 'bg-[var(--brand-primary)] text-[var(--brand-text)]' : 'bg-[var(--bg-surface)] border-2 border-[var(--border-color)] text-[var(--text-muted)]'}`}>
                      {inst.status === 'Paid' ? '✓' : inst.status === 'Bonus' ? '✦' : inst.month}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-main)]">Month {inst.month} {inst.status === 'Bonus' && <span className="text-[var(--brand-primary)] ml-1">(Jeweler Bonus)</span>}</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Due: {inst.dueDate}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-sm font-bold ${inst.status === 'Paid' || inst.status === 'Bonus' ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>{inst.amount}</p>
                    {inst.status === 'Paid' && (
                      <p className="text-[10px] text-green-500 mt-0.5 font-medium">Paid on {inst.paymentDate} via {inst.mode}</p>
                    )}
                    {inst.status === 'Pending' && (
                      <button className="mt-1 px-3 py-1 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-main)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors">
                        Record Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};
