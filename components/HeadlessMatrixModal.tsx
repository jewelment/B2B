'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

const IconClose = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconSuccess = () => <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconChevronLeft = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconDownload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export interface HeadlessMatrixModalProps {
  product: any; // For backward compatibility if single product passed
  products?: any[]; // For cart list mode
  activeMatrixSku?: string;
  setActiveMatrixSku?: (sku: string) => void;
  onClose: () => void;
}

export default function HeadlessMatrixModal({ 
  product, 
  products, 
  activeMatrixSku, 
  setActiveMatrixSku, 
  onClose 
}: HeadlessMatrixModalProps) {
  const { selectedItems, removeSelection } = useCartStore();
  
  const activeProductData = products && activeMatrixSku 
    ? products.find(p => p.designCode === activeMatrixSku) 
    : product;

  const activeIndex = products && activeMatrixSku ? selectedItems.indexOf(activeMatrixSku) : 0;

  const [matrixData, setMatrixData] = useState<{ columns: any[], rows: any[], rtsVariants?: string[] } | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<{status: boolean, poNumber: string}>({ status: false, poNumber: '' });
  const [error, setError] = useState<string | null>(null);
  
  // NEW STATES FOR ENHANCEMENTS
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPricingBreakup, setShowPricingBreakup] = useState(false);

  const handleNextSku = useCallback(() => {
    if (setActiveMatrixSku && activeIndex < selectedItems.length - 1) setActiveMatrixSku(selectedItems[activeIndex + 1]);
  }, [activeIndex, selectedItems, setActiveMatrixSku]);

  const handlePrevSku = useCallback(() => {
    if (setActiveMatrixSku && activeIndex > 0) setActiveMatrixSku(selectedItems[activeIndex - 1]);
  }, [activeIndex, selectedItems, setActiveMatrixSku]);

  // Handle ESC and arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (checkoutSuccess.status) return;
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' && products) handleNextSku();
      if (e.key === 'ArrowLeft' && products) handlePrevSku();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checkoutSuccess.status, onClose, handleNextSku, handlePrevSku, products]);

  // Fetch matrix when active product changes
  useEffect(() => {
    async function fetchMatrix() {
      setIsLoading(true);
      setError(null);
      setMatrixData(null);
      setQuantities({}); // Reset quantities when switching products (or keep them if we want to store in Zustand, but MVP keeps it local)
      
      try {
        const res = await fetch(`/api/storefront/product-matrix/${activeProductData.designCode}`);
        const result = await res.json();
        if (result.success && result.data?.matrix) {
          setMatrixData(result.data.matrix);
        } else {
          setError('Failed to load matrix options.');
        }
      } catch (e) {
        setError('Network error loading matrix.');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (activeProductData?.designCode) {
      setShowPricingBreakup(false);
      setActiveImageIndex(0);
      fetchMatrix();
    }
  }, [activeProductData?.designCode]);


  const handleQtyChange = (rowId: string, colId: string, val: string) => {
    const qty = parseInt(val, 10) || 0;
    const key = `${rowId}_${colId}`;
    setQuantities(prev => ({ ...prev, [key]: qty }));
  };

  if (!activeProductData) return null;

  const totalUnits = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  const basePrice = activeProductData.price || activeProductData.estimatedPrice || 0;
  const totalValue = totalUnits * basePrice;

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const handleGeneratePO = async () => {
    if (totalUnits === 0) {
      setError('Please enter at least 1 quantity.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const matrixPayload = {
        [activeProductData.designCode]: quantities
      };

      const res = await fetch('/api/checkout/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrixPayload, totalValue, totalUnits })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate PO');
      
      setCheckoutSuccess({ status: true, poNumber: data.poNumber || 'Draft Generated successfully' });
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to extract gallery images
  const getProductGallery = (prod: any) => {
    if (!prod) return [];
    if (prod.media && Array.isArray(prod.media)) return prod.media.map((m: any) => m.url).filter(Boolean);
    if (prod.primaryImage) return [prod.primaryImage, ...(prod.gallery || [])].filter(Boolean);
    if (prod.mainImage) return [prod.mainImage].filter(Boolean);
    if (prod.description?.startsWith('/uploads')) return [prod.description];
    return [];
  };

  const activeGallery = getProductGallery(activeProductData);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-6 transition-all duration-500">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity cursor-pointer"
        onClick={!checkoutSuccess.status ? onClose : undefined}
      />

      <div className="flex items-center justify-between w-full max-w-7xl gap-2 md:gap-4 my-auto mx-auto z-10">
        
        {/* EXTERNAL LEFT ARROW (if multiple products) */}
        <div className="w-10 md:w-14 shrink-0 flex justify-center">
          {products && selectedItems.length > 1 && !checkoutSuccess.status && (
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrevSku(); }} 
              disabled={activeIndex === 0} 
              className="hidden md:flex w-12 h-12 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)] items-center justify-center hover:bg-white/10 hover:text-white disabled:opacity-0 transition-all shadow-xl backdrop-blur-md"
            >
              <IconChevronLeft />
            </button>
          )}
        </div>

        {/* Main Glassmorphic Modal Window */}
        <div 
          className={`relative w-full max-w-6xl bg-[var(--bg-surface)]/90 backdrop-blur-3xl border border-[var(--glass-border)] rounded-[2rem] shadow-[-10px_0_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] max-h-[90vh] ${checkoutSuccess.status ? 'pointer-events-none' : ''}`}
        >
          
          {/* Success Overlay */}
          {checkoutSuccess.status && (
            <div className="absolute inset-0 bg-[var(--bg-surface)]/95 backdrop-blur-3xl z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300 pointer-events-auto">
              {/* Top-right close button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shadow-sm"
              >
                <IconClose />
              </button>

              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <IconSuccess />
              </div>
              
              <h3 className="text-3xl font-light text-[var(--text-main)] mb-3">Purchase Order Transmitted</h3>
              <p className="text-[var(--text-muted)] text-sm mb-10 max-w-md leading-relaxed">
                Your matrix payload has been successfully received. Your procurement manager will review and contact you shortly.
              </p>
              
              <div className="bg-black/30 border border-white/10 rounded-2xl p-6 mb-10 w-full max-w-sm shadow-inner relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent opacity-50"></div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">B2B Reference Number</p>
                <p className="text-2xl font-mono text-[var(--brand-primary)] tracking-wider drop-shadow-md">{checkoutSuccess.poNumber}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-md justify-center">
                <a 
                  href={`/api/checkout/pdf/${checkoutSuccess.poNumber}`} 
                  download 
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all shadow-sm shimmer-hover overflow-hidden relative text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 pointer-events-auto"
                >
                  <IconDownload /> Download Invoice
                </a>
                <button 
                  onClick={onClose} 
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-[10px] font-bold uppercase tracking-widest pointer-events-auto"
                >
                  Close & Return
                </button>
              </div>
              
              <p className="text-[11px] text-[var(--text-muted)]">
                You can also download this invoice anytime from your <Link href="/admin/orders" className="text-[var(--brand-primary)] underline hover:opacity-80 transition-opacity">Orders tab</Link>.
              </p>
            </div>
          )}

          {/* Left Information Panel */}
          <div className="w-full md:w-[35%] bg-black/20 p-6 md:p-8 border-r border-[var(--glass-border)] flex flex-col justify-between relative shadow-inner shrink-0 overflow-y-auto">
            
            {/* PRICING BREAKUP OVERLAY */}
            {showPricingBreakup && !checkoutSuccess.status && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in rounded-l-[2rem]">
                <div className="bg-[var(--bg-surface)] border border-[var(--glass-border)] shadow-2xl rounded-2xl p-6 w-full max-w-xs relative">
                  <button onClick={() => setShowPricingBreakup(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)]"><IconClose /></button>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 border-b border-white/10 pb-2">Estimated Breakdown</h4>
                  <div className="space-y-3 text-sm text-[var(--text-main)]">
                    <div className="flex justify-between"><span className="text-xs font-medium">Gold Value (18K)</span><span className="font-mono">₹{(basePrice * 0.65).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div className="flex justify-between"><span className="text-xs font-medium">Diamond Value</span><span className="font-mono">₹{(basePrice * 0.25).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div className="flex justify-between pt-3 border-t border-white/5"><span className="text-xs font-medium">Making Charges</span><span className="font-mono">₹{(basePrice * 0.10).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="aspect-square rounded-[1.5rem] bg-black/40 flex items-center justify-center overflow-hidden border border-white/5 mb-4 shadow-2xl relative">
                  {activeGallery.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeGallery[activeImageIndex]} alt={activeProductData.title} className="w-full h-full object-cover transition-opacity duration-300" />
                  ) : (
                    <span className="text-[var(--text-muted)] text-xs font-semibold tracking-[0.2em] uppercase">No Image</span>
                  )}
              </div>

              {/* THUMBNAILS GALLERY */}
              {activeGallery.length > 1 && (
                <div className="flex gap-2 mt-3 mb-6 mx-auto sm:mx-0 justify-start overflow-x-auto pb-2 scrollbar-hide">
                  {activeGallery.slice(0, 4).map((img: any, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-12 shrink-0 rounded-lg overflow-hidden border transition-all ${activeImageIndex === idx ? 'border-[var(--brand-primary)] shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img as string} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              )}
              {!(activeGallery.length > 1) && <div className="mb-6"></div>}
              
              <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-widest mb-2">Dynamic Matrix</div>
                  <h2 className="text-3xl font-light tracking-wide text-[var(--text-main)] drop-shadow-md">{activeProductData.designCode}</h2>
                  <p className="text-sm text-[var(--text-muted)] font-light leading-relaxed">{activeProductData.title}</p>
                  
                  <div className="pt-4 mt-4 border-t border-white/10 flex flex-col items-start">
                      <p className="text-2xl font-medium text-[var(--brand-primary)] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                          {formatPrice(basePrice)} 
                          <span className="text-xs font-normal text-gray-500 ml-2">/ base unit</span>
                      </p>
                      
                      {/* VIEW PRICING BREAKUP BUTTON */}
                      <button 
                        onClick={() => setShowPricingBreakup(true)}
                        className="text-[9px] text-[var(--brand-primary)] opacity-80 font-bold uppercase tracking-widest mt-2 border-b border-[var(--brand-primary)]/30 pb-0.5 hover:opacity-100 transition-all"
                      >
                        View Pricing Breakup
                      </button>
                  </div>
              </div>
            </div>

            {/* CART ITEMS LIST */}
            {products && selectedItems.length > 0 && (
              <div className="border-t border-white/10 pt-6 mt-6">
                <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-widest mb-3">Cart Items ({selectedItems.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItems.map(sku => {
                    const isActive = activeMatrixSku === sku;
                    const displaySku = sku.replace('AJ-', ''); 
                    
                    let pillStyle = '';
                    if (isActive) {
                      pillStyle = 'bg-[var(--brand-primary)] border-[var(--brand-primary)] text-[var(--brand-text)] shadow-md';
                    } else {
                      pillStyle = 'bg-white/5 border-white/10 text-[var(--text-muted)] hover:bg-white/10 hover:text-white';
                    }

                    return (
                      <div 
                        key={sku} 
                        onClick={() => setActiveMatrixSku && setActiveMatrixSku(sku)}
                        className={`inline-flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-all border ${pillStyle}`}
                      >
                        <div className="flex items-center gap-1.5 pr-1.5">
                          <span className="text-[9px] font-mono font-bold tracking-wide">{displaySku}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeSelection(sku); }} 
                          className={`flex-shrink-0 text-[8px] leading-none transition-colors ml-0.5 ${isActive ? 'text-[var(--brand-text)]/60 hover:text-[var(--brand-text)]' : 'text-red-400 hover:text-red-500'}`}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Matrix Data Panel */}
          <div className="w-full md:w-[65%] flex flex-col h-full bg-gradient-to-b from-transparent to-black/10">
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)] flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-[var(--text-main)]">Dynamic Purchase Order Configurator</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Matrix values automatically synced with catalog parameters</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all shadow-sm"
              >
                <IconClose />
              </button>
            </div>

            {/* Matrix Grid Area */}
            <div className="flex-1 overflow-auto p-4 md:p-8 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
                   <p className="text-sm text-[var(--text-muted)] mt-4 animate-pulse">Syncing Option Sets...</p>
                </div>
              ) : error ? (
                <div className="text-center text-red-400 mt-10 p-6 bg-red-900/10 rounded-xl border border-red-500/20">
                  {error}
                </div>
              ) : matrixData && (
                <div className="w-full">
                  <div className="flex items-center text-[9px] text-[var(--text-muted)] uppercase tracking-widest mb-4 gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80 border border-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>
                    Ready to Ship (In Stock)
                  </div>
                  <div className="overflow-x-auto pb-4">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr>
                          <th className="p-3 border-b border-white/10 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider sticky left-0 bg-[var(--bg-surface)]/95 backdrop-blur-md z-10">Purity \ Size</th>
                          {matrixData.columns.map(col => (
                            <th key={col.id} className="p-3 border-b border-white/10 text-center text-xs font-semibold text-[var(--text-main)] min-w-[80px]">
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {matrixData.rows.map(row => (
                          <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-3 text-xs font-medium text-[var(--text-main)] tracking-wide sticky left-0 bg-[var(--bg-surface)]/95 backdrop-blur-md z-10 group-hover:bg-white/[0.02]">
                              {row.label}
                            </td>
                            {matrixData.columns.map(col => {
                              const key = `${row.id}_${col.id}`;
                              const val = quantities[key] || '';
                              const isRts = matrixData.rtsVariants?.includes(key);
                              
                              return (
                                <td key={col.id} className="p-2 relative">
                                    <div className="relative group/input">
                                      <input 
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={val}
                                        onChange={(e) => handleQtyChange(row.id, col.id, e.target.value)}
                                        className={`w-full h-10 border rounded-lg text-center text-sm placeholder-gray-600 focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all shadow-inner appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                        isRts 
                                          ? 'bg-emerald-900/10 border-emerald-500/40 text-emerald-400 font-semibold' 
                                          : 'bg-black/40 border-white/10 text-[var(--text-main)]'
                                      }`}
                                    />
                                    <div className="absolute inset-y-0 right-1 flex flex-col justify-center opacity-0 group-hover/input:opacity-100 transition-opacity z-20">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleQtyChange(row.id, col.id, String((parseInt(val as string) || 0) + 1)); }}
                                        className="p-0.5 text-gray-500 hover:text-white transition-colors h-4 flex items-center justify-center"
                                      >
                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleQtyChange(row.id, col.id, String(Math.max(0, (parseInt(val as string) || 0) - 1))); }}
                                        className="p-0.5 text-gray-500 hover:text-white transition-colors h-4 flex items-center justify-center"
                                      >
                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Area */}
            <div className="p-6 border-t border-[var(--glass-border)] bg-black/30 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-baseline gap-3">
                <div className="text-[var(--text-muted)] text-sm font-medium">Draft Value</div>
                <div className="text-2xl font-light text-[var(--text-main)] drop-shadow-md">
                  {formatPrice(totalValue)}
                </div>
                <div className="text-xs text-gray-500">({totalUnits} units)</div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-white/10 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-wide"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleGeneratePO}
                  disabled={isSubmitting || totalUnits === 0}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center px-8 py-3 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black/80 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Generate Draft PO'
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* EXTERNAL RIGHT ARROW (if multiple products) */}
        <div className="w-10 md:w-14 shrink-0 flex justify-center">
          {products && selectedItems.length > 1 && !checkoutSuccess.status && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleNextSku(); }} 
              disabled={activeIndex === selectedItems.length - 1} 
              className="hidden md:flex w-12 h-12 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)] items-center justify-center hover:bg-white/10 hover:text-white disabled:opacity-0 transition-all shadow-xl backdrop-blur-md"
            >
              <IconChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
