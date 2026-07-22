'use client';

import React, { useState, useEffect } from 'react';
import { ViewLogsDrawer, LogEntry } from '@/components/ui/ViewLogsDrawer';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { FiltersDrawer, FilterGroup } from '@/components/ui/FiltersDrawer';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

export default function AllTransactionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Ecom', 'Store'];

  const [paymentStatus, setPaymentStatus] = useState('Payment Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedTxs, setSelectedTxs] = useState<string[]>([]);

  useEffect(() => {
    // Fetch real event logs for the Orders module
    async function fetchLogs() {
      try {
        const res = await fetch('/api/logs?module=ORDERS');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Failed to fetch logs', err);
      }
    }
    fetchLogs();
  }, [isLogsOpen]); // Refetch when the drawer is opened

  const mockTransactions = [
    { id: 'TRANS-0000007', orderId: 'PCJ-0006107', date: '15-07-2026 at 10:37 am', customer: 'YARRAVENGANNA GARI Dharani', phone: '6301742800', amount: 18652, via: 'via Gokwik', pgId: 'RKWIKBHJMGJGF207166SMP', status: 'Initiated', source: 'Store' },
    { id: 'TRANS-0000008', orderId: 'PCJ-0006105', date: '15-07-2026 at 10:32 am', customer: 'YARRAVENGANNA GARI Dharani', phone: '6301742800', amount: 17102, via: 'via Gokwik', pgId: 'RKWIKNQHMMEKR1750806MP', status: 'Initiated', source: 'Ecom' },
    { id: 'TRANS-0000004', orderId: 'PCJ-0006045', date: '15-07-2026 at 10:25 am', customer: 'Himanshu Sharma', phone: '7021614055', amount: 16040, via: 'via Gokwik', pgId: 'RKWIK5A1C36Y51314592MP', status: 'Initiated', source: 'Ecom' },
    { id: 'TRANS-0000062', orderId: 'ABND-6a55e608', date: '15-07-2026 at 10:19 am', customer: 'Khushboo Gwalla', phone: '7439565615', amount: 53131, via: 'via Gokwik', pgId: 'RKWIK8SR06L5E0950971MP', status: 'Initiated', source: 'Ecom' },
    { id: 'TRANS-0000008', orderId: 'PCJ-0006031', date: '15-07-2026 at 9:42 am', customer: 'Iman zehra', phone: '9622449358', amount: 9463, via: 'via Razorpay', pgId: 'pay_TDds0dJDoq15f6', status: 'Success', source: 'Store' },
    { id: 'TRANS-0000007', orderId: 'PCJ-0006030', date: '15-07-2026 at 9:33 am', customer: 'Iman zehra', phone: '9622449358', amount: 22845, via: 'via Gokwik', pgId: 'KWIKEcK4TL3Q8191884MP', status: 'Success', source: 'Store' },
    { id: 'TRANS-0000006', orderId: 'PCJ-0005999', date: '15-07-2026 at 9:23 am', customer: 'Vijay Yadav', phone: '7506230206', amount: 1, via: 'via Gokwik', pgId: 'KWIKNYZ14YRT7599482MP', status: 'Success', source: 'Ecom' },
  ];

  let filteredTransactions = mockTransactions.filter(tx => {
    let keep = true;
    if (activeTab !== 'All' && tx.source !== activeTab) keep = false;
    if (paymentStatus !== 'Payment Status' && tx.status !== paymentStatus) keep = false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!tx.id.toLowerCase().includes(q) && !tx.orderId.toLowerCase().includes(q) && !tx.customer.toLowerCase().includes(q)) {
        keep = false;
      }
    }

    if (advancedFilters.payment_status && advancedFilters.payment_status.length > 0) {
       // Filter by selected multiple statuses if any
       const statuses = advancedFilters.payment_status.map((s: string) => s.toLowerCase());
       if (!statuses.includes(tx.status.toLowerCase())) keep = false;
    }

    return keep;
  });

  filteredTransactions.sort((a, b) => {
     if (sortOrder === 'asc') return a.amount - b.amount;
     return b.amount - a.amount;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleDownloadInvoice = (e: React.MouseEvent, tx: any) => {
    e.stopPropagation();
    const text = `INVOICE\n\nTransaction ID: ${tx.id}\nOrder ID: ${tx.orderId}\nCustomer: ${tx.customer}\nAmount: ${tx.amount}\nStatus: ${tx.status}\nGateway: ${tx.via} (${tx.pgId})\nDate: ${tx.date}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${tx.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const transactionsFiltersConfig: FilterGroup[] = [
    {
      id: 'payment_status',
      title: 'Payment Status',
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Pending', value: 'pending' },
        { label: 'Initiated', value: 'initiated' },
        { label: 'Refunded', value: 'refunded' }
      ]
    },
    {
      id: 'gateway',
      title: 'Payment Gateway',
      options: [
        { label: 'Razorpay', value: 'razorpay' },
        { label: 'Gokwik', value: 'gokwik' }
      ]
    },
    {
      id: 'amount_spent',
      title: 'Amount',
      options: [
        { label: 'High to Low', value: 'desc' },
        { label: 'Low to High', value: 'asc' }
      ]
    },
    { id: 'date_of_transaction', title: 'Date of Transaction', options: [] }
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen flex flex-col">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">All Transactions</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsLogsOpen(true)} className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide">
            View Logs
          </button>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] mb-6">
         <div className="flex items-center gap-6">
           {tabs.map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`pb-3 px-4 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
             >
               {tab}
               {activeTab === tab && (
                 <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--brand-primary)] rounded-t-full shadow-[0_0_8px_var(--brand-primary)] animate-in fade-in zoom-in duration-300" />
               )}
             </button>
           ))}
         </div>
         <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-main)] pb-3">
            <span className="w-6 h-4 flex items-center justify-center overflow-hidden rounded-sm border border-white/10">
               <img src="/india-flag.svg" className="w-full h-full object-cover" alt="IN" />
            </span>
            India
         </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-color)] shadow-sm">
        <div className="relative min-w-[300px]">
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" />
          <svg className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[180px]">
            <CustomDropdown label="" options={['Payment Status', 'Success', 'Initiated', 'Failed', 'Refunded']} value={paymentStatus} onChange={setPaymentStatus} />
          </div>
          <button onClick={() => setIsFiltersOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-medium transition-colors">
            More Filters
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </button>
          <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--text-muted)]/10 rounded-lg text-[var(--text-main)] text-sm font-medium hover:bg-[var(--text-muted)]/20 transition-colors">
            Sort {sortOrder === 'desc' ? '↓' : '↑'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[500px]">
        <div className="w-full overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-12">
                  <input 
                    type="checkbox" 
                    className="rounded-sm border-[var(--border-color)] bg-transparent text-[var(--brand-primary)] focus:ring-0 cursor-pointer" 
                    checked={selectedTxs.length === filteredTransactions.length && filteredTransactions.length > 0}
                    onChange={(e) => setSelectedTxs(e.target.checked ? filteredTransactions.map(tx => tx.id) : [])}
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Transaction ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-center">Payment Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-center">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm">
                    No transactions found for the selected filters.
                  </td>
                </tr>
              )}
              {filteredTransactions.map((tx, idx) => (
                <tr key={tx.id + idx} onClick={() => router.push(`/admin/orders/${tx.orderId}`)} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-[var(--border-color)] bg-transparent text-[var(--brand-primary)] focus:ring-0 cursor-pointer" 
                      checked={selectedTxs.includes(tx.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        setSelectedTxs(prev => e.target.checked ? [...prev, tx.id] : prev.filter(id => id !== tx.id));
                      }} 
                      onClick={(e) => e.stopPropagation()} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link href={`/admin/orders/${tx.orderId}`} className="text-sm font-semibold text-[var(--brand-primary)] hover:underline" onClick={(e) => e.stopPropagation()}>{tx.id}</Link>
                      <span className="text-[10px] text-[var(--text-muted)]">{tx.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--brand-primary)] text-sm font-semibold">
                    <Link href={`/admin/orders/${tx.orderId}`} className="hover:underline" onClick={(e) => e.stopPropagation()}>{tx.orderId}</Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-[var(--brand-primary)]">{tx.customer}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{tx.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--text-main)]">{tx.amount}</span>
                        <img src="/india-flag.svg" className="w-3 h-2" alt="IN" />
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">{tx.via}</span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">{tx.pgId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${tx.status === 'Success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-500/20 text-slate-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--brand-primary)]">
                    <button onClick={(e) => handleDownloadInvoice(e, tx)} className="p-2 rounded-full hover:bg-[var(--brand-primary)]/10 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)] sticky bottom-0 z-10">
           <span className="text-xs text-[var(--text-muted)]">Showing {filteredTransactions.length} of {mockTransactions.length} Transactions</span>
           <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] disabled:opacity-50" disabled>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold shadow-md">1</button>
              {totalPages > 1 && (
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] text-xs font-medium transition-colors">2</button>
              )}
              <button className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] disabled:opacity-50 transition-colors" disabled={totalPages <= 1}>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>
        </div>
      </div>

      <FiltersDrawer 
        isOpen={isFiltersOpen} 
        onClose={() => setIsFiltersOpen(false)} 
        filtersConfig={transactionsFiltersConfig} 
        onApply={(filters) => { setAdvancedFilters(filters); setIsFiltersOpen(false); }}
      />

      <ViewLogsDrawer isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} logs={logs} />
    </div>
  );
}
