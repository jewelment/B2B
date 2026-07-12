'use client';

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import AdvancedMatrixModal from '@/components/AdvancedMatrixModal';

// --- SVGs ---
const IconClose = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconCart = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const IconLock = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconSuccess = () => <svg className="w-12 h-12 text-[#4e080f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconChevronLeft = () => <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>;
const IconDownload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

const Page = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  return (
    <div className="page bg-white shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] overflow-hidden" ref={ref}>
      <div className="w-full h-full flex flex-col relative">
        <div className={`absolute top-0 bottom-0 w-12 z-50 pointer-events-none ${props.number % 2 === 0 ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/30 via-black/5 to-transparent opacity-60`}></div>
        {props.children}
      </div>
    </div>
  );
});
Page.displayName = 'Page';

export default function FlipbookClient({ catalog }: { catalog: any }) {
  const config = catalog.configuration || {};
  
  // App State
  const [isUnlocked, setIsUnlocked] = useState(!config.password);
  const [passInput, setPassInput] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // PO MATRIX STATE
  const [showPOMatrix, setShowPOMatrix] = useState(false);
  const [activeMatrixSku, setActiveMatrixSku] = useState<string | null>(null);
  const [matrixQuantities, setMatrixQuantities] = useState<Record<string, Record<string, number>>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<{status: boolean, poNumber: string}>({ status: false, poNumber: '' });

  const bookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const cartScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMatrixSku && cartScrollRef.current) {
      const activeEl = document.getElementById(`cart-pill-${activeMatrixSku}`);
      if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeMatrixSku]);

  const handleToggleCart = (code: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSelectedItems(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);
  };

  const handlePORequest = () => {
    if (selectedItems.length > 0) {
      setActiveMatrixSku(selectedItems[0]);
      setShowPOMatrix(true);
    }
  };

  const onPageFlip = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio blocked', e));
    }
  };

  const closeMatrix = () => {
    setShowPOMatrix(false);
  };

  const handleRemoveSkuFromCart = (targetSku: string) => {
    const newSelected = selectedItems.filter(s => s !== targetSku);
    setSelectedItems(newSelected);
    
    const newQuantities = { ...matrixQuantities };
    delete newQuantities[targetSku];
    setMatrixQuantities(newQuantities);

    if(newSelected.length === 0) setShowPOMatrix(false);
    else if(activeMatrixSku === targetSku) setActiveMatrixSku(newSelected[0]); 
  };

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // --- SECURITY GATEKEEPER VIEW ---
  if (config.password && !isUnlocked) {
    return (      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 animate-in fade-in duration-500 font-sans">
        <style>{`::selection { background-color: var(--brand-primary); color: var(--brand-text); }`}</style>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] max-w-sm w-full p-10 rounded-3xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-xl text-[var(--text-main)] font-light tracking-widest uppercase mb-2">Secure Showcase</h1>
          <p className="text-[10px] text-[var(--text-muted)] mb-8 uppercase tracking-widest">Password Protected Flipbook</p>
          <input 
            type="password" placeholder="ENTER SECURE PIN" value={passInput} onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { if (passInput === config.password) setIsUnlocked(true); else alert("Incorrect Password."); } }}
            className="w-full px-4 py-4 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] text-center tracking-[0.3em] text-sm focus:border-[var(--brand-primary)] outline-none mb-4 transition-colors" 
          />
          <button onClick={() => { if (passInput === config.password) setIsUnlocked(true); else alert("Incorrect Password."); }} className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:opacity-90 active:scale-95 transition-all bg-[var(--brand-primary)] text-[var(--brand-text)]">
            Unlock Catalog
          </button>
        </div>
      </div>
    );
  }

  // --- BUILD PAGES ---
  const isDark = config.theme === 'DARK';
  const showPricing = !config.hidePricing;
  const pages: any[] = [{ type: 'COVER', img: config.frontCover || 'https://images.unsplash.com/photo-1599643478514-4a4e09b52342?w=1200&q=80', title: catalog.name }];

  let insertIndex = 0;
  catalog.items.forEach((item: any, i: number) => {
    if (config.lifestyleInserts && config.lifestyleInserts[insertIndex] && i > 0 && i % 4 === 0) {
      pages.push({ type: 'INSERT', img: config.lifestyleInserts[insertIndex] });
      insertIndex++;
    }
    // Only push if the product data successfully mapped from the Master Inventory
    if (item.product) {
      pages.push({ type: 'PRODUCT', data: item.product });
    }
  });

  pages.push({ type: 'COVER', img: config.backCover || 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&q=80', title: 'Ashok Jewels Fine Wholesale' });
  if (pages.length % 2 !== 0) pages.push({ type: 'BLANK' });

  // Get active product data dynamically from the enriched catalog items
  const activeProductData = catalog.items.find((i: any) => i.designCode === activeMatrixSku)?.product;
  const purities = ['18K YELLOW GOLD', '18K ROSE GOLD', '14K WHITE GOLD'];
  const sizes = ['Ring 5', 'Ring 6', 'Ring 7', 'Ring 8', 'Ring 9'];

  let totalMatrixUnits = 0;
  let totalMatrixValue = 0;
  if (matrixQuantities) {
    Object.entries(matrixQuantities).forEach(([sku, variants]) => {
      const pData = catalog.items.find((i: any) => i.designCode === sku)?.product;
      Object.values(variants).forEach(qty => {
        totalMatrixUnits += qty;
        totalMatrixValue += qty * (pData?.estimatedPrice || 0);
      });
    });
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#050505]' : 'bg-[#e5e5e5]'} flex flex-col items-center justify-center overflow-hidden font-sans`}>
      <style>{`::selection { background-color: #4e080f; color: white; }`}</style>
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2361/2361-preview.mp3" preload="auto"></audio>

      <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-40">
        <div className="flex flex-col">
          <span className={`text-[10px] font-bold tracking-[0.3em] uppercase ${isDark ? 'text-[#4e080f]' : 'text-gray-500'}`}>Ashok Jewels</span>
          <span className={`text-xs ${isDark ? 'text-white' : 'text-black'} tracking-widest uppercase mt-1`}>{catalog.name}</span>
        </div>
        <div className="flex items-center gap-4">
          
          {/* CRITICAL FIX: Pointed the Export URL to /pdf instead of /export */}
          <button 
            onClick={() => window.open(`/api/catalog/${catalog.id}/pdf`, '_blank')}
            className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all ${isDark ? 'bg-black/50 border-white/20 text-white hover:bg-white/10' : 'bg-white/50 border-black/20 text-black hover:bg-black/5'} flex items-center gap-2`}
          >
            <IconDownload /> Export PDF / CSV
          </button>
          
          <button onClick={() => window.close()} className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/20' : 'bg-black/5 border-black/10 text-black hover:bg-black/10'}`}>
            <IconClose />
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex items-center justify-center pt-10 perspective-[2000px]">
        {/* @ts-ignore */}
        <HTMLFlipBook width={450} height={636} size="stretch" minWidth={315} maxWidth={1000} minHeight={400} maxHeight={1533} maxShadowOpacity={0.6} showCover={true} mobileScrollSupport={true} onFlip={onPageFlip} className="shadow-2xl" ref={bookRef}>
          {pages.map((page, index) => (
            <Page key={index} number={index}>
              {page.type === 'COVER' && (
                <div className="w-full h-full relative bg-[#111]">
                  <img src={page.img} className="w-full h-full object-cover opacity-60 mix-blend-overlay" alt="Cover" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-t from-black/80 via-transparent to-transparent">
                    <h1 className="text-3xl lg:text-4xl text-white font-light tracking-[0.2em] uppercase leading-relaxed">{page.title}</h1>
                    {index === 0 && <p className="text-[10px] text-[#4e080f] font-bold tracking-[0.4em] uppercase mt-6 border-b border-[#4e080f] pb-2">Confidential Line Sheet</p>}
                  </div>
                </div>
              )}
              {page.type === 'INSERT' && (
                <div className="w-full h-full relative bg-[#0a0a0a]">
                  <img src={page.img} className="w-full h-full object-cover" alt="Lifestyle Insert" />
                </div>
              )}
              {page.type === 'PRODUCT' && (
                <div className={`w-full h-full flex flex-col p-8 lg:p-12 ${isDark ? 'bg-[#141414] text-white' : 'bg-[#fafafa] text-gray-900'}`}>
                  <div className="flex justify-between items-start mb-6 border-b border-gray-500/20 pb-4">
                    <div>
                      <p className={`text-[10px] font-mono tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{page.data.designCode}</p>
                      <h2 className="text-lg lg:text-xl font-medium tracking-wide mt-1">{page.data.title}</h2>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest border border-[#4e080f] text-[#4e080f] px-2 py-1 rounded">
                      {page.data.metalPurity || '18KT'}
                    </span>
                  </div>
                  <div className="flex-1 relative bg-white rounded-xl overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] mb-6 cursor-pointer" onClick={() => bookRef.current?.pageFlip().flipNext()}>
                    <img src={page.data.mainImage || page.data.render8k || page.data.description} className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 hover:scale-105" alt={page.data.title} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>IGI Certification</p>
                      <p className="text-xs font-mono tracking-wider">{page.data.igiCertNumber || 'Uncertified'}</p>
                    </div>
                    {showPricing && (
                      <div className="text-right">
                        <p className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Est. Wholesale Value</p>
                        <p className="text-lg font-light text-[#4e080f]">{formatPrice(page.data.estimatedPrice)}</p>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={(e) => handleToggleCart(page.data.designCode, e)}
                    style={selectedItems.includes(page.data.designCode) ? { backgroundColor: '#4e080f', color: '#ffffff', borderColor: '#4e080f' } : {}}
                    className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-all ${selectedItems.includes(page.data.designCode) ? 'shadow-lg border border-transparent' : `border ${isDark ? 'border-white/20 hover:bg-white/10 text-white' : 'border-black/20 hover:bg-black/5 text-black'}`}`}
                  >
                    {selectedItems.includes(page.data.designCode) ? '✓ Staged for PO' : '+ Add to Allocation'}
                  </button>
                </div>
              )}
              {page.type === 'BLANK' && <div className={`w-full h-full ${isDark ? 'bg-[#111]' : 'bg-[#fafafa]'}`}></div>}
            </Page>
          ))}
        </HTMLFlipBook>
      </div>

      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${selectedItems.length > 0 && !showPOMatrix ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className={`backdrop-blur-xl border rounded-full px-5 py-3 shadow-2xl flex items-center gap-6 ${isDark ? 'bg-black/80 border-[#333]' : 'bg-white/90 border-gray-200'}`}>
          <div className="flex items-center gap-3 pl-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#4e080f', color: '#ffffff' }}>
              <IconCart />
            </div>
            <div>
              <p className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Current Selection</p>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{selectedItems.length} SKUs Staged</p>
            </div>
          </div>
          <button 
            onClick={handlePORequest} 
            style={{ backgroundColor: '#4e080f', color: '#ffffff' }}
            className="px-8 py-3 text-[10px] whitespace-nowrap font-bold uppercase tracking-widest rounded-full hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            {config.poMatrix ? 'Review Pricing Breakup' : 'Request Direct PO'}
          </button>
        </div>
      </div>

      {/* MATRIX MODAL */}
      {showPOMatrix && activeProductData && (
        <AdvancedMatrixModal
          products={catalog.items.map((i: any) => i.product)}
          selectedItems={selectedItems}
          activeMatrixSku={activeMatrixSku!}
          setActiveMatrixSku={setActiveMatrixSku}
          matrixQuantities={matrixQuantities}
          setMatrixQuantities={setMatrixQuantities}
          handleRemoveSkuFromCart={handleRemoveSkuFromCart}
          closeMatrix={closeMatrix}
          catalogId={catalog.id}
          clientId={catalog.clientId}
        />
      )}
    </div>
  );
}