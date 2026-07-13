"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ComponentType = 'HeroBanner' | 'ProductCarousel' | 'TextBlock' | 'BentoGrid' | 'ProductGrid';

interface SDUIComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
}

const DEFAULT_PROPS: Record<ComponentType, any> = {
  HeroBanner: { title: 'Welcome to our B2B Portal', subtitle: 'Discover our latest collections.', imageUrl: '', buttonText: 'Shop Now' },
  ProductCarousel: { title: 'Featured Products', category: 'ALL', count: 4 },
  TextBlock: { content: 'Add your rich text content here...', align: 'center' },
  BentoGrid: { title: 'Collections', items: [] },
  ProductGrid: { title: 'Master Inventory', showFilters: true }
};

// --- Sortable Item Wrapper ---
function SortableItem({ id, item, isSelected, onClick, onRemove, previewMode }: { id: string, item: SDUIComponent, isSelected: boolean, onClick: () => void, onRemove: () => void, previewMode?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderContent = () => (
    <div className="flex flex-col gap-2 pointer-events-none w-full">
      {!previewMode && <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">{item.type}</span>}
      {item.type === 'HeroBanner' && (
        <div className={`w-full bg-slate-100 flex items-center justify-center flex-col text-center p-4 relative overflow-hidden ${previewMode ? 'aspect-[4/3] rounded-none' : 'h-32 rounded-lg border border-slate-200'}`}>
          {item.props.imageUrl && <img src={item.props.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />}
          <h3 className="font-bold text-lg relative z-10">{item.props.title}</h3>
          <p className="text-sm text-slate-600 relative z-10">{item.props.subtitle}</p>
          {previewMode && item.props.buttonText && <button className="mt-4 px-6 py-2 bg-black text-white text-xs font-bold relative z-10">{item.props.buttonText}</button>}
        </div>
      )}
      {item.type === 'ProductCarousel' && (
        <div className={`w-full bg-white p-4 ${previewMode ? '' : 'rounded-lg border border-slate-200 bg-slate-50'}`}>
          <h3 className={`font-bold ${previewMode ? 'text-sm mb-4 uppercase tracking-widest' : 'mb-2'}`}>{item.props.title}</h3>
          <div className="flex gap-2 overflow-hidden">
            {[...Array(item.props.count)].map((_, i) => (
              <div key={i} className={`flex-shrink-0 ${previewMode ? 'w-32 aspect-[3/4]' : 'flex-1 h-20'} bg-slate-100 border border-slate-200 rounded-md`}></div>
            ))}
          </div>
        </div>
      )}
      {item.type === 'TextBlock' && (
        <div className={`w-full bg-white p-6 text-${item.props.align || 'center'}`}>
          <p className="text-slate-600 text-sm leading-relaxed">{item.props.content}</p>
        </div>
      )}
      {item.type === 'BentoGrid' && (
        <div className={`w-full bg-white p-4 ${previewMode ? '' : 'rounded-lg border border-slate-200 bg-slate-50'}`}>
          <h3 className={`font-bold ${previewMode ? 'text-sm mb-4 uppercase tracking-widest' : 'mb-2'}`}>{item.props.title}</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className={`bg-slate-100 border border-slate-200 rounded-md ${previewMode ? 'aspect-square' : 'h-16'}`}></div>
            <div className={`bg-slate-100 border border-slate-200 rounded-md ${previewMode ? 'aspect-square' : 'h-16'}`}></div>
          </div>
        </div>
      )}
      {item.type === 'ProductGrid' && (
        <div className={`w-full bg-white p-4 ${previewMode ? '' : 'rounded-lg border border-slate-200 bg-slate-50'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-bold ${previewMode ? 'text-sm uppercase tracking-widest' : ''}`}>{item.props.title}</h3>
            {item.props.showFilters && <div className="h-6 w-20 bg-slate-100 border border-slate-200 rounded-md"></div>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-100 border border-slate-200 rounded-md"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (previewMode) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        onClick={onClick}
        className={`relative transition-all cursor-pointer ${isSelected ? 'ring-2 ring-[var(--brand-primary)] z-10' : 'hover:ring-2 hover:ring-blue-300 z-0'}`}
      >
        {renderContent()}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 mb-4 border-2 rounded-xl transition-all cursor-pointer ${isSelected ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' : 'border-[var(--border-color)] bg-white hover:border-[var(--brand-primary)]/50'}`}
      onClick={onClick}
    >
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        <button 
          {...attributes} 
          {...listeners}
          className="p-1.5 bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="p-1.5 bg-red-50 rounded-md text-red-500 hover:bg-red-100"
          title="Remove"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
      {renderContent()}
    </div>
  );
}

// --- Main Builder Page ---
export default function ThemeBuilderPage() {
  const [fullData, setFullData] = useState<any>(null);
  const [targetPlatform, setTargetPlatform] = useState<'web' | 'app'>('web');
  const [currentEnv, setCurrentEnv] = useState<'draft' | 'staging' | 'prod'>('draft');
  const [currentPagePath, setCurrentPagePath] = useState<string>('/');

  const components = fullData?.[targetPlatform]?.[currentEnv]?.[currentPagePath] || [];

  const setComponents = (newComponentsOrUpdater: any) => {
    setFullData((prev: any) => {
      if (!prev) return prev;
      const currentArray = prev[targetPlatform]?.[currentEnv]?.[currentPagePath] || [];
      const newArray = typeof newComponentsOrUpdater === 'function' ? newComponentsOrUpdater(currentArray) : newComponentsOrUpdater;
      return {
        ...prev,
        [targetPlatform]: {
          ...prev[targetPlatform],
          [currentEnv]: {
            ...prev[targetPlatform][currentEnv],
            [currentPagePath]: newArray
          }
        }
      };
    });
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewMode, setPreviewMode] = useState(false);

  // Auto-switch device view when platform changes
  useEffect(() => {
    if (targetPlatform === 'web') setDeviceView('desktop');
    if (targetPlatform === 'app') setDeviceView('mobile');
    setSelectedId(null);
  }, [targetPlatform]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchLayout();
  }, []);

  const fetchLayout = async () => {
    try {
      const res = await fetch('/api/admin/theme-builder');
      const data = await res.json();
      if (data.success && data.layoutData) {
        setFullData(data.layoutData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (envToSave: 'draft' | 'staging' | 'prod' = 'draft') => {
    setSaving(true);
    try {
      let dataToSave = { ...fullData };
      
      // If saving to staging, copy draft -> staging
      if (envToSave === 'staging') {
        dataToSave[targetPlatform].staging = JSON.parse(JSON.stringify(dataToSave[targetPlatform].draft));
      }
      // If saving to prod, copy staging -> prod
      if (envToSave === 'prod') {
        dataToSave[targetPlatform].prod = JSON.parse(JSON.stringify(dataToSave[targetPlatform].staging));
      }

      const res = await fetch('/api/admin/theme-builder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layoutData: dataToSave })
      });
      if (!res.ok) throw new Error('Failed to save');
      
      setFullData(dataToSave);
      
      if (envToSave === 'draft') alert('Draft saved successfully!');
      if (envToSave === 'staging') alert('Layout deployed to Staging successfully!');
      if (envToSave === 'prod') alert('Layout published to Production live successfully!');
    } catch (e) {
      console.error(e);
      alert('Error saving layout.');
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addComponent = (type: ComponentType) => {
    const newComp: SDUIComponent = {
      id: `${type}-${Date.now()}`,
      type,
      props: { ...DEFAULT_PROPS[type] }
    };
    setComponents([...components, newComp]);
    setSelectedId(newComp.id);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateSelectedProps = (newProps: any) => {
    setComponents(components.map(c => 
      c.id === selectedId ? { ...c, props: { ...c.props, ...newProps } } : c
    ));
  };

  const selectedComponent = components.find(c => c.id === selectedId);

  if (loading) return <div className="p-10 flex justify-center"><div className="animate-pulse">Loading Builder...</div></div>;

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-base)]">
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-[var(--border-color)] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-tight">Theme Builder</h1>
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-md uppercase tracking-widest">Phase 13 SDUI</span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => { setTargetPlatform('web'); setCurrentEnv('draft'); setCurrentPagePath('/'); }} 
              className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${targetPlatform === 'web' ? 'bg-white shadow text-[var(--brand-primary)]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Website Channel
            </button>
            <button 
              onClick={() => { setTargetPlatform('app'); setCurrentEnv('draft'); setCurrentPagePath('/'); }} 
              className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${targetPlatform === 'app' ? 'bg-white shadow text-[var(--brand-primary)]' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Mobile App Channel
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('draft')}
            disabled={saving || currentEnv !== 'draft'}
            className="px-4 py-1.5 bg-slate-100 text-slate-700 text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-slate-200 disabled:opacity-50 transition-all border border-slate-300"
          >
            Save as Draft
          </button>
          <button 
            onClick={() => handleSave('staging')}
            disabled={saving || currentEnv !== 'draft'}
            className="px-4 py-1.5 bg-blue-500 text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
            title="Deploy current draft to Staging"
          >
            Deploy to Staging
          </button>
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to push Staging to Production? This will be immediately visible to all live users.")) {
                handleSave('prod');
              }
            }}
            disabled={saving || currentEnv === 'draft'}
            className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md"
            title="Publish staging layout to Production"
          >
            Publish to Prod
          </button>
        </div>
      </header>

      {/* 3-PANE LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: PALETTE */}
        <aside className="w-72 bg-white border-r border-[var(--border-color)] p-6 overflow-y-auto">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Component Palette</h2>
          <div className="space-y-3">
            {(Object.keys(DEFAULT_PROPS) as ComponentType[]).map(type => (
              <button 
                key={type}
                onClick={() => addComponent(type)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all text-left group"
              >
                <span className="font-semibold text-sm">{type}</span>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            ))}
          </div>
          <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-100">
            Click a component above to add it to your canvas, then drag to reorder.
          </div>
        </aside>

        {/* CENTER PANE: CANVAS */}
        <main className="flex-1 bg-slate-100 overflow-y-auto p-8 flex flex-col items-center relative custom-scrollbar">
          
          {/* Top Toolbar */}
          <div className="flex items-center gap-6 mb-8 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 sticky top-0 z-[60] flex-wrap justify-center">
            
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setCurrentEnv('draft')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${currentEnv === 'draft' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Drafts</button>
              <button onClick={() => setCurrentEnv('staging')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${currentEnv === 'staging' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Staging</button>
              <button onClick={() => setCurrentEnv('prod')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${currentEnv === 'prod' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>Production</button>
            </div>
            
            <div className="w-px h-6 bg-slate-300"></div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Page:</span>
              <select 
                className="bg-slate-100 border-none text-sm font-bold rounded-md py-1.5 px-3 focus:ring-2 focus:ring-[var(--brand-primary)]"
                value={currentPagePath}
                onChange={(e) => setCurrentPagePath(e.target.value)}
              >
                {fullData && Object.keys(fullData[targetPlatform]?.[currentEnv] || {}).map(path => (
                  <option key={path} value={path}>{path}</option>
                ))}
              </select>
              <button 
                onClick={() => {
                  const newPath = prompt('Enter new page path (e.g., /about):', '/');
                  if (newPath && fullData) {
                    setFullData((prev: any) => ({
                      ...prev,
                      [targetPlatform]: {
                        ...prev[targetPlatform],
                        draft: { ...prev[targetPlatform].draft, [newPath]: [] },
                        staging: { ...prev[targetPlatform].staging, [newPath]: [] },
                        prod: { ...prev[targetPlatform].prod, [newPath]: [] }
                      }
                    }));
                    setCurrentPagePath(newPath);
                    setCurrentEnv('draft');
                  }
                }}
                className="p-1.5 bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                title="Add New Page"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>

            <div className="w-px h-6 bg-slate-300"></div>
            {targetPlatform === 'app' && (
              <>
                <div className="flex items-center bg-emerald-50 p-1 rounded-lg border border-emerald-100">
                  <button 
                    onClick={() => {
                      if (confirm("Initiate APK compilation process? This will package the current layout schema into a deployable Android bundle.")) {
                        alert("Starting build pipeline... (Simulated). The APK will be ready in the Release Manager shortly.");
                      }
                    }} 
                    className="px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 bg-emerald-500 shadow text-white hover:bg-emerald-600"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Build APK Release
                  </button>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
              </>
            )}
            {targetPlatform === 'web' && (
              <>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                  <button onClick={() => setDeviceView('mobile')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${deviceView === 'mobile' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    Mobile
                  </button>
                  <button onClick={() => setDeviceView('tablet')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${deviceView === 'tablet' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    Tablet
                  </button>
                  <button onClick={() => setDeviceView('desktop')} className={`px-4 py-1.5 text-xs font-bold rounded-md flex items-center gap-2 transition-all ${deviceView === 'desktop' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Desktop
                  </button>
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
              </>
            )}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setPreviewMode(false)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!previewMode ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                Builder
              </button>
              <button onClick={() => setPreviewMode(true)} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${previewMode ? 'bg-[var(--brand-primary)] shadow text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                <span className={`w-2 h-2 rounded-full ${previewMode ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></span>
                Live Preview
              </button>
            </div>
          </div>

          <div className={`transition-all duration-300 shrink-0 relative ${
            deviceView === 'mobile' 
              ? 'w-[390px] min-h-[844px] bg-white shadow-2xl rounded-[3rem] border-[14px] border-neutral-900 overflow-hidden ring-1 ring-black/5 flex flex-col' 
              : deviceView === 'tablet'
              ? 'w-[768px] min-h-[1024px] bg-white shadow-xl rounded-[2rem] border-[12px] border-neutral-800 overflow-hidden flex flex-col'
              : 'w-full max-w-5xl bg-white shadow-sm min-h-[800px] border border-slate-200 rounded-xl flex flex-col'
          }`}>
            
            {deviceView === 'mobile' && (
              <>
                {/* Fake iPhone Notch */}
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
                  <div className="w-40 h-6 bg-neutral-900 rounded-b-3xl"></div>
                </div>

                {/* Mobile Header Mock */}
                <div className="h-20 bg-white border-b border-neutral-100 pt-10 px-6 flex items-center justify-between sticky top-0 z-40">
                  <div className="text-xl font-black tracking-tighter text-black">ASHOK JEWELS</div>
                  <svg className="w-6 h-6 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
              </>
            )}

            <div className={`flex-1 ${previewMode ? 'bg-white' : 'bg-slate-50 p-4'}`}>
              {components.length === 0 ? (
                <div className="h-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-500 min-h-[500px] m-4">
                  <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="font-bold">Your canvas is empty.</p>
                  <p className="text-sm mt-1 text-center px-4">Add components from the palette to start building.</p>
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {components.map((comp) => (
                      <SortableItem 
                        key={comp.id} 
                        id={comp.id} 
                        item={comp} 
                        isSelected={selectedId === comp.id}
                        onClick={() => setSelectedId(comp.id)}
                        onRemove={() => removeComponent(comp.id)}
                        previewMode={previewMode}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>

            {deviceView === 'mobile' && previewMode && (
              <div className="h-16 bg-white border-t border-neutral-100 sticky bottom-0 inset-x-0 flex items-center justify-around px-4 z-40 pointer-events-none shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="w-6 h-6 rounded bg-neutral-800"></div>
                <div className="w-6 h-6 rounded bg-neutral-300"></div>
                <div className="w-6 h-6 rounded bg-neutral-300"></div>
                <div className="w-6 h-6 rounded bg-neutral-300"></div>
              </div>
            )}
            {deviceView === 'tablet' && (
              <>
                {/* Tablet Frame Mock */}
                <div className="absolute top-0 inset-x-0 h-4 flex justify-center z-50 pointer-events-none">
                  <div className="w-32 h-4 bg-neutral-800 rounded-b-2xl"></div>
                </div>
              </>
            )}
          </div>
        </main>

        {/* RIGHT PANE: INSPECTOR */}
        <aside className="w-80 bg-white border-l border-[var(--border-color)] overflow-y-auto">
          {selectedComponent ? (
            <div className="p-6">
              <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-6">Edit {selectedComponent.type}</h2>
              <div className="space-y-5">
                {Object.keys(selectedComponent.props).map(propKey => (
                  <div key={propKey}>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 capitalize">{propKey}</label>
                    {typeof selectedComponent.props[propKey] === 'number' ? (
                      <input 
                        type="number"
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[var(--brand-primary)]"
                        value={selectedComponent.props[propKey]}
                        onChange={(e) => updateSelectedProps({ [propKey]: parseInt(e.target.value) || 0 })}
                      />
                    ) : typeof selectedComponent.props[propKey] === 'boolean' ? (
                      <input 
                        type="checkbox"
                        className="w-5 h-5 rounded border-slate-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]"
                        checked={selectedComponent.props[propKey]}
                        onChange={(e) => updateSelectedProps({ [propKey]: e.target.checked })}
                      />
                    ) : propKey === 'content' || propKey === 'description' ? (
                      <textarea 
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[var(--brand-primary)] min-h-[100px]"
                        value={selectedComponent.props[propKey]}
                        onChange={(e) => updateSelectedProps({ [propKey]: e.target.value })}
                      />
                    ) : propKey.toLowerCase().includes('image') || propKey.toLowerCase().includes('icon') ? (
                      <div className="space-y-2">
                        {selectedComponent.props[propKey] && (
                          <img src={selectedComponent.props[propKey]} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                        )}
                        <input 
                          type="text"
                          className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[var(--brand-primary)]"
                          value={selectedComponent.props[propKey]}
                          onChange={(e) => updateSelectedProps({ [propKey]: e.target.value })}
                          placeholder="Image URL or upload below"
                        />
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const formData = new FormData();
                              formData.append('file', file);
                              formData.append('assetType', 'componentAsset');
                              // We use the existing theme api to upload assets
                              const res = await fetch('/api/admin/theme', {
                                method: 'POST',
                                body: formData
                              });
                              const data = await res.json();
                              if (data.success && data.url) {
                                updateSelectedProps({ [propKey]: data.url });
                              } else {
                                alert('Failed to upload image.');
                              }
                            }}
                          />
                          <div className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 border-dashed rounded-lg p-2.5 text-sm text-center text-slate-600 font-semibold transition-colors flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Upload New Image
                          </div>
                        </div>
                      </div>
                    ) : (
                      <input 
                        type="text"
                        className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[var(--brand-primary)]"
                        value={selectedComponent.props[propKey]}
                        onChange={(e) => updateSelectedProps({ [propKey]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-500 h-full flex flex-col justify-center">
              <svg className="w-10 h-10 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              <p className="text-sm">Select a component on the canvas to edit its properties.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
