'use client';

import React, { useState, useEffect } from 'react';

export default function ThemeSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    primaryFont: 'Inter',
    secondaryFont: 'Inter',
    logoLight: null,
    logoDark: null,
    faviconLight: null,
    faviconDark: null,
    brandName: '',
    brandDescription: '',
    brandSubheading: '',
  });
  
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fontOptions = ['Inter', 'Roboto', 'Playfair Display', 'Montserrat', 'Outfit', 'Cinzel'];

  useEffect(() => {
    fetch('/api/admin/theme')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(data.settings);
        }
        setLoading(false);
      });
  }, []);

  const handleFontSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryFont: settings.primaryFont,
          secondaryFont: settings.secondaryFont,
          brandName: settings.brandName,
          brandDescription: settings.brandDescription,
          brandSubheading: settings.brandSubheading,
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast("Text Settings updated!");
      } else {
        showToast("Failed to update text settings.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, assetType: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assetType', assetType);

      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setSettings((prev: any) => ({ ...prev, [assetType]: data.url }));
        showToast(`Asset uploaded successfully!`);
      } else {
        showToast("Upload failed.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-[var(--text-muted)] animate-pulse">Loading configurations...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 relative">
      
      {/* Custom Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center space-x-3 ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'}`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          )}
          <span className="font-bold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Branding & Typography</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Configure your B2B portal's visual identity. Upload logos and define core typefaces.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Typography Bento */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-5">Global Typography</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2">Primary Font (Headings)</label>
                <select 
                  value={settings.primaryFont || 'Inter'}
                  onChange={e => setSettings({...settings, primaryFont: e.target.value})}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] text-sm rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[#4e080f] focus:ring-1 focus:ring-[#4e080f]/30 outline-none transition-shadow"
                >
                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2">Secondary Font (Body Text)</label>
                <select 
                  value={settings.secondaryFont || 'Inter'}
                  onChange={e => setSettings({...settings, secondaryFont: e.target.value})}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] text-sm rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[#4e080f] focus:ring-1 focus:ring-[#4e080f]/30 outline-none transition-shadow"
                >
                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>

              <button 
                onClick={handleFontSave}
                disabled={saving}
                className="w-full mt-6 bg-[#4e080f] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-[#3a060b] shadow-lg shadow-[#4e080f]/20 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Apply Fonts'}
              </button>
            </div>
          </div>

          <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 mt-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-5">SEO & Text Branding</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2">Brand Name (Tab Title)</label>
                <input 
                  type="text" 
                  value={settings.brandName || ''}
                  onChange={e => setSettings({...settings, brandName: e.target.value})}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] text-sm rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[#4e080f] focus:ring-1 focus:ring-[#4e080f]/30 outline-none transition-shadow"
                  placeholder="e.g. Ashok Jewels B2B"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2">Brand Subheading</label>
                <input 
                  type="text" 
                  value={settings.brandSubheading || ''}
                  onChange={e => setSettings({...settings, brandSubheading: e.target.value})}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] text-sm rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[#4e080f] focus:ring-1 focus:ring-[#4e080f]/30 outline-none transition-shadow"
                  placeholder="e.g. Premium Wholesale Diamonds"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-2">Meta Description</label>
                <textarea 
                  value={settings.brandDescription || ''}
                  onChange={e => setSettings({...settings, brandDescription: e.target.value})}
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] text-sm rounded-lg px-4 py-2.5 text-[var(--text-main)] focus:border-[#4e080f] focus:ring-1 focus:ring-[#4e080f]/30 outline-none transition-shadow min-h-[80px]"
                  placeholder="Meta description for search engines..."
                />
              </div>
              <button 
                onClick={handleFontSave}
                disabled={saving}
                className="w-full mt-6 bg-[#4e080f] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-[#3a060b] shadow-lg shadow-[#4e080f]/20 transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Text Branding'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Media Uploads Bento */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-surface)]/80 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-300 h-full">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-5">Brand Assets</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Asset Box */}
              {[
                { key: 'logoLight', label: 'Primary Logo (Light Theme)', aspect: 'aspect-[3/1]', bg: 'bg-white' },
                { key: 'logoDark', label: 'Secondary Logo (Dark Theme)', aspect: 'aspect-[3/1]', bg: 'bg-black border border-white/10' },
                { key: 'faviconLight', label: 'Favicon (Light Tab)', aspect: 'aspect-square', bg: 'bg-white' },
                { key: 'faviconDark', label: 'Favicon (Dark Tab)', aspect: 'aspect-square', bg: 'bg-black border border-white/10' },
              ].map(asset => (
                <div key={asset.key} className="space-y-2">
                  <label className="block text-xs font-bold text-[var(--text-main)]">{asset.label}</label>
                  <div className={`relative ${asset.aspect} ${asset.bg} rounded-xl overflow-hidden shadow-inner flex items-center justify-center group`}>
                    
                    {settings[asset.key] ? (
                      <img src={settings[asset.key]} alt={asset.label} className="max-w-[80%] max-h-[80%] object-contain" />
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 opacity-50">Empty</span>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
                        Upload Image
                        <input type="file" accept="image/png, image/jpeg, image/webp, image/svg+xml" className="hidden" onChange={(e) => handleFileUpload(e, asset.key)} />
                      </label>
                    </div>

                  </div>
                  <p className="text-[10px] text-[var(--text-muted)]">Supported: PNG, WebP, JPG, SVG.</p>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
