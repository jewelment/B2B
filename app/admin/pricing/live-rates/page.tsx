'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type ViewState = 'main' | 'diamond' | 'metal' | 'gemstone' | 'pearl' | 'making_charges';
type DiamondTab = 'all' | 'setting' | 'shape' | 'size';

export default function PricingHubLiveRates() {
  const [activeView, setActiveView] = useState<ViewState>('main');
  const [showDiamondModal, setShowDiamondModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  // Schedule Dropdown State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedule, setSchedule] = useState('OFF');
  
  // Diamond Tabs State
  const [activeDiamondTab, setActiveDiamondTab] = useState<DiamondTab>('all');

  // Metal Matrix State
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [baseGold, setBaseGold] = useState<number>(7250);
  const [baseSilver, setBaseSilver] = useState<number>(88);

  const metalMatrixData = [
    { purity: '24KT', type: 'GOLD', base: 99.9, markup: 0 },
    { purity: '22KT', type: 'GOLD', base: 91.66, markup: 1.5 },
    { purity: '18KT', type: 'GOLD', base: 75, markup: 2 },
    { purity: '14KT', type: 'GOLD', base: 58.33, markup: 2.5 },
    { purity: '9KT', type: 'GOLD', base: 37.5, markup: 3 },
    { purity: '925', type: 'SILVER', base: 92.5, markup: 4 },
    { purity: '999', type: 'SILVER', base: 99.9, markup: 2 },
  ];

  // Simulated API Rates
  const [apiGold, setApiGold] = useState(7410.00);
  const [apiSilver, setApiSilver] = useState(92.50);

  useEffect(() => {
    if (isLiveApi) {
      const interval = setInterval(() => {
        setBaseGold(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5);
        setBaseSilver(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.5);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLiveApi]);

  // Diamond Modal State (Dynamic Rows)
  const [diamondRows, setDiamondRows] = useState([
    { id: 1, size: 'All', minWt: 79, maxWt: 95.999, value: 280000, type: 'Per Carat' },
    { id: 2, size: 'All', minWt: 96, maxWt: 105, value: 330000, type: 'Per Carat' },
    { id: 3, size: 'All', minWt: 105.001, maxWt: null, value: null, type: 'Per Carat' },
  ]);

  const handleAddDiamondRow = () => {
    setDiamondRows([...diamondRows, { id: Date.now(), size: 'All', minWt: 0, maxWt: 0, value: 0, type: 'Per Carat' }]);
  };

  const handleRemoveDiamondRow = (id: number) => {
    setDiamondRows(diamondRows.filter(row => row.id !== id));
  };

  const toggleExpand = (name: string) => {
    if (expandedRow === name) {
      setExpandedRow(null);
    } else {
      setExpandedRow(name);
    }
  };

  // Views Component Renders
  const renderMainDashboard = () => (
    <div className="animate-in fade-in duration-300 space-y-8">
      {/* Global Sync Panel */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Master Pricing Engine</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Control global metal baselines, component rates, and synchronization triggers.</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-4">
            <button className="text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors px-4 py-2 border border-transparent hover:border-[var(--border-color)] rounded-full">Export Derivations</button>
            <button className="text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors px-4 py-2 border border-transparent hover:border-[var(--border-color)] rounded-full">Import Derivations</button>
            
            {/* Custom Dropdown */}
            <div className="relative">
              <div 
                className={`flex items-center gap-2 border ${isScheduleOpen ? 'border-[var(--brand-primary)] shadow-[0_0_10px_rgba(242,189,66,0.15)]' : 'border-[var(--border-color)]'} rounded-lg px-3 py-2.5 bg-black/5 dark:bg-white/5 cursor-pointer min-w-[140px] justify-between transition-all`}
                onClick={() => setIsScheduleOpen(!isScheduleOpen)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase">Schedule:</span>
                  <span className="text-sm font-bold text-[var(--text-main)]">{schedule}</span>
                </div>
                <svg className={`w-3 h-3 text-[var(--brand-primary)] transition-transform ${isScheduleOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
              
              {isScheduleOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  {['OFF', 'HOURLY', 'DAILY'].map(opt => (
                    <div 
                      key={opt}
                      onClick={() => { setSchedule(opt); setIsScheduleOpen(false); }}
                      className={`px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors ${schedule === opt ? 'text-[var(--brand-primary)] bg-black/20 dark:bg-white/10' : 'text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:bg-black/10 dark:hover:bg-white/5'}`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="text-[13px] font-bold text-[var(--brand-text)] bg-[var(--brand-primary)] px-6 py-2.5 rounded-full shimmer-hover transition-all">
              Apply & Sync Global Rates
            </button>
          </div>
          <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mr-2">LAST GLOBAL UPDATE: SYSTEM LOADED</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Price Master</h1>
        </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-2xl">
        <div className="border-b border-[var(--border-color)] px-6 py-4 flex gap-6">
          <button className="text-sm font-bold text-[var(--brand-primary)] border-b-[3px] border-[var(--brand-primary)] pb-[17px] -mb-4">All (5)</button>
        </div>
        
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-[var(--border-color)]">
              <th className="py-4 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px]">MASTER NAME (5)</th>
              <th className="py-4 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px]">MODIFIED BY</th>
              <th className="py-4 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px] text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Diamond Price Master', view: 'diamond', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 0v9m0 0l8-4.5M12 12L4 7.5" /></svg> },
              { name: 'Metal Price Master', view: 'metal', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
              { name: 'Gemstone Price Master', view: 'gemstone', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> },
              { name: 'Pearl Price Master', view: 'pearl', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="5" strokeWidth={1.5} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 17v4m0-14V3m5 9h4M3 12h4m10.192-5.192l2.829-2.829M6.808 17.192l-2.829 2.829m10.192 0l2.829 2.829M6.808 6.808L3.979 3.979" /></svg> },
              { name: 'Making Charges', view: 'making_charges', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
            ].map((master) => (
              <tr key={master.name} className="border-b border-[var(--border-color)]/50 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                <td className="py-4 px-6 font-medium text-[var(--text-main)] flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors">
                    {master.icon}
                  </div>
                  {master.name}
                </td>
                <td className="py-4 px-6 text-[var(--text-muted)]">--</td>
                <td className="py-4 px-6 text-right">
                  <button 
                    onClick={() => setActiveView(master.view as ViewState)}
                    className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );

  const renderMetalMaster = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
      
      <div className="flex items-center gap-2 cursor-pointer group w-fit" onClick={() => setActiveView('main')}>
        <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight transition-colors">Metal Price Master</h1>
      </div>

      {/* Matrix Panel */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-8 shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-main)] mb-1">Precious Metal Rates</h2>
            <p className="text-xs text-[var(--text-muted)]">Updates cascade down to all active karatages instantly.</p>
          </div>
          <div className="flex bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-full p-1">
            <button 
              onClick={() => setIsLiveApi(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isLiveApi ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              MANUAL BASE
            </button>
            <button 
              onClick={() => setIsLiveApi(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isLiveApi ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              LIVE API BASE
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Side Inputs */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-widest">BASE GOLD (24KT / 1G)</label>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">API: ₹{apiGold.toFixed(2)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--text-muted)]">₹</span>
                <input 
                  type="number" 
                  value={baseGold.toFixed(2)}
                  onChange={(e) => setBaseGold(Number(e.target.value))}
                  disabled={isLiveApi}
                  className={`w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-4 text-xl font-black text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--brand-primary)] transition-all ${isLiveApi ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">BASE SILVER (999 / 1G)</label>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">API: ₹{apiSilver.toFixed(2)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[var(--text-muted)]">₹</span>
                <input 
                  type="number" 
                  value={baseSilver.toFixed(2)}
                  onChange={(e) => setBaseSilver(Number(e.target.value))}
                  disabled={isLiveApi}
                  className={`w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-4 text-xl font-black text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--brand-primary)] transition-all ${isLiveApi ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>
          </div>

          {/* Right Side Matrix Table */}
          <div className="w-full lg:w-2/3">
            <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
              <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface)]">
                <h3 className="text-sm font-bold text-[var(--text-main)]">Purity & Markup Matrix</h3>
                <button className="text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1 transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Edit Matrix
                </button>
              </div>
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[var(--border-color)]/50">
                    <th className="py-3 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[10px]">PURITY LEVEL</th>
                    <th className="py-3 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[10px] text-center">BASE (%)</th>
                    <th className="py-3 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[10px] text-center">MARKUP (%)</th>
                    <th className="py-3 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[10px] text-right">FINAL RATE (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {metalMatrixData.map((row) => {
                    const activeBase = row.type === 'GOLD' ? baseGold : baseSilver;
                    const finalRate = activeBase * (row.base / 100) * (1 + (row.markup / 100));
                    return (
                      <tr key={row.purity} className="border-b border-[var(--border-color)]/30 hover:bg-[var(--bg-surface)] transition-colors">
                        <td className="py-3 px-6 flex items-center gap-2">
                          <span className="font-bold text-[var(--text-main)] text-xs">{row.purity}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[var(--text-muted)]">{row.type}</span>
                        </td>
                        <td className="py-3 px-6 text-center text-xs text-[var(--text-main)] font-mono">{row.base}</td>
                        <td className="py-3 px-6 text-center text-xs text-[var(--text-main)] font-mono">{row.markup}</td>
                        <td className="py-3 px-6 text-right text-xs font-bold text-[var(--brand-primary)] font-mono">{finalRate.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  const renderDiamondMaster = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveView('main')}>
          <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight group-hover:text-[var(--text-main)] transition-colors">Diamond Price Master</h1>
        </div>
        <div className="flex gap-6 items-center">
          <button className="text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Settings</button>
          <button className="text-[13px] font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">Export</button>
          <button className="text-[13px] font-bold text-[var(--text-main)] transition-colors">Import</button>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-2xl">
        <div className="border-b border-[var(--border-color)] px-6 py-4 flex gap-8">
          {[
            { id: 'all', label: 'All (2)' },
            { id: 'setting', label: 'Diamond Setting Type (1)' },
            { id: 'shape', label: 'Diamond Shape (1)' },
            { id: 'size', label: 'Diamond Size (1)' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveDiamondTab(tab.id as DiamondTab)}
              className={`text-sm font-bold pb-[17px] -mb-4 transition-colors ${activeDiamondTab === tab.id ? 'text-[var(--brand-primary)] border-b-[3px] border-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="relative max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search..." className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)]" />
          </div>
        </div>
        
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
              <th className="py-4 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px]">DIAMOND (2)</th>
              <th className="py-4 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px]">PRICE</th>
              <th className="py-4 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px]">LAST UPDATED</th>
              <th className="py-4 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px]">PRICE TYPE</th>
              <th className="py-4 px-6 font-bold text-[var(--text-muted)] uppercase tracking-widest text-[11px] text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'VVS-FG - Round', date: '03-04-2026 At 2:11 Pm' },
              { name: 'SI-HI - Round', date: '03-04-2026 At 2:11 Pm' }
            ].map((diamond) => (
              <React.Fragment key={diamond.name}>
                <tr className="border-b border-[var(--border-color)] hover:bg-[var(--bg-base)] transition-colors group">
                  <td className="py-4 px-6 font-bold text-[var(--text-main)] flex items-center gap-2">
                    <button onClick={() => toggleExpand(diamond.name)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] mr-1 p-1">
                      <svg className={`w-3 h-3 transition-transform ${expandedRow === diamond.name ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {diamond.name}
                  </td>
                  <td className="py-4 px-6">
                    <button onClick={() => toggleExpand(diamond.name)} className="text-[var(--brand-primary)] hover:underline cursor-pointer font-bold bg-transparent">View</button>
                  </td>
                  <td className="py-4 px-6 text-[var(--text-muted)] font-mono text-xs">{diamond.date}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-[var(--text-muted)]/10 text-[var(--text-main)] rounded-full text-xs font-bold border border-[var(--border-color)]">Mixed</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => setShowDiamondModal(true)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Row Content (Dedicated Results) */}
                {expandedRow === diamond.name && (
                  <tr className="bg-[var(--bg-base)]">
                    <td colSpan={5} className="p-0 border-b border-[var(--border-color)]">
                      <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="bg-[var(--bg-surface)] rounded-lg border border-[var(--border-color)] overflow-hidden">
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                                <th className="py-3 px-4 text-[var(--text-muted)] font-bold text-[10px] tracking-widest uppercase">Size</th>
                                <th className="py-3 px-4 text-[var(--text-muted)] font-bold text-[10px] tracking-widest uppercase">Min Wt.</th>
                                <th className="py-3 px-4 text-[var(--text-muted)] font-bold text-[10px] tracking-widest uppercase">Max Wt.</th>
                                <th className="py-3 px-4 text-[var(--text-muted)] font-bold text-[10px] tracking-widest uppercase">Value</th>
                                <th className="py-3 px-4 text-[var(--text-muted)] font-bold text-[10px] tracking-widest uppercase">Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {diamondRows.map((row) => (
                                <tr key={row.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-black/5 dark:hover:bg-white/5">
                                  <td className="py-3 px-4 text-[var(--text-main)] text-xs font-medium">{row.size}</td>
                                  <td className="py-3 px-4 text-[var(--text-main)] text-xs font-mono">{row.minWt} ct</td>
                                  <td className="py-3 px-4 text-[var(--text-main)] text-xs font-mono">{row.maxWt || 'Above'} {row.maxWt && 'ct'}</td>
                                  <td className="py-3 px-4 text-[var(--brand-primary)] text-xs font-mono font-bold">₹{row.value?.toLocaleString() || 'Custom'}</td>
                                  <td className="py-3 px-4 text-[var(--text-main)] text-xs">{row.type}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-2 mb-8 cursor-pointer group w-fit" onClick={() => setActiveView('main')}>
        <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--brand-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        <h1 className="text-xl font-bold text-[var(--text-main)] tracking-tight capitalize group-hover:text-[var(--text-main)] transition-colors">{title}</h1>
      </div>
      
      <div className="h-[200px] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl flex flex-col items-center justify-center text-center opacity-80 shadow-lg">
        <h3 className="text-[15px] font-bold text-[var(--text-main)]">Configuration Module</h3>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">Matrix configuration placeholder for {title.toLowerCase().replace('master', '').trim()}.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8">
      {activeView === 'main' && renderMainDashboard()}
      {activeView === 'metal' && renderMetalMaster()}
      {activeView === 'diamond' && renderDiamondMaster()}
      {activeView === 'gemstone' && renderPlaceholder('Gemstone Master')}
      {activeView === 'pearl' && renderPlaceholder('Pearl Master')}
      {activeView === 'making_charges' && renderPlaceholder('Making Charges Master')}

      {/* Diamond 'Add Standard' Modal */}
      {showDiamondModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDiamondModal(false)}></div>
          <div className="relative w-full max-w-5xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-surface)]">
              <h3 className="text-lg font-bold text-[var(--text-main)]">Add Standard</h3>
              <button onClick={() => setShowDiamondModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto bg-[var(--bg-base)]">
              <div className="bg-[var(--bg-surface)] rounded-xl p-6 border border-[var(--border-color)]">
                <h4 className="text-sm font-bold text-[var(--text-main)] mb-6">Standard Details</h4>
                
                <div className="mb-8 max-w-xs">
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">diamond <span className="text-red-500">*</span></label>
                  <select className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] appearance-none">
                    <option>VVS-FG</option>
                    <option>SI-HI</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {diamondRows.map((row) => (
                    <div key={row.id} className="flex flex-wrap md:flex-nowrap items-end gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="w-full md:w-32">
                        <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">Size</label>
                        <select className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-main)] focus:outline-none appearance-none">
                          <option>All</option>
                        </select>
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">Min Wt. <span className="text-red-500">*</span></label>
                        <input type="number" defaultValue={row.minWt || ''} placeholder="Enter Min" className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-main)] focus:outline-none" />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">Max Wt. <span className="text-red-500">*</span></label>
                        <input type="number" defaultValue={row.maxWt || ''} placeholder="Enter Max" className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-main)] focus:outline-none" />
                      </div>
                      <div className="w-full md:flex-1">
                        <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">Value <span className="text-red-500">*</span></label>
                        <input type="number" defaultValue={row.value || ''} placeholder="Enter Value" className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-main)] focus:outline-none" />
                      </div>
                      <div className="w-full md:w-40">
                        <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-2 uppercase tracking-widest">Price Type <span className="text-red-500">*</span></label>
                        <select defaultValue={row.type} className="w-full bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-main)] focus:outline-none appearance-none">
                          <option>Per Carat</option>
                          <option>Fixed Price</option>
                          <option>Percentage</option>
                        </select>
                      </div>
                      <button onClick={() => handleRemoveDiamondRow(row.id)} className="p-2 mb-1 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  
                  <div className="pt-2 flex justify-end pr-12">
                     <button onClick={handleAddDiamondRow} className="text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                       + Add More Range
                     </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex justify-end gap-4 rounded-b-2xl">
              <button onClick={() => setShowDiamondModal(false)} className="px-6 py-2.5 bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-full text-sm font-bold transition-all">
                Cancel
              </button>
              <button onClick={() => setShowDiamondModal(false)} className="px-8 py-2.5 bg-[var(--brand-primary)] text-[var(--brand-text)] rounded-full text-sm font-bold transition-all shimmer-hover">
                Update Standard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}