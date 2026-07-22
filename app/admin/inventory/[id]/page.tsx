'use client';

import React, { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FallbackImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-black/5 dark:bg-[#121212] text-[var(--text-muted)] ${className}`}>
        <svg className="w-1/2 h-1/2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

export default function StoreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);

  // Database-Ready Master Lists (Rule #9 Compliance)
  const [masterDestinations, setMasterDestinations] = useState([
    { id: 'DEST-001', code: 'HQ', name: 'Main Warehouse (HQ)' },
    { id: 'DEST-002', code: 'C184', name: 'Spectrum Mall - Noida' },
  ]);

  const [purgeReasonsMaster, setPurgeReasonsMaster] = useState([
    { id: 'PRG-1', reason: 'Damaged Goods' },
    { id: 'PRG-2', reason: 'Lost in Transit / Theft' },
    { id: 'PRG-3', reason: 'System Correction' },
    { id: 'PRG-4', reason: 'Return to Manufacturer' },
  ]);

  // Mock Store Data
  const store = {
    id: unwrappedParams.id,
    name: 'Sarath City Capital Mall - Hyderabad',
    address: 'UGF 121, Sarath City Capital Mall Miyapur - Gachibowli Rd, Hyderabad, Telangana 500084',
    code: 'F181',
    status: 'Active',
    manager: 'Mohammed Ali',
    phone: '+91 99887 76655',
    email: 'hyd.sarath@store.com',
    gst: '36AADCA1234F1Z5'
  };

  // Mock Inventory Data with Thumbnails
  const [inventoryItems, setInventoryItems] = useState([
    { sku: 'RNG-GLD-001', name: 'Classic Gold Solitaire Ring', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?w=100&q=80', category: 'Rings', variants: 12, bagCount: 15, status: 'In Stock' },
    { sku: 'NCK-DIA-045', name: 'Diamond Tennis Necklace', image: 'https://images.unsplash.com/photo-1599643478524-fb66f70d00f8?w=100&q=80', category: 'Necklaces', variants: 4, bagCount: 4, status: 'Low Stock' },
    { sku: 'ERG-SLV-089', name: 'Silver Hoop Earrings Set', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=100&q=80', category: 'Earrings', variants: 35, bagCount: 42, status: 'In Stock' },
    { sku: 'BRL-GLD-112', name: '24k Gold Bangle Bracelet', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&q=80', category: 'Bracelets', variants: 8, bagCount: 10, status: 'In Stock' },
    { sku: 'PND-DIA-033', name: 'Diamond Drop Pendant', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&q=80', category: 'Pendants', variants: 14, bagCount: 20, status: 'In Stock' },
    { sku: 'RNG-PLT-099', name: 'Platinum Wedding Band', image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?w=100&q=80', category: 'Rings', variants: 10, bagCount: 5, status: 'Low Stock' },
  ]);

  // Transfer History State
  const [transferHistory, setTransferHistory] = useState([
    {
      id: 'TRN-102938',
      date: '18-07-2026',
      source: 'Sarath City Capital Mall - Hyderabad',
      destination: 'Main Warehouse (HQ)',
      status: 'Completed',
      items: [
        { sku: 'RNG-GLD-002', name: 'Rose Gold Stack Ring' },
        { sku: 'NCK-DIA-040', name: 'Diamond Tennis Choker' }
      ]
    },
    {
      id: 'TRN-102801',
      date: '10-07-2026',
      source: 'Sarath City Capital Mall - Hyderabad',
      destination: 'Spectrum Mall - Noida (C184)',
      status: 'In Transit',
      items: [
        { sku: 'ERG-SLV-080', name: 'Silver Drop Earrings' }
      ]
    }
  ]);

  // Modal States
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);

  // Schedule Report Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [reportType, setReportType] = useState<'Transfer' | 'Purge' | null>(null);
  const [scheduleTimeframe, setScheduleTimeframe] = useState('1 Month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Transfer Flow State
  const [stagedItems, setStagedItems] = useState<any[]>([]);
  const [scanInput, setScanInput] = useState('');
  const [destinationStore, setDestinationStore] = useState(masterDestinations[0].name);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [transferInvoiceData, setTransferInvoiceData] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Purge Flow State
  const [stagedPurgeItems, setStagedPurgeItems] = useState<any[]>([]);
  const [purgeScanInput, setPurgeScanInput] = useState('');
  const [selectedPurgeReason, setSelectedPurgeReason] = useState(purgeReasonsMaster[0].reason);
  const [isPurgeDragOver, setIsPurgeDragOver] = useState(false);

  const scanInputRef = useRef<HTMLInputElement>(null);
  const purgeScanInputRef = useRef<HTMLInputElement>(null);

  // Focus scan input when modals open
  useEffect(() => {
    if (isTransferModalOpen && scanInputRef.current) setTimeout(() => scanInputRef.current?.focus(), 100);
    if (isPurgeModalOpen && purgeScanInputRef.current) setTimeout(() => purgeScanInputRef.current?.focus(), 100);
  }, [isTransferModalOpen, isPurgeModalOpen]);

  // Report Scheduling Logic
  const openScheduleModal = (type: 'Transfer' | 'Purge') => {
    setReportType(type);
    setIsScheduleModalOpen(true);
  };

  const handleDownloadCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,SKU,Item Name,Action,Date\nRNG-GLD-001,Classic Gold Solitaire Ring,${reportType},2026-07-21\nTimeframe:,${scheduleTimeframe},Start:,${startDate},End:,${endDate}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${store.code}_${reportType}_Report.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setIsScheduleModalOpen(false);
  };

  const handleDownloadHistoryCSV = (record: any) => {
    const csvContent = `data:text/csv;charset=utf-8,Transfer ID,Date,Source,Destination,SKU,Item Name\n${record.items.map((i: any) => `${record.id},${record.date},${record.source},${record.destination},${i.sku},${i.name}`).join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Transfer_${record.id}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // --- TRANSFER LOGIC ---
  const availableTransferItems = inventoryItems.filter(item => !stagedItems.some(staged => staged.sku === item.sku));
  const handleStageItem = (item: any) => { if (!stagedItems.some(staged => staged.sku === item.sku)) setStagedItems([...stagedItems, item]); };
  const handleUnstageItem = (sku: string) => setStagedItems(stagedItems.filter(item => item.sku !== sku));
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: any) => e.dataTransfer.setData('application/json', JSON.stringify(item));
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragOver(false);
    const data = e.dataTransfer.getData('application/json');
    if (data) handleStageItem(JSON.parse(data));
  };
  const handleScanBarcode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && scanInput.trim()) {
      e.preventDefault();
      const skuToFind = scanInput.trim().toUpperCase();
      const itemToStage = availableTransferItems.find(item => item.sku.toUpperCase() === skuToFind);
      if (itemToStage) handleStageItem(itemToStage);
      else alert(`SKU ${skuToFind} not found.`);
      setScanInput('');
    }
  };

  const initiateTransfer = () => {
    if (stagedItems.length === 0) return;
    const dateStr = new Date().toLocaleDateString('en-IN').replace(/\//g, '-');
    const invoiceId = `TRN-${Date.now().toString().slice(-6)}`;
    const newInvoice = {
      id: invoiceId, date: dateStr,
      source: store.name, sourceCode: store.code, destination: destinationStore,
      items: [...stagedItems], status: 'In Transit'
    };
    setTransferInvoiceData(newInvoice);
    setTransferHistory([newInvoice, ...transferHistory]);
    setInventoryItems(inventoryItems.filter(item => !stagedItems.some(staged => staged.sku === item.sku)));
    setStagedItems([]); setIsTransferModalOpen(false); setIsInvoiceModalOpen(true);
  };

  // --- PURGE LOGIC ---
  const availablePurgeItems = inventoryItems.filter(item => !stagedPurgeItems.some(staged => staged.sku === item.sku));
  const handleStagePurgeItem = (item: any) => { if (!stagedPurgeItems.some(staged => staged.sku === item.sku)) setStagedPurgeItems([...stagedPurgeItems, item]); };
  const handleUnstagePurgeItem = (sku: string) => setStagedPurgeItems(stagedPurgeItems.filter(item => item.sku !== sku));
  const handlePurgeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsPurgeDragOver(false);
    const data = e.dataTransfer.getData('application/json');
    if (data) handleStagePurgeItem(JSON.parse(data));
  };
  const handlePurgeScanBarcode = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && purgeScanInput.trim()) {
      e.preventDefault();
      const skuToFind = purgeScanInput.trim().toUpperCase();
      const itemToStage = availablePurgeItems.find(item => item.sku.toUpperCase() === skuToFind);
      if (itemToStage) handleStagePurgeItem(itemToStage);
      else alert(`SKU ${skuToFind} not found.`);
      setPurgeScanInput('');
    }
  };
  const initiatePurge = () => {
    if (stagedPurgeItems.length === 0) return;
    setInventoryItems(inventoryItems.filter(item => !stagedPurgeItems.some(staged => staged.sku === item.sku)));
    setStagedPurgeItems([]); setIsPurgeModalOpen(false);
    alert(`Successfully purged ${stagedPurgeItems.length} items. Reason: ${selectedPurgeReason}`);
  };

  const viewHistoricalInvoice = (historyRecord: any) => {
    setTransferInvoiceData({ ...historyRecord, source: historyRecord.source, sourceCode: store.code });
    setIsInvoiceModalOpen(true);
  };

  return (
    <div className="p-8 max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">

      {/* Back Button */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => router.push('/admin/inventory')} className="flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors group">
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Inventory Matrix
        </button>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">{store.name}</h1>
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            {store.status}
          </span>
        </div>

        {/* Actions Menu */}
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => openScheduleModal('Transfer')} className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Transfer Report (CSV)
          </button>
          <button onClick={() => openScheduleModal('Purge')} className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Purge Report (CSV)
          </button>
          <button onClick={() => setIsPurgeModalOpen(true)} className="px-6 py-2.5 rounded-full text-sm font-medium border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors shadow-sm">
            Purge Inventory
          </button>
          <button onClick={() => setIsTransferModalOpen(true)} className="px-6 py-2.5 bg-[var(--brand-primary)] text-white dark:text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover">
            Transfer Inventory
          </button>
        </div>
      </div>

      {/* TOP SECTION: 25% Sidebar / 75% Transfer Ledger */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pt-4">

        {/* Left Col: Store Info Panel (25%) */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl space-y-6 sticky top-6">
            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)] pb-3">Store Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Branch Code</p>
                <p className="text-sm font-medium text-[var(--text-main)]">{store.code}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">GST Number</p>
                <p className="text-sm font-medium text-[var(--text-main)]">{store.gst}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Full Address</p>
                <p className="text-sm font-medium text-[var(--text-main)] leading-relaxed">{store.address}</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)] pb-3 pt-4">Contact Info</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Manager</p>
                <p className="text-sm font-medium text-[var(--text-main)]">{store.manager}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Phone</p>
                <p className="text-sm font-medium text-[var(--text-main)]">{store.phone}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-1">Email</p>
                <p className="text-sm font-medium text-[var(--text-main)] break-all">{store.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Transfer Ledger (75%) */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-black/5 dark:bg-white/5">
              <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-3">
                Transfer History Ledger
              </h2>
              <button onClick={() => openScheduleModal('Transfer')} className="text-xs font-bold text-[var(--brand-primary)] hover:underline">
                Download Master Ledger
              </button>
            </div>
            <div className="overflow-x-auto custom-scrollbar flex-1">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-black/10 dark:bg-[#121212] border-b border-[var(--border-color)] text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider shadow-sm">
                    <th className="py-4 px-6 w-32">TRANSFER ID</th>
                    <th className="py-4 px-6 w-24">DATE</th>
                    <th className="py-4 px-6 min-w-[300px]">TRANSFER DIRECTION (SOURCE ➔ DESTINATION)</th>
                    <th className="py-4 px-6 w-24 text-right">SKUS</th>
                    <th className="py-4 px-6 w-32 text-center">STATUS</th>
                    <th className="py-4 px-6 w-24 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {transferHistory.length === 0 ? (
                    <tr><td colSpan={6} className="py-12 text-center text-[var(--text-muted)]">No transfer history available.</td></tr>
                  ) : (
                    transferHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                        <td className="py-5 px-6 font-mono text-sm font-semibold text-[var(--text-main)] whitespace-nowrap">{record.id}</td>
                        <td className="py-5 px-6 text-sm text-[var(--text-muted)] font-mono whitespace-nowrap">{record.date}</td>
                        <td className="py-5 px-6 text-sm">
                          <div className="flex items-center gap-3 bg-black/5 dark:bg-[#121212] p-2 rounded-lg border border-[var(--border-color)]">
                            <div className="flex items-center gap-2 w-1/2 overflow-hidden" title={record.source}>
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                              <span className="truncate font-medium text-[var(--text-muted)]">{record.source}</span>
                            </div>
                            <svg className="w-4 h-4 text-[var(--text-muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            <div className="flex items-center gap-2 w-1/2 overflow-hidden" title={record.destination}>
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] shrink-0"></div>
                              <span className="truncate font-bold text-[var(--text-main)]">{record.destination}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-sm font-bold text-[var(--brand-primary)] text-right font-mono">{record.items.length}</td>
                        <td className="py-5 px-6 text-center">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${record.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' : 'bg-orange-500/10 text-orange-600 border border-orange-500/30'} whitespace-nowrap`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <div className="flex justify-center gap-4">
                            <button onClick={() => viewHistoricalInvoice(record)} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] dark:hover:text-white transition-colors" title="View Transfer Invoice">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </button>
                            <button onClick={() => handleDownloadHistoryCSV(record)} className="text-[var(--text-muted)] hover:text-blue-500 transition-colors" title="Download Report">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination UI for Ledger */}
            <div className="p-4 border-t border-[var(--border-color)] flex items-center justify-between bg-black/5 dark:bg-[#121212]">
              <span className="text-xs text-[var(--text-muted)]">Showing 1 to {transferHistory.length} of {transferHistory.length} entries</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm disabled:opacity-50" disabled>Prev</button>
                <button className="px-3 py-1 rounded bg-[var(--brand-primary)] text-[#121212] text-sm font-bold shadow-md">1</button>
                <button className="px-3 py-1 rounded bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 100% Width Active Inventory Grid */}
      <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden flex flex-col mt-6">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-black/5 dark:bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-3">
              Active Inventory (Ready to Ship)
              <span className="px-2 py-1 bg-[var(--brand-primary)] text-[#121212] rounded-md text-xs font-mono">{inventoryItems.length} SKUs</span>
            </h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">Verified physical stock housed within {store.code}. Fully mapped to Master Product Variants.</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-[#121212] rounded-lg px-4 py-2 border border-[var(--border-color)] focus-within:border-[var(--brand-primary)] transition-colors shadow-inner w-72">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search SKU or Name..." className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" />
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar w-full max-h-[600px]">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="sticky top-0 z-10 bg-[var(--bg-surface)] shadow-sm">
              <tr className="bg-black/10 dark:bg-[#121212] border-b border-[var(--border-color)] text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-4 px-6 w-16">IMAGE</th>
                <th className="py-4 px-6 w-48">SKU</th>
                <th className="py-4 px-6">ITEM NAME</th>
                <th className="py-4 px-6 w-32">CATEGORY</th>
                <th className="py-4 px-6 w-32 text-right">VARIANTS</th>
                <th className="py-4 px-6 w-32 text-right">BAG COUNT</th>
                <th className="py-4 px-6 w-32 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {inventoryItems.map((item) => (
                <tr key={item.sku} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 rounded-lg border border-[var(--border-color)] overflow-hidden bg-white dark:bg-[#121212] shrink-0">
                      <FallbackImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-sm text-[var(--brand-primary)] font-semibold">{item.sku}</td>
                  <td className="py-4 px-6 text-sm font-medium text-[var(--text-main)]">{item.name}</td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)]">{item.category}</td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)] text-right font-mono">{item.variants}</td>
                  <td className="py-4 px-6 text-sm text-[var(--text-muted)] text-right font-mono">{item.bagCount}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Low Stock' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/30' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'} whitespace-nowrap`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Dual-List Transfer Modal with Thumbnails */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-black/5 dark:bg-white/5 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)]">Master Inventory Transfer</h3>
                <div className="text-[var(--text-muted)] text-sm mt-2 flex items-center gap-2">
                  <span>Moving stock from <span className="font-bold text-[var(--text-main)]">{store.code}</span> to:</span>
                  <select
                    value={destinationStore}
                    onChange={(e) => setDestinationStore(e.target.value)}
                    className="bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-lg px-3 py-1 outline-none text-[var(--brand-primary)] font-semibold cursor-pointer"
                  >
                    {masterDestinations.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] bg-white/5 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Dual List Body */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">

              {/* Left Pane: Available Inventory */}
              <div className="flex flex-col h-full bg-black/5 dark:bg-transparent">
                <div className="p-4 border-b border-[var(--border-color)] bg-black/5 dark:bg-[#121212] shrink-0 space-y-3">
                  <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center justify-between">
                    Available Inventory
                    <span className="text-xs font-mono bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-[var(--text-muted)]">{availableTransferItems.length} left</span>
                  </h4>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    </div>
                    <input
                      ref={scanInputRef} type="text" value={scanInput} onChange={e => setScanInput(e.target.value)} onKeyDown={handleScanBarcode}
                      placeholder="Scan Barcode or Type SKU + Enter..."
                      className="w-full pl-10 p-3 bg-white dark:bg-[#1a1a1a] rounded-xl text-sm text-[var(--text-main)] border border-[var(--brand-primary)] outline-none shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.1)] focus:shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.2)] transition-shadow font-mono"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
                    Tip: Drag and drop items to the right, or click the plus icon.
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 relative">
                  {availableTransferItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] opacity-50">
                      <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                      <p className="text-sm">No items left to transfer.</p>
                    </div>
                  ) : (
                    availableTransferItems.map(item => (
                      <div key={item.sku} draggable onDragStart={(e) => handleDragStart(e, item)} className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-[var(--border-color)] transition-all group cursor-grab active:cursor-grabbing hover:shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="text-[var(--text-muted)] opacity-30 group-hover:opacity-100 transition-opacity pl-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                          </div>
                          <div className="w-10 h-10 rounded border border-[var(--border-color)] overflow-hidden shrink-0">
                            <FallbackImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--text-main)] font-mono">{item.sku}</p>
                            <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[180px]">{item.name}</p>
                          </div>
                        </div>
                        <button onClick={() => handleStageItem(item)} className="w-8 h-8 rounded bg-black/5 dark:bg-white/5 text-[var(--text-muted)] group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Pane: Staged for Transfer */}
              <div
                className={`flex flex-col h-full bg-[var(--bg-surface)] transition-colors duration-300 ${isDragOver ? 'bg-[var(--brand-primary)]/10 ring-4 ring-inset ring-[var(--brand-primary)]/50' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                onDrop={handleDrop}
              >
                <div className="p-4 border-b border-[var(--border-color)] shrink-0 space-y-3 bg-[var(--brand-primary)]/5">
                  <h4 className="text-sm font-bold text-[var(--brand-primary)] uppercase tracking-wider flex items-center justify-between">
                    Staged for Transfer
                    <span className="text-xs font-mono bg-[var(--brand-primary)] text-white px-2 py-0.5 rounded shadow-sm">{stagedItems.length} items</span>
                  </h4>
                  <div className="text-xs text-[var(--text-muted)] pt-3 pb-1 flex items-center gap-2 border-t border-[var(--brand-primary)]/20">
                    <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Review items carefully. Transfer initiates immediately.
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative">
                  {isDragOver && stagedItems.length > 0 && (
                    <div className="absolute inset-0 z-10 bg-[var(--brand-primary)]/10 flex items-center justify-center backdrop-blur-[2px] rounded-b-xl border-2 border-dashed border-[var(--brand-primary)] pointer-events-none">
                      <span className="font-bold text-[var(--brand-primary)] bg-[var(--bg-surface)] px-4 py-2 rounded-full shadow-lg">Drop to Stage SKU</span>
                    </div>
                  )}

                  {stagedItems.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center h-full text-[var(--text-muted)] transition-opacity ${isDragOver ? 'opacity-100' : 'opacity-50'}`}>
                      {isDragOver ? (
                        <svg className="w-16 h-16 mb-4 text-[var(--brand-primary)] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      ) : (
                        <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      )}
                      <p className={`text-sm font-semibold ${isDragOver ? 'text-[var(--brand-primary)]' : ''}`}>
                        {isDragOver ? 'Release to Drop Item Here' : 'Drag & Drop items here to stage.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-2">
                      {stagedItems.map(item => (
                        <div key={item.sku} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded border border-[var(--border-color)] overflow-hidden shrink-0">
                              <FallbackImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[var(--brand-primary)] font-mono">{item.sku}</p>
                              <p className="text-[11px] font-medium text-[var(--text-main)] mt-0.5">{item.name}</p>
                            </div>
                          </div>
                          <button onClick={() => handleUnstageItem(item.sku)} className="text-[var(--text-muted)] hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors" title="Remove">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[var(--border-color)] bg-black/5 dark:bg-white/5 flex justify-end gap-4 shrink-0">
              <button onClick={() => setIsTransferModalOpen(false)} className="px-8 py-3 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button
                onClick={initiateTransfer}
                disabled={stagedItems.length === 0}
                className="px-8 py-3 bg-[var(--brand-primary)] text-white dark:text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Initiate Transfer ({stagedItems.length} items)
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Dual-List Purge Modal with Thumbnails */}
      {isPurgeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="p-6 border-b border-red-500/20 bg-red-500/5 dark:bg-red-500/10 shrink-0 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <div>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Purge Inventory (Permanent Removal)</h3>
                <p className="text-[var(--text-muted)] text-sm mt-1">Select items to permanently write-off from <span className="font-bold text-[var(--text-main)]">{store.code}</span></p>
              </div>
              <button onClick={() => setIsPurgeModalOpen(false)} className="text-[var(--text-muted)] hover:text-red-500 bg-white/5 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Dual List Body */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">

              {/* Left Pane: Available Inventory */}
              <div className="flex flex-col h-full bg-black/5 dark:bg-transparent">
                <div className="p-4 border-b border-[var(--border-color)] bg-black/5 dark:bg-[#121212] shrink-0 space-y-3">
                  <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center justify-between">
                    Available Inventory
                    <span className="text-xs font-mono bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-[var(--text-muted)]">{availablePurgeItems.length} left</span>
                  </h4>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    </div>
                    <input
                      ref={purgeScanInputRef} type="text" value={purgeScanInput} onChange={e => setPurgeScanInput(e.target.value)} onKeyDown={handlePurgeScanBarcode}
                      placeholder="Scan Barcode or Type SKU + Enter..."
                      className="w-full pl-10 p-3 bg-white dark:bg-[#1a1a1a] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-red-500 outline-none shadow-[0_0_15px_rgba(239,68,68,0.1)] focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-shadow font-mono"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {availablePurgeItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] opacity-50">
                      <p className="text-sm">No items left.</p>
                    </div>
                  ) : (
                    availablePurgeItems.map(item => (
                      <div key={item.sku} draggable onDragStart={(e) => handleDragStart(e, item)} className="flex items-center justify-between p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 border border-transparent hover:border-[var(--border-color)] transition-all group cursor-grab">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-[var(--border-color)] overflow-hidden shrink-0">
                            <FallbackImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--text-main)] font-mono">{item.sku}</p>
                            <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[180px]">{item.name}</p>
                          </div>
                        </div>
                        <button onClick={() => handleStagePurgeItem(item)} className="w-8 h-8 rounded bg-black/5 dark:bg-white/5 text-[var(--text-muted)] group-hover:bg-red-500 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Pane: Staged for Purge */}
              <div
                className={`flex flex-col h-full bg-[var(--bg-surface)] transition-colors duration-300 ${isPurgeDragOver ? 'bg-red-500/10 ring-4 ring-inset ring-red-500/50' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsPurgeDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsPurgeDragOver(false); }}
                onDrop={handlePurgeDrop}
              >
                <div className="p-4 border-b border-[var(--border-color)] shrink-0 space-y-4 bg-red-500/5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-red-500 uppercase tracking-wider">
                      Staged for Purge
                      <span className="ml-2 text-xs font-mono bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">{stagedPurgeItems.length} items</span>
                    </h4>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--text-main)]">Reason for Write-off</label>
                    <select
                      value={selectedPurgeReason}
                      onChange={(e) => setSelectedPurgeReason(e.target.value)}
                      className="w-full bg-black/5 dark:bg-[#121212] border border-red-500/30 rounded-xl p-3 outline-none text-[var(--text-main)] text-sm cursor-pointer shadow-inner focus:border-red-500"
                    >
                      {purgeReasonsMaster.map(r => (
                        <option key={r.id} value={r.reason}>{r.reason}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 relative">
                  {isPurgeDragOver && stagedPurgeItems.length > 0 && (
                    <div className="absolute inset-0 z-10 bg-red-500/10 flex items-center justify-center backdrop-blur-[2px] rounded-b-xl border-2 border-dashed border-red-500 pointer-events-none">
                      <span className="font-bold text-red-500 bg-[var(--bg-surface)] px-4 py-2 rounded-full shadow-lg">Drop to Stage SKU</span>
                    </div>
                  )}

                  {stagedPurgeItems.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center h-full text-[var(--text-muted)] transition-opacity ${isPurgeDragOver ? 'opacity-100' : 'opacity-50'}`}>
                      {isPurgeDragOver ? (
                        <svg className="w-16 h-16 mb-4 text-red-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      ) : (
                        <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      )}
                      <p className={`text-sm font-semibold ${isPurgeDragOver ? 'text-red-500' : ''}`}>
                        {isPurgeDragOver ? 'Release to Drop Item Here' : 'Drag & Drop items here to purge.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-2">
                      {stagedPurgeItems.map(item => (
                        <div key={item.sku} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-[#121212] border border-red-500/30 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded border border-[var(--border-color)] overflow-hidden shrink-0">
                              <FallbackImage src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-red-500 font-mono">{item.sku}</p>
                              <p className="text-[11px] font-medium text-[var(--text-main)] mt-0.5">{item.name}</p>
                            </div>
                          </div>
                          <button onClick={() => handleUnstagePurgeItem(item.sku)} className="text-[var(--text-muted)] hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors" title="Remove">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[var(--border-color)] bg-black/5 dark:bg-white/5 flex justify-end gap-4 shrink-0">
              <button onClick={() => setIsPurgeModalOpen(false)} className="px-8 py-3 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button
                onClick={initiatePurge}
                disabled={stagedPurgeItems.length === 0}
                className="px-8 py-3 bg-red-600 text-white rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Confirm Purge ({stagedPurgeItems.length} items)
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Report and Invoice Modals omitted from rewrite for brevity, assuming identical to previous versions as they weren't requested to change */}

      {/* Schedule Report Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Schedule {reportType} Report</h3>
            <p className="text-[var(--text-muted)] text-sm mb-6">Select a timeframe to export detailed tracking data for the auditor.</p>

            <div className="space-y-6 mb-8">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[var(--text-main)]">Quick Select Timeframe</label>
                <div className="flex flex-wrap gap-2">
                  {['1 Month', '3 Months', '6 Months', '1 Year', 'Financial Year'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => setScheduleTimeframe(tf)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${scheduleTimeframe === tf ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--brand-primary)]' : 'bg-transparent border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-[var(--text-main)]">Or Custom Date Range</label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setScheduleTimeframe('Custom'); }} className="w-full p-3 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-[var(--border-color)] focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                  <span className="text-[var(--text-muted)]">to</span>
                  <div className="flex-1">
                    <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setScheduleTimeframe('Custom'); }} className="w-full p-3 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-[var(--border-color)] focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => setIsScheduleModalOpen(false)} className="px-6 py-2.5 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={handleDownloadCSV} className="px-6 py-2.5 bg-[var(--brand-primary)] text-white dark:text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Invoice Overlay Modal */}
      {isInvoiceModalOpen && transferInvoiceData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">

            {/* Printable Invoice Area */}
            <div className="p-10 bg-white dark:bg-[#121212] text-black dark:text-white">
              <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-800 pb-6 mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tighter text-[var(--brand-primary)]">TRANSFER INVOICE</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">Invoice #{transferInvoiceData.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">Date of Transfer</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{transferInvoiceData.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Source Origin</p>
                  <p className="font-bold text-lg">{transferInvoiceData.source}</p>
                  <p className="text-sm font-mono text-[var(--brand-primary)]">{transferInvoiceData.sourceCode}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-[var(--brand-primary)]"></div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Destination Store</p>
                  <p className="font-bold text-lg">{transferInvoiceData.destination}</p>
                  <p className="text-sm text-gray-500">{transferInvoiceData.status || 'Awaiting Acknowledgment'}</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-3 pb-2 border-b border-gray-200 dark:border-gray-800">Transferred SKU Ledger</h3>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-500 dark:text-gray-400 font-medium">
                      <th className="py-2">SKU</th>
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-mono text-xs">
                    {transferInvoiceData.items.map((item: any) => (
                      <tr key={item.sku}>
                        <td className="py-3 font-bold text-[var(--brand-primary)]">{item.sku}</td>
                        <td className="py-3 font-sans text-sm">{item.name}</td>
                        <td className="py-3 text-center">
                          <span className="px-2 py-1 rounded bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 text-[10px] uppercase font-bold">{transferInvoiceData.status || 'In Transit'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Transfer Logged Successfully</span>
                </div>
                <p className="text-sm font-bold">Total Items: <span className="text-[var(--brand-primary)] text-xl ml-2">{transferInvoiceData.items.length}</span></p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-black/5 dark:bg-black/40 border-t border-[var(--border-color)] flex justify-end gap-4">
              <button onClick={() => setIsInvoiceModalOpen(false)} className="px-6 py-2.5 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                Close
              </button>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="px-6 py-2.5 bg-[var(--brand-primary)] text-white dark:text-[#121212] rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
