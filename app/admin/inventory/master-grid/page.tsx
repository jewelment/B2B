'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { LuxuryTable } from '@/components/LuxuryTable';

type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
  gallery: (string | File | null)[];
};

export default function MasterInventoryGrid() {
  const premiumEasing = [0.16, 1, 0.3, 1] as any;
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/storefront/products');
        const json = await res.json();
        if (json.success) {
          const formattedData: Product[] = json.data.map((p: any) => ({
            id: p.id,
            name: p.title,
            sku: p.designCode,
            category: p.category || 'Uncategorized',
            price: `₹${(p.price || 0).toLocaleString('en-IN')}`,
            status: p.status || (p.stock > 0 ? 'Active' : 'Out of Stock'),
            gallery: p.gallery || []
          }));
          setData(formattedData);
        }
      } catch (error) {
        console.error("Failed to load real catalog data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'selection',
        header: () => (
          <input 
            type="checkbox" 
            className="rounded-[3px] border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-[var(--bg-base)] w-4 h-4 cursor-pointer"
          />
        ),
        cell: () => (
          <input 
            type="checkbox" 
            className="rounded-[3px] border-[var(--border-color)] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-[var(--bg-base)] w-4 h-4 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Product Name',
        cell: (info) => {
          const row = info.row.original;
          const firstImage = row.gallery?.[0];
          const imgUrl = firstImage ? (firstImage instanceof File ? URL.createObjectURL(firstImage) : firstImage as string) : null;
          
          return (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-black/10 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-center shrink-0 overflow-hidden">
                {imgUrl ? (
                  <img src={imgUrl} alt={info.getValue<string>()} className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-4 h-4 text-[var(--text-muted)] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                )}
              </div>
              <span className="font-semibold text-[var(--text-main)]">{info.getValue<string>()}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
        cell: (info) => <span className="font-mono text-xs text-[var(--text-muted)]">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'price',
        header: 'Price (Base)',
        cell: (info) => <span className="text-[var(--text-main)] font-medium">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue<string>();
          let colorClass = 'bg-gray-500/10 text-gray-500 border-gray-500/20';
          if (status === 'Active') colorClass = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
          if (status === 'Draft') colorClass = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
          if (status === 'Out of Stock') colorClass = 'bg-red-500/10 text-red-500 border-red-500/20';
          
          return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${colorClass}`}>
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: () => (
          <div className="flex justify-end pr-4">
            <button className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
            </button>
          </div>
        ),
      }
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-10 selection:bg-[var(--brand-primary)]/20 selection:text-[var(--brand-primary)]">
      
      {/* Background ambient glow effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[var(--brand-primary)]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="w-full space-y-10 max-w-[1600px] mx-auto">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: premiumEasing }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-light tracking-tight">Master Inventory</h1>
            <p className="text-sm text-[var(--text-muted)] mt-2 font-medium tracking-wide">Manage global product catalog and wholesale variants.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2.5 border border-[var(--border-color)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md rounded-md text-xs font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95 shadow-sm">
              Export Matrix
            </button>
            <button className="px-6 py-2.5 bg-[var(--text-main)] text-[var(--bg-base)] rounded-md text-xs font-bold uppercase tracking-widest shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:opacity-90 active:scale-95 transition-all">
              + New Product
            </button>
          </div>
        </motion.div>

        {/* BENTO GRID: HEADLINE WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Catalog Value', value: '$1.2M', subtext: '+4.2% vs last month', color: 'text-emerald-500' },
            { label: 'Active SKUs', value: '4,208', subtext: ' across 64 collections', color: 'text-[var(--text-muted)]' },
            { label: 'Pending QC Approvals', value: '12', subtext: 'Requires gemologist review', color: 'text-amber-500' }
          ].map((widget, i) => (
            <motion.div
              key={widget.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: premiumEasing }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.04)' }}
              className="bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] backdrop-blur-[12px] p-6 rounded-xl relative overflow-hidden group cursor-default"
            >
              {/* Subtle Gradient Border Glow on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-[var(--brand-primary)]/10 to-transparent"></div>
              
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">{widget.label}</h3>
              <p className="text-3xl font-light tracking-tight">{widget.value}</p>
              <p className={`text-xs mt-2 font-medium ${widget.color}`}>{widget.subtext}</p>
            </motion.div>
          ))}
        </div>

        {/* DATA TABLE WRAPPER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: premiumEasing }}
          className="space-y-4"
        >
          {/* Table Controls (Search/Filter) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-2">
            <div className="relative w-full max-w-sm">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search products by SKU or Name..." 
                className="w-full pl-11 pr-4 py-3 text-sm bg-[rgba(255,255,255,0.02)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] text-[var(--text-main)] backdrop-blur-md shadow-sm transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2">
              {['All', 'Rings', 'Necklaces', 'Earrings'].map(filter => (
                <button key={filter} className="px-4 py-2 rounded-md text-xs font-bold tracking-widest uppercase border border-[var(--border-color)] bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors active:scale-95">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-[var(--text-muted)] tracking-widest text-sm uppercase font-bold animate-pulse">
              Syncing Master Inventory...
            </div>
          ) : (
            <LuxuryTable columns={columns} data={data} />
          )}

        </motion.div>
      </div>
    </div>
  );
}
