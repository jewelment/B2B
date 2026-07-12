'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PurchaseOrderPDF } from '@/components/PurchaseOrderPDF';
import { useSearchParams } from 'next/navigation';

// Dynamically import the PDF downloader to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink),
  { ssr: false }
);

function OrderHistoryContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // THE FIX: Re-introduced the Modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  
  const searchParams = useSearchParams();
  const showSuccessBanner = searchParams.get('success') === 'true';

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch('/api/history');
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          console.error("Failed to load orders:", data.error);
        }
      } catch (error) {
        console.error("Network error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">Approved</span>;
      case 'PENDING':
        return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">Pending Review</span>;
      case 'PROCESSING':
        return <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">In Production</span>;
      case 'FULFILLED':
        return <span className="bg-[var(--text-muted)]/10 text-[var(--text-muted)] border border-[var(--border-color)] text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">Fulfilled</span>;
      default:
        return <span className="bg-gray-500/10 text-gray-500 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="w-full max-w-5xl animate-in fade-in duration-500">
      
      {/* Success Banner */}
      {showSuccessBanner && (
        <div className="mb-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 text-emerald-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span className="text-sm font-bold">Purchase Order successfully submitted and added to your pipeline.</span>
          </div>
          <button onClick={() => window.history.replaceState(null, '', '/dashboard/history')} className="text-emerald-600 hover:text-emerald-800 p-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-2xl font-light tracking-wide text-[var(--text-main)] mb-2">Order History</h1>
        <p className="text-sm text-[var(--text-muted)]">Track your wholesale pipeline and download past Proforma invoices.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--brand-primary)]">
          <svg className="animate-spin w-8 h-8 mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <span className="text-xs font-bold tracking-widest uppercase">Syncing Pipeline...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="w-full bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--text-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-xl font-medium text-[var(--text-main)] mb-3">No Purchase Orders Found</h2>
          <p className="text-sm text-[var(--text-muted)] mb-8">You haven't generated any Proforma Invoices yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm transition-all hover:shadow-md hover:border-[var(--brand-primary)]/20">
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-lg font-bold text-[var(--brand-primary)] tracking-wide">{order.poNumber}</h3>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Placed on: <strong className="font-bold text-[var(--text-main)] ml-1">{formatDate(order.createdAt)}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Matrix Size: <strong className="font-bold text-[var(--text-main)] ml-1">{order.items?.length || 0} Variants</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    Total Units: <strong className="font-bold text-[var(--text-main)] ml-1">{order.totalUnits} Pieces</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-center pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border-color)] md:pl-8">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Estimated Value</p>
                <p className="text-xl font-light text-[var(--text-main)] mb-4">{formatPrice(order.totalValue)}</p>
                
                {/* THE FIX: Replaced PDF Link with Quick View trigger */}
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="w-full md:w-auto px-6 py-2.5 bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm hover:bg-[var(--text-muted)]/10 hover:border-[var(--brand-primary)]/40 transition-all text-center flex justify-center items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Quick View
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* THE FIX: QUICK VIEW MODAL (Theme-Aware)    */}
      {/* ========================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedOrder(null)} 
          />
          
          {/* Modal Container */}
          <div className="relative w-full max-w-4xl bg-[var(--bg-base)] border border-[var(--border-color)] shadow-2xl rounded-[2rem] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-surface)]">
              <div>
                <h3 className="text-xl font-mono font-medium text-[var(--brand-primary)] mb-2">{selectedOrder.poNumber}</h3>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--text-muted)]/10 text-[var(--text-muted)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Scrollable Line Items) */}
            <div className="p-8 overflow-y-auto flex-1">
              <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Matrix Items</h4>
              <div className="space-y-4">
                {selectedOrder.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-6 p-4 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-2xl hover:border-[var(--brand-primary)]/30 transition-colors">
                    
                    <div className="w-16 h-16 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl overflow-hidden flex items-center justify-center p-1 shadow-sm">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.designCode} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                      ) : (
                        <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest">No Img</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[var(--text-main)] mb-1">{item.designCode}</p>
                      <p className="text-xs text-[var(--text-muted)]">{item.title}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-bold bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-muted)] px-2 py-1 rounded uppercase tracking-wider">
                          {item.purity || 'STD'} | {item.metal || 'METAL'}
                        </span>
                        <span className="text-xs font-medium text-[var(--text-main)]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--brand-primary)]">
                        {formatPrice(Number(item.estimatedPrice || item.unitPrice || 0) * item.quantity)}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer (Totals & PDF Download) */}
            <div className="px-8 py-6 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Total Pipeline Value</p>
                <p className="text-2xl font-light text-[var(--text-main)]">{formatPrice(selectedOrder.totalValue)}</p>
              </div>
              
              {/* THE FIX: The PDF Link is safely rendered inside the open modal */}
              <PDFDownloadLink 
                document={<PurchaseOrderPDF orderData={selectedOrder} />} 
                fileName={`${selectedOrder.poNumber}_AshokJewels_PO.pdf`}
                className="px-8 py-3.5 bg-[var(--brand-primary)] text-[var(--brand-text)] text-xs font-bold uppercase tracking-widest rounded-xl shadow-sm hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 min-w-[220px]"
              >
                {({ loading }) => (
                  <>
                    {loading ? (
                      <svg className="animate-spin h-4 w-4 text-[var(--brand-text)]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg className="w-4 h-4 text-[var(--brand-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    )}
                    {loading ? 'Preparing...' : 'Download PO PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function OrderHistoryPage() {
  return (
    <React.Suspense fallback={<div className="flex justify-center p-12 text-sm text-[var(--text-muted)]">Loading order history...</div>}>
      <OrderHistoryContent />
    </React.Suspense>
  );
}