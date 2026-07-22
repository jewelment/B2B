'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerSchemesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await fetch('/api/customer/schemes');
        const data = await res.json();
        if (data.success) {
          setEnrollments(data.enrollments);
        }
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">My Savings Plans</h1>
          <p className="text-[var(--text-muted)] text-sm">Track your progress and manage your investments.</p>
        </div>
        <Link href="/dashboard/schemes/calculator" className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
          Explore New Plans
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">No Active Plans</h3>
          <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto mb-6">You are not currently enrolled in any savings plans. Start a new plan to unlock exclusive jewelry bonuses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const totalTenure = enrollment.scheme.totalTenureMonths;
            const completedCount = enrollment.installments.filter((i: any) => i.status === 'PAID').length;
            const progress = (completedCount / totalTenure) * 100;
            const totalExpected = enrollment.monthlyInstallment * totalTenure;
            const balanceDue = totalExpected - enrollment.totalPaid;

            return (
              <Link key={enrollment.id} href={`/dashboard/schemes/${enrollment.id}`} className="block group">
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] group-hover:border-[var(--brand-primary)] rounded-2xl p-6 shadow-sm group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden">
                  
                  {/* Status Badge */}
                  <div className="absolute top-6 right-6">
                    {enrollment.status === 'ACTIVE' && <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Active</span>}
                    {enrollment.status === 'WITHDRAWAL_REQUESTED' && <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-orange-500/20">Withdrawal Req</span>}
                    {enrollment.status === 'CLOSED' && <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/20">Closed</span>}
                  </div>

                  <h3 className="text-xl font-bold text-[var(--text-main)] mb-1 pr-20">{enrollment.scheme.name}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-6">Started {new Date(enrollment.startDate).toLocaleDateString()}</p>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--text-muted)]">Monthly Installment</span>
                      <span className="font-bold text-[var(--text-main)]">{formatCurrency(enrollment.monthlyInstallment)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--text-muted)]">Total Paid</span>
                      <span className="font-bold text-[var(--brand-primary)]">{formatCurrency(enrollment.totalPaid)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--text-muted)]">Balance Due</span>
                      <span className="font-bold text-[var(--text-main)]">{formatCurrency(balanceDue)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">Progress</span>
                      <span className="text-xs font-bold text-[var(--text-main)]">{completedCount} of {totalTenure} Paid</span>
                    </div>
                    <div className="h-2 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--brand-primary)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
