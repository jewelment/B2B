'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EnrollmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params.id;

  // Mock toggle state for automated reminders
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Mock customer data
  const customer = {
    name: 'Nityam Mishra',
    phone: '+91 99999 99999',
    email: 'nityam@example.com',
    plan: 'Swarna Lakshmi Yojana',
    monthlyInstallment: 5000,
    startDate: '12 Jan 2026',
    status: 'Active',
    totalPaid: 15000,
    totalPending: 40000,
  };

  // 12 Months mapping based on the mock data (3 paid, 8 pending, 1 bonus)
  const timeline = Array.from({ length: 12 }).map((_, i) => {
    const monthNumber = i + 1;
    let status = 'Pending';
    if (monthNumber <= 3) status = 'Paid';
    if (monthNumber === 12) status = 'Bonus';
    
    // Calculate a mock due date
    const date = new Date(2026, i, 12);
    
    return {
      month: monthNumber,
      amount: monthNumber === 12 ? customer.monthlyInstallment : customer.monthlyInstallment, // Bonus is 100% of installment
      dueDate: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status,
      isCurrent: monthNumber === 4 // Highlight the current pending month
    };
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* Header & Breadcrumb */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <button onClick={() => router.back()} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Enrollments
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-[var(--text-main)]">Enrollment Details</h1>
            <span className="px-3 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-widest">{customer.status}</span>
          </div>
          <p className="text-[var(--text-muted)] text-sm mt-1">ID: ENR-{enrollmentId} • Enrolled on {customer.startDate}</p>
        </div>
        
        {/* Automated Comms Toggle */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm flex items-center gap-6">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-main)] mb-1">Automated Reminders</h4>
            <p className="text-xs text-[var(--text-muted)]">Auto-send SMS/Email before due dates.</p>
          </div>
          <button 
            onClick={() => setRemindersEnabled(!remindersEnabled)}
            className={`w-14 h-7 rounded-full relative transition-colors ${remindersEnabled ? 'bg-green-500' : 'bg-black/20 dark:bg-white/10'}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${remindersEnabled ? 'left-8' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Customer Info & Summary */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--brand-primary)] to-[#d4af37]"></div>
             
             <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center text-xl font-bold border border-[var(--brand-primary)]/20 shadow-inner group-hover:scale-110 transition-transform">
                 NM
               </div>
               <div>
                 <h2 className="text-xl font-bold text-[var(--text-main)]">{customer.name}</h2>
                 <p className="text-sm text-[var(--text-muted)]">{customer.phone}</p>
               </div>
             </div>

             <div className="space-y-4 text-sm">
               <div className="flex justify-between pb-3 border-b border-[var(--border-color)]">
                 <span className="text-[var(--text-muted)]">Plan</span>
                 <span className="text-[var(--text-main)] font-semibold">{customer.plan}</span>
               </div>
               <div className="flex justify-between pb-3 border-b border-[var(--border-color)]">
                 <span className="text-[var(--text-muted)]">Monthly Installment</span>
                 <span className="text-[var(--text-main)] font-bold">{formatCurrency(customer.monthlyInstallment)}</span>
               </div>
               <div className="flex justify-between pb-3 border-b border-[var(--border-color)]">
                 <span className="text-[var(--text-muted)]">Total Paid (3/11)</span>
                 <span className="text-green-500 font-bold">{formatCurrency(customer.totalPaid)}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-[var(--text-muted)]">Pending Amount</span>
                 <span className="text-red-400 font-bold">{formatCurrency(customer.totalPending)}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Timeline */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[var(--border-color)] bg-black/5 dark:bg-[#121212]">
              <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Installment Timeline
              </h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {timeline.map((item) => (
                  <div key={item.month} className={`flex items-center gap-6 p-4 rounded-xl border transition-all ${item.isCurrent ? 'bg-[var(--brand-primary)]/5 border-[var(--brand-primary)]/30 shadow-[0_4px_20px_rgba(212,175,55,0.05)]' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}>
                    
                    {/* Month Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                      item.status === 'Paid' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                      item.status === 'Bonus' ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/20 text-[var(--brand-primary)]' :
                      item.isCurrent ? 'bg-[var(--bg-surface)] border-[var(--brand-primary)] text-[var(--text-main)] shadow-[0_0_10px_rgba(212,175,55,0.2)]' :
                      'bg-black/5 dark:bg-white/5 border-[var(--border-color)] text-[var(--text-muted)]'
                    }`}>
                      {item.status === 'Paid' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>}
                      {item.status === 'Pending' && <span className="font-bold text-sm">M{item.month}</span>}
                      {item.status === 'Bonus' && <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h4 className={`font-bold ${item.isCurrent ? 'text-[var(--text-main)] text-base' : 'text-[var(--text-muted)] text-sm'}`}>
                        {item.status === 'Bonus' ? 'Ashok Jewelment Bonus' : `Installment ${item.month}`}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">Due: {item.dueDate}</p>
                    </div>

                    {/* Amount */}
                    <div className="text-right mr-4">
                      <div className={`font-bold ${item.status === 'Paid' ? 'text-[var(--text-main)]' : item.status === 'Bonus' ? 'text-[var(--brand-primary)]' : 'text-[var(--text-main)]'}`}>
                        {formatCurrency(item.amount)}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        item.status === 'Paid' ? 'text-green-500' :
                        item.status === 'Bonus' ? 'text-[var(--brand-primary)]' :
                        'text-red-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    {/* Action CTAs (Only for pending) */}
                    <div className="w-48 flex justify-end gap-2">
                      {item.status === 'Pending' && item.isCurrent && (
                        <>
                          <button className="px-3 py-1.5 rounded-md bg-[var(--bg-surface)] border border-[var(--border-color)] text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--brand-primary)] transition-colors uppercase tracking-widest flex items-center gap-1" title="Send Request Link">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Request
                          </button>
                          <button className="px-3 py-1.5 rounded-md bg-[var(--brand-primary)] text-black border border-[var(--brand-primary)] text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Pay
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
