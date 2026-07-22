'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FallbackImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-black/5 dark:bg-[#121212] text-[var(--text-muted)] ${className}`}>
        <svg className="w-1/2 h-1/2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

// CRM Rule #12: Custom Dropdown Component
const CustomDropdown = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all ${isOpen ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 text-[var(--brand-primary)]' : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--text-muted)]'}`}
      >
        <span className="opacity-70 text-xs uppercase tracking-wider">{label}:</span>
        <span>{value}</span>
        <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-full min-w-[200px] z-50 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <ul className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <li 
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === option ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold' : 'text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function ProductsMasterPage() {
  const router = useRouter();
  
  // Live Database Connection
  const categories = ['All Categories', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Pendants'];
  const stockStatuses = ['All Status', 'Active', 'Draft', 'Pending'];
  
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedStatus, setSelectedStatus] = useState(stockStatuses[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
    const matchStatus = selectedStatus === 'All Status' || (p.status || 'Active').toLowerCase() === selectedStatus.toLowerCase();
    const searchString = `${p.designCode || ''} ${p.title || ''}`.toLowerCase();
    const matchSearch = searchString.includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  return (
    <div className="p-8 max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
      
      {/* Header Panel */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Master Product Catalog</h1>
          <p className="text-[var(--text-muted)] text-sm mt-2">Manage all inventory SKUs, dynamic pricing matrices, and master variants.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button className="px-6 py-2.5 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Import Matrix
          </button>
          <button 
            onClick={() => {
              const newId = `NEW-${Math.floor(Math.random() * 100000)}`;
              router.push(`/admin/products/edit/${newId}`);
            }}
            className="px-6 py-2.5 bg-[var(--brand-primary)] text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create Product
          </button>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden flex flex-col">
        
        {/* TABS */}
        <div className="flex overflow-x-auto border-b border-[var(--border-color)] scrollbar-hide px-2">
          {stockStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all border-b-2 ${
                selectedStatus === status 
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)] bg-[var(--brand-primary)]/5' 
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="p-4 border-b border-[var(--border-color)] flex flex-wrap justify-between items-center gap-6 bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-4 z-20">
            <CustomDropdown label="Category" options={categories} value={selectedCategory} onChange={setSelectedCategory} />
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-[#121212] rounded-full px-5 py-2.5 border border-[var(--border-color)] focus-within:border-[var(--brand-primary)] transition-all shadow-inner w-full md:w-96">
            <svg className="w-4 h-4 text-[var(--text-muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search by SKU or Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" 
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto custom-scrollbar w-full min-h-[500px]">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="sticky top-0 z-10 bg-[var(--bg-surface)] shadow-sm">
              <tr className="bg-black/10 dark:bg-[#121212] border-b border-[var(--border-color)] text-[11px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-5 px-6 w-16">IMAGE</th>
                <th className="py-5 px-6 w-48">SKU</th>
                <th className="py-5 px-6">PRODUCT DETAILS</th>
                <th className="py-5 px-6 w-40 text-right">MASTER PRICE (INR)</th>
                <th className="py-5 px-6 w-32 text-center">VARIANTS</th>
                <th className="py-5 px-6 w-48 text-center">INVENTORY STATUS</th>
                <th className="py-5 px-6 w-24 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[var(--text-muted)] animate-pulse uppercase tracking-widest font-bold text-xs">
                    Loading Master Catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      <p>No products found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-5 px-6">
                      <div className="w-14 h-14 rounded-xl border border-[var(--border-color)] overflow-hidden bg-white dark:bg-[#121212] shrink-0 shadow-sm relative group-hover:shadow-md transition-all">
                        <FallbackImage src={product.image || 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?w=200&q=80'} alt={product.title || 'Product'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    </td>
                    <td className="py-5 px-6 font-mono text-sm font-semibold text-[var(--text-main)] whitespace-nowrap">{product.designCode}</td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-bold text-[var(--brand-primary)] mb-1 truncate max-w-[300px]">{product.title || 'Untitled'}</p>
                      <p className="text-xs text-[var(--text-muted)]">{product.category}</p>
                    </td>
                    <td className="py-5 px-6 text-sm font-bold text-[var(--text-main)] text-right font-mono whitespace-nowrap">
                      {(product.price || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 text-xs font-bold font-mono border border-[var(--border-color)]">
                        {product.variants || 0}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-2 w-full max-w-[180px] mx-auto">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-emerald-500">Ready: {product.rtsQty || 0}</span>
                          <span className="text-blue-500">CM: {product.cmQty || 0}</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden flex">
                          <div className="h-full bg-emerald-500" style={{ width: `0%` }}></div>
                          <div className="h-full bg-blue-500" style={{ width: `0%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <button onClick={() => router.push(`/admin/products/edit/${product.id}`)} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] dark:hover:text-white transition-colors" title="Edit Product Matrix">
                        <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination UI */}
        <div className="p-5 border-t border-[var(--border-color)] flex items-center justify-between bg-black/5 dark:bg-[#121212]">
          <span className="text-xs font-medium text-[var(--text-muted)]">Showing 1 to {filteredProducts.length} of {products.length} Products</span>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-medium transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-1.5 rounded-full bg-[var(--brand-primary)] text-[#121212] text-sm font-bold shadow-md">1</button>
            <button className="px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-medium transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
