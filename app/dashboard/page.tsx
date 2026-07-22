'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PriceBreakup from '@/components/PriceBreakup';
import MatrixModal from '@/components/MatrixModal';

export default function DashboardCatalog() {
  const router = useRouter();
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  
  const [layout, setLayout] = useState<any[]>([]);
  const [promoBanners, setPromoBanners] = useState<any[]>([]);
  
  // Pagination and Infinite Scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uniquePurities, setUniquePurities] = useState<string[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadData = async (pageNum: number, currentFilter: string) => {
    setLoading(true);
    try {
      const [invRes, layoutRes, bannerRes] = await Promise.all([
        fetch(`/api/inventory?page=${pageNum}&limit=24&purity=${currentFilter}`),
        pageNum === 1 ? fetch('/api/sdui/page?path=/&platform=WEB&environment=PRODUCTION') : Promise.resolve(null),
        pageNum === 1 ? fetch('/api/storefront/banners') : Promise.resolve(null)
      ]);
      
      if (invRes.ok) {
         const data = await invRes.json();
         const newProducts = Array.isArray(data.products) ? data.products : [];
         
         if (pageNum === 1) {
           setInventory(newProducts);
         } else {
           setInventory(prev => [...prev, ...newProducts]);
         }
         
         if (data.pagination) {
           setHasMore(pageNum < data.pagination.totalPages);
         } else {
           setHasMore(false);
         }

         if (data.uniquePurities) {
           setUniquePurities(data.uniquePurities);
         }
      }

      if (layoutRes && layoutRes.ok) {
        const layoutData = await layoutRes.json();
        if (layoutData.layoutData && layoutData.layoutData.length > 0) {
          setLayout(layoutData.layoutData);
        } else if (pageNum === 1) {
          // Fallback to default layout only on initial load
          setLayout([{ id: 'default-grid', type: 'ProductGrid', props: { title: 'Master Inventory', showFilters: true } }]);
        }
      }

      if (bannerRes && bannerRes.ok) {
        const bannerData = await bannerRes.json();
        if (bannerData.success) {
          setPromoBanners(bannerData.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, filter);
  }, [filter]);

  const lastElementRef = useCallback((node: HTMLAnchorElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => {
          const next = prev + 1;
          loadData(next, filter);
          return next;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, filter]);

  const safeInventory = Array.isArray(inventory) ? inventory : [];

  // --- Render Mappers ---
  const renderProductGrid = (props: any) => (
    <div className="w-full mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 bg-[var(--glass-bg)] backdrop-blur-xl p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-sm">
        <div>
          <h2 className="text-3xl font-light tracking-wide text-[var(--text-main)]">{props.title || 'Master Inventory'}</h2>
          <p className="text-sm tracking-wide text-[var(--text-muted)] mt-2">Browse and build your wholesale PO from our global collection.</p>
        </div>
        
        {props.showFilters !== false && (
          <div className="flex space-x-4 mt-6 md:mt-0 relative">
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                className="appearance-none pl-6 pr-12 py-3.5 text-sm font-medium border border-[var(--border-color)] rounded-xl bg-[var(--bg-surface)] text-[var(--text-main)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 cursor-pointer transition-all"
              >
                <option value="ALL">All Karatage</option>
                {uniquePurities.map((purity) => (
                  <option key={purity as string} value={purity as string}>
                    {purity as string} Purity
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {safeInventory.map((item, index) => {
          const isLastElement = index === safeInventory.length - 1;
          return (
          <Link 
            href={`/dashboard/product/${item.handle}`}
            prefetch={true}
            key={`${item.id}-${index}`} 
            ref={isLastElement ? lastElementRef : null}
            className="group relative bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col cursor-pointer block"
          >
            <div className="relative aspect-square m-3 rounded-[1.5rem] bg-[var(--text-muted)]/5 flex items-center justify-center overflow-hidden border border-[var(--border-color)] group-hover:border-[var(--brand-primary)]/30 transition-colors">
              {item.media && item.media.length > 0 ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.media[0].url} alt={item.title} className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${item.media.length > 1 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`} />
                  {item.media.length > 1 && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.media[1].url} alt={`${item.title} alternate`} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-105" />
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50">
                  <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase">NO IMAGE</span>
                </div>
              )}
            </div>
            
            <div className="p-5 pt-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold tracking-wide text-[var(--text-main)]">{item.designCode}</h3>
                  <span className="text-[10px] font-bold tracking-wider bg-[var(--text-muted)]/10 text-[var(--text-muted)] px-2.5 py-1 rounded-md border border-[var(--border-color)]">
                    {item.metalPurity}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-1">{item.title}</p>
              </div>
              
              <div className="mt-5 pt-4 border-t border-[var(--border-color)]" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <PriceBreakup estimatedPrice={item.price || item.estimatedPrice || 0} components={item.components} />
              </div>
            </div>
          </Link>
          );
        })}
      </div>
      
      {loading && (
        <div className="w-full py-10 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)]"></div>
        </div>
      )}

      {safeInventory.length === 0 && !loading && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-[var(--text-muted)]">
          <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <p className="text-sm font-medium">No inventory matches the selected filter.</p>
        </div>
      )}
    </div>
  );

  const renderHeroBanner = (props: any) => (
    <div className="relative w-full h-[400px] md:h-[500px] bg-slate-900 rounded-[2rem] overflow-hidden flex items-center justify-center mt-10">
      {props.imageUrl ? (
        <img src={props.imageUrl} alt={props.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)] to-slate-900 opacity-80"></div>
      )}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-tight">{props.title}</h1>
        <p className="text-lg md:text-xl text-slate-200 font-light max-w-2xl mx-auto mb-8">{props.subtitle}</p>
        {props.buttonText && (
          <button className="px-8 py-4 bg-white text-slate-900 font-bold uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-transform shadow-xl">
            {props.buttonText}
          </button>
        )}
      </div>
    </div>
  );

  const renderTextBlock = (props: any) => (
    <div className={`w-full py-16 px-6 text-${props.align || 'center'} mt-10 max-w-4xl mx-auto`}>
      <p className="text-xl md:text-2xl text-[var(--text-main)] leading-relaxed font-light">{props.content}</p>
    </div>
  );

  const renderPromoBanner = (props: any) => {
    // Determine which banner to show based on the placement requested in props
    const targetPlacement = props.placement || 'HERO';
    // If fetching dynamically, grab the first active banner that matches the placement
    const activeBanner = props.fetchDynamic && promoBanners.length > 0 
      ? promoBanners.find(b => b.placement === targetPlacement || targetPlacement === 'ANY') || promoBanners[0]
      : null;

    const finalTitle = activeBanner?.title || props.title;
    const finalImage = activeBanner?.imageUrl || props.imageUrl;
    const finalMobileImage = activeBanner?.mobileImageUrl || activeBanner?.imageUrl || props.imageUrl;
    const finalLink = activeBanner?.linkUrl || props.linkUrl || '#';

    if (!finalImage) return null;

    return (
      <Link href={finalLink} className="relative block w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden group mt-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-[var(--border-color)]">
        {/* Mobile Image */}
        <div className="absolute inset-0 md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={finalMobileImage} alt={finalTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        {/* Desktop Image */}
        <div className="absolute inset-0 hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={finalImage} alt={finalTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        
        {/* Luxury Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-white mb-2">{finalTitle}</h2>
            {targetPlacement !== 'ANY' && <p className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">{targetPlacement} PROMOTION</p>}
          </div>
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto relative z-10 animate-in fade-in duration-500 pb-20">
      
      {layout.map((comp) => {
        switch(comp.type) {
          case 'HeroBanner': return <div key={comp.id}>{renderHeroBanner(comp.props)}</div>;
          case 'PromoBanner': return <div key={comp.id}>{renderPromoBanner(comp.props)}</div>;
          case 'ProductGrid': return <div key={comp.id}>{renderProductGrid(comp.props)}</div>;
          case 'TextBlock': return <div key={comp.id}>{renderTextBlock(comp.props)}</div>;
          default: return null;
        }
      })}

      {selectedProduct && (
        <MatrixModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
