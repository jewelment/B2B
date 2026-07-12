'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const IconClose = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconChevronLeft = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconSuccess = () => <svg className="w-12 h-12 text-[#4e080f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconDownload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export interface AdvancedMatrixModalProps {
  products: any[];
  selectedItems: string[];
  activeMatrixSku: string;
  setActiveMatrixSku: (sku: string) => void;
  matrixQuantities: Record<string, Record<string, number>>;
  setMatrixQuantities: (quantities: Record<string, Record<string, number>> | ((prev: any) => any)) => void;
  handleRemoveSkuFromCart: (sku: string) => void;
  closeMatrix: () => void;
  purities?: string[];
  sizes?: string[];
  catalogId?: string;
  clientId?: string;
}

export default function AdvancedMatrixModal({
  products,
  selectedItems,
  activeMatrixSku,
  setActiveMatrixSku,
  matrixQuantities,
  setMatrixQuantities,
  handleRemoveSkuFromCart,
  closeMatrix,
  purities = ['14K YG', '14K RG', '14K WG', '18K YG', '18K RG', '18K WG'],
  sizes = ['6', '7', '8', '9', '10', '11'],
  catalogId,
  clientId
}: AdvancedMatrixModalProps) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<{status: boolean, poNumber: string}>({ status: false, poNumber: '' });
  const [showPricingBreakup, setShowPricingBreakup] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeProductData = products.find(i => i.designCode === activeMatrixSku);
  
  const activeIndex = selectedItems.indexOf(activeMatrixSku);
  
  const handleNextSku = useCallback(() => {
    if (activeIndex < selectedItems.length - 1) setActiveMatrixSku(selectedItems[activeIndex + 1]);
  }, [activeIndex, selectedItems, setActiveMatrixSku]);

  const handlePrevSku = useCallback(() => {
    if (activeIndex > 0) setActiveMatrixSku(selectedItems[activeIndex - 1]);
  }, [activeIndex, selectedItems, setActiveMatrixSku]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (checkoutSuccess.status) return;
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') handleNextSku();
      if (e.key === 'ArrowLeft') handlePrevSku();
      if (e.key === 'Escape') closeMatrix();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextSku, handlePrevSku, checkoutSuccess.status, closeMatrix]);

  useEffect(() => {
    setShowPricingBreakup(false);
    setActiveImageIndex(0);
  }, [activeMatrixSku]);

  const updateMatrixQty = (sku: string, variantKey: string, qty: number) => {
    if (validationError) setValidationError(null);
    setMatrixQuantities((prev: any) => ({
      ...prev, [sku]: { ...(prev[sku] || {}), [variantKey]: Math.max(0, qty) }
    }));
  };

  const getProductPrice = (product: any) => {
    if (!product) return 0;
    return product.price || product.estimatedPrice || 0;
  };

  const getProductGallery = (product: any) => {
    if (!product) return [];
    
    // Support for Flipbook/Grid format
    if (product.media && Array.isArray(product.media)) {
      return product.media.map((m: any) => m.url).filter(Boolean);
    }
    
    // Support for Dashboard Catalog format
    if (product.primaryImage) {
      return [product.primaryImage, ...(product.gallery || [])].filter(Boolean);
    }

    // Support for flat catalog format
    if (product.mainImage) {
        return [product.mainImage].filter(Boolean);
    }
    
    if (product.description && product.description.startsWith('http')) {
        return [product.description];
    }
    
    return [];
  };

  let totalMatrixUnits = 0;
  let totalMatrixValue = 0;
  
  if (matrixQuantities) {
    Object.entries(matrixQuantities).forEach(([sku, variants]) => {
      const pData = products.find(i => i.designCode === sku);
      Object.values(variants as any).forEach((qty: any) => {
        totalMatrixUnits += qty;
        totalMatrixValue += qty * getProductPrice(pData);
      });
    });
  }

  const submitGlobalPO = async () => {
    if (selectedItems.length === 0) return;

    if (totalMatrixUnits === 0) {
      setValidationError(`Incomplete Matrix: Please enter a quantity for at least one item.`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const payload: any = { matrixPayload: matrixQuantities, totalValue: totalMatrixValue, totalUnits: totalMatrixUnits };
      if (catalogId) payload.catalogId = catalogId;
      if (clientId) payload.clientId = clientId;

      const res = await fetch('/api/checkout/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        setCheckoutSuccess({ status: true, poNumber: data.poNumber });
      } else {
        setValidationError(data.error || "Transmission failed.");
      }
    } catch (error) {
      setValidationError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    closeMatrix();
  };

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  if (!activeProductData) return null;

  const activeGallery = getProductGallery(activeProductData);
  const activePrice = getProductPrice(activeProductData);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={checkoutSuccess.status ? undefined : closeMatrix} 
    >
      
      {validationError && !checkoutSuccess.status && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 p-4 rounded-xl shadow-xl z-[120] flex items-center gap-4 animate-in slide-in-from-top-4 max-w-md w-[90%]">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 font-bold">!</div>
          <div>
            <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-0.5">Allocation Required</p>
            <p className="text-xs text-red-600 leading-tight">{validationError}</p>
          </div>
          <button onClick={() => setValidationError(null)} className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors ml-auto"><IconClose /></button>
        </div>
      )}

      {/* Locked width container using flex constraints */}
      <div 
        className="flex items-center justify-between w-full max-w-[1200px] gap-2 md:gap-6 my-auto mx-auto px-2"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* EXTERNAL LEFT ARROW */}
        <div className="w-10 md:w-14 shrink-0 flex justify-center">
          {selectedItems.length > 1 && !checkoutSuccess.status && (
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrevSku(); }} 
              disabled={activeIndex === 0} 
              className="hidden md:flex w-14 h-14 rounded-full bg-[#1a1a1a] border border-[#333] text-white items-center justify-center hover:bg-[#333] disabled:opacity-0 transition-all shadow-xl"
            >
              <IconChevronLeft />
            </button>
          )}
        </div>

        {/* MODAL CORE */}
        <div className="bg-white w-full max-w-[950px] rounded-2xl flex flex-col sm:flex-row overflow-hidden shadow-2xl relative max-h-[90vh]">
          
          {/* SUCCESS OVERLAY */}
          {checkoutSuccess.status && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <button onClick={closeMatrix} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                <IconClose />
              </button>
              <IconSuccess />
              <h2 className="text-2xl font-light text-gray-900 mt-6 mb-2">Purchase Order Transmitted</h2>
              <p className="text-sm text-gray-500 mb-8 max-w-md px-4">Your matrix payload has been successfully received. Your procurement manager will review and contact you shortly.</p>
              
              <div className="bg-gray-50 border border-gray-200 px-8 py-5 rounded-2xl mb-8">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">B2B Reference Number</p>
                <p className="text-3xl font-mono text-gray-900">{checkoutSuccess.poNumber}</p>
              </div>
              
              <div className="flex gap-4">
                <a href={`/api/checkout/pdf/${checkoutSuccess.poNumber}`} download className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50">
                  <IconDownload /> Download Invoice
                </a>
                <button onClick={closeMatrix} className="px-8 py-3.5 bg-[#4e080f] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-colors shadow-md">
                  Close & Return
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-8">
                You can also download this invoice anytime from your <Link href="/dashboard/orders" className="text-[#4e080f] underline hover:text-[#3a060b] transition-colors">Orders tab</Link>.
              </p>
            </div>
          )}

          {/* LEFT PANE */}
          <div className="w-full sm:w-[35%] bg-white border-r border-gray-100 flex flex-col relative shrink-0">
            
            {showPricingBreakup && !checkoutSuccess.status && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-md p-6 animate-in fade-in">
                <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 w-full max-w-xs relative">
                  <button onClick={() => setShowPricingBreakup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><IconClose /></button>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Estimated Breakdown</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between"><span className="text-xs font-medium">Gold Value (18K)</span><span className="font-mono text-gray-900">₹{(activePrice * 0.65).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div className="flex justify-between"><span className="text-xs font-medium">Diamond Value</span><span className="font-mono text-gray-900">₹{(activePrice * 0.25).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                    <div className="flex justify-between pt-3 border-t border-gray-50"><span className="text-xs font-medium">Making Charges</span><span className="font-mono text-gray-900">₹{(activePrice * 0.10).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8 pb-4 relative z-10 flex flex-col items-center sm:items-start">
              
              <div className="aspect-square w-full max-w-[220px] bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden shadow-sm relative mx-auto sm:mx-0">
                 {activeGallery.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeGallery[activeImageIndex]} alt={activeProductData.title} className="w-full h-full object-cover transition-opacity duration-300" />
                 ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">No Image</div>
                 )}
              </div>

              {activeGallery.length > 1 && (
                <div className="flex gap-2 mt-3 mb-5 mx-auto sm:mx-0 justify-center sm:justify-start">
                  {activeGallery.slice(0, 4).map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-[#4e080f] shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img as string} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                </div>
              )}
              {!(activeGallery.length > 1) && <div className="mb-5"></div>}
              
              <h2 className="text-2xl font-light text-gray-900 mb-1 text-center sm:text-left">{activeProductData.designCode}</h2>
              <p className="text-sm text-gray-500 mb-4 text-center sm:text-left">{activeProductData.title}</p>
              
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-medium text-[#4e080f]">{formatPrice(activePrice)}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">/ Unit Base</span>
                </div>
                <button 
                  onClick={() => setShowPricingBreakup(true)}
                  className="text-[9px] text-[#4e080f] font-bold uppercase tracking-widest mt-2 border-b border-[#4e080f]/30 pb-0.5 hover:border-[#4e080f] transition-all"
                >
                  View Pricing Breakup
                </button>
              </div>
            </div>

            <div className="px-8 pb-8 flex-1 border-t border-gray-50 pt-4 mt-2 z-10">
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-3 text-center sm:text-left">Cart Items ({selectedItems.length})</p>
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {selectedItems.map(sku => {
                  const isActive = activeMatrixSku === sku;
                  const displaySku = sku.replace('AJ-', ''); 
                  
                  const skuVariants = matrixQuantities[sku] || {};
                  const isFilled = Object.values(skuVariants).reduce((a: any, b: any) => a + b, 0) > 0;

                  let pillStyle = '';
                  if (isActive) {
                    pillStyle = 'bg-[#4e080f] border-[#4e080f] text-white shadow-md';
                  } else if (isFilled) {
                    pillStyle = 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100';
                  } else {
                    pillStyle = 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100';
                  }

                  return (
                    <div 
                      key={sku} 
                      id={`cart-pill-${sku}`}
                      onClick={() => setActiveMatrixSku(sku)}
                      className={`inline-flex items-center justify-between px-2 py-1 rounded-md cursor-pointer transition-all border ${pillStyle}`}
                    >
                      <div className="flex items-center gap-1.5 pr-1.5">
                        {!isActive && (
                          <div className={`w-1 h-1 rounded-full ${isFilled ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        )}
                        <span className="text-[9px] font-mono font-bold tracking-wide">{displaySku}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveSkuFromCart(sku); }} 
                        className={`flex-shrink-0 text-[8px] leading-none transition-colors ml-0.5 ${isActive ? 'text-white/60 hover:text-white' : (isFilled ? 'text-emerald-400 hover:text-emerald-700' : 'text-red-400 hover:text-red-700')}`}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT PANE */}
          <div className="w-full sm:w-[65%] bg-white flex flex-col h-full relative">
            
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-light text-gray-800">Purchase Order Matrix</h3>
              <button onClick={closeMatrix} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"><IconClose /></button>
            </div>

            <div className="flex-1 p-6 sm:p-8 overflow-y-auto overflow-x-hidden">
              <div className="w-full border border-gray-100 rounded-xl overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="py-2.5 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest w-24 sticky left-0 bg-gray-50 z-10 border-r border-gray-100">Purity \\ Size</th>
                      {sizes.map(s => <th key={s} className="py-2.5 px-2 text-[10px] font-bold text-gray-700 text-center">{s}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {purities.map(purity => (
                      <tr key={purity} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-2 px-4 text-[10px] font-bold text-gray-500 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50 z-10 border-r border-gray-100">{purity}</td>
                        {sizes.map(size => {
                          const variantKey = `${purity}_${size}`;
                          const qty = matrixQuantities[activeMatrixSku]?.[variantKey] || 0;
                          return (
                            <td key={size} className="py-1 px-1.5 text-center">
                              <input 
                                type="number" min="0" value={qty || ''} placeholder="0"
                                onChange={(e) => updateMatrixQty(activeMatrixSku, variantKey, parseInt(e.target.value) || 0)}
                                className={`w-16 h-9 mx-auto pr-1 text-center rounded-lg text-sm font-medium outline-none transition-all focus:ring-1 focus:ring-[#4e080f] ${
                                  qty > 0 
                                    ? 'bg-white border-2 border-[#4e080f] text-[#4e080f] shadow-sm' 
                                    : 'bg-transparent border border-gray-200 text-gray-900 hover:border-gray-300 focus:border-[#4e080f]'
                                }`} 
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-5 px-6 sm:px-8 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0 mt-auto w-full">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Global Value</p>
                <p className="text-2xl font-light text-gray-900 leading-none">
                  {formatPrice(totalMatrixValue)} <span className="text-xs font-medium text-gray-500 ml-1">({totalMatrixUnits} units)</span>
                </p>
              </div>
              <div className="flex w-full sm:w-auto gap-3">
                <button 
                  onClick={handleSaveDraft}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                >
                  Save to Draft
                </button>
                <button 
                  onClick={() => submitGlobalPO()}
                  className="flex-1 sm:flex-none px-8 py-3 bg-[#4e080f] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#3a060b] transition-all shadow-md"
                >
                  {isSubmitting ? 'Validating...' : 'Add to Global PO'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* EXTERNAL RIGHT ARROW */}
        <div className="w-10 md:w-14 shrink-0 flex justify-center">
          {selectedItems.length > 1 && !checkoutSuccess.status && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleNextSku(); }} 
              disabled={activeIndex === selectedItems.length - 1} 
              className="hidden md:flex w-14 h-14 rounded-full bg-[#1a1a1a] border border-[#333] text-white items-center justify-center hover:bg-[#333] disabled:opacity-0 transition-all shadow-xl"
            >
              <IconChevronRight />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
