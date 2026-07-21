'use client';

import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import AdvancedMatrixModal from '@/components/AdvancedMatrixModal';
import { useCartStore } from '@/store/useCartStore';

// --- Consistent High-Quality Icons ---
const IconClose = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconCart = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const IconLock = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconChevronLeft = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>;
const IconDownload = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconZoomIn = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>;
const IconZoomOut = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>;
const IconFullscreen = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3.75v5.25m0-5.25h5.25m-5.25 0L9 9m11.25-5.25v5.25m0-5.25h-5.25m5.25 0L15 9m-11.25 11.25v-5.25m0 5.25h5.25m-5.25 0L9 15m11.25 5.25v-5.25m0 5.25h-5.25m5.25 0L15 15" /></svg>;
const IconMinimize = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9V3.75M9 9H3.75M9 9L3.75 3.75M9 15v5.25M9 15H3.75M9 15l-5.25 5.25M15 9h5.25M15 9V3.75M15 9l5.25-5.25M15 15h5.25M15 15v5.25m0-5.25l5.25 5.25" /></svg>;

const Page = React.forwardRef<HTMLDivElement, any>((props, ref) => {
  const isRightPage = props.number % 2 === 0;
  const isCover = props.isCover;

  // This CSS adds the stacked border effect to simulate the physical thickness of remaining pages
  const thicknessShadow = isRightPage
    ? (isCover ? '2px 2px 5px rgba(0,0,0,0.6)' : '1px 1px 0px #e0e0e0, 2px 2px 0px #ffffff, 3px 3px 0px #e0e0e0, 4px 4px 0px #ffffff, 5px 5px 0px #d0d0d0, 6px 6px 8px rgba(0,0,0,0.3)')
    : (isCover ? '-2px 2px 5px rgba(0,0,0,0.6)' : '-1px 1px 0px #e0e0e0, -2px 2px 0px #ffffff, -3px 3px 0px #e0e0e0, -4px 4px 0px #ffffff, -5px 5px 0px #d0d0d0, -6px 6px 8px rgba(0,0,0,0.3)');

  return (
    <div className={`page overflow-hidden bg-white`} style={{ boxShadow: thicknessShadow }} ref={ref}>
      <div className={`w-full h-full flex flex-col relative`}>

        {/* Very subtle spine definition - avoiding heavy gradients that break during 3D flip animation */}
        {!isCover && <div className={`absolute top-0 bottom-0 w-8 z-50 pointer-events-none ${isRightPage ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'} from-black/10 to-transparent opacity-50`}></div>}

        {/* Paper texture for inner pages */}
        {!isCover && <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-20 z-10 mix-blend-multiply"></div>}

        <div className={`w-full h-full bg-white`}>
          {props.children}
        </div>
      </div>
    </div>
  );
});
Page.displayName = 'Page';

const ProductImage = ({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [error, setError] = React.useState(false);
  
  if (!src || error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/5 rounded-xl border-2 border-dashed border-black/10">
        <svg className="w-10 h-10 text-black/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 3h12l4 6-10 13L2 9ZM11 3L8 9l4 13 4-13-3-6M2 9h20"></path>
        </svg>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
};

export default function FlipbookClient({ catalog }: { catalog: any }) {
  const config = catalog.configuration || {};

  const [isUnlocked, setIsUnlocked] = useState(!config.password);
  const [passInput, setPassInput] = useState('');
  const { selectedItems, toggleSelection, removeSelection, matrixQuantities, setMatrixQuantities, clearCart } = useCartStore();
  const [currentPage, setCurrentPage] = useState(0);

  // LIVE PREVIEW HYDRATION
  const [previewConfig, setPreviewConfig] = useState<any>(config);
  const [previewCatalog, setPreviewCatalog] = useState<any>(catalog);

  // --- TELEMETRY ENGINE ---
  const sendTelemetry = (eventType: string, eventData?: any) => {
    // Only track if it's a real catalog (not preview)
    if (catalog.id === 'preview') return;
    
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        catalogId: catalog.id,
        eventType,
        eventData
      })
    }).catch(err => console.error('Telemetry failed:', err));
  };

  useEffect(() => {
    // Log initial view
    sendTelemetry('CATALOG_VIEW');
  }, []);

  useEffect(() => {
    if (catalog.id === 'preview') {
      try {
        const stored = localStorage.getItem('flipbook_preview_data');
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreviewConfig(parsed.config || {});
          setPreviewCatalog(parsed.catalog || { id: 'preview', items: [] });
          setIsUnlocked(!parsed.config?.password);
        }
      } catch (e) {
        console.error('Failed to load preview data', e);
      }
    }
  }, [catalog.id]);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isPortrait = previewConfig.orientation === 'LANDSCAPE' 
    ? false 
    : (previewConfig.orientation === 'PORTRAIT' 
      ? true 
      : (windowDimensions.height > windowDimensions.width && windowDimensions.width < 1024));


  const [showPOMatrix, setShowPOMatrix] = useState(false);
  const [activeMatrixSku, setActiveMatrixSku] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<{ status: boolean, poNumber: string }>({ status: false, poNumber: '' });

  const bookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const cartScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeMatrixSku && cartScrollRef.current) {
      const activeEl = document.getElementById(`cart-pill-${activeMatrixSku}`);
      if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeMatrixSku]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Keyboard Shortcuts for page flipping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!bookRef.current) return;
      if (e.key === 'ArrowRight') {
        bookRef.current.pageFlip().flipNext();
      } else if (e.key === 'ArrowLeft') {
        bookRef.current.pageFlip().flipPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleCart = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelection(code);
    if (!selectedItems.includes(code)) {
      sendTelemetry('ADD_TO_CART', { designCode: code });
    }
  };

  const handlePORequest = () => {
    if (selectedItems.length > 0) {
      setActiveMatrixSku(selectedItems[0]);
      setShowPOMatrix(true);
    }
  };

  const onPageFlip = (e: any) => {
    setCurrentPage(e.data);
    sendTelemetry('PAGE_TURN', { pageNumber: e.data });
    if (audioRef.current) {
      audioRef.current.src = '/dflip/sound/turn2.mp3';
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio blocked', e));
    }
  };

  const closeMatrix = () => {
    setShowPOMatrix(false);
  };

  const handleRemoveSkuFromCart = (targetSku: string) => {
    removeSelection(targetSku);
    const newSelected = selectedItems.filter(s => s !== targetSku);

    if (newSelected.length === 0) setShowPOMatrix(false);
    else if (activeMatrixSku === targetSku) setActiveMatrixSku(newSelected[0]);
  };

  const formatPrice = (amount: number) => {
    if (!amount || amount === 0) return 'Price on Request';
    return `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;
  };

  // If password protected and not unlocked yet
  if (!isUnlocked) {
    return (
      <div className={`h-screen overflow-hidden flex items-center justify-center ${previewConfig.theme === 'DARK' ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'} p-4`}>
        <div className={`max-w-md w-full p-8 rounded-2xl shadow-2xl border ${previewConfig.theme === 'DARK' ? 'bg-[#111] border-[#333]' : 'bg-white border-gray-200'} text-center`}>
          <div className="w-16 h-16 rounded-full bg-[#4e080f]/10 text-[#4e080f] flex items-center justify-center mx-auto mb-6">
            <IconLock />
          </div>
          <h2 className={`text-2xl font-light mb-2 ${previewConfig.theme === 'DARK' ? 'text-white' : 'text-gray-900'}`}>Restricted Access</h2>
          <p className={`text-sm mb-8 ${previewConfig.theme === 'DARK' ? 'text-gray-400' : 'text-gray-500'}`}>Please enter your secure PIN to view this catalog.</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={passInput}
              onChange={e => setPassInput(e.target.value)}
              placeholder="Enter PIN"
              className={`flex-1 px-4 py-3 rounded-xl border text-center font-mono text-lg tracking-widest focus:ring-2 focus:ring-[#4e080f] outline-none ${previewConfig.theme === 'DARK' ? 'bg-[#222] border-[#444] text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
            />
            <button
              onClick={() => {
                if (passInput === previewConfig.password) setIsUnlocked(true);
                else alert('Incorrect PIN');
              }}
              className="px-6 rounded-xl bg-[#4e080f] text-white font-bold uppercase tracking-widest text-sm hover:opacity-90"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Determine dark mode
  const isDark = previewConfig.theme === 'DARK';
  const showPricing = previewConfig.hidePricing !== true;

  // Build Pages Array based on previewConfig
  const pages: any[] = [];
  
  const DEFAULT_COVER = '/images/peakpx.jpg';
  const isDefaultFront = !previewConfig.frontCover;
  const isDefaultBack = !previewConfig.backCover;

  pages.push({ 
    type: 'COVER', 
    img: previewConfig.frontCover || DEFAULT_COVER, 
    title: previewCatalog.name || 'Digital Catalog',
    objectPosition: isDefaultFront ? 'left center' : 'center'
  });
  
  // 1. Load products sequentially or chunked based on itemsPerPage
  const prefImgIdx = Number(previewConfig.preferredImageIndex || 0);
  const getProductImage = (p: any) => {
    if (!p.media || p.media.length === 0) return null;
    
    const targetSeq = prefImgIdx + 1;
    
    // 1. Exact match by sequence
    const exact = p.media.find((m: any) => m.sequence === targetSeq);
    if (exact && exact.url) return exact.url;
    
    // 2. User's specific fallback logic (Image 2 -> Image 3 -> Image 1)
    if (targetSeq === 2) {
      const fallback3 = p.media.find((m: any) => m.sequence === 3);
      if (fallback3 && fallback3.url) return fallback3.url;
      const fallback1 = p.media.find((m: any) => m.sequence === 1);
      if (fallback1 && fallback1.url) return fallback1.url;
    } else if (targetSeq === 3) {
      const fallback2 = p.media.find((m: any) => m.sequence === 2);
      if (fallback2 && fallback2.url) return fallback2.url;
      const fallback1 = p.media.find((m: any) => m.sequence === 1);
      if (fallback1 && fallback1.url) return fallback1.url;
    }
    
    // 3. Absolute fallback
    return p.media[0].url;
  };

  const rawDesktop = previewConfig.desktopItemsPerPage !== undefined ? previewConfig.desktopItemsPerPage : previewCatalog.desktopItemsPerPage !== undefined ? previewCatalog.desktopItemsPerPage : 4;
  const rawMobile = previewConfig.mobileItemsPerPage !== undefined ? previewConfig.mobileItemsPerPage : previewCatalog.mobileItemsPerPage !== undefined ? previewCatalog.mobileItemsPerPage : 1;
  const itemsPerPage = Number(isPortrait ? rawMobile : rawDesktop);
  
  const productItems = previewCatalog.items?.filter((i: any) => i.product) || [];

  let i = 0;
  let patternIndex = 0;
  const pattern = [1, 4, 4]; // Only 1 and 4 allowed!

  while (i < productItems.length) {
    const remaining = productItems.length - i;
    let take = itemsPerPage;

    if (itemsPerPage === 0) { // Smart Auto-Align
      take = pattern[patternIndex % pattern.length];
      patternIndex++;
    }

    // Force fallback to 1 if we need 4 but don't have enough to form a complete grid
    if (take > 1 && remaining < take) {
      take = 1;
    }

    const chunk = productItems.slice(i, i + take).map((item: any) => item.product);

    if (take === 1) {
      pages.push({ type: 'PRODUCT', data: chunk[0] });
    } else {
      pages.push({ type: 'PRODUCT_GRID', data: chunk, itemsPerPage: 4 });
    }

    i += take;
  }

  // 2. Splice in promotional pages at exact defined positions
  if (previewConfig.lifestyleInserts && Array.isArray(previewConfig.lifestyleInserts)) {
    // Sort descending by position so splicing doesn't shift the indices for subsequent inserts
    const inserts = [...previewConfig.lifestyleInserts].sort((a: any, b: any) => {
      const posA = typeof a === 'object' ? a.position : 0;
      const posB = typeof b === 'object' ? b.position : 0;
      return posB - posA;
    });

    inserts.forEach((insert: any) => {
      const position = typeof insert === 'object' ? insert.position : 0;
      const image = typeof insert === 'object' ? insert.image : insert;
      
      // Ensure position is at least 1 so it never overwrites the front cover (index 0)
      const clampedPosition = Math.max(1, position);
      // Index offset +1 accounts for the Cover (so position 1 = after 1st product)
      const spliceIndex = Math.min(clampedPosition + 1, pages.length);
      pages.splice(spliceIndex, 0, { type: 'INSERT', img: image });
    });
  }


  if (pages.length % 2 === 0) pages.push({ type: 'BLANK' }); // Force ODD page count before back cover so it lands on LEFT
  pages.push({ 
    type: 'COVER', 
    img: previewConfig.backCover || DEFAULT_COVER, 
    title: previewConfig.backCoverText || 'Ashok Jewels Fine Wholesale',
    objectPosition: isDefaultBack ? 'right center' : 'center'
  });

  const activeProductData = previewCatalog.items?.find((i: any) => i.designCode === activeMatrixSku)?.product;

  let totalMatrixUnits = 0;
  let totalMatrixValue = 0;
  if (matrixQuantities) {
    Object.entries(matrixQuantities).forEach(([sku, variants]) => {
      const pData = previewCatalog.items.find((i: any) => i.designCode === sku)?.product;
      Object.values(variants).forEach(qty => {
        totalMatrixUnits += qty;
        totalMatrixValue += qty * (pData?.estimatedPrice || 0);
      });
    });
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const getBackgroundStyle = () => {
    switch (previewConfig.viewerBackground) {
      case 'WOOD': return { backgroundColor: '#2a1b12', backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' };
      case 'MARBLE': return { backgroundColor: '#1a1a1a', backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-marble.png")' };
      case 'SLATE': return { backgroundColor: '#2c3e50' };
      case 'VELVET': return { backgroundColor: '#4e080f', backgroundImage: 'url("https://www.transparenttextures.com/patterns/diagmonds-light.png")' };
      case 'UNSPLASH_BED': return { backgroundImage: 'url("https://images.unsplash.com/photo-1543751416-705d3e34d02a?auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'UNSPLASH_BROWN_WOOD': return { backgroundImage: 'url("https://images.unsplash.com/photo-1621295693450-080546d2ec8e?auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'UNSPLASH_PARQUET': return { backgroundImage: 'url("https://images.unsplash.com/photo-1576092762791-dd9e2220abd1?auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'UNSPLASH_METAL': return { backgroundImage: 'url("https://images.unsplash.com/photo-1781877621630-5a6497bea75d?auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'UNSPLASH_WHITE_LINES': return { backgroundImage: 'url("https://images.unsplash.com/photo-1756758933069-411ca6f96b1a?auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'UNSPLASH_BLUR': return { backgroundImage: 'url("https://images.unsplash.com/photo-1719496175716-a62c78af1ee8?auto=format&fit=crop&w=2000&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' };
      default: return { background: isDark ? 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)' : 'radial-gradient(circle at center, #f5f5f5 0%, #d4d4d4 100%)' };
    }
  };

  return (
    <div className={`h-[100dvh] flex flex-col items-center justify-center overflow-hidden font-sans relative transition-all duration-500`}
      style={getBackgroundStyle()}
    >
      <style>{`
        ::selection { background-color: #4e080f; color: white; }
        ${currentPage === 0 ? '.stf__block--left { opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; box-shadow: none !important; }' : ''}
        ${currentPage >= pages.length - 2 ? '.stf__block--right { opacity: 0 !important; visibility: hidden !important; pointer-events: none !important; box-shadow: none !important; }' : ''}
        .stf__wrapper { filter: drop-shadow(0 30px 40px rgba(0, 0, 0, ${isDark ? 0.7 : 0.3})); }
      `}</style>
      <audio ref={audioRef} src="/dflip/sound/turn2.mp3" preload="auto"></audio>

      <div className="fixed top-0 left-0 p-4 md:p-6 z-40 pointer-events-none">
        {/* Text color is now explicitly determined based on background contrast instead of using mix-blend-difference which caused blue/cyan rendering on wood backgrounds */}
        <div className={`flex flex-col ${['WOOD', 'MARBLE', 'SLATE', 'VELVET', 'UNSPLASH_BROWN_WOOD', 'UNSPLASH_METAL', 'UNSPLASH_BLUR'].includes(previewConfig.viewerBackground) || (!previewConfig.viewerBackground && isDark) ? 'text-white/90 drop-shadow-md' : 'text-black/80 drop-shadow-sm'}`}>
          <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase">Ashok Jewels</span>
          <span className="text-[10px] md:text-xs tracking-widest uppercase mt-1 font-bold">{catalog.name}</span>
        </div>
      </div>

      <div className="fixed top-0 right-0 p-4 md:p-6 flex items-center gap-2 md:gap-4 z-40">

          {/* CRITICAL FIX: Pointed the Export URL to /pdf instead of /export */}
          <button
            onClick={() => window.open(`/api/catalog/${catalog.id}/pdf`, '_blank')}
            className="px-3 md:px-5 py-2 md:py-2.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-xl backdrop-blur-xl bg-white/80 border border-black/10 text-gray-800 shadow-lg transition-all duration-200 ease-in-out hover:bg-white hover:shadow-xl active:scale-95 flex items-center gap-1 md:gap-2"
          >
            <IconDownload /> <span className="hidden md:inline">Export PDF / CSV</span><span className="md:hidden">Export</span>
          </button>

          <button onClick={() => window.close()} className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center backdrop-blur-xl bg-white/80 border border-black/10 text-gray-800 shadow-lg transition-all duration-200 ease-in-out hover:bg-white hover:shadow-xl active:scale-90">
            <IconClose />
          </button>
        </div>
      <div
        className="w-full max-w-7xl mx-auto flex items-center justify-center perspective-[2000px] transition-transform duration-700 ease-in-out"
        style={{
          height: 'calc(100vh - 160px)',
          marginTop: '60px',
          marginBottom: '100px',
          transform: `scale(${zoomLevel}) ${windowDimensions.width <= windowDimensions.height ? 'translateX(0)' : (currentPage === 0 ? 'translateX(-225px)' : currentPage >= pages.length - 2 ? 'translateX(225px)' : 'translateX(0)')}`,
          transformOrigin: 'center center'
        }}
      >
        {/* @ts-ignore */}
        <HTMLFlipBook width={isPortrait ? Math.min(windowDimensions.width - 40, 450) : 450} height={isPortrait ? Math.min(windowDimensions.height - 180, 636) : 636} size="stretch" minWidth={250} maxWidth={isPortrait ? 600 : 544} minHeight={250} maxHeight={800} maxShadowOpacity={0.6} drawShadow={true} showCover={true} mobileScrollSupport={true} usePortrait={true} onFlip={onPageFlip} flippingTime={1000} swipeDistance={30} className="" ref={bookRef}>
          {pages.map((page, index) => (
            <Page key={index} number={index} isCover={page.type === 'COVER'}>
              {page.type === 'COVER' && (
                <div className="w-full h-full relative bg-black">
                  <img 
                    src={page.img} 
                    className="w-full h-full object-cover" 
                    style={{ objectPosition: page.objectPosition || 'center' }} 
                    alt="Cover" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center pointer-events-none bg-black/40">
                    <h1 className="text-2xl lg:text-3xl text-white font-light tracking-[0.2em] uppercase leading-relaxed drop-shadow-md">{page.title}</h1>
                    {index === 0 && <p className="text-[9px] text-white font-bold tracking-[0.4em] uppercase mt-4 border-b border-white pb-2 drop-shadow-md">Confidential Line Sheet</p>}
                  </div>
                </div>
              )}

              {page.type === 'INSERT' && (
                <div className="w-full h-full relative bg-[#0a0a0a]">
                  {page.img ? <img src={page.img} className="w-full h-full object-cover" alt="Lifestyle Insert" /> : <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-widest"><svg className="w-10 h-10 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>Empty Promotional Page Placeholder</div>}
                </div>
              )}
              {page.type === 'PRODUCT' && (
                <div className={`w-full h-full flex flex-col p-8 lg:p-12 ${isDark ? 'bg-[#141414] text-white' : 'bg-white text-gray-900'}`}>

                  {/* Image Container with precise ratio containment */}
                  <div className="flex-1 w-full relative bg-transparent overflow-hidden mb-8 min-h-0 flex items-center justify-center cursor-pointer" onClick={() => bookRef.current?.pageFlip().flipNext()}>
                    <div className="aspect-square h-full max-w-full relative rounded-xl overflow-hidden">
                      <ProductImage 
                        src={getProductImage(page.data)} 
                        className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-700 hover:scale-[1.02]" 
                        alt={page.data.title} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mb-8 border-t border-black/10 pt-6">
                    <p className={`text-[10px] font-mono tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{page.data.designCode}</p>
                    <h2 className="text-xl font-medium tracking-wide leading-tight">{page.data.title}</h2>
                    {showPricing && (
                      <div className="mt-2 flex flex-col gap-0.5">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Estimated Value</span>
                        <p className="text-xl font-light text-[#4e080f]">{formatPrice(page.data.price || page.data.estimatedPrice || 0)}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleToggleCart(page.data.designCode, e)}
                    className={`w-full py-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-lg transition-all ${selectedItems.includes(page.data.designCode) ? 'bg-[#4e080f] text-white shadow-md border-transparent' : `border border-[#4e080f] text-[#4e080f] hover:bg-[#4e080f] hover:text-white`}`}
                  >
                    {selectedItems.includes(page.data.designCode) ? '✓ In Cart' : '+ Add to Cart'}
                  </button>
                </div>
              )}
              {page.type === 'PRODUCT_GRID' && (
                <div className={`w-full h-full flex flex-col p-4 md:p-6 ${isDark ? 'bg-[#141414] text-white' : 'bg-white text-gray-900'}`}>
                  <div className={`grid gap-3 md:gap-4 flex-1 ${
                    page.data.length === 2 ? 'grid-cols-1 grid-rows-2' :
                    page.data.length === 3 ? 'grid-cols-2 grid-rows-2' :
                    page.data.length === 4 ? 'grid-cols-2 grid-rows-2' :
                    page.data.length === 5 ? 'grid-cols-2 grid-rows-3' :
                    page.data.length === 6 ? 'grid-cols-2 grid-rows-3' :
                    page.data.length === 7 ? 'grid-cols-2 grid-rows-4' :
                    'grid-cols-2 grid-rows-4'
                  }`}>
                    {page.data.map((product: any, idx: number) => (
                      <div key={idx} className={`flex flex-col border rounded-xl overflow-hidden relative group min-h-0 ${isDark ? 'border-white/10' : 'border-black/10'} ${
                        (page.data.length === 3 && idx === 0) || 
                        (page.data.length === 5 && idx === 0) || 
                        (page.data.length === 7 && idx === 0) ? 'col-span-2 row-span-1' : ''
                      }`}>
                        <div className="flex-1 w-full relative bg-transparent overflow-hidden min-h-0 flex items-center justify-center cursor-pointer" onClick={() => bookRef.current?.pageFlip().flipNext()}>
                          <div className="aspect-square h-full max-w-full relative">
                            <ProductImage 
                              src={getProductImage(product)} 
                              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.05]" 
                              alt={product.title} 
                            />
                          </div>
                        </div>
                        <div className={`p-3 md:p-4 border-t flex flex-col justify-between ${isDark ? 'bg-[#1a1a1a] border-white/5' : 'bg-gray-50 border-black/5'}`}>
                           <p className={`text-[8px] md:text-[9px] font-mono tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{product.designCode}</p>
                           <h3 className="text-[10px] md:text-xs font-medium truncate mb-1">{product.title}</h3>
                           <div className="flex justify-between items-center mt-1">
                             {showPricing && <span className="text-[10px] md:text-xs font-medium text-[#4e080f]">{formatPrice(product.price || product.estimatedPrice || 0)}</span>}
                             <button
                              onClick={(e) => handleToggleCart(product.designCode, e)}
                              className={`px-3 py-1.5 md:py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors ${selectedItems.includes(product.designCode) ? 'bg-[#4e080f] text-white shadow-md' : 'bg-black/5 hover:bg-black/10 text-gray-700'}`}
                             >
                               {selectedItems.includes(product.designCode) ? '✓ In Cart' : '+ Add to Cart'}
                             </button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {page.type === 'BLANK' && <div className={`w-full h-full ${isDark ? 'bg-[#111]' : 'bg-[#fafafa]'}`}></div>}
            </Page>
          ))}
        </HTMLFlipBook>
      </div>

      {/* DEARFLIP-STYLE TOOLBAR */}
      <div className={`fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 opacity-90 hover:opacity-100`}>
        <div className={`flex items-center gap-1 p-1.5 rounded-xl shadow-2xl backdrop-blur-xl border ${isDark ? 'bg-black/60 border-white/10 text-gray-300' : 'bg-white/70 border-black/10 text-gray-600'}`}>
          {/* Pagination Controls */}
          <div className="flex items-center">
            <button onClick={() => bookRef.current?.pageFlip().flipPrev()} disabled={currentPage === 0} className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/10 hover:text-black ${isDark ? 'hover:text-white hover:bg-white/10' : ''} disabled:opacity-30 disabled:hover:bg-transparent`}>
              <IconChevronLeft />
            </button>
            <div className={`px-3 py-1 font-mono text-[10px] md:text-xs tracking-wider min-w-[60px] text-center border-x ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              {currentPage + 1} / {pages.length}
            </div>
            <button onClick={() => bookRef.current?.pageFlip().flipNext()} disabled={currentPage >= pages.length - 2} className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/10 hover:text-black ${isDark ? 'hover:text-white hover:bg-white/10' : ''} disabled:opacity-30 disabled:hover:bg-transparent`}>
              <IconChevronRight />
            </button>
          </div>

          <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>

          {/* View Controls */}
          <button onClick={() => setZoomLevel(Math.min(zoomLevel + 0.5, 3))} className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/10 hover:text-black ${isDark ? 'hover:text-white hover:bg-white/10' : ''}`} title="Zoom In">
            <IconZoomIn />
          </button>

          <button onClick={() => setZoomLevel(Math.max(zoomLevel - 0.5, 1))} className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/10 hover:text-black ${isDark ? 'hover:text-white hover:bg-white/10' : ''}`} title="Zoom Out">
            <IconZoomOut />
          </button>

          <button onClick={handleFullscreen} className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/10 hover:text-black ${isDark ? 'hover:text-white hover:bg-white/10' : ''}`} title="Fullscreen">
            {isFullscreen ? <IconMinimize /> : <IconFullscreen />}
          </button>

          <div className={`w-px h-6 mx-1 ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>

          <button onClick={() => window.open(`/api/catalog/${catalog.id}/pdf`, '_blank')} className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-black/10 hover:text-black ${isDark ? 'hover:text-white hover:bg-white/10' : ''}`} title="Export PDF">
            <IconDownload />
          </button>
        </div>
      </div>

      {/* FLOATING CART (Moved up so it doesn't overlap toolbar) */}
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${selectedItems.length > 0 && !showPOMatrix ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
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
          products={previewCatalog.items?.map((i: any) => i.product) || []}
          activeMatrixSku={activeMatrixSku!}
          setActiveMatrixSku={setActiveMatrixSku}
          closeMatrix={closeMatrix}
          catalogId={previewCatalog.id}
          clientId={previewCatalog.clientId}
        />
      )}
    </div>
  );
}