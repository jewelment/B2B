'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PurchaseOrderPDF } from '@/components/PurchaseOrderPDF';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
);

export default function AdminOrdersDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // UX States
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [openStatusMenu, setOpenStatusMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Pointing to the new V2 Admin Orders API
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setOpenStatusMenu(null); 
      
      // Pointing to the new V2 Admin Orders API
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId, status: newStatus })
      });
    } catch (error) {
      alert("Failed to update status.");
      fetchOrders(); 
    }
  };

  // Mapped to V2 Statuses
  const getStatusUI = (status: string) => {
    switch(status) {
      case 'DRAFT_PO': return { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', dot: 'bg-amber-500', label: 'Pending Review' };
      case 'APPROVED': return { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/20', dot: 'bg-blue-500', label: 'Approved' };
      case 'PRODUCTION': return { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500/20', dot: 'bg-purple-500', label: 'In Production' };
      case 'SHIPPED': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/20', dot: 'bg-emerald-500', label: 'Shipped' };
      case 'CANCELLED': return { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/20', dot: 'bg-red-500', label: 'Cancelled' };
      default: return { bg: 'bg-[var(--bg-base)]', text: 'text-[var(--text-muted)]', border: 'border-[var(--border-color)]', dot: 'bg-[var(--text-muted)]', label: status };
    }
  };

  const filteredOrders = orders.filter(o => statusFilter === 'ALL' || o.status === statusFilter);
  const totalPipelineValue = filteredOrders.reduce((acc, order) => acc + order.totalValue, 0);
  const totalActiveItems = filteredOrders.reduce((sum, o) => sum + o.totalItems, 0);
  const pendingReviewCount = orders.filter(o => o.status === 'DRAFT_PO').length;

  const handleRowClick = (orderId: string) => {
    setExpandedRow(expandedRow === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[var(--brand-primary)]">
        <svg className="animate-spin w-8 h-8 mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span className="text-xs font-bold tracking-widest uppercase">Syncing Enterprise Ledger...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700 pb-20 relative">
      
      {openStatusMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenStatusMenu(null)}></div>
      )}

      {/* Header & Filters */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-3xl font-light text-[var(--text-main)] tracking-wide">PO Control Center</h1>
          <p className="text-sm text-[var(--text-muted)] mt-2">Manage incoming B2B wholesale orders and pipeline value.</p>
        </div>
        
        <div className="relative min-w-[220px]">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold uppercase tracking-wider py-3.5 px-5 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 cursor-pointer transition-all hover:bg-[var(--bg-base)]"
          >
            <option value="ALL">All Pipeline Orders</option>
            <option value="DRAFT_PO">Pending Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PRODUCTION">In Production</option>
            <option value="SHIPPED">Shipped</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* UNIFIED METRICS RIBBON       */}
      {/* ========================================== */}
      <div className="flex flex-col md:flex-row w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl mb-8 overflow-hidden">
        
        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[var(--border-color)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Total Monitored Pipeline</p>
            <span className="text-[9px] font-bold bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] px-2.5 py-1 rounded uppercase tracking-widest">{filteredOrders.length} Active</span>
          </div>
          <p className="text-3xl font-light text-[var(--text-main)] tracking-tight">{formatPrice(totalPipelineValue)}</p>
        </div>

        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[var(--border-color)] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Accumulated Volume</p>
            <svg className="w-4 h-4 text-[var(--text-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-light text-[var(--text-main)] tracking-tight">{totalActiveItems.toLocaleString('en-IN')}</p>
            <p className="text-sm text-[var(--text-muted)] font-medium">Units</p>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 bg-[var(--brand-primary)]/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-[0.2em]">Awaiting Rate Lock</p>
            {pendingReviewCount > 0 && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--brand-primary)] opacity-50"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--brand-primary)]"></span>
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-light text-[var(--brand-primary)] tracking-tight">{pendingReviewCount}</p>
            <p className="text-sm text-[var(--brand-primary)]/60 font-medium">Orders</p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* DATA GRID                                  */}
      {/* ========================================== */}
      <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-base)] text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)] border-b border-[var(--border-color)]">
                <th className="px-8 py-5">PO Number</th>
                <th className="px-6 py-5">Client</th>
                <th className="px-6 py-5">Date Submitted</th>
                <th className="px-6 py-5 text-center">Volume</th>
                <th className="px-6 py-5 text-right">Est. Value</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-transparent">
              
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-[var(--text-muted)] text-sm">No purchase orders match the selected criteria.</td>
                </tr>
              ) : filteredOrders.map((order) => {
                const ui = getStatusUI(order.status);
                const isExpanded = expandedRow === order.id;

                return (
                  <React.Fragment key={order.id}>
                    
                    <tr 
                      onClick={() => handleRowClick(order.id)}
                      className={`group cursor-pointer transition-colors ${isExpanded ? 'bg-[var(--bg-base)]' : 'hover:bg-[var(--bg-base)]/50'}`}
                    >
                      {/* V2 Mappings applied below */}
                      <td className="px-8 py-6 font-mono text-sm font-medium text-[var(--brand-primary)]">{order.orderNumber}</td>
                      <td className="px-6 py-6 text-sm text-[var(--text-main)] font-semibold">{order.client?.companyName || 'Unknown'}</td>
                      <td className="px-6 py-6 text-sm text-[var(--text-muted)]">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-[var(--text-main)] font-medium text-xs">{order.totalItems}</span>
                      </td>
                      <td className="px-6 py-6 text-right font-medium text-[var(--text-main)]">{formatPrice(order.totalValue)}</td>
                      
                      <td className="px-6 py-6 text-center relative">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOpenStatusMenu(openStatusMenu === order.id ? null : order.id); }}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border ${ui.bg} ${ui.border} ${ui.text} text-[9px] font-bold uppercase tracking-widest transition-all hover:opacity-80 active:scale-95`}
                        >
                          <span className={`w-1 h-1 rounded-full ${ui.dot}`}></span>
                          {ui.label}
                          <svg className="w-3 h-3 ml-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>

                        {openStatusMenu === order.id && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 p-1">
                            {['DRAFT_PO', 'APPROVED', 'PRODUCTION', 'SHIPPED', 'CANCELLED'].map(statusOption => {
                               const optUI = getStatusUI(statusOption);
                               return (
                                 <div 
                                   key={statusOption}
                                   onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, statusOption); }}
                                   className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer text-[10px] font-bold uppercase tracking-widest transition-colors ${order.status === statusOption ? 'bg-[var(--bg-base)] ' + optUI.text : 'text-[var(--text-muted)] hover:bg-[var(--bg-base)] hover:text-[var(--text-main)]'}`}
                                 >
                                   <span className={`w-1 h-1 rounded-full ${order.status === statusOption ? optUI.dot : 'bg-transparent'}`}></span>
                                   {optUI.label}
                                 </div>
                               );
                            })}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-8 py-6 text-right">
                        <div className={`inline-flex items-center justify-center w-7 h-7 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] transition-all duration-300 ${isExpanded ? 'rotate-180 bg-[var(--brand-primary)]/5 border-[var(--brand-primary)]/20 text-[var(--brand-primary)]' : 'group-hover:bg-[var(--bg-base)]'}`}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-[var(--bg-base)] border-b border-[var(--border-color)]">
                        <td colSpan={7} className="p-0">
                          <div className="px-10 py-8 animate-in slide-in-from-top-2 duration-300">
                            
                            <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
                              <h4 className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                Matrix Payload ({order.items.length} Variants)
                              </h4>
                              
                              <PDFDownloadLink 
                                document={<PurchaseOrderPDF orderData={order} />} 
                                fileName={`${order.orderNumber}_Internal_Invoice.pdf`}
                                className="px-4 py-2 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] text-[9px] font-bold uppercase tracking-widest rounded flex items-center gap-2 hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text)] hover:border-[var(--brand-primary)] transition-all"
                                onClick={(e) => e.stopPropagation()} 
                              >
                                {({ loading }) => (
                                  <>
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    {loading ? 'Preparing...' : 'Export Proforma'}
                                  </>
                                )}
                              </PDFDownloadLink>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                              {order.items.map((item: any) => (
                                <div key={item.id} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 flex items-center gap-4 hover:border-[var(--brand-primary)]/30 transition-colors cursor-default" onClick={(e) => e.stopPropagation()}>
                                  <div className="w-14 h-14 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                                    {item.product?.description ? (
                                      <img src={item.product.description} alt={item.product.designCode} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                    ) : (
                                      <svg className="w-5 h-5 text-[var(--text-muted)]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[var(--text-main)] truncate mb-0.5">{item.product.designCode}</p>
                                    <p className="text-xs text-[var(--text-muted)] truncate mb-2">{item.product.title}</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-[9px] font-bold bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-muted)] px-2 py-0.5 rounded uppercase tracking-wider">
                                        {item.metalPurity}
                                      </span>
                                      <span className="text-[10px] text-[var(--text-main)] font-semibold border-l border-[var(--border-color)] pl-2">
                                        Qty: {item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}