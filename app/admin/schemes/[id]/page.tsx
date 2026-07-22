'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSchemeAnalyticsPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchemeData = async () => {
      try {
        const res = await fetch(`/api/schemes/${params.id}`);
        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch scheme analytics", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchemeData();
  }, [params.id]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.scheme) {
    return <div className="p-8 text-center text-[var(--text-muted)]">Scheme not found.</div>;
  }

  const { scheme, stats } = data;

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-32">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link href="/admin/schemes" className="text-[var(--brand-primary)] text-sm font-bold flex items-center gap-2 mb-4 hover:underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Schemes
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-extrabold text-[var(--text-main)]">{scheme.name}</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-wide ${scheme.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : scheme.status === 'DRAFT' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              {scheme.status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
              {scheme.status}
            </span>
          </div>
          <p className="text-[var(--text-muted)] text-sm max-w-2xl">{scheme.shortDescription}</p>
        </div>
        
        <Link 
          href={`/admin/schemes/create?edit=${scheme.id}`}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all shadow-sm shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide"
        >
          Edit Scheme Parameters
        </Link>
      </div>

      {/* KPI Widgets (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Total Enrollments</p>
          <p className="text-3xl font-bold text-[var(--text-main)]">{scheme.enrollments.length}</p>
          <p className="text-sm text-green-500 mt-2 font-medium">{stats.totalActiveUsers} Active</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Total Revenue Received</p>
          <p className="text-3xl font-bold text-[var(--brand-primary)]">{formatCurrency(stats.totalPaidRevenue)}</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Total Pending Dues</p>
          <p className="text-3xl font-bold text-[var(--text-main)]">{formatCurrency(stats.totalPendingBalance)}</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm bg-gradient-to-br from-[var(--bg-surface)] to-black/20 dark:to-white/5">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-4">Scheme Rules</p>
          <div className="space-y-2 text-sm text-[var(--text-muted)]">
            <div className="flex justify-between"><span>Tenure:</span> <span className="font-medium text-[var(--text-main)]">{scheme.totalTenureMonths} + {scheme.bonusInstallments} Bonus</span></div>
            <div className="flex justify-between"><span>Min Amt:</span> <span className="font-medium text-[var(--text-main)]">{formatCurrency(scheme.minInstallment)}</span></div>
            <div className="flex justify-between"><span>Grace:</span> <span className="font-medium text-[var(--text-main)]">{scheme.gracePeriodDays} Days</span></div>
          </div>
        </div>
      </div>

      {/* Enrolled Users Table */}
      <h2 className="text-xl font-bold text-[var(--text-main)] mb-6 pb-4 border-b border-[var(--border-color)]">Enrolled Customers Analytics</h2>
      
      {scheme.enrollments.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">No Customers Yet</h3>
          <p className="text-[var(--text-muted)] text-sm max-w-sm mx-auto">There are no customers currently enrolled in this specific scheme.</p>
        </div>
      ) : (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)] text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Enrollment Date</th>
                <th className="p-4 text-right">Monthly Inst.</th>
                <th className="p-4 text-right">Total Paid</th>
                <th className="p-4 text-center">Installments Paid</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-sm">
              {scheme.enrollments.map((enr: any) => {
                const completedCount = enr.installments.filter((i: any) => i.status === 'PAID').length;
                return (
                  <tr key={enr.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-[var(--text-main)]">{enr.client?.name || enr.client?.email || 'Unknown Client'}</p>
                      <p className="text-xs text-[var(--text-muted)]">{enr.client?.email}</p>
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">{new Date(enr.startDate).toLocaleDateString()}</td>
                    <td className="p-4 text-right font-medium text-[var(--text-main)]">{formatCurrency(enr.monthlyInstallment)}</td>
                    <td className="p-4 text-right font-bold text-[var(--brand-primary)]">{formatCurrency(enr.totalPaid)}</td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-bold text-[var(--text-main)]">{completedCount}</span>
                        <span className="text-[var(--text-muted)]">/ {scheme.totalTenureMonths}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {enr.status === 'ACTIVE' && <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Active</span>}
                      {enr.status === 'WITHDRAWAL_REQUESTED' && <span className="px-2 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-orange-500/20">Withdrawal Req</span>}
                      {enr.status === 'CLOSED' && <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/20">Closed</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
