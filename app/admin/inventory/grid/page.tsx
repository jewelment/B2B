'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';

// --- SVGs ---
const IconSearch = () => <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const IconRefresh = ({ className = "" }: { className?: string }) => <svg className={`w-4 h-4 text-[var(--text-main)] ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const IconTrash = () => <svg className="w-4 h-4 text-[var(--text-muted)] hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconSort = () => <svg className="w-3 h-3 text-[var(--text-muted)] inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
const IconPencil = () => <svg className="w-3 h-3 text-[var(--text-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const IconClose = () => <svg className="w-4 h-4 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconAddImage = () => <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

interface CatalogProduct {
  id: string;
  designCode: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  gallery: (string | File | null)[];
}

export default function MasterCatalogSpreadsheet() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Toolbar State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CatalogProduct | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  // Selection & Edit State
  const [editedProducts, setEditedProducts] = useState<Record<string, Partial<CatalogProduct>>>({});
  const [historyStack, setHistoryStack] = useState<Record<string, Partial<CatalogProduct>>[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ rowId: string, colId: keyof CatalogProduct } | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowId: string, colId: keyof CatalogProduct } | null>(null);
  const [activeMediaSku, setActiveMediaSku] = useState<string | null>(null);

  // --- DRAG TO FILL STATE ---
  const [dragFill, setDragFill] = useState<{ field: keyof CatalogProduct | null, startRow: number | null, currentRow: number | null, value: any }>({ field: null, startRow: null, currentRow: null, value: null });

  // --- LOAD REAL DATABASE INVENTORY ---
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/storefront/products');
        const json = await res.json();
        
        if (json.success) {
          setProducts(json.data);
        }
      } catch (error) {
        console.error("Failed to load real catalog data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  // --- SORTING & FILTERING ---
  const uniqueCategories = ['All Categories', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const handleSort = (key: keyof CatalogProduct) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const processedProducts = useMemo(() => {
    let filtered = products.map(p => ({ ...p, ...(editedProducts[p.id] || {}) })) as CatalogProduct[];

    if (selectedCategory !== 'All Categories') filtered = filtered.filter(p => p.category === selectedCategory);
    
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.designCode.toLowerCase().includes(lowerQuery) || p.title.toLowerCase().includes(lowerQuery));
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, editedProducts, searchQuery, selectedCategory, sortConfig]);

  // --- EXCEL LOGIC: CELL EDIT & HISTORY ---
  const handleCellChange = (id: string, field: keyof CatalogProduct, value: any) => {
    setHistoryStack(prev => [...prev, { ...editedProducts }]); 
    setEditedProducts(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  // --- GLOBAL KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingCell) {
        if (e.key === 'Escape') setEditingCell(null);
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          setHistoryStack(prev => {
            if (prev.length === 0) return prev;
            const newHistory = [...prev];
            const previousState = newHistory.pop();
            if (previousState !== undefined) setEditedProducts(previousState);
            return newHistory;
          });
        }
        if (e.key === 'c' && selectedCell) {
          e.preventDefault();
          const targetProduct = processedProducts.find(p => p.id === selectedCell.rowId);
          if (targetProduct) navigator.clipboard.writeText(String(targetProduct[selectedCell.colId] || ''));
        }
      }

      if (selectedCell) {
        if (e.key === 'Enter') {
          e.preventDefault();
          setEditingCell(selectedCell);
          return;
        }

        const columns: (keyof CatalogProduct)[] = ['designCode', 'title', 'category', 'price', 'stock'];
        const rowIndex = processedProducts.findIndex(p => p.id === selectedCell.rowId);
        const colIndex = columns.indexOf(selectedCell.colId);

        if (e.key === 'ArrowDown' && rowIndex < processedProducts.length - 1) {
          e.preventDefault();
          setSelectedCell({ rowId: processedProducts[rowIndex + 1].id, colId: selectedCell.colId });
        } else if (e.key === 'ArrowUp' && rowIndex > 0) {
          e.preventDefault();
          setSelectedCell({ rowId: processedProducts[rowIndex - 1].id, colId: selectedCell.colId });
        } else if (e.key === 'ArrowRight' && colIndex < columns.length - 1) {
          e.preventDefault();
          setSelectedCell({ rowId: selectedCell.rowId, colId: columns[colIndex + 1] });
        } else if (e.key === 'ArrowLeft' && colIndex > 0) {
          e.preventDefault();
          setSelectedCell({ rowId: selectedCell.rowId, colId: columns[colIndex - 1] });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingCell, selectedCell, processedProducts]);

  // --- EXCEL LOGIC: DRAG TO FILL ---
  const handleDragStart = (field: keyof CatalogProduct, rowIdx: number, value: any) => {
    setHistoryStack(prev => [...prev, { ...editedProducts }]);
    setDragFill({ field, startRow: rowIdx, currentRow: rowIdx, value });
  };

  const handleDragEnter = (rowIdx: number) => {
    if (dragFill.startRow !== null && dragFill.field !== null) {
      setDragFill(prev => ({ ...prev, currentRow: rowIdx }));
    }
  };

  const handleDragEnd = useCallback(() => {
    if (dragFill.startRow !== null && dragFill.currentRow !== null && dragFill.field !== null) {
      const start = Math.min(dragFill.startRow, dragFill.currentRow);
      const end = Math.max(dragFill.startRow, dragFill.currentRow);
      
      if (start !== end) {
        const newEdits = { ...editedProducts };
        for (let i = start; i <= end; i++) {
          const product = processedProducts[i];
          newEdits[product.id] = { ...newEdits[product.id], [dragFill.field]: dragFill.value };
        }
        setEditedProducts(newEdits);
      }
    }
    setDragFill({ field: null, startRow: null, currentRow: null, value: null });
  }, [dragFill, editedProducts, processedProducts]);

  useEffect(() => {
    window.addEventListener('mouseup', handleDragEnd);
    return () => window.removeEventListener('mouseup', handleDragEnd);
  }, [handleDragEnd]);

  // --- GLOBAL ACTIONS ---
  const handleDeleteRow = (id: string) => {
    if(confirm('Are you sure you want to delete this SKU?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      const newEdits = { ...editedProducts };
      delete newEdits[id];
      setEditedProducts(newEdits);
    }
  };

  // --- REAL DATABASE TRANSMISSION (BULK SYNC) ---
  const handleSaveAll = async () => {
    setIsSavingAll(true);
    setNotification(null);
    try {
      const formData = new FormData();
      const payloadEdits: any[] = [];

      Object.entries(editedProducts).forEach(([id, changes]) => {
        let productUpdates: any = { id, ...changes };

        if (changes.gallery) {
          const processedGallery: (string | null)[] = [];
          changes.gallery.forEach((item, idx) => {
            if (item instanceof File) {
              const fieldName = `file_${id}_${idx}`;
              formData.append(fieldName, item);
              processedGallery.push(`UPLOADED:${fieldName}`);
            } else {
              processedGallery.push(item as string | null);
            }
          });
          productUpdates.gallery = processedGallery;
        }

        payloadEdits.push(productUpdates);
      });

      formData.append('edits', JSON.stringify(payloadEdits));

      const res = await fetch('/api/admin/products/bulk-sync', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      
      if (data.success) {
        setProducts(prev => prev.map(p => ({ ...p, ...(editedProducts[p.id] || {}) })) as CatalogProduct[]);
        setEditedProducts({});
        setHistoryStack([]);
        setNotification({ type: 'success', message: `Success: Transmitted and synced ${payloadEdits.length} SKUs.` });
      } else {
        setNotification({ type: 'error', message: `Sync Failed: ${data.error}` });
      }
    } catch (err) {
      console.error("Transmission error", err);
      setNotification({ type: 'error', message: `Network error. Could not reach the server.` });
    } finally {
      setIsSavingAll(false);
      // Auto-dismiss notification after 4 seconds
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // --- MEDIA MODAL ---
  const activeProduct = activeMediaSku ? processedProducts.find(p => p.id === activeMediaSku) : null;
  // Always render exactly 6 slots for the sequence upload
  const currentGallery = Array.from({ length: 6 }, (_, i) => activeProduct?.gallery?.[i] || null);

  const handleModalImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && activeMediaSku) {
      const updatedGallery = [...currentGallery];
      updatedGallery[index] = e.target.files[0]; 
      handleCellChange(activeMediaSku, 'gallery', updatedGallery);
    }
  };

  const handleModalImageRemove = (index: number) => {
    if (activeMediaSku) {
      const updatedGallery = [...currentGallery];
      updatedGallery[index] = null;
      handleCellChange(activeMediaSku, 'gallery', updatedGallery);
    }
  };

  const renderGalleryThumbnail = (item: string | File | null) => {
    if (!item) return null;
    if (item instanceof File) return URL.createObjectURL(item);
    return item;
  };

  // --- REUSABLE CELL RENDERER ---
  const renderCell = (product: CatalogProduct, colId: keyof CatalogProduct, index: number, type: string = 'text') => {
    const isSelected = selectedCell?.rowId === product.id && selectedCell?.colId === colId;
    const isEditing = editingCell?.rowId === product.id && editingCell?.colId === colId;
    const isBeingFilled = dragFill.startRow !== null && dragFill.currentRow !== null && dragFill.field === colId && index >= Math.min(dragFill.startRow, dragFill.currentRow) && index <= Math.max(dragFill.startRow, dragFill.currentRow);

    return (
      <td 
        key={colId}
        onMouseEnter={() => handleDragEnter(index)}
        onClick={() => { if (!isEditing) setSelectedCell({ rowId: product.id, colId }); }}
        onDoubleClick={() => { setSelectedCell({ rowId: product.id, colId }); setEditingCell({ rowId: product.id, colId }); }}
        className={`p-0 border-b border-r border-[var(--border-color)] relative h-12 cursor-cell align-middle bg-transparent transition-colors
          ${isSelected && !isEditing ? 'outline outline-2 outline-gray-400 dark:outline-gray-500 z-10' : ''}
          ${isBeingFilled && !isSelected ? 'border-b-2 border-gray-400 opacity-70' : ''}
        `}
      >
        {isEditing ? (
          <input 
            type={type}
            autoFocus
            defaultValue={product[colId] as any}
            onBlur={(e) => {
              setEditingCell(null);
              const val = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
              if (val != product[colId]) handleCellChange(product.id, colId, val);
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            className="w-full h-full absolute inset-0 px-4 text-sm font-mono text-[var(--text-main)] bg-[var(--bg-surface)] outline-none ring-2 ring-inset ring-[var(--brand-primary)] rounded-md z-20"
          />
        ) : (
          <div className={`px-4 flex items-center h-full text-sm truncate select-none ${colId === 'designCode' || colId === 'price' ? 'font-mono text-[var(--text-main)]' : 'text-[var(--text-main)]'}`}>
            {Array.isArray(product[colId]) ? `[${product[colId].length} Media Items]` : (product[colId] as React.ReactNode) || <span className="text-[var(--text-muted)] italic">Empty</span>}
          </div>
        )}

        {isSelected && !isEditing && (
          <div 
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-gray-400 dark:bg-gray-500 rounded-full border-[2px] border-[var(--bg-surface)] cursor-crosshair z-30 shadow-sm transition-transform hover:scale-110" 
            onMouseDown={(e) => { e.stopPropagation(); handleDragStart(colId, index, product[colId]); }} 
          />
        )}
      </td>
    );
  };

  const hasEdits = Object.keys(editedProducts).length > 0;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans transition-colors duration-300 p-4 md:p-6 lg:p-8 relative">
      
      {/* FLOATING TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[200] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          <p className="text-sm font-bold tracking-wide">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* WRAPPER FOR ALIGNMENT */}
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* TOOLBAR */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h1 className="text-xl md:text-2xl font-normal text-[var(--text-main)]">Master Catalog</h1>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={handleSaveAll}
              disabled={!hasEdits || isSavingAll}
              className={`px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium tracking-wide transition-all duration-200 ${
                hasEdits ? 'bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-md text-white cursor-pointer active:translate-y-0' : 'bg-transparent border border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
              }`}
            >
              {isSavingAll ? 'Saving...' : 'Save all changes'}
            </button>

            <div className="h-8 w-px bg-[var(--border-color)] hidden md:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--text-main)]">Filter:</span>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand-primary)] transition-all cursor-pointer"
              >
                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IconSearch /></div>
              <input 
                type="text" 
                placeholder="Search SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--brand-primary)] w-full md:w-64 transition-all"
              />
            </div>

            <button 
              onClick={() => { setIsReloading(true); window.location.reload(); }} 
              className="p-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] hover:brightness-95 dark:hover:brightness-125 transition-all shadow-sm"
            >
              <IconRefresh className={isReloading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* SPREADSHEET GRID */}
        <div>
          <div className="bg-[var(--bg-surface)] rounded-xl overflow-x-auto custom-scrollbar shadow-sm border border-[var(--border-color)]">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-[var(--text-muted)] flex items-center justify-center gap-2">
                 <IconRefresh className="animate-spin" /> Loading catalog matrix...
              </div>
            ) : (
              <table className="w-full text-left border-collapse whitespace-nowrap select-none bg-[var(--bg-surface)]">
                <thead>
                  <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                    <th className="py-3 px-3 border-r border-[var(--border-color)] text-center w-12"><input type="checkbox" className="rounded-md border-[var(--border-color)] cursor-pointer" /></th>
                    
                    <th className="border-r border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative">
                      <div className="flex items-center justify-between resize-x overflow-hidden min-w-[120px] max-w-[300px] py-3 px-4 cursor-pointer" onClick={() => handleSort('designCode')}>
                        <span className="text-xs font-bold text-[var(--text-main)] tracking-wide uppercase">SKU NO</span>
                        <IconSort />
                      </div>
                    </th>
                    
                    <th className="border-r border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative">
                      <div className="flex items-center justify-between resize-x overflow-hidden min-w-[200px] max-w-[500px] py-3 px-4 cursor-pointer" onClick={() => handleSort('title')}>
                        <span className="text-xs font-bold text-[var(--text-main)] tracking-wide uppercase">NAME</span>
                        <IconSort />
                      </div>
                    </th>

                    <th className="border-r border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative">
                      <div className="flex items-center justify-between resize-x overflow-hidden min-w-[150px] max-w-[300px] py-3 px-4 cursor-pointer" onClick={() => handleSort('category')}>
                        <span className="text-xs font-bold text-[var(--text-main)] tracking-wide uppercase">CATEGORY</span>
                        <IconSort />
                      </div>
                    </th>

                    <th className="border-r border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative">
                      <div className="flex items-center justify-between resize-x overflow-hidden min-w-[120px] max-w-[250px] py-3 px-4 cursor-pointer" onClick={() => handleSort('price')}>
                        <span className="text-xs font-bold text-[var(--text-main)] tracking-wide uppercase">PRICE (INR)</span>
                        <IconSort />
                      </div>
                    </th>

                    <th className="border-r border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative">
                      <div className="flex items-center justify-between resize-x overflow-hidden min-w-[100px] max-w-[200px] py-3 px-4 cursor-pointer" onClick={() => handleSort('stock')}>
                        <span className="text-xs font-bold text-[var(--text-main)] tracking-wide uppercase">STOCK</span>
                        <IconSort />
                      </div>
                    </th>

                    <th className="py-3 px-4 border-r border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] tracking-wide uppercase text-center w-24">PHOTOS</th>
                    <th className="py-3 px-4 text-xs font-bold text-[var(--text-main)] tracking-wide uppercase text-center w-16">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {processedProducts.map((product, index) => {
                    const firstImage = product.gallery[0];
                    
                    return (
                      <tr key={product.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                        <td className="py-1 px-3 border-b border-r border-[var(--border-color)] text-center">
                          <span className="text-xs text-[var(--text-muted)] font-mono">{index + 1}</span>
                        </td>

                        {renderCell(product, 'designCode', index)}
                        {renderCell(product, 'title', index)}
                        {renderCell(product, 'category', index)}
                        {renderCell(product, 'price', index, 'number')}
                        {renderCell(product, 'stock', index, 'number')}

                        <td className="border-b border-r border-[var(--border-color)] p-1 align-middle text-center w-24">
                          <button onClick={() => setActiveMediaSku(product.id)} className="w-10 h-10 mx-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] overflow-hidden relative group shadow-sm hover:shadow-md transition-all">
                            {firstImage ? (
                              <img src={renderGalleryThumbnail(firstImage) as string} className="w-full h-full object-cover" alt="thumb" />
                            ) : (
                              <span className="text-[8px] text-[var(--text-muted)] flex h-full items-center justify-center font-bold">N/A</span>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[1px]"><IconPencil /></div>
                          </button>
                        </td>

                        <td className="border-b border-[var(--border-color)] p-2 text-center align-middle">
                          <button onClick={() => handleDeleteRow(product.id)} className="p-2 rounded-lg hover:bg-red-500/10 transition-colors inline-block text-[var(--text-muted)] hover:text-red-500">
                            <IconTrash />
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* MEDIA MANAGER MODAL */}
      {activeMediaSku && activeProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--border-color)] bg-[var(--bg-base)]">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] tracking-tight">{activeProduct.title}</h3>
                <p className="text-sm text-[var(--text-muted)] font-mono mt-1">Editing Gallery for {activeProduct.designCode}</p>
              </div>
              <button onClick={() => setActiveMediaSku(null)} className="p-2 bg-[var(--bg-surface)] rounded-full hover:brightness-95 dark:hover:brightness-125 transition-colors border border-[var(--border-color)] shadow-sm"><IconClose /></button>
            </div>

            <div className="p-6">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold mb-5">Sequence Upload (Images automatically rename to {activeProduct.designCode}_1, etc.)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {currentGallery.map((img, idx) => {
                  const imgUrl = renderGalleryThumbnail(img);
                  return (
                    <div key={idx} className="relative aspect-square rounded-2xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-base)] flex flex-col items-center justify-center group overflow-hidden hover:border-[var(--brand-primary)] transition-colors">
                      {imgUrl ? (
                        <>
                          <img src={imgUrl as string} className="w-full h-full object-cover" alt={`Slot ${idx + 1}`} />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                            <button onClick={() => handleModalImageRemove(idx)} className="absolute bottom-3 right-3 p-2 bg-[var(--bg-surface)] rounded-full text-red-500 shadow-lg hover:scale-105 transition-transform"><IconClose /></button>
                            <label className="absolute top-3 right-3 p-2 bg-[var(--bg-surface)] rounded-full text-[var(--text-main)] shadow-lg hover:scale-105 transition-transform cursor-pointer"><IconPencil /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleModalImageUpload(idx, e)} /></label>
                          </div>
                        </>
                      ) : (
                        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-[var(--text-muted)]">
                          <div className="p-3 bg-[var(--bg-surface)] rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform"><IconAddImage /></div>
                          <span className="text-[10px] uppercase font-bold tracking-wider">Slot {idx + 1}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleModalImageUpload(idx, e)} />
                        </label>
                      )}
                      <div className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-mono px-2 py-1 rounded-md shadow-sm backdrop-blur-md">{activeProduct.designCode}_{idx + 1}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-5 bg-[var(--bg-base)] border-t border-[var(--border-color)] flex justify-end">
              <button onClick={() => setActiveMediaSku(null)} className="px-8 py-2.5 bg-emerald-500 text-white rounded-lg font-medium text-sm hover:bg-emerald-600 shadow-md hover:shadow-lg transition-all duration-200">Complete Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}