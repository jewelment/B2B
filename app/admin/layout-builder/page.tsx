'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// SDUI Types
type ComponentType = 'HERO_BANNER' | 'CATEGORY_CAROUSEL' | 'PRODUCT_GRID' | 'TEXT_BLOCK' | 'SPACER';

interface SDUIComponent {
  id: string;
  type: ComponentType;
  props: any;
}

const AVAILABLE_COMPONENTS: { type: ComponentType; label: string; icon: any; defaultProps: any }[] = [
  { 
    type: 'HERO_BANNER', 
    label: 'Hero Banner', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    defaultProps: { imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000', title: 'New Collection', subtitle: 'Discover the latest' }
  },
  { 
    type: 'CATEGORY_CAROUSEL', 
    label: 'Category Carousel', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
    defaultProps: { title: 'Shop by Category', categories: 'Rings, Necklaces, Bracelets' }
  },
  { 
    type: 'PRODUCT_GRID', 
    label: 'Product Grid', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    defaultProps: { title: 'Trending Now', limit: 4, collectionId: 'all' }
  },
  { 
    type: 'TEXT_BLOCK', 
    label: 'Rich Text', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" /></svg>,
    defaultProps: { text: 'Welcome to Ashok Jewels B2B portal.', align: 'center' }
  },
  { 
    type: 'SPACER', 
    label: 'Spacer', 
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>,
    defaultProps: { height: 32 }
  }
];

export default function LayoutBuilder() {
  const [layout, setLayout] = useState<SDUIComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sdui-layout');
    if (saved) {
      try {
        setLayout(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveLayout = () => {
    localStorage.setItem('sdui-layout', JSON.stringify(layout));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const addComponent = (type: ComponentType, defaultProps: any) => {
    const newComponent: SDUIComponent = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      props: { ...defaultProps }
    };
    setLayout([...layout, newComponent]);
    setSelectedId(newComponent.id);
  };

  const removeComponent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLayout(layout.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const moveComponent = (index: number, direction: -1 | 1, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index + direction < 0 || index + direction >= layout.length) return;
    const newLayout = [...layout];
    const temp = newLayout[index];
    newLayout[index] = newLayout[index + direction];
    newLayout[index + direction] = temp;
    setLayout(newLayout);
  };

  const updateSelectedComponent = (key: string, value: any) => {
    setLayout(layout.map(c => {
      if (c.id === selectedId) {
        return { ...c, props: { ...c.props, [key]: value } };
      }
      return c;
    }));
  };

  const selectedComponent = layout.find(c => c.id === selectedId);

  // Render visual mockups for each component type
  const renderPreview = (comp: SDUIComponent) => {
    switch (comp.type) {
      case 'HERO_BANNER':
        return (
          <div className="relative w-full aspect-[4/3] bg-neutral-200 overflow-hidden flex items-center justify-center">
            {comp.props.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={comp.props.imageUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <span className="text-neutral-400">No Image</span>
            )}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-4 text-center">
              <h2 className="text-xl font-bold tracking-tight">{comp.props.title || 'Title'}</h2>
              <p className="text-xs opacity-80 mt-1">{comp.props.subtitle}</p>
            </div>
          </div>
        );
      case 'CATEGORY_CAROUSEL':
        return (
          <div className="py-4 px-2 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-3 px-2">{comp.props.title}</h3>
            <div className="flex gap-2 overflow-hidden px-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex-shrink-0 w-20 h-24 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-neutral-200"></div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'PRODUCT_GRID':
        return (
          <div className="py-4 px-4 bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-800 mb-3">{comp.props.title}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(Number(comp.props.limit) || 4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-50 rounded-lg border border-neutral-200 p-2 flex flex-col">
                  <div className="flex-1 bg-neutral-100 rounded mb-2"></div>
                  <div className="h-2 bg-neutral-200 rounded w-2/3 mb-1"></div>
                  <div className="h-2 bg-neutral-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'TEXT_BLOCK':
        return (
          <div className={`py-6 px-4 bg-white`} style={{ textAlign: comp.props.align || 'left' }}>
            <p className="text-sm text-neutral-600">{comp.props.text}</p>
          </div>
        );
      case 'SPACER':
        return (
          <div className="w-full border-y border-dashed border-neutral-200 bg-neutral-50 flex items-center justify-center text-[10px] text-neutral-400" style={{ height: Number(comp.props.height) || 32 }}>
            {comp.props.height}px Space
          </div>
        );
      default:
        return <div>Unknown Component</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans flex flex-col h-screen overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-6 flex items-center justify-between flex-shrink-0 z-10 relative">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SDUI Layout Builder</h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-[var(--text-muted)]">Phase 9.1 &bull; Server-Driven UI Native Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={saveLayout}
            className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm ${isSaved ? 'bg-emerald-500 text-white' : 'bg-[var(--brand-primary)] text-white hover:opacity-90'}`}
          >
            {isSaved ? 'Saved Locally!' : 'Save Schema'}
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: TOOLBOX */}
        <div className="w-72 border-r border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col overflow-y-auto custom-scrollbar">
          <div className="p-5">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Available Components</h2>
            <div className="space-y-2">
              {AVAILABLE_COMPONENTS.map(comp => (
                <button 
                  key={comp.type}
                  onClick={() => addComponent(comp.type, comp.defaultProps)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all text-left group"
                >
                  <div className="text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors">
                    {comp.icon}
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">{comp.label}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <div className="flex gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-[10px] font-medium text-amber-600 dark:text-amber-500 leading-relaxed">
                    This SDUI Layout drives the native Expo app and modern frontend dynamically. The schema will be exported as JSON via the Mobile API.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER PANEL: PREVIEW CANVAS */}
        <div className="flex-1 bg-[var(--bg-base)] overflow-y-auto relative flex flex-col items-center py-12 custom-scrollbar shadow-inner">
          
          <div className="w-[390px] min-h-[844px] bg-white shadow-2xl rounded-[3rem] border-[14px] border-neutral-900 overflow-hidden relative ring-1 ring-black/5 flex flex-col shrink-0">
            
            {/* Fake iPhone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
              <div className="w-40 h-6 bg-neutral-900 rounded-b-3xl"></div>
            </div>

            {/* Mobile Header Mock */}
            <div className="h-20 bg-white border-b border-neutral-100 pt-10 px-6 flex items-center justify-between sticky top-0 z-40">
              <div className="text-xl font-black tracking-tighter text-black">ASHOK JEWELS</div>
              <svg className="w-6 h-6 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-neutral-50 pb-20">
              {layout.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 p-8 text-center min-h-[500px]">
                  <svg className="w-12 h-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-sm font-medium text-neutral-500">Your Canvas is Empty</p>
                  <p className="text-xs mt-1">Add components from the toolbox to start building the mobile layout.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {layout.map((comp, idx) => (
                    <div 
                      key={comp.id} 
                      onClick={() => setSelectedId(comp.id)}
                      className={`relative group cursor-pointer transition-all ${selectedId === comp.id ? 'ring-2 ring-[var(--brand-primary)] z-10' : 'hover:ring-2 hover:ring-blue-400/50 hover:z-10'}`}
                    >
                      {/* Component Actions */}
                      <div className={`absolute top-2 right-2 bg-neutral-900/90 backdrop-blur text-white p-1 rounded-lg shadow-lg flex items-center gap-1 opacity-0 transition-opacity ${selectedId === comp.id ? 'opacity-100' : 'group-hover:opacity-100'} z-20`}>
                        <button onClick={(e) => moveComponent(idx, -1, e)} disabled={idx === 0} className="p-1 hover:bg-white/20 rounded disabled:opacity-30"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></button>
                        <button onClick={(e) => moveComponent(idx, 1, e)} disabled={idx === layout.length - 1} className="p-1 hover:bg-white/20 rounded disabled:opacity-30"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></button>
                        <div className="w-px h-3 bg-white/20 mx-1"></div>
                        <button onClick={(e) => removeComponent(comp.id, e)} className="p-1 hover:bg-red-500 rounded text-red-300 hover:text-white"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                      
                      {/* The Preview */}
                      <div className={selectedId === comp.id ? 'opacity-90' : ''}>
                        {renderPreview(comp)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Nav Mock */}
            <div className="h-16 bg-white border-t border-neutral-100 absolute bottom-0 inset-x-0 flex items-center justify-around px-4 z-40 pointer-events-none">
              <div className="w-6 h-6 rounded bg-neutral-800"></div>
              <div className="w-6 h-6 rounded bg-neutral-300"></div>
              <div className="w-6 h-6 rounded bg-neutral-300"></div>
              <div className="w-6 h-6 rounded bg-neutral-300"></div>
            </div>
            
          </div>
        </div>

        {/* RIGHT PANEL: INSPECTOR */}
        <div className="w-80 border-l border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-col overflow-y-auto custom-scrollbar">
          {selectedComponent ? (
            <div className="p-5 animate-in fade-in slide-in-from-right-4">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[var(--border-color)]">
                <div className="p-2 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-lg">
                  {AVAILABLE_COMPONENTS.find(c => c.type === selectedComponent.type)?.icon}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-main)]">
                    {AVAILABLE_COMPONENTS.find(c => c.type === selectedComponent.type)?.label}
                  </h2>
                  <p className="text-[10px] font-mono text-[var(--text-muted)]">ID: {selectedComponent.id}</p>
                </div>
              </div>

              <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Properties</h3>
              
              <div className="space-y-4">
                {Object.keys(selectedComponent.props).map(key => {
                  const value = selectedComponent.props[key];
                  const type = typeof value;
                  
                  return (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                      {type === 'number' || key.includes('height') || key.includes('limit') ? (
                        <input 
                          type="number"
                          value={value}
                          onChange={(e) => updateSelectedComponent(key, Number(e.target.value))}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                        />
                      ) : type === 'string' && value.length > 50 ? (
                        <textarea
                          value={value}
                          onChange={(e) => updateSelectedComponent(key, e.target.value)}
                          rows={3}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-primary)] transition-colors resize-none"
                        />
                      ) : key === 'align' ? (
                        <select
                          value={value}
                          onChange={(e) => updateSelectedComponent(key, e.target.value)}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      ) : (
                        <input 
                          type="text"
                          value={value}
                          onChange={(e) => updateSelectedComponent(key, e.target.value)}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="p-5 h-full flex flex-col items-center justify-center text-center">
              <svg className="w-10 h-10 text-[var(--border-color)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              <h3 className="text-sm font-semibold text-[var(--text-main)] mb-1">No Component Selected</h3>
              <p className="text-xs text-[var(--text-muted)]">Click on a component in the canvas to edit its properties.</p>
            </div>
          )}
          
          {/* JSON EXPORT PREVIEW */}
          <div className="mt-auto border-t border-[var(--border-color)] bg-[var(--bg-base)]">
            <div className="p-3 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">SDUI Payload Schema</span>
            </div>
            <div className="p-4 h-48 overflow-y-auto custom-scrollbar bg-[#0d1117] text-[#58a6ff]">
              <pre className="text-[10px] font-mono leading-relaxed">
                {JSON.stringify({ version: "1.0", layout }, null, 2)}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
