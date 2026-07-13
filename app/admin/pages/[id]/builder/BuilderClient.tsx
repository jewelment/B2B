"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import { DivKit } from '@divkitframework/react';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { compileToDivKit, SDUIComponent, ComponentType } from '@/lib/divkitCompiler';

function DraggableSidebarBlock({ type, variant, children }: { type: ComponentType, variant: string, children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar_${type}_${variant}`,
    data: { type, variant, isSidebar: true }
  });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
      {children}
    </div>
  );
}

function SortableItem(props: { id: string; comp: SDUIComponent; isSelected: boolean; onSelect: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      onClick={(e) => { e.stopPropagation(); props.onSelect(); }}
      className={`relative group p-4 border-2 transition-all cursor-pointer rounded-2xl ${props.isSelected ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 z-10 shadow-lg' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'}`}
    >
      <div className={`absolute top-2 right-2 flex gap-1 transition-opacity z-10 ${props.isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <button onClick={(e) => { e.stopPropagation(); props.onDelete(); }} className="bg-red-500 text-white p-1.5 rounded-lg shadow-sm hover:bg-red-600 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
      
      {/* Component Visual Stub inside Phone Frame */}
      {props.comp.type === 'HeroBanner' && (
        <div className="bg-slate-900 rounded-xl p-6 text-center text-white relative overflow-hidden h-48 flex flex-col justify-center shadow-inner">
          {(props.comp.props as any).imageUrl && <img src={(props.comp.props as any).imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt="" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <h3 className="relative z-10 text-xl font-light tracking-wide">{(props.comp.props as any).title || 'Hero Banner'}</h3>
          <p className="relative z-10 text-[10px] opacity-80 mt-2 uppercase tracking-widest">{(props.comp.props as any).subtitle || 'Subtitle here'}</p>
          {(props.comp.props as any).ctaText && (
            <div className="relative z-10 mt-4">
              <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">{(props.comp.props as any).ctaText}</span>
            </div>
          )}
        </div>
      )}
      
      {props.comp.type === 'ProductGrid' && (
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-widest">{(props.comp.props as any).title || 'Product Grid'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-800 h-24 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"></div>
            <div className="bg-white dark:bg-slate-800 h-24 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"></div>
            <div className="bg-white dark:bg-slate-800 h-24 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"></div>
            <div className="bg-white dark:bg-slate-800 h-24 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"></div>
          </div>
        </div>
      )}

      {props.comp.type === 'TextBlock' && (
        <div className="bg-transparent p-4">
          <h3 className="text-xl font-light text-slate-800 dark:text-slate-100 mb-2">{(props.comp.props as any).title || 'Text Block'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{(props.comp.props as any).content || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}</p>
        </div>
      )}
    </div>
  );
}

function SortableLayerItem(props: { id: string; comp: SDUIComponent; isSelected: boolean; onSelect: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `layer_${props.id}` });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div 
      ref={setNodeRef} style={style} {...attributes} {...listeners}
      onClick={(e) => { e.stopPropagation(); props.onSelect(); }}
      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-grab active:cursor-grabbing mb-2 transition-all ${props.isSelected ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/30' : 'bg-[var(--bg-base)] border-[var(--border-color)] hover:border-slate-400'}`}
    >
      <div className="flex items-center gap-3">
        <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
        <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-widest">{props.comp.type}</span>
      </div>
      <button onClick={(e) => { e.stopPropagation(); props.onDelete(); }} className="text-red-400 hover:text-red-600 transition-colors p-1">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
}

export default function BuilderClient({ pageData }: { pageData: any }) {
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'CODE' | 'PREVIEW'>('VISUAL');
  const [sidebarTab, setSidebarTab] = useState<'BLOCKS' | 'LAYERS'>('BLOCKS');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [environment, setEnvironment] = useState(pageData.environment || 'DRAFT');
  
  const [globalHeader, setGlobalHeader] = useState<any>({ title: 'Global Header Store', showSearch: true });
  const [globalFooter, setGlobalFooter] = useState<any>({ title: 'Global Footer © 2026' });
  
  const [components, setComponents] = useState<SDUIComponent[]>(() => {
    if (pageData.layoutData) {
      try { return JSON.parse(pageData.layoutData); } catch(e) { return []; }
    }
    return [];
  });
  
  const [jsonCode, setJsonCode] = useState<string>(() => JSON.stringify(components, null, 2));

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const { setNodeRef: setCanvasRef } = useDroppable({ id: 'canvas_droppable' });
  
  const [activeDragItem, setActiveDragItem] = useState<any>(null);

  const handleDragStart = (event: any) => {
    setActiveDragItem(event.active);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveDragItem(null);
    
    if (!over) return;

    if (active.data.current?.isSidebar) {
      // Dropped a new component from the sidebar
      const type = active.data.current.type;
      const variant = active.data.current.variant;
      addComponent(type, variant);
      return;
    }

    // Sorting existing components
    // Map layer ids back to normal ids
    const activeId = active.id.toString().replace('layer_', '');
    const overId = over.id.toString().replace('layer_', '').replace('canvas_droppable', '');

    if (activeId !== overId && overId) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  useEffect(() => {
    if (activeTab !== 'CODE') setJsonCode(JSON.stringify(components, null, 2));
  }, [components, activeTab]);

  const handleCodeChange = (value: string | undefined) => {
    setJsonCode(value || '');
    try { setComponents(JSON.parse(value || '[]')); } catch (e) {}
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (publishEnv?: string) => {
    try {
      setIsSaving(true);
      const targetEnv = publishEnv || environment;
      const res = await fetch('/api/admin/sdui/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: pageData.id, layoutData: JSON.stringify(components), environment: targetEnv })
      });
      if (res.ok) {
        alert(`Layout saved to ${targetEnv} successfully!`);
        setEnvironment(targetEnv);
      }
      else alert("Failed to save layout.");
    } catch (e) {
      console.error(e);
      alert("Error saving layout.");
    } finally {
      setIsSaving(false);
    }
  };

  const addComponent = (type: ComponentType, variant: string = 'default') => {
    const newId = `comp_${Math.random().toString(36).substr(2, 9)}`;
    let props = {};
    if (type === 'HeroBanner') {
      props = variant === 'Luxury Minimalist' 
        ? { title: 'Elegance Redefined', subtitle: 'Explore the minimal collection.', imageUrl: 'https://placehold.co/800x400/1a1a1a/FFF' }
        : { title: 'Summer Collection', subtitle: 'Shop now', imageUrl: 'https://placehold.co/400x800/e2e8f0/000' };
    } else if (type === 'TextBlock') {
      props = { title: 'About Us', content: 'We craft luxury experiences.' };
    } else if (type === 'ProductGrid') {
      props = { title: 'Featured Products', showFilters: true };
    }
    setComponents([...components, { id: newId, type, props }]);
    setSelectedComponentId(newId);
  };

  const updateSelectedComponentProp = (key: string, value: any) => {
    if (selectedComponentId === 'global_header') { setGlobalHeader({ ...globalHeader, [key]: value }); return; }
    if (selectedComponentId === 'global_footer') { setGlobalFooter({ ...globalFooter, [key]: value }); return; }
    
    setComponents(comps => comps.map(c => c.id === selectedComponentId ? { ...c, props: { ...c.props, [key]: value } } : c));
  };

  const selectedComponent = selectedComponentId === 'global_header' ? { type: 'GlobalHeader', props: globalHeader } 
                          : selectedComponentId === 'global_footer' ? { type: 'GlobalFooter', props: globalFooter }
                          : components.find(c => c.id === selectedComponentId);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden font-sans text-[var(--text-main)] selection:bg-[var(--brand-primary)] selection:text-white">
        
        {/* LEFT SIDEBAR: COMPONENT LIBRARY & LAYERS */}
        <div className="w-72 bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col shrink-0 z-20 shadow-sm relative">
          <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <Link href="/admin/pages" className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </Link>
            </div>
            <div className="flex bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg p-1">
              <button onClick={() => setSidebarTab('BLOCKS')} className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-md transition-all ${sidebarTab === 'BLOCKS' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>Blocks</button>
              <button onClick={() => setSidebarTab('LAYERS')} className={`px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-md transition-all ${sidebarTab === 'LAYERS' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>Layers</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {sidebarTab === 'BLOCKS' ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Hero Banners
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <DraggableSidebarBlock type="HeroBanner" variant="Luxury Minimalist">
                      <div className="flex flex-col text-left p-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all group shadow-sm bg-[var(--bg-base)] pointer-events-none">
                        <div className="w-full h-20 bg-slate-800 rounded-lg mb-3 flex items-center justify-center border border-slate-700">
                          <div className="w-1/2 h-2 bg-white/20 rounded-full"></div>
                        </div>
                        <div className="text-xs font-bold group-hover:text-[var(--brand-primary)]">Luxury Minimalist</div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-1">Drag to add to canvas</div>
                      </div>
                    </DraggableSidebarBlock>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Dynamic Data
                  </h3>
                  <DraggableSidebarBlock type="ProductGrid" variant="default">
                    <div className="flex flex-col text-left p-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all group shadow-sm bg-[var(--bg-base)] pointer-events-none">
                      <div className="w-full h-20 rounded-lg mb-3 grid grid-cols-3 gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-2 border border-[var(--border-color)]">
                        <div className="bg-slate-200 dark:bg-slate-700 rounded-sm"></div><div className="bg-slate-200 dark:bg-slate-700 rounded-sm"></div><div className="bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
                      </div>
                      <div className="text-xs font-bold group-hover:text-[var(--brand-primary)]">Product Grid</div>
                    </div>
                  </DraggableSidebarBlock>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Typography
                  </h3>
                  <DraggableSidebarBlock type="TextBlock" variant="default">
                    <div className="w-full text-left p-3 rounded-xl border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all group shadow-sm bg-[var(--bg-base)] flex items-center gap-3 pointer-events-none">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-serif text-lg font-bold text-slate-500 border border-[var(--border-color)]">T</div>
                      <div>
                        <div className="text-xs font-bold group-hover:text-[var(--brand-primary)]">Rich Text Block</div>
                        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">Paragraphs & Headings</div>
                      </div>
                    </div>
                  </DraggableSidebarBlock>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <SortableContext items={components.map(c => `layer_${c.id}`)} strategy={verticalListSortingStrategy}>
                  {components.map((comp, idx) => (
                    <SortableLayerItem 
                      key={comp.id} id={comp.id} comp={comp} 
                      isSelected={selectedComponentId === comp.id}
                      onSelect={() => setSelectedComponentId(comp.id)}
                      onDelete={() => {
                        const newComps = [...components];
                        newComps.splice(idx, 1);
                        setComponents(newComps);
                        if (selectedComponentId === comp.id) setSelectedComponentId(null);
                      }} 
                    />
                  ))}
                </SortableContext>
                {components.length === 0 && (
                  <div className="text-center p-6 text-[var(--text-muted)] text-xs border-2 border-dashed border-[var(--border-color)] rounded-xl">
                    No layers on canvas.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CANVAS AREA */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[var(--bg-base)]">
          
          {/* TOP TOOLBAR */}
          <div className="h-16 border-b border-[var(--border-color)] flex items-center justify-between px-6 shrink-0 z-30 bg-[var(--bg-surface)]/80 backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-3">
              <span className="bg-[var(--bg-base)] text-[var(--text-muted)] px-3 py-1.5 rounded-lg text-xs font-mono border border-[var(--border-color)] shadow-inner">
                {pageData.path}
              </span>
              <h1 className="font-bold text-sm tracking-wide">{pageData.title}</h1>
              
              <div className={`ml-4 px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full border ${environment === 'PRODUCTION' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : environment === 'STAGING' ? 'bg-blue-50 text-blue-600 border-blue-100' : environment === 'DEVELOPMENT' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {environment}
              </div>
            </div>

            <div className="flex items-center bg-[var(--bg-base)] p-1 rounded-xl border border-[var(--border-color)] shadow-inner">
              <button onClick={() => setActiveTab('VISUAL')} className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'VISUAL' ? 'bg-[var(--bg-surface)] shadow text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                Live Canvas
              </button>
              <button onClick={() => setActiveTab('CODE')} className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'CODE' ? 'bg-[var(--bg-surface)] shadow text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>
                Liquid JSON
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select 
                onChange={(e) => handleSave(e.target.value)} 
                disabled={isSaving}
                className="bg-transparent border border-[var(--border-color)] text-[var(--text-main)] px-3 py-2 rounded-lg text-xs font-bold focus:outline-none cursor-pointer"
                value=""
              >
                <option value="" disabled>Publish to...</option>
                <option value="DRAFT">Draft</option>
                <option value="DEVELOPMENT">Development</option>
                <option value="STAGING">Staging</option>
                <option value="PRODUCTION">Production</option>
              </select>
              <button onClick={() => handleSave()} disabled={isSaving} className="bg-[var(--brand-primary)] text-white px-6 py-2.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest disabled:opacity-50 flex items-center gap-2">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* WORKSPACE CONTENT */}
          <div className="flex-1 overflow-hidden relative">
            
            {/* VISUAL BUILDER TAB (IPHONE MOCKUP) */}
            {activeTab === 'VISUAL' && (
              <div className="absolute inset-0 overflow-y-auto p-10 flex justify-center bg-[var(--bg-base)] custom-scrollbar" onClick={() => setSelectedComponentId(null)}>
                
                {/* iPhone Frame */}
                <div 
                  className="w-[400px] bg-white dark:bg-slate-900 rounded-[3.5rem] border-[16px] border-slate-900 dark:border-black shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative flex flex-col shrink-0 transition-all group overflow-hidden"
                  style={{ height: '850px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Hardware Details */}
                  <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50 pointer-events-none">
                    <div className="w-40 h-7 bg-slate-900 dark:bg-black rounded-b-3xl relative flex justify-center items-center gap-4">
                      <div className="w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pt-12 pb-8 px-4 bg-slate-50 dark:bg-[#0a0a0a] flex flex-col">
                    
                    {/* GLOBAL HEADER */}
                    <div onClick={() => setSelectedComponentId('global_header')} className={`w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 shrink-0 flex items-center justify-between cursor-pointer transition-all mb-4 rounded-xl ${selectedComponentId === 'global_header' ? 'ring-2 ring-[var(--brand-primary)] shadow-md' : 'hover:border-slate-400'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        <span className="font-bold text-sm tracking-wide">{globalHeader.title}</span>
                      </div>
                      {globalHeader.showSearch && (
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      )}
                    </div>

                    <div ref={setCanvasRef} className="flex-1">
                      {components.length === 0 ? (
                        <div className="h-[400px] border-2 border-dashed border-[var(--border-color)] rounded-3xl flex flex-col items-center justify-center text-[var(--text-muted)] m-2 bg-[var(--bg-base)]">
                          <p className="font-bold text-sm tracking-wide text-[var(--text-main)]">Canvas Droppable Area</p>
                          <p className="text-[11px] mt-2 tracking-widest uppercase">Drag blocks from library</p>
                        </div>
                      ) : (
                        <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-4">
                            {components.map((comp, idx) => (
                              <SortableItem 
                                key={comp.id} 
                                id={comp.id} 
                                comp={comp} 
                                isSelected={selectedComponentId === comp.id}
                                onSelect={() => setSelectedComponentId(comp.id)}
                                onDelete={() => {
                                  const newComps = [...components];
                                  newComps.splice(idx, 1);
                                  setComponents(newComps);
                                  if (selectedComponentId === comp.id) setSelectedComponentId(null);
                                }} 
                              />
                            ))}
                          </div>
                        </SortableContext>
                      )}
                    </div>

                    {/* GLOBAL FOOTER */}
                    <div onClick={() => setSelectedComponentId('global_footer')} className={`w-full bg-slate-900 text-white p-6 shrink-0 text-center cursor-pointer transition-all mt-4 rounded-xl ${selectedComponentId === 'global_footer' ? 'ring-2 ring-[var(--brand-primary)] shadow-md' : 'opacity-90 hover:opacity-100'}`}>
                      <span className="font-bold text-xs tracking-widest uppercase opacity-70">{globalFooter.title}</span>
                      <div className="flex justify-center gap-4 mt-4 opacity-50">
                        <div className="w-8 h-1 bg-white rounded"></div><div className="w-8 h-1 bg-white rounded"></div>
                      </div>
                    </div>

                  </div>
                  
                  {/* Home Indicator */}
                  <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-50">
                    <div className="w-32 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}

            {/* CODE EDITOR TAB */}
            {activeTab === 'CODE' && (
              <div className="absolute inset-0 bg-[#1e1e1e] animate-in fade-in">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme="vs-dark"
                  value={jsonCode}
                  onChange={handleCodeChange}
                  options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on', formatOnPaste: true, padding: { top: 24 } }}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: PROPERTIES INSPECTOR */}
        {activeTab === 'VISUAL' && (
          <div className="w-80 bg-[var(--bg-surface)] border-l border-[var(--border-color)] flex flex-col shrink-0 z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] transition-all animate-in slide-in-from-right-8 duration-500">
            <div className="p-5 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5 flex items-center justify-between">
              <h2 className="text-xs font-black tracking-widest uppercase">Settings & Properties</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {!selectedComponent ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <div className="w-16 h-16 border border-[var(--border-color)] rounded-2xl flex items-center justify-center mb-6 bg-[var(--bg-base)]">
                    <svg className="w-8 h-8 text-[var(--text-main)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                  </div>
                  <p className="text-sm font-bold tracking-wide text-[var(--text-main)]">No Block Selected</p>
                  <p className="text-[11px] mt-3 tracking-widest uppercase text-[var(--text-muted)] leading-relaxed">Click a block on the canvas<br/>to edit its properties</p>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-300">
                  
                  <div className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border border-[var(--brand-primary)]/20 flex items-center gap-3">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {selectedComponent.type}
                  </div>

                  <div className="space-y-5">
                    
                    {/* Common Properties */}
                    <div>
                      <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center justify-between">
                        Title / Header
                      </label>
                      <input 
                        type="text" 
                        value={(selectedComponent.props as any).title || ''} 
                        onChange={(e) => updateSelectedComponentProp('title', e.target.value)}
                        className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all shadow-inner"
                      />
                    </div>

                    {selectedComponent.type === 'HeroBanner' && (
                      <>
                        <div>
                          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Subtitle</label>
                          <input 
                            type="text" 
                            value={(selectedComponent.props as any).subtitle || ''} 
                            onChange={(e) => updateSelectedComponentProp('subtitle', e.target.value)}
                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all shadow-inner"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Call to Action Text</label>
                          <input 
                            type="text" 
                            value={(selectedComponent.props as any).ctaText || ''} 
                            onChange={(e) => updateSelectedComponentProp('ctaText', e.target.value)}
                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--brand-primary)] transition-all shadow-inner"
                            placeholder="e.g. Shop Now"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Call to Action URL</label>
                          <input 
                            type="text" 
                            value={(selectedComponent.props as any).ctaUrl || ''} 
                            onChange={(e) => updateSelectedComponentProp('ctaUrl', e.target.value)}
                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--brand-primary)] transition-all shadow-inner"
                            placeholder="/products"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center justify-between">
                            Background Image
                          </label>
                          <input 
                            type="text" 
                            value={(selectedComponent.props as any).imageUrl || ''} 
                            onChange={(e) => updateSelectedComponentProp('imageUrl', e.target.value)}
                            className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all shadow-inner font-mono text-[11px] mb-2"
                            placeholder="https://"
                          />
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => updateSelectedComponentProp('imageUrl', ev.target?.result);
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="bg-[var(--bg-surface)] border border-dashed border-[var(--border-color)] rounded-xl p-4 text-center hover:bg-[var(--brand-primary)]/5 hover:border-[var(--brand-primary)] transition-colors">
                              <svg className="w-6 h-6 mx-auto mb-2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                              <span className="text-xs font-bold text-[var(--brand-primary)]">Upload Local Image</span>
                            </div>
                          </div>

                          {(selectedComponent.props as any).imageUrl && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-[var(--border-color)] h-24 relative bg-slate-900">
                              <img src={(selectedComponent.props as any).imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {selectedComponent.type === 'TextBlock' && (
                      <div>
                        <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2">Paragraph Content</label>
                        <textarea 
                          value={(selectedComponent.props as any).content || ''} 
                          onChange={(e) => updateSelectedComponentProp('content', e.target.value)}
                          rows={6}
                          className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)] transition-all shadow-inner resize-none leading-relaxed"
                        />
                      </div>
                    )}

                    {selectedComponent.type === 'GlobalHeader' && (
                      <div className="flex items-center justify-between bg-[var(--bg-base)] p-3.5 rounded-xl border border-[var(--border-color)]">
                        <div>
                          <span className="text-xs font-bold block text-[var(--text-main)]">Show Search Icon</span>
                        </div>
                        <button 
                          onClick={() => updateSelectedComponentProp('showSearch', !(selectedComponent.props as any).showSearch)}
                          className={`w-11 h-6 rounded-full relative transition-colors shadow-inner ${((selectedComponent.props as any).showSearch) ? 'bg-[var(--brand-primary)]' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${((selectedComponent.props as any).showSearch) ? 'translate-x-6' : 'translate-x-1'}`}></div>
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Drag Overlay for smooth visual feedback when dragging from Sidebar */}
      <DragOverlay>
        {activeDragItem ? (
          <div className="bg-[var(--brand-primary)]/90 text-white px-4 py-2 rounded-lg shadow-2xl font-bold text-xs tracking-widest uppercase">
            Dragging {activeDragItem.data.current?.type || 'Component'}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
