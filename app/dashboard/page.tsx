'use client';

import React, { useState, useEffect } from 'react';
import PriceBreakup from '@/components/PriceBreakup';
import MatrixModal from '@/components/MatrixModal';

export default function DashboardCatalog() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  // NEW: State to handle real-time filtering
  const [filter, setFilter] = useState<string>('ALL');

  // Fetch inventory on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/inventory'); 
        if(res.ok) {
           const data = await res.json();
           // FIX: Guarantee we are setting an array to state, even if wrapped in an object
           setInventory(Array.isArray(data) ? data : (data.items || data.inventory || []));
        }
      } catch (error) {
        console.error("Failed to fetch inventory", error);
      }
    }
    loadData();
  }, []);

  // FIX: Safely check if inventory is an array before mapping
  const uniquePurities = Array.isArray(inventory) 
    ? Array.from(new Set(inventory.map(item => item?.metalPurity))).filter(Boolean)
    : [];

  // FIX: Safely filter the inventory before rendering
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const filteredInventory = filter === 'ALL' 
    ? safeInventory 
    : safeInventory.filter(item => item?.metalPurity === filter);

  return (
    <div className="max-w-[1400px] mx-auto relative z-10 animate-in fade-in duration-500">
      
      {/* Header & Filter Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 bg-[var(--glass-bg)] backdrop-blur-xl p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-sm">
        <div>
          <h2 className="text-3xl font-light tracking-wide text-[var(--text-main)]">Master Inventory</h2>
          <p className="text-sm tracking-wide text-[var(--text-muted)] mt-2">Browse and build your wholesale PO from our global collection.</p>
        </div>
        
        <div className="flex space-x-4 mt-6 md:mt-0 relative">
          <div className="relative">
            {/* THE FIX: Wired the select dropdown to the React state */}
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
      </div>

      {/* Grid */}
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
      
      {/* Empty State Fallback */}
      {filteredInventory.length === 0 && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-[var(--text-muted)]">
          <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <p className="text-sm font-medium">No inventory matches the selected filter.</p>
        </div>
      )}

      {/* Render Matrix Modal */}
      {selectedProduct && (
        <MatrixModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
