'use client';

import React, { useState, useEffect } from 'react';
import { ViewLogsDrawer, LogEntry } from '@/components/ui/ViewLogsDrawer';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { FiltersDrawer, FilterGroup } from '@/components/ui/FiltersDrawer';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PurchaseOrderPDF } from '@/components/PurchaseOrderPDF';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false, loading: () => <span className="text-[10px] text-muted-foreground animate-pulse">Loading PDF engine...</span> }
);

export default function AllPOsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending Approval', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Any Date');
  const [client, setClient] = useState('All Clients');
  const [amount, setAmount] = useState('Any Amount');
  const [sort, setSort] = useState('Newest First');

  const [isLoading, setIsLoading] = useState(true);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

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

  // Mock Purchase Orders (enriched for PDF)
  const mockPOs = [
    { 
      id: 'PO-20260722-1405', poNumber: 'PO-20260722-1405', client: 'Ashok Kumar', clientType: 'VIPs', email: 'ashok@example.com', totalAmount: 4520000, totalValue: 4520000, totalUnits: 12, status: 'Pending Approval', date: '22-07-2026', createdAt: new Date(), isUrgent: true,
      items: [{ id: '1', product: { title: 'Gold Necklace', designCode: 'GN-123' }, metalPurity: '22KT', quantity: 12 }]
    },
    { 
      id: 'PO-20260721-8839', poNumber: 'PO-20260721-8839', client: 'Suhana Reddy', clientType: 'Retail', email: 'suhana@example.com', totalAmount: 215000, totalValue: 215000, totalUnits: 3, status: 'Processing', date: '21-07-2026', createdAt: new Date(), isUrgent: false,
      items: [{ id: '2', product: { title: 'Diamond Ring', designCode: 'DR-456' }, metalPurity: '18KT', quantity: 3 }]
    },
    { 
      id: 'PO-20260720-4102', poNumber: 'PO-20260720-4102', client: 'Rajesh Sharma', clientType: 'Retail', email: 'rajesh@example.com', totalAmount: 1250000, totalValue: 1250000, totalUnits: 5, status: 'Shipped', date: '20-07-2026', createdAt: new Date(), isUrgent: false,
      items: [{ id: '3', product: { title: 'Platinum Band', designCode: 'PB-789' }, metalPurity: '950PT', quantity: 5 }]
    },
    { 
      id: 'PO-20260718-9921', poNumber: 'PO-20260718-9921', client: 'Jewelers Hub', clientType: 'Wholesale', email: 'hub@example.com', totalAmount: 8500000, totalValue: 8500000, totalUnits: 45, status: 'Delivered', date: '18-07-2026', createdAt: new Date(), isUrgent: false,
      items: [{ id: '4', product: { title: 'Silver Bracelet', designCode: 'SB-012' }, metalPurity: '925AG', quantity: 45 }]
    },
  ];

  const allPOsFiltersConfig: FilterGroup[] = [
    {
      id: 'po_status',
      title: 'PO Status',
      options: [
        { label: 'Pending Approval', value: 'pending_approval' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' }
      ]
    },
    {
      id: 'amount',
      title: 'Amount',
      options: [
        { label: 'High to Low', value: 'desc' },
        { label: 'Low to High', value: 'asc' }
      ]
    },
    {
      id: 'client_type',
      title: 'Client Type',
      options: [
        { label: 'VIPs', value: 'vips' },
        { label: 'Retail', value: 'retail' },
        { label: 'Wholesale', value: 'wholesale' }
      ]
    },
    { id: 'date_of_order', title: 'Date of Order', options: [] }
  ];

  let filteredPOs = mockPOs.filter(po => {
    // 1. Tab Filter
    if (activeTab !== 'All' && po.status !== activeTab) return false;
    
    // 2. Search Filter
    if (searchQuery) {
       const query = searchQuery.toLowerCase();
       if (!po.poNumber.toLowerCase().includes(query) && !po.client.toLowerCase().includes(query)) {
         return false;
       }
    }

    // 3. Client Filter
    if (client !== 'All Clients' && po.clientType !== client) return false;

    // 4. Amount Filter
    if (amount !== 'Any Amount') {
       if (amount === '> ₹ 10L' && po.totalAmount <= 1000000) return false;
       if (amount === '> ₹ 50L' && po.totalAmount <= 5000000) return false;
       if (amount === '> ₹ 1Cr' && po.totalAmount <= 10000000) return false;
    }
    
    // 5. Date Range Filter
    if (dateRange !== 'Any Date') {
       // Mock logic for dateRange, since dates are strings like '22-07-2026', we can do basic matching.
       // Today = '22-07-2026' (based on mock data)
       if (dateRange === 'Today' && po.date !== '22-07-2026') return false;
    }

    return true;
  });

  // Apply Sort
  filteredPOs = filteredPOs.sort((a, b) => {
    if (sort === 'Amount: High to Low') return b.totalAmount - a.totalAmount;
    if (sort === 'Amount: Low to High') return a.totalAmount - b.totalAmount;
    
    // For dates
    const dateA = new Date(a.date.split('-').reverse().join('-')).getTime();
    const dateB = new Date(b.date.split('-').reverse().join('-')).getTime();
    
    if (sort === 'Oldest First') return dateA - dateB;
    // Default: Newest First
    return dateB - dateA;
  });

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Approval': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-[var(--text-muted)] border-[var(--border-color)]';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen flex flex-col">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Master PO Ledger</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsLogsOpen(true)} className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide">
            View Logs
          </button>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide">
            Export CSV
          </button>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
            + Create Draft PO
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[var(--border-color)] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--brand-primary)] rounded-t-full shadow-[0_0_8px_var(--brand-primary)] animate-in fade-in zoom-in duration-300" />
            )}
          </button>
        ))}
      </div>

      {/* Filters (Single Line layout) */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-[var(--bg-surface)] p-3 rounded-xl border border-[var(--border-color)] shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
             <input 
               type="text" 
               placeholder="Search PO Number or Client Name..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" 
             />
             <svg className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div className="w-[160px]">
          <CustomDropdown label="Date" options={['Any Date', 'Today', 'Last 7 Days', 'This Month', 'This Year']} value={dateRange} onChange={setDateRange} />
        </div>
        <div className="w-[160px]">
          <CustomDropdown label="Client Type" options={['All Clients', 'VIPs', 'Retail', 'Wholesale']} value={client} onChange={setClient} />
        </div>
        <div className="w-[160px]">
          <CustomDropdown label="Amount" options={['Any Amount', '> ₹ 10L', '> ₹ 50L', '> ₹ 1Cr']} value={amount} onChange={setAmount} />
        </div>
        <div className="w-[160px]">
          <CustomDropdown label="Sort By" options={['Newest First', 'Oldest First', 'Amount: High to Low', 'Amount: Low to High']} value={sort} onChange={setSort} />
        </div>
        <button onClick={() => setIsFiltersOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-medium transition-colors">
          More Filters
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[500px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-surface)]/80 backdrop-blur-sm z-10">
             <div className="w-10 h-10 border-4 border-[var(--brand-primary)]/20 border-t-[var(--brand-primary)] rounded-full animate-spin mb-4" />
             <p className="text-sm text-[var(--text-muted)] font-medium animate-pulse">Loading Ledger...</p>
          </div>
        ) : null}

        <div className="w-full overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-12">
                  <input type="checkbox" className="rounded-sm border-[var(--border-color)] bg-transparent text-[var(--brand-primary)] focus:ring-0 cursor-pointer" />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">PO Reference</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Client / Entity</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Units</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Total Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Date Submitted</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredPOs.length === 0 ? (
                 <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-[var(--text-muted)] text-sm">
                       No Purchase Orders found matching your criteria.
                    </td>
                 </tr>
              ) : (
                filteredPOs.map((po, idx) => (
                  <tr key={po.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded-sm border-[var(--border-color)] bg-transparent text-[var(--brand-primary)] focus:ring-0 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">{po.id}</span>
                        {po.isUrgent && <span className="px-1.5 py-0.5 rounded-sm bg-red-500 text-white text-[9px] font-bold uppercase tracking-wider">Urgent</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[var(--text-main)]">{po.client}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{po.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-medium text-[var(--text-main)]">{po.totalUnits}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-[var(--text-main)]">₹ {po.totalAmount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-[var(--text-muted)]">{po.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md border ${getStatusColor(po.status)}`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <PDFDownloadLink 
                           document={<PurchaseOrderPDF orderData={po} />} 
                           fileName={`${po.id}_Internal_Invoice.pdf`}
                           className="text-[var(--brand-primary)] hover:text-[var(--brand-text)] hover:bg-[var(--brand-primary)] px-3 py-1.5 rounded-lg border border-[var(--brand-primary)]/30 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"
                           onClick={(e) => e.stopPropagation()} 
                         >
                           {({ loading }) => (
                             <>
                               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                               {loading ? 'Preparing...' : 'Download PO'}
                             </>
                           )}
                         </PDFDownloadLink>
                         <Link href={`/admin/orders/all-pos/${po.id}`} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--brand-primary)]/10" onClick={(e) => e.stopPropagation()}>
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                         </Link>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)] sticky bottom-0 z-10">
           <span className="text-xs text-[var(--text-muted)]">Showing {filteredPOs.length} of {mockPOs.length} POs</span>
           <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] disabled:opacity-50" disabled>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold shadow-md">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] text-xs font-medium transition-colors">2</button>
              <button className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] transition-colors">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>
        </div>
      </div>

      <FiltersDrawer 
        isOpen={isFiltersOpen} 
        onClose={() => setIsFiltersOpen(false)} 
        filtersConfig={allPOsFiltersConfig} 
        onApply={(filters) => console.log('Applied Filters:', filters)}
      />

      <ViewLogsDrawer isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} logs={logs} />
    </div>
  );
}
