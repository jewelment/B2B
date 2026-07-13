'use client';

import React, { useState, useEffect } from 'react';
import PriceBreakup from '@/components/PriceBreakup';
import MatrixModal from '@/components/MatrixModal';

export default function DashboardCatalog() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  
  const [layout, setLayout] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [invRes, layoutRes] = await Promise.all([
          fetch('/api/inventory'),
          fetch('/api/admin/theme-builder')
        ]);
        
        if (invRes.ok) {
           const data = await invRes.json();
           setInventory(Array.isArray(data) ? data : (data.items || data.inventory || []));
        }

        if (layoutRes.ok) {
          const layoutData = await layoutRes.json();
          if (layoutData.success && layoutData.layoutData && layoutData.layoutData.length > 0) {
            setLayout(layoutData.layoutData);
          } else {
            // Fallback to default layout
            setLayout([{ id: 'default-grid', type: 'ProductGrid', props: { title: 'Master Inventory', showFilters: true } }]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }
    loadData();
  }, []);

  const uniquePurities = Array.isArray(inventory) 
    ? Array.from(new Set(inventory.map(item => item?.metalPurity))).filter(Boolean)
    : [];

  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const filteredInventory = filter === 'ALL' 
    ? safeInventory 
    : safeInventory.filter(item => item?.metalPurity === filter);

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
                onChange={(e) => setFilter(e.target.value)}
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
        {filteredInventory.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedProduct(item)}
            className="group relative bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col cursor-pointer"
          >
            <div className="relative aspect-square m-3 rounded-[1.5rem] bg-[var(--text-muted)]/5 flex items-center justify-center overflow-hidden border border-[var(--border-color)]">
              {item.description && item.description.startsWith('/uploads') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.description} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <span className="text-[var(--text-muted)] text-xs font-semibold tracking-[0.2em] uppercase">IMAGE PENDING</span>
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
              
              <div className="mt-5 pt-4 border-t border-[var(--border-color)]" onClick={(e) => e.stopPropagation()}>
                <PriceBreakup estimatedPrice={item.estimatedPrice} components={item.components} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredInventory.length === 0 && (
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

  return (
    <div className="max-w-[1400px] mx-auto relative z-10 animate-in fade-in duration-500 pb-20">
      
      {layout.map((comp) => {
        switch(comp.type) {
          case 'HeroBanner': return <div key={comp.id}>{renderHeroBanner(comp.props)}</div>;
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
