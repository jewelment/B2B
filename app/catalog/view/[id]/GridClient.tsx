'use client';

import React, { useState, useRef, useEffect } from 'react';
import AdvancedMatrixModal from '@/components/AdvancedMatrixModal';
import BrandLogo from '@/components/BrandLogo';

import { useCartStore } from '@/store/useCartStore';

// --- Icons ---
const IconDownload = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconShare = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconLock = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconClose = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconChevronLeft = () => <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>;
const IconSuccess = () => <svg className="w-12 h-12 text-[#4e080f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconBook = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;

export default function GridClient({ catalog }: { catalog: any }) {
  const config = catalog.configuration || {};

  // App State
  const [isUnlocked, setIsUnlocked] = useState(!config.password);
  const [passInput, setPassInput] = useState('');
  const [clientTheme, setClientTheme] = useState<'LIGHT' | 'DARK'>(config.theme || 'LIGHT');

  // Global Store State
  const { selectedItems, toggleSelection, matrixQuantities } = useCartStore();

  // Local Matrix UI State
  const [showPOMatrix, setShowPOMatrix] = useState(false);
  const [activeMatrixSku, setActiveMatrixSku] = useState<string | null>(null);

  const cartScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMatrixSku && cartScrollRef.current) {
      const activeEl = document.getElementById(`cart-pill-${activeMatrixSku}`);
      if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeMatrixSku]);

  const handlePORequest = () => {
    if (selectedItems.length > 0) {
      setActiveMatrixSku(selectedItems[0]);
      setShowPOMatrix(true);
    }
  };

  const closeMatrix = () => {
    setShowPOMatrix(false);
  };

  const formatPrice = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  // --- SECURITY GATEKEEPER VIEW ---
  if (config.password && !isUnlocked) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6 animate-in fade-in duration-500 font-sans">
        <style>{`::selection { background-color: var(--brand-primary); color: var(--brand-text); }`}</style>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] max-w-sm w-full p-10 rounded-3xl text-center shadow-2xl">
          <div className="w-16 h-16 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full flex items-center justify-center mx-auto mb-6"><IconLock /></div>
          <h1 className="text-xl text-[var(--text-main)] font-light tracking-widest uppercase mb-2">Secure Grid</h1>
          <p className="text-[10px] text-[var(--text-muted)] mb-8 uppercase tracking-widest">Password Protected Showcase</p>
          <input
            type="password" placeholder="ENTER SECURE PIN" value={passInput} onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { if (passInput === config.password) setIsUnlocked(true); else alert("Incorrect Password."); } }}
            className="w-full px-4 py-4 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] text-center tracking-[0.3em] text-sm focus:border-[var(--brand-primary)] outline-none mb-4 transition-colors"
          />
          <button onClick={() => { if (passInput === config.password) setIsUnlocked(true); else alert("Incorrect Password."); }} className="w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:opacity-90 active:scale-95 transition-all bg-[var(--brand-primary)] text-[var(--brand-text)]">
            Unlock Showcase
          </button>
        </div>
      </div>
    );
  }

  const isDark = clientTheme === 'DARK';
  const themeClasses = {
    bg: isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8f9fa]',
    textMain: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    cardBg: isDark ? 'bg-[#141414] border-[#222]' : 'bg-white border-gray-200',
    floatingNav: isDark ? 'bg-black/80 border-[#333]' : 'bg-white/90 border-gray-200'
  };

  const purities = ['18K YELLOW GOLD', '18K ROSE GOLD', '14K WHITE GOLD'];
  const sizes = ['Ring 5', 'Ring 6', 'Ring 7', 'Ring 8', 'Ring 9'];

  let totalMatrixUnits = 0;
  let totalMatrixValue = 0;
  if (matrixQuantities) {
    Object.entries(matrixQuantities).forEach(([sku, variants]) => {
      const pData = catalog.items.find((i: any) => i.product && i.product.designCode === sku)?.product;
      Object.values(variants).forEach(qty => {
        totalMatrixUnits += qty;
        totalMatrixValue += qty * (pData?.estimatedPrice || pData?.price || 0);
      });
    });
  }

  const activeProductData = catalog.items.find((i: any) => i.product && i.product.designCode === activeMatrixSku)?.product;
  const showPricing = !config.hidePricing;

  return (
    <div className={`min-h-screen ${themeClasses.bg} selection:bg-[var(--brand-primary)] selection:text-white pb-32 transition-colors duration-700`}>

      {/* Floating Theme Toggle */}
      <button
        onClick={() => setClientTheme(isDark ? 'LIGHT' : 'DARK')}
        className={`fixed top-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border shadow-lg transition-all ${isDark ? 'bg-white/10 border-white/20 text-yellow-300 hover:bg-white/20 hover:rotate-12' : 'bg-black/10 border-black/20 text-gray-800 hover:bg-black/20 hover:-rotate-12'}`}
        title="Toggle Theme"
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )}
      </button>

      {/* Immersive Cover Block */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <img src={isDark ? "/images/Catlog_BG_Dark.jpg" : "/images/Catlog_BG_Light.jpg"} alt="Cover Background" className="w-full h-full object-cover scale-105 opacity-60 transition-all duration-700" />
          <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent' : 'bg-gradient-to-t from-[#f8f9fa] via-white/60 to-transparent'}`}></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-8 flex justify-center transition-opacity duration-700">
            <BrandLogo
              theme={isDark ? 'DARK' : 'LIGHT'}
              variant="FULL"
              width={200}
              height={70}
              tenantId={catalog.tenantId}
              settings={catalog.storeSettings}
            />
          </div>
          <p className={`text-[10px] md:text-xs font-bold tracking-[0.4em] ${isDark ? 'text-amber-200/80' : 'text-[#4e080f]'} uppercase mb-6 transition-colors duration-700`}>Private B2B Showcase</p>
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-light ${themeClasses.textMain} tracking-tight leading-tight mb-6 transition-colors duration-700`}>
            {catalog.name}
          </h1>
          {catalog.clientId && (
            <p className={`text-sm md:text-base ${themeClasses.textMuted} tracking-wide font-medium transition-colors duration-700`}>
              <span className={themeClasses.textMain}>{catalog.clientId}</span>
            </p>
          )}

          <div className="mt-12 flex items-center justify-center gap-4">
            <button className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-black/5 border-black/10 text-black hover:bg-black/10'}`} title="Share Internally">
              <IconShare />
            </button>
            <button
              onClick={() => window.open(`/api/catalog/${catalog.id}/pdf`, '_blank')}
              className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 backdrop-blur-md border transition-all duration-500 ${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-black/5 border-black/10 text-black hover:bg-black/10'}`}
              title="Download PDF"
            >
              <IconDownload /> Export PDF
            </button>
            <button
              onClick={() => window.location.href = `/catalog/flipbook/${catalog.id}`}
              className={`px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 backdrop-blur-md border transition-all duration-500 bg-[var(--brand-primary)] border-[var(--brand-primary)] text-[var(--brand-text)] hover:opacity-90 shadow-xl shadow-[var(--brand-primary)]/20`}
              title="Open Flipbook Mode"
            >
              <IconBook /> View Flipbook
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16">
        <div className="flex justify-between items-end mb-10">
          <h2 className={`text-sm font-bold uppercase tracking-[0.2em] ${themeClasses.textMuted}`}>Curation Payload ({catalog.items.filter((i: any) => i.product).length} Designs)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {catalog.items.map((item: any, idx: number) => {
            const product = item.product;
            if (!product) return null;

            const isSelected = selectedItems.includes(product.designCode);
            const imgIndex = config.preferredImageIndex || 0;
            const productImg = (product.media && product.media.length > imgIndex) ? product.media[imgIndex].url : (product.media && product.media.length > 0 ? product.media[0].url : product.mainImage);

            return (
              <div
                key={product.designCode}
                className={`group relative flex flex-col ${themeClasses.cardBg} border rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isSelected ? 'ring-2 ring-[#4e080f] border-[#4e080f]' : ''}`}
                style={{ animationDelay: `${(idx % 12) * 50}ms` }}
              >
                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-20 w-8 h-8 bg-[#4e080f] text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                    <IconCheck />
                  </div>
                )}

                {/* Product Image */}
                <div className="relative aspect-square bg-white overflow-hidden cursor-pointer" onClick={() => toggleSelection(product.designCode)}>
                  <img src={productImg || product.description} alt={product.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out p-4" />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white/20 transition-colors">
                      {isSelected ? 'Remove Selection' : 'Select for PO'}
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <p className={`text-[10px] font-mono tracking-widest ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{product.designCode}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-[#4e080f]/10 text-[#4e080f]'}`}>{product.metalPurity || '18KT'}</span>
                  </div>
                  <h3 className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate mb-4`}>{product.title}</h3>
                  <div className="mt-auto flex justify-between items-end">
                    <div>
                      <p className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>B2B Est. Value</p>
                      <p className={`text-lg font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatPrice(product.estimatedPrice || product.price || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${selectedItems.length > 0 && !showPOMatrix ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className={`${themeClasses.floatingNav} backdrop-blur-xl border rounded-full px-4 py-3 shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-10`}>
          <div className="pl-4">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${themeClasses.textMuted}`}>Selections Ready</p>
            <p className={`text-sm font-semibold ${themeClasses.textMain}`}>{selectedItems.length} SKUs added</p>
          </div>
          <button
            onClick={handlePORequest}
            style={{ backgroundColor: '#4e080f', color: '#ffffff' }}
            className="px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest rounded-full hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
          >
            Review Purchase Order Matrix
          </button>
        </div>
      </div>

      {/* MATRIX MODAL */}
      {showPOMatrix && activeProductData && (
        <AdvancedMatrixModal
          products={catalog.items.map((i: any) => i.product)}
          activeMatrixSku={activeMatrixSku!}
          setActiveMatrixSku={setActiveMatrixSku}
          closeMatrix={closeMatrix}
          catalogId={catalog.id}
          clientId={catalog.clientId}
        />
      )}

    </div>
  );
}
