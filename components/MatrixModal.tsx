'use client';

import React, { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';

// Mock options for the B2B Matrix
const SIZES = [5, 6, 7, 8, 9];
const VARIANTS = [
  { id: '18K-YG', label: '18K Yellow Gold' },
  { id: '18K-RG', label: '18K Rose Gold' },
  { id: '14K-WG', label: '14K White Gold' }
];

export default function MatrixModal({ product, onClose }: { product: any, onClose: () => void }) {
  const addItem = useCartStore((state) => state.addItem);
  
  // State to hold the grid of quantities
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // The Hardcoded Inventory Rule for Dev Phase
  const isInStock = (size: number) => size >= 6 && size <= 8;

  const handleQuantityChange = (size: number, variantId: string, value: string) => {
    const qty = parseInt(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [`${size}-${variantId}`]: qty
    }));
  };

  const handleAddToOrder = () => {
    let addedCount = 0;
    
    // Loop through the matrix state and push to Zustand
    Object.entries(quantities).forEach(([key, qty]) => {
      if (qty > 0) {
        const [size, variantId] = key.split('-');
        const [purity, color] = variantId.split('-');
        
        addItem({
          designCode: product.designCode,
          title: product.title,
          purity: purity,
          metal: color,
          size: size.toString(),
          quantity: qty,
          estimatedPrice: product.estimatedPrice || 0, // In production, this would calculate dynamically
          imageUrl: product.description || ''
        });
        addedCount += qty;
      }
    });

    if (addedCount > 0) {
      onClose(); // Close modal on success
    }
  };

  const totalSelected = Object.values(quantities).reduce((acc, curr) => acc + curr, 0);
  const totalValue = totalSelected * (product.estimatedPrice || 0);

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Spatial Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Side: Product Context */}
        <div className="w-full md:w-1/3 bg-[var(--bg-base)] p-8 border-r border-[var(--border-color)] flex flex-col">
          <div className="flex-1">
            <div className="aspect-square rounded-[1.5rem] bg-[var(--text-muted)]/5 flex items-center justify-center overflow-hidden border border-[var(--border-color)] mb-6">
              {product.description && product.description.startsWith('/uploads') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.description} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[var(--text-muted)] text-xs font-semibold tracking-[0.2em] uppercase">No Image</span>
              )}
            </div>
            <h2 className="text-2xl font-light tracking-wide text-[var(--text-main)] mb-1">{product.designCode}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">{product.title}</p>
            <p className="text-xl font-medium text-[var(--brand-primary)]">{formatPrice(product.estimatedPrice)} <span className="text-xs font-normal text-[var(--text-muted)]">/ unit</span></p>
          </div>
          
          <div className="mt-8 space-y-3">
            {/* Visual Legend */}
            <div className="flex items-center text-xs text-[var(--text-muted)]">
              <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50 mr-2"></span>
              Ready to Dispatch (In Stock)
            </div>
            <div className="flex items-center text-xs text-[var(--text-muted)]">
              <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50 mr-2"></span>
              Made to Order (14-21 Days)
            </div>
          </div>
        </div>

        {/* Right Side: The Matrix */}
        <div className="w-full md:w-2/3 flex flex-col bg-[var(--bg-surface)]">
          <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-center">
            <h3 className="text-lg font-light tracking-wide text-[var(--text-main)]">Purchase Order Matrix</h3>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div className="flex-1 overflow-auto p-8">
            <div className="min-w-max">
              {/* Matrix Header */}
              <div className="flex mb-4">
                <div className="w-24 shrink-0 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider pt-2">Size</div>
                {VARIANTS.map(variant => (
                  <div key={variant.id} className="w-32 px-2 text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    {variant.label}
                  </div>
                ))}
              </div>

              {/* Matrix Rows */}
              {SIZES.map(size => {
                const stockStatus = isInStock(size);
                return (
                  <div key={size} className="flex items-center mb-4 group">
                    <div className="w-24 shrink-0 font-medium text-[var(--text-main)] flex items-center">
                      Ring {size}
                      {stockStatus && <span className="ml-2 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                    </div>
                    {VARIANTS.map(variant => {
                      const id = `${size}-${variant.id}`;
                      return (
                        <div key={id} className="w-32 px-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={quantities[id] || ''}
                            onChange={(e) => handleQuantityChange(size, variant.id, e.target.value)}
                            className={`w-full text-center py-2.5 bg-[var(--bg-base)] text-[var(--text-main)] rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all font-mono border
                              ${stockStatus 
                                ? 'border-emerald-500/30 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-500/5' 
                                : 'border-amber-500/30 focus:ring-amber-500/20 focus:border-amber-500 bg-amber-500/5'
                              }
                            `}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-base)] flex justify-between items-center">
            <div>
              <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider">Total Matrix Value</p>
              <p className="text-2xl font-light text-[var(--brand-primary)]">{formatPrice(totalValue)} <span className="text-sm text-[var(--text-muted)]">({totalSelected} units)</span></p>
            </div>
            <button 
              onClick={handleAddToOrder}
              disabled={totalSelected === 0}
              className="px-8 py-3.5 bg-[var(--brand-primary)] text-white text-sm font-semibold tracking-wide rounded-xl shadow-md hover:shadow-lg hover:bg-[var(--brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Add to Global PO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}