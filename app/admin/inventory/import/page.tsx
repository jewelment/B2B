'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportProductsWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [conflictRule, setConflictRule] = useState<'APPEND' | 'OVERWRITE' | 'SKIP'>('SKIP');

  const csvInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async (type: 'empty' | 'data') => {
    setStatus({ type: 'info', text: 'Generating template from dynamic fields...' });
    try {
      window.open(`/api/admin/products/templates?type=${type}`, '_blank');
      setStatus({ type: 'success', text: 'Template generated successfully.' });
      setTimeout(() => setStatus({ type: '', text: '' }), 4000);
    } catch (error) {
      setStatus({ type: 'error', text: 'Failed to export layout specification sheet.' });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, target: 'csv' | 'media') => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (target === 'csv' && droppedFile.name.endsWith('.csv')) {
        setCsvFile(droppedFile);
        setStatus({ type: '', text: '' });
      } else if (target === 'media' && (droppedFile.name.endsWith('.zip') || droppedFile.type.startsWith('image/'))) {
        setMediaFile(droppedFile);
        setStatus({ type: '', text: '' });
      } else {
        setStatus({ type: 'error', text: `Invalid format for selected pipeline step.` });
      }
    }
  };

  const handleFinalExecution = async () => {
    if (!csvFile) {
      setStatus({ type: 'error', text: 'Missing structured catalog CSV data.' });
      setCurrentStep(2);
      return;
    }
    setIsUploading(true);
    setStatus({ type: 'info', text: 'Initializing PIM ingestion engine. Processing matrix...' });

    try {
      const formData = new FormData();
      formData.append('csv', csvFile);
      if (mediaFile) formData.append('mediaBulk', mediaFile);
      formData.append('conflictRule', conflictRule);

      const res = await fetch('/api/admin/products/import/execute', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        setStatus({ type: 'success', text: `Sync Complete: ${result.count} master SKUs mapped to core grid.` });
        setCsvFile(null);
        setMediaFile(null);
        setCurrentStep(1);
      } else {
        setStatus({ type: 'error', text: result.error || 'Pipeline execution failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Network exception during database ingestion mapping.' });
    } finally {
      setIsUploading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Export Template', desc: 'Generate dynamic layout schema.' },
    { num: 2, title: 'Data Ingestion', desc: 'Upload catalog CSV payload.' },
    { num: 3, title: 'Asset Pipeline', desc: 'Sync high-res production media.' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 font-sans text-[#2a2a2a]">
      
      {/* HEADER */}
      <div className="mb-12 pl-2">
        <h1 className="text-3xl font-light tracking-wide text-[var(--text-main)] mb-2">Import Engine</h1>
        <p className="text-sm tracking-wide text-[var(--text-muted)]">
          Map master inventory assets and synchronize your B2B wholesale ecosystem.
        </p>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SPATIAL TIMELINE */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {steps.map((s) => (
            <div 
              key={s.num} 
              onClick={() => setCurrentStep(s.num as 1|2|3)}
              className={`relative overflow-hidden group cursor-pointer p-6 rounded-xl transition-all duration-300 ease-out border ${
                currentStep === s.num 
                  ? 'bg-[var(--bg-surface)] border-[var(--border-color)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] scale-[1.02]' 
                  : currentStep > s.num 
                    ? 'bg-transparent border-transparent hover:bg-[var(--bg-base)]'
                    : 'bg-transparent border-transparent opacity-70 hover:opacity-100 hover:bg-[var(--bg-base)]'
              }`}
            >
              <div className="relative flex items-center space-x-5 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  currentStep === s.num 
                    ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-[0_4px_20px_rgba(0,0,0,0.1)]' 
                    : currentStep > s.num 
                      ? 'bg-[var(--bg-base)] text-[var(--text-main)] border border-[var(--border-color)]'
                      : 'bg-transparent text-[var(--text-muted)] border border-[var(--border-color)]'
                }`}>
                  {currentStep > s.num ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : s.num}
                </div>
                <div>
                  <p className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${currentStep === s.num ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>
                    {s.title}
                  </p>
                  <p className={`text-sm font-light mt-1 transition-colors ${currentStep === s.num ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: MAIN INTERACTIVE BENTO CARD */}
        <div className="lg:col-span-8 bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm rounded-2xl p-8 md:p-12 min-h-[500px] flex flex-col relative overflow-hidden transition-all duration-500">
          
          {/* Status Pill overlay */}
          {status.text && (
            <div className={`absolute top-6 right-6 z-50 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest shadow-md transition-all animate-in slide-in-from-top-4 fade-in duration-300 border ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
              status.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 
              'bg-blue-50 text-blue-800 border-blue-200'
            }`}>
              {status.text}
            </div>
          )}

          {/* STEP 1 CONTROLS */}
          {currentStep === 1 && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
              <div className="h-16 w-16 rounded-xl bg-[var(--bg-base)] flex items-center justify-center mb-8 border border-[var(--border-color)]">
                <svg className="w-7 h-7 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </div>
              <h3 className="text-2xl font-light text-[var(--text-main)] mb-3">Export Framework</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed font-light max-w-lg mb-10">
                Download the dynamic layout schema to map your master data. The template automatically includes all active custom fields configured in the database engine.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-auto">
                <button onClick={() => handleDownloadTemplate('empty')} className="py-4 px-6 bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--bg-base)] hover:border-[var(--border-color)] transition-all">
                  Download Blank Template
                </button>
                <button onClick={() => handleDownloadTemplate('data')} className="py-4 px-6 bg-[var(--bg-base)] border border-[var(--border-color)] shadow-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-all">
                  Export Active Data
                </button>
              </div>

              {/* NEXT STEP BUTTON FOR STEP 1 */}
              <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex justify-end">
                 <button onClick={() => setCurrentStep(2)} className="py-3 px-8 bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-full text-[10px] font-bold uppercase tracking-widest shimmer-hover hover:-translate-y-0.5 transition-all">
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 CONTROLS */}
          {currentStep === 2 && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-light text-[var(--text-main)] mb-2">Ingest Catalog Data</h3>
              <p className="text-[var(--text-muted)] text-sm font-light mb-8">Upload your populated CSV. The engine will parse fields and buffer variants.</p>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'csv')}
                onClick={() => csvInputRef.current?.click()}
                className={`flex-1 relative flex flex-col items-center justify-center p-12 rounded-2xl cursor-pointer transition-all duration-300 ease-out border-2 border-dashed
                  ${isDragging ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 scale-[1.02]' 
                    : csvFile ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/60' 
                    : 'border-[var(--border-color)] bg-[var(--bg-base)] hover:bg-[var(--bg-surface)]'
                  }
                `}
              >
                <input type="file" ref={csvInputRef} onChange={(e) => e.target.files?.[0] && setCsvFile(e.target.files[0])} accept=".csv" className="hidden" />
                
                {csvFile ? (
                  <div className="text-center animate-in zoom-in-95 duration-300">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-sm">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <p className="text-lg font-medium text-[var(--text-main)]">{csvFile.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wider">{(csvFile.size / 1024).toFixed(1)} KB • Ready for processing</p>
                  </div>
                ) : (
                  <div className="text-center pointer-events-none">
                     <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-xl transition-colors duration-300 mb-6 border
                      ${isDragging ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] border-[var(--brand-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-color)] shadow-sm'}
                    `}>
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <p className="text-base font-medium text-[var(--text-main)]">Drop your CSV layout here</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-3">Click to browse files</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-between items-center">
                 <button onClick={() => setCurrentStep(1)} className="py-3 px-6 bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-base)] transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back
                </button>
                 <button onClick={() => setCurrentStep(3)} disabled={!csvFile} className="py-3 px-8 bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-full text-[10px] font-bold uppercase tracking-widest shimmer-hover hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 CONTROLS */}
          {currentStep === 3 && (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-2xl font-light text-[var(--text-main)] mb-2">Sync Media Assets</h3>
              <p className="text-[var(--text-muted)] text-sm font-light mb-6">Drop a ZIP of high-res renders to map images to SKUs automatically.</p>
              
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'media')}
                onClick={() => mediaInputRef.current?.click()}
                className={`flex-1 relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300 ease-out border-2 border-dashed mb-8
                  ${isDragging ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5' 
                    : mediaFile ? 'border-emerald-200 bg-emerald-50/40' 
                    : 'border-[var(--border-color)] bg-[var(--bg-base)] hover:bg-[var(--bg-surface)]'
                  }
                `}
              >
                <input type="file" ref={mediaInputRef} onChange={(e) => e.target.files?.[0] && setMediaFile(e.target.files[0])} accept=".zip,image/*" className="hidden" />
                {mediaFile ? (
                  <div className="text-center animate-in zoom-in-95 duration-300">
                    <p className="text-base font-medium text-[var(--text-main)]">{mediaFile.name}</p>
                    <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-widest">Asset Package Linked</p>
                  </div>
                ) : (
                  <div className="text-center pointer-events-none">
                    <p className="text-sm font-medium text-[var(--text-main)]">Drop ZIP archive or bulk images</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-2">Requires SKU_1.jpg naming</p>
                  </div>
                )}
              </div>

              {/* UPGRADED PREMIUM CONFLICT RULE UI */}
              <div className="mb-auto">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-3">Media Sync Rule</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'SKIP', title: 'Skip Match', desc: 'Ignore if SKU exists' },
                    { id: 'OVERWRITE', title: 'Overwrite', desc: 'Replace old media' },
                    { id: 'APPEND', title: 'Append', desc: 'Add to gallery' }
                  ].map(rule => (
                    <div 
                      key={rule.id}
                      onClick={() => setConflictRule(rule.id as any)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        conflictRule === rule.id 
                          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 shadow-sm' 
                          : 'border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--border-color)] hover:bg-[var(--bg-base)]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${conflictRule === rule.id ? 'text-[var(--brand-primary)]' : 'text-[var(--text-main)]'}`}>
                          {rule.title}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${conflictRule === rule.id ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10' : 'border-[var(--border-color)]'}`}>
                          {conflictRule === rule.id && (
                            <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">{rule.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                 <button onClick={() => setCurrentStep(2)} className="py-3 px-6 bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-base)] transition-all flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back
                </button>
                <button 
                  onClick={handleFinalExecution} 
                  disabled={isUploading} 
                  className="py-3 px-8 bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-full text-[10px] font-bold uppercase tracking-widest shimmer-hover hover:-translate-y-0.5 transition-all flex items-center disabled:opacity-50 disabled:transform-none"
                >
                  {isUploading && (
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isUploading ? 'Compiling Data...' : 'Execute Import'}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}