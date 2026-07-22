'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// SVGs
const IconPlus = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconEdit = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const IconTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconClose = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconUpload = () => <svg className="w-8 h-8 text-[var(--brand-primary)] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

export default function BannersDirectory() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [placement, setPlacement] = useState('HERO');
  const [linkUrl, setLinkUrl] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [imageUrl, setImageUrl] = useState('');
  const [mobileImageUrl, setMobileImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (data.success) {
        setBanners(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = (banner?: any) => {
    if (banner) {
      setEditingBanner(banner);
      setTitle(banner.title);
      setPlacement(banner.placement);
      setLinkUrl(banner.linkUrl || '');
      setStatus(banner.status);
      setImageUrl(banner.imageUrl);
      setMobileImageUrl(banner.mobileImageUrl || '');
    } else {
      setEditingBanner(null);
      setTitle('');
      setPlacement('HERO');
      setLinkUrl('');
      setStatus('ACTIVE');
      setImageUrl('');
      setMobileImageUrl('');
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingBanner(null);
  };

  const handleSave = async () => {
    if (!title || !imageUrl) return alert("Title and Image URL are required.");
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingBanner?.id,
          title,
          imageUrl,
          mobileImageUrl,
          placement,
          linkUrl,
          status
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
        closeDrawer();
      } else {
        alert("Error saving banner: " + data.message);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchBanners();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Mock upload logic for demo purposes (Ideally this hits Cloudinary API)
  const handleImageUpload = () => {
    const mockUrl = prompt("Enter Desktop Image URL (or leave blank for demo):");
    if (mockUrl) {
      setImageUrl(mockUrl);
    } else {
      setImageUrl("https://images.unsplash.com/photo-1599643478514-4a734ce3aa93?auto=format&fit=crop&q=80&w=2000");
    }
  };

  const handleMobileImageUpload = () => {
    const mockUrl = prompt("Enter Mobile specific Image URL (Optional):");
    if (mockUrl) {
      setMobileImageUrl(mockUrl);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-light text-[var(--text-main)] mb-2 tracking-wide">Banner Merchandising</h1>
          <p className="text-sm text-[var(--text-muted)] tracking-widest uppercase">Visual Directory & Placements</p>
        </div>
        <button 
          onClick={() => openDrawer()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide"
        >
          <IconPlus /> Create Banner
        </button>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-[var(--bg-surface)] rounded-3xl border border-[var(--border-color)]">
          <p className="text-[var(--text-muted)] text-sm mb-4">No promotional banners active.</p>
          <button onClick={() => openDrawer()} className="text-[var(--brand-primary)] text-sm underline hover:opacity-80">Upload your first banner</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map(banner => (
            <div key={banner.id} className="group relative bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-[var(--brand-primary)]/50 transition-all duration-300 flex flex-col">
              {/* Image Thumbnail */}
              <div className="h-48 w-full bg-black relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white rounded shadow-sm border border-white/10">
                    {banner.placement}
                  </span>
                  <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md rounded shadow-sm border border-white/10 ${banner.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {banner.status}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-medium text-[var(--text-main)] mb-1 truncate">{banner.title}</h3>
                <p className="text-xs text-[var(--text-muted)] truncate mb-4">{banner.linkUrl || 'No destination link'}</p>
                
                <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openDrawer(banner)} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
                    <IconEdit /> Edit Banner
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors">
                    <IconTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slide-out Drawer */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={closeDrawer}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
              <h2 className="text-xl font-light text-[var(--text-main)]">{editingBanner ? 'Edit Banner' : 'Upload Banner'}</h2>
              <button onClick={closeDrawer} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"><IconClose /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Desktop Image Upload Zone */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Desktop Banner Graphic</label>
                {imageUrl ? (
                  <div className="relative h-40 rounded-xl overflow-hidden border border-[var(--border-color)] group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={handleImageUpload} className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-xs font-semibold text-white transition-all">Change Desktop</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={handleImageUpload}
                    className="h-40 rounded-xl border-2 border-dashed border-[var(--border-color)] hover:border-[var(--brand-primary)]/50 bg-black/10 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[var(--brand-primary)]/5"
                  >
                    <IconUpload />
                    <p className="text-xs text-[var(--text-muted)] mt-2 font-medium">Click to upload Desktop graphic</p>
                  </div>
                )}
              </div>

              {/* Mobile Image Upload Zone (Responsive Mapping) */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Mobile Portrait Graphic (Optional)</label>
                {mobileImageUrl ? (
                  <div className="relative h-40 w-32 rounded-xl overflow-hidden border border-[var(--border-color)] group mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={mobileImageUrl} alt="Mobile Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={handleMobileImageUpload} className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-xs font-semibold text-white transition-all">Change</button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={handleMobileImageUpload}
                    className="h-32 rounded-xl border-2 border-dashed border-[var(--border-color)] hover:border-[var(--brand-primary)]/50 bg-black/5 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[var(--brand-primary)]/5"
                  >
                    <IconUpload />
                    <p className="text-[10px] text-[var(--text-muted)] mt-2 font-medium">Upload Mobile specific crop</p>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Title / Reference Name</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  className="w-full bg-transparent border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all"
                  placeholder="e.g., Summer Bridal Sale"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Placement Zone</label>
                <select 
                  value={placement} 
                  onChange={e => setPlacement(e.target.value)}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] appearance-none"
                >
                  <option value="HERO">Homepage Hero Slider</option>
                  <option value="PLP">Category Grid (PLP)</option>
                  <option value="SIDEBAR">Catalog Sidebar</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Destination URL</label>
                <input 
                  type="text" 
                  value={linkUrl} 
                  onChange={e => setLinkUrl(e.target.value)} 
                  className="w-full bg-transparent border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] transition-all"
                  placeholder="e.g., /catalog?collection=bridal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={status === 'ACTIVE'} onChange={() => setStatus('ACTIVE')} className="accent-[var(--brand-primary)]" />
                    <span className="text-sm text-[var(--text-main)]">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={status === 'DRAFT'} onChange={() => setStatus('DRAFT')} className="accent-[var(--brand-primary)]" />
                    <span className="text-sm text-[var(--text-muted)]">Draft / Hidden</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[var(--border-color)] bg-black/20 flex gap-4">
              <button 
                onClick={closeDrawer}
                className="flex-1 py-3 rounded-full bg-transparent text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] transition-all text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Banner'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
