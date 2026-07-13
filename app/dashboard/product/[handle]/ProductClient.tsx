'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PriceBreakup from '@/components/PriceBreakup';
import AdvancedMatrixModal from '@/components/AdvancedMatrixModal';
import { useCartStore } from '@/store/useCartStore';

const IconChevronLeft = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;

export default function ProductClient({ product }: { product: any }) {
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  
  // Matrix State
  const [showMatrix, setShowMatrix] = useState(false);
  const { toggleSelection, selectedItems } = useCartStore();
  const isSelected = selectedItems.includes(product.designCode);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const images = product.media && product.media.length > 0 
    ? product.media.map((m: any) => m.url) 
    : (product.description && product.description.startsWith('http') ? [product.description] : []);

  const hasImages = images.length > 0;

  const handleAddToCart = () => {
    toggleSelection(product.designCode);
    setShowMatrix(true);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors mb-8"
      >
        <IconChevronLeft /> Back to Inventory
      </button>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
        
        {/* Left Column: Premium Gallery */}
        <div className="w-full lg:w-[50%] flex flex-col gap-4">
          <div 
            className="w-full aspect-square bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-[2rem] overflow-hidden relative cursor-zoom-in group shadow-sm"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {hasImages ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)] opacity-50">
                <span className="text-xs font-bold tracking-[0.2em] uppercase">NO IMAGE</span>
              </div>
            )}
            
            {!isZoomed && hasImages && (
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-gray-600 uppercase tracking-widest shadow-sm pointer-events-none">
                Hover to Zoom
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#4e080f] opacity-100 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details */}
        <div className="w-full lg:w-[50%] flex flex-col">
          <div className="mb-8 border-b border-[var(--border-color)] pb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-mono font-bold tracking-widest text-[var(--text-muted)] mb-2 uppercase">{product.designCode}</p>
                <h1 className="text-3xl md:text-4xl font-light text-[var(--text-main)] leading-tight">{product.title}</h1>
              </div>
              <span className="text-[10px] font-bold tracking-wider bg-[var(--text-muted)]/10 text-[var(--text-main)] px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                {product.metalPurity || '18KT'}
              </span>
            </div>
            
            <div className="flex items-end gap-3 mt-4">
              <span className="text-3xl font-medium text-[#4e080f]">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price || product.estimatedPrice || 0)}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5">/ Est. Unit Base</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Value Proposition</h3>
            <PriceBreakup estimatedPrice={product.estimatedPrice} components={product.components} />
          </div>

          <div className="mt-auto pt-8 border-t border-[var(--border-color)]">
            <button 
              onClick={handleAddToCart}
              className={`w-full py-4 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all ${isSelected ? 'bg-[#5c5c5c] hover:bg-[#4a4a4a]' : 'bg-[#4e080f] hover:bg-[#3a060b]'} hover:shadow-xl hover:-translate-y-1`}
            >
              {isSelected ? 'Remove from Cart' : 'Add to Cart'}
            </button>
            <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">
              This will add the design to your centralized B2B Purchase Order session.
            </p>
          </div>
        </div>
      </div>

      {showMatrix && (
        <AdvancedMatrixModal
          products={[product]}
          activeMatrixSku={product.designCode}
          setActiveMatrixSku={() => {}} // Not needed for single item
          closeMatrix={() => setShowMatrix(false)}
        />
      )}
    </div>
  );
}
