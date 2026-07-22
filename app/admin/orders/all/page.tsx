'use client';

import React, { useState, useEffect } from 'react';
import { ViewLogsDrawer, LogEntry } from '@/components/ui/ViewLogsDrawer';
import { CustomDropdown } from '@/components/ui/CustomDropdown';
import { FiltersDrawer, FilterGroup } from '@/components/ui/FiltersDrawer';
import { OrderActionMenu } from '@/components/ui/OrderActionMenu';
import Link from 'next/link';

export default function AllOrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Ecom', 'Store', 'Pending', 'Multi', 'New', 'Complete', 'Archived'];

  // Filters
  const [orderId, setOrderId] = useState('Order ID');
  const [orderStatus, setOrderStatus] = useState('Order Status');
  const [paymentStatus, setPaymentStatus] = useState('Payment Status');
  const [amountSpent, setAmountSpent] = useState('Amount Spent');
  const [dateRange, setDateRange] = useState('Today');
  
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // New States
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [kpiStats, setKpiStats] = useState({ orders: 2, sales: 22646, fulfillment: 0 });

  useEffect(() => {
    // Mock dynamic KPI changes based on time palette
    if (dateRange === 'Today') setKpiStats({ orders: 2, sales: 22646, fulfillment: 0 });
    else if (dateRange === 'Yesterday') setKpiStats({ orders: 5, sales: 54100, fulfillment: 2 });
    else if (dateRange === 'Last 7 Days') setKpiStats({ orders: 34, sales: 342000, fulfillment: 15 });
    else if (dateRange === 'This Month') setKpiStats({ orders: 120, sales: 1245000, fulfillment: 45 });
    else setKpiStats({ orders: 1450, sales: 15000000, fulfillment: 400 });
  }, [dateRange]);

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

  const mockOrders = [
    { id: '#KISNA-5965', date: '15-07-2026 at 9:32 am', fulfilledBy: 'Store', user: 'Iman zehra', items: 1, total: 32108.00, paymentStatus: 'Success', orderStatus: 'Shipping' },
    { id: '#KISNA-5964', date: '15-07-2026 at 9:23 am', fulfilledBy: 'ECOM', user: 'Vijay Yadav', items: 1, total: 1.00, paymentStatus: 'Success', orderStatus: 'Confirmed' },
    { id: '#KISNA-5963', date: '14-07-2026 at 11:17 pm', fulfilledBy: 'ECOM', user: 'shalini singh', items: 1, total: 14778.00, paymentStatus: 'Success', orderStatus: 'Confirmed' },
    { id: '#KISNA-5962', date: '14-07-2026 at 6:54 pm', fulfilledBy: 'ECOM', user: 'Vijay Yadav', items: 1, total: 1.00, paymentStatus: 'Success', orderStatus: 'Confirmed' },
    { id: '#KISNA-5961', date: '14-07-2026 at 5:53 pm', fulfilledBy: 'ECOM', user: 'Jaan mehndiratta', items: 1, total: 8334.00, paymentStatus: 'Success', orderStatus: 'Confirmed' },
  ];

  const getTabCount = (tabName: string) => {
    if (tabName === 'All') return mockOrders.length;
    if (tabName === 'Store') return mockOrders.filter(o => o.fulfilledBy === 'Store').length;
    if (tabName === 'Ecom') return mockOrders.filter(o => o.fulfilledBy === 'ECOM').length;
    if (tabName === 'Pending') return mockOrders.filter(o => o.orderStatus === 'Pending').length;
    if (tabName === 'Multi') return mockOrders.filter(o => o.items > 1).length;
    if (tabName === 'New') return mockOrders.length;
    if (tabName === 'Complete') return mockOrders.filter(o => o.orderStatus === 'Completed' || o.orderStatus === 'Confirmed').length;
    if (tabName === 'Archived') return mockOrders.filter(o => o.orderStatus === 'Archived').length;
    return 0;
  };

  const allOrdersFiltersConfig: FilterGroup[] = [
    {
      id: 'order_status',
      title: 'Order Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Partial Shipping', value: 'partial_shipping' },
        { label: 'Shipping', value: 'shipping' },
        { label: 'Partially Delivered', value: 'partially_delivered' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Archived', value: 'archived' },
        { label: 'On Hold', value: 'on_hold' },
        { label: 'Abandoned', value: 'abandoned' },
        { label: 'Completed', value: 'completed' },
        { label: 'Awaiting Shipment', value: 'awaiting_shipment' },
        { label: 'Fulfilled', value: 'fulfilled' },
        { label: 'Confirmed', value: 'confirmed' }
      ]
    },
    {
      id: 'payment_status',
      title: 'Payment Status',
      options: [
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Pending', value: 'pending' }
      ]
    },
    {
      id: 'fulfilled_by',
      title: 'Fulfilled By',
      options: [
        { label: 'Store', value: 'store' },
        { label: 'ECOM', value: 'ecom' }
      ]
    },
    {
      id: 'amount_spent',
      title: 'Amount Spent',
      options: [
        { label: 'High to Low', value: 'desc' },
        { label: 'Low to High', value: 'asc' }
      ]
    },
    {
      id: 'no_of_items',
      title: 'No. of Items in Order',
      options: [
        { label: '1 Item', value: '1' },
        { label: '2-5 Items', value: '2_5' },
        { label: 'More than 5', value: '5_plus' }
      ]
    },
    { id: 'tagged_with', title: 'Tagged With', options: [] },
    { id: 'date_of_order', title: 'Date of Order', options: [] },
    { id: 'destination', title: 'Destination', options: [] },
    { id: 'vendor', title: 'Vendor', options: [] }
  ];

  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Store') return order.fulfilledBy === 'Store';
    if (activeTab === 'Ecom') return order.fulfilledBy === 'ECOM';
    if (activeTab === 'Pending') return order.orderStatus === 'Pending';
    if (activeTab === 'Multi') return order.items > 1;
    if (activeTab === 'New') return true; // Just mock logic
    if (activeTab === 'Complete') return order.orderStatus === 'Completed' || order.orderStatus === 'Confirmed';
    if (activeTab === 'Archived') return order.orderStatus === 'Archived';
    return true;
  });

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen flex flex-col">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Orders</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsLogsOpen(true)} className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide">
            View Logs
          </button>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide">
            Import
          </button>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
            + Create Order
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6 relative z-30">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-3xl font-bold text-[var(--text-main)] mb-1">{kpiStats.orders.toLocaleString()}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Orders</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-3xl font-bold text-[var(--text-main)] mb-1">₹{kpiStats.sales.toLocaleString('en-IN')}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Sales Amount</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-3xl font-bold text-[var(--text-main)] mb-1">{kpiStats.fulfillment.toLocaleString()}</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">Fulfillment Items</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm flex items-center justify-center">
          <div className="w-[180px]">
            <CustomDropdown label="" options={['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'This Year']} value={dateRange} onChange={setDateRange} />
          </div>
        </div>
      </div>

      {/* Data Table with encapsulated Tabs and Filters */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1 min-h-[600px]">
        
        {/* Tabs inside wrapper */}
        <div className="flex justify-between items-end border-b border-[var(--border-color)] px-6 pt-4">
          <div className="flex items-center gap-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              >
                {tab} {['All', 'Store', 'Ecom'].includes(tab) ? `(${getTabCount(tab)})` : ''}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-primary)] rounded-t-full shadow-[0_0_8px_var(--brand-primary)] animate-in fade-in zoom-in duration-300" />
                )}
              </button>
            ))}
          </div>
          <div className="pb-3 flex items-center gap-2 text-sm text-[var(--text-main)] font-medium">
            <img src="/india-flag.svg" alt="India" className="w-6 h-6 rounded-full object-cover shadow-sm" /> India
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex flex-wrap justify-between items-center gap-4 bg-black/5 dark:bg-black/20 relative z-20">
          <div className="flex items-center gap-2 bg-[var(--bg-base)] rounded-lg px-4 py-2 border border-[var(--border-color)] focus-within:border-[var(--brand-primary)] transition-colors w-72 shrink-0">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search..." className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" />
          </div>
          <div className="flex gap-3 flex-nowrap flex-1">
            <div className="w-[160px] shrink-0">
              <CustomDropdown label="" options={['Order ID', 'Client Name', 'SKU']} value={orderId} onChange={setOrderId} />
            </div>
            <div className="w-[160px] shrink-0">
              <CustomDropdown label="" options={['Order Status', 'Pending', 'Confirmed', 'Shipping']} value={orderStatus} onChange={setOrderStatus} />
            </div>
            <div className="w-[160px] shrink-0">
              <CustomDropdown label="" options={['Payment Status', 'Success', 'Failed', 'Pending']} value={paymentStatus} onChange={setPaymentStatus} />
            </div>
            <div className="w-[160px] shrink-0">
              <CustomDropdown label="" options={['Amount Spent', 'High to Low', 'Low to High']} value={amountSpent} onChange={setAmountSpent} />
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setIsFiltersOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-medium transition-colors">
              More Filters
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--text-muted)]/10 rounded-lg text-[var(--text-main)] text-sm font-medium hover:bg-[var(--text-muted)]/20 transition-colors">
              Sort
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
            </button>
          </div>
        </div>

        <div className="w-full overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] w-12">
                  <input 
                    type="checkbox" 
                    className="rounded-sm border-[var(--border-color)] bg-transparent text-[var(--brand-primary)] focus:ring-0 cursor-pointer"
                    checked={filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(filteredOrders.map(o => o.id));
                      } else {
                        setSelectedOrders([]);
                      }
                    }} 
                  />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Order Info (116019)</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Fulfilled By</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">User</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Items</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-center">Payment Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-center">Order Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredOrders.map((order, idx) => (
                <tr key={order.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-pointer animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${idx * 50}ms` }}>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded-sm border-[var(--border-color)] bg-transparent text-[var(--brand-primary)] focus:ring-0 cursor-pointer"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders([...selectedOrders, order.id]);
                        } else {
                          setSelectedOrders(selectedOrders.filter(id => id !== order.id));
                        }
                      }} 
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <Link href={`/admin/orders/${order.id.replace('#','')}`} className="text-sm font-semibold text-[var(--brand-primary)] hover:underline" onClick={(e) => e.stopPropagation()}>{order.id}</Link>
                      <span className="text-[10px] text-[var(--text-muted)]">{order.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--text-main)] font-medium">
                    {order.fulfilledBy}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--brand-primary)] font-medium hover:underline">
                    {order.user}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-[var(--text-main)]">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-[var(--text-main)]">
                    ₹{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${order.paymentStatus === 'Success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${order.orderStatus === 'Shipping' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/orders/${order.id.replace('#','')}`} className="p-1.5 rounded-full hover:bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] transition-colors" onClick={(e) => e.stopPropagation()}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </Link>
                      <OrderActionMenu 
                        actions={[
                          { label: 'Download Invoice', onClick: () => alert('Downloading invoice...') },
                          { label: 'Email Invoice', onClick: () => alert('Invoice sent to email!') },
                          { label: 'Cancel Order', isDestructive: true, onClick: () => { if(confirm('Are you sure you want to cancel this order?')) alert('Order Cancelled!') } }
                        ]} 
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Dynamic Pagination */}
        <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)] sticky bottom-0 z-10">
           <span className="text-xs text-[var(--text-muted)]">Showing {filteredOrders.length} of {mockOrders.length} Orders</span>
           <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] disabled:opacity-50" disabled>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold shadow-md">1</button>
              {filteredOrders.length > 10 && (
                 <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] text-xs font-medium transition-colors">2</button>
              )}
              <button className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-surface)] disabled:opacity-50 transition-colors" disabled={filteredOrders.length <= 10}>
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
           </div>
        </div>
      </div>

      <FiltersDrawer 
        isOpen={isFiltersOpen} 
        onClose={() => setIsFiltersOpen(false)} 
        filtersConfig={allOrdersFiltersConfig} 
        onApply={(filters) => console.log('Applied Filters:', filters)}
      />

      <ViewLogsDrawer isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} logs={logs} />
    </div>
  );
}
