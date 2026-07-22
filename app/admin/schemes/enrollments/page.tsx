'use client';
import React, { useState } from 'react';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { useRouter } from 'next/navigation';

export default function EnrollmentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Active', 'Completed', 'Draft', 'Cancelled'];
  const [timePeriod, setTimePeriod] = useState('Last 30 Days');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic KPI simulation based on time period
  const kpis = {
    'Last 30 Days': { total: 47, active: 2, completed: 0, draft: 27, amount: '₹1,35,077.2' },
    'Last 7 Days': { total: 12, active: 1, completed: 0, draft: 8, amount: '₹45,500.0' },
    'This Year': { total: 342, active: 156, completed: 42, draft: 89, amount: '₹45,30,000' }
  };

  const currentKpis = kpis[timePeriod as keyof typeof kpis] || kpis['Last 30 Days'];

  const enrollments = [
    { id: 1, customer: 'Nityam Mishra', phone: '7007701373', scheme: 'Swarna Lakshmi Yojana', monthlyAmt: '₹2,000', totalAmt: '₹22,000', installments: '0/11', status: 'Draft', date: '15/7/2026' },
    { id: 2, customer: 'Nityam Mishra', phone: '7007701373', scheme: 'Swarna Lakshmi Yojana', monthlyAmt: '₹2,000', totalAmt: '₹22,000', installments: '0/11', status: 'Draft', date: '15/7/2026' },
    { id: 3, customer: 'Nityam Mishra', phone: '7007701373', scheme: 'Swarna Lakshmi Yojana', monthlyAmt: '₹2,000', totalAmt: '₹22,000', installments: '0/11', status: 'Draft', date: '15/7/2026' },
    { id: 4, customer: 'Nityam Mishra', phone: '7007701373', scheme: 'Swarna Lakshmi Yojana', monthlyAmt: '₹2,000', totalAmt: '₹22,000', installments: '0/11', status: 'Draft', date: '15/7/2026' },
    { id: 5, customer: 'Shubham Chouhan', phone: '8109694664', scheme: 'Swarna Lakshmi Yojana', monthlyAmt: '₹20,000', totalAmt: '₹2,20,000', installments: '0/11', status: 'Authenticated', date: '13/7/2026' },
    { id: 6, customer: 'Shubham Chouhan', phone: '8109694664', scheme: 'Swarna Lakshmi Yojana', monthlyAmt: '₹10,000', totalAmt: '₹1,10,000', installments: '0/11', status: 'Authenticated', date: '13/7/2026' }
  ];

  const filteredEnrollments = enrollments.filter(enr => {
    const matchesSearch = enr.customer.toLowerCase().includes(searchQuery.toLowerCase()) || enr.scheme.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || 
      (activeTab === 'Draft' && enr.status === 'Draft') || 
      (activeTab === 'Active' && enr.status === 'Authenticated'); // Map Authenticated to Active for now
    return matchesSearch && matchesTab;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-main)]">11+1 Enrollments</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6 relative z-30">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-3xl font-bold text-[var(--text-main)] mb-1">{currentKpis.total}</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Enrollments</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-3xl font-bold text-[var(--text-main)] mb-1">{currentKpis.active}</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Active</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-3xl font-bold text-[var(--text-main)] mb-1">{currentKpis.completed}</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Completed</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <h3 className="text-3xl font-bold text-[var(--text-main)] mb-1">{currentKpis.draft}</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Draft</p>
        </div>
        <div className="col-span-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-[var(--text-main)] mb-1">{currentKpis.amount}</h3>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Amount Received</p>
          </div>
          <div className="w-[140px]">
            <CustomDropdown 
              label="" 
              options={['Last 30 Days', 'Last 7 Days', 'This Year']} 
              value={timePeriod} 
              onChange={setTimePeriod} 
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1 min-h-[500px]">
        {/* Tabs */}
        <div className="flex items-center border-b border-[var(--border-color)] px-6 pt-4 gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-primary)] rounded-t-full shadow-[0_0_8px_var(--brand-primary)] animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center gap-4 bg-black/5 dark:bg-black/20 relative z-20">
          <div className="flex items-center gap-2 bg-[var(--bg-base)] rounded-lg px-4 py-2 border border-[var(--border-color)] focus-within:border-[var(--brand-primary)] transition-colors w-72">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" />
          </div>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all shadow-sm shimmer-hover text-xs font-bold uppercase tracking-wide gap-2">
            Filters
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Scheme</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Monthly Amt</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Total Amt</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Installments</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Opening Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enr, idx) => (
                <tr key={enr.id} onClick={() => router.push(`/admin/schemes/enrollments/${enr.id}`)} className="border-b border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[var(--text-main)]">{enr.customer}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{enr.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{enr.scheme}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{enr.monthlyAmt}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{enr.totalAmt}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-main)]">{enr.installments}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 text-[var(--text-muted)] border border-[var(--border-color)] text-[11px] font-bold tracking-wide">
                      {enr.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[var(--text-muted)]">{enr.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3 text-[var(--text-muted)] transition-opacity">
                       <button className="hover:text-[var(--brand-primary)] transition-colors">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-end bg-black/5 dark:bg-black/20">
           <div className="flex items-center gap-2">
             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--brand-primary)] transition-colors">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--brand-primary)] text-black font-bold text-sm shadow-sm">
               1
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--brand-primary)] transition-colors">
               2
             </button>
             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--brand-primary)] transition-colors">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
