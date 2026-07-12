'use client';

import React, { useState } from 'react';

// Reusable SVG Icons
const IconUpload = () => <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const IconImage = () => <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconTrash = () => <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default function AssetManager() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Mock Database for uploaded images
  const [assets, setAssets] = useState([
    { id: 1, sku: 'AJ-RG-001', url: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=600&auto=format&fit=crop', size: '1.2 MB', date: '2026-06-25' },
    { id: 2, sku: 'AJ-ER-042', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', size: '0.8 MB', date: '2026-06-24' },
    { id: 3, sku: 'AJ-PT-088', url: 'https://images.unsplash.com/photo-1599643478524-fb66f70a00eb?q=80&w=600&auto=format&fit=crop', size: '2.1 MB', date: '2026-06-22' },
  ]);

  // Handle Drag & Drop UI states
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      alert('Mock Upload Complete! In Phase 3, this will auto-rename your files to match SKUs.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 p-8 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-light tracking-wide text-[#4e080f]">Media & Assets</h1>
            <p className="text-sm text-gray-500 mt-2">Upload and manage high-resolution jewelry renders for the B2B catalog.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all shadow-sm">
              Sync to ERP
            </button>
            <button onClick={simulateUpload} disabled={uploading} className="px-5 py-2.5 bg-[#4e080f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#3a060b] transition-all shadow-md disabled:opacity-50">
              {uploading ? 'Processing...' : 'Upload Media'}
            </button>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div 
          onDragEnter={handleDrag} 
          onDragLeave={handleDrag} 
          onDragOver={handleDrag} 
          onDrop={handleDrop}
          className={`relative w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all duration-300 ${dragActive ? 'border-[#dfae61] bg-[#dfae61]/5' : 'border-gray-300 bg-white hover:border-[#dfae61]/50 hover:bg-gray-50'}`}
        >
          <IconUpload />
          <p className="text-sm font-semibold text-gray-700 mb-1">Drag and drop your 8K renders here</p>
          <p className="text-xs text-gray-400 mb-6">Supports .JPG, .PNG, .WEBP (Max 10MB per file)</p>
          <button onClick={simulateUpload} className="px-6 py-2 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-200 transition-colors">
            Browse Files
          </button>
        </div>

        {/* Asset Gallery Grid */}
        <div>
          <h2 className="text-lg font-semibold tracking-wide mb-6 flex items-center">
            <IconImage /> <span className="ml-2">Recent Uploads</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {assets.map((asset) => (
              <div key={asset.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#dfae61]/30 transition-all duration-300">
                {/* Image Thumbnail */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt={asset.sku} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                     <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-[#dfae61] hover:text-white transition-colors text-gray-700 shadow-lg">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                     </button>
                     <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-gray-700 shadow-lg">
                       <IconTrash />
                     </button>
                  </div>
                </div>
                
                {/* Meta Details */}
                <div className="p-4 border-t border-gray-50">
                  <p className="text-[11px] text-[#dfae61] font-bold uppercase tracking-widest mb-1">{asset.sku}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium">
                    <span>{asset.date}</span>
                    <span>{asset.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}