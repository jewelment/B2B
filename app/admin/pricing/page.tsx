'use client';

import React, { useState, useEffect, ClipboardEvent, useCallback } from 'react';

// ----------------------------------------------------------------------
// COMPONENT EXTRACTED OUTSIDE TO PREVENT REACT FOCUS-LOSS BUG
// ----------------------------------------------------------------------
const TableInput = ({ value, onChange, type = "text", align = "left", isEditing }: any) => {
  if (!isEditing) {
    return (
      <div className={`w-full h-full px-3 py-2 truncate ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>
        {value}
      </div>
    );
  }
  return (
    <input 
      type={type} 
      step={type === 'number' ? "any" : undefined}
      value={value} 
      onChange={onChange} 
      className={`w-full h-full min-h-[36px] px-3 py-2 bg-transparent outline-none focus:bg-white focus:ring-2 focus:ring-[var(--brand-primary)]/50 focus:z-10 relative transition-all ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}
    />
  );
};

export default function AdminPricingPanel() {
  // --- STATE: Database Connection ---
  const [loadingSettings, setLoadingSettings] = useState(true);

  // --- STATE: Metal Pricing & Sync ---
  // Mapped directly to the StoreSettings database schema
  const [pricingMode, setPricingMode] = useState<'MANUAL' | 'LIVE_API'>('MANUAL');
  const [baseGold24k, setBaseGold24k] = useState(7150);
  const [baseSilver925, setBaseSilver925] = useState(92);
  const [syncSchedule, setSyncSchedule] = useState('OFF');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('Never');

  const liveGold = 7410.00; // Simulated Live MCX API value
  const liveSilver = 92.50; // Simulated Live MCX API value

  const activeGold = pricingMode === 'LIVE_API' ? liveGold : baseGold24k;
  const activeSilver = pricingMode === 'LIVE_API' ? liveSilver : baseSilver925;

  // --- INITIAL DATABASE FETCH ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setPricingMode(data.settings.pricingMode);
          setBaseGold24k(data.settings.manualGoldRate24K);
          setBaseSilver925(data.settings.manualSilverRate);
          setLastSynced(`System Loaded`);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  // --- GLOBAL EDIT & SELECTION STATES ---
  const [isEditingKarat, setIsEditingKarat] = useState(false);
  const [isEditingDiamond, setIsEditingDiamond] = useState(false);
  const [isEditingLabour, setIsEditingLabour] = useState(false);

  const [selectedDiamonds, setSelectedDiamonds] = useState<number[]>([]);
  const [selectedLabours, setSelectedLabours] = useState<number[]>([]);

  // --- SNAPSHOT HISTORY ENGINE (For Undo) ---
  const [history, setHistory] = useState<{ d: any[], l: any[] }[]>([]);

  const saveSnapshot = useCallback(() => {
    setHistory(prev => {
      const newHistory = [...prev, { d: [...diamondData], l: [...labourData] }];
      return newHistory.slice(-10);
    });
  }, []); 

  // --- STATE: Purity & Markup Matrix ---
  const [karatMatrix, setKaratMatrix] = useState([
    { id: '24KT', metal: 'Gold', purity: 99.90, markup: 0.0 }, // Added 24K for accurate baseline
    { id: '22KT', metal: 'Gold', purity: 91.66, markup: 1.5 },
    { id: '18KT', metal: 'Gold', purity: 75.00, markup: 2.0 },
    { id: '14KT', metal: 'Gold', purity: 58.33, markup: 2.5 },
    { id: '9KT',  metal: 'Gold', purity: 37.50, markup: 3.0 },
    { id: '925',  metal: 'Silver', purity: 92.50, markup: 4.0 },
    { id: '999',  metal: 'Silver', purity: 99.90, markup: 2.0 },
  ]);

  const handleKaratChange = (index: number, field: 'purity' | 'markup', value: string) => {
    const newMatrix = [...karatMatrix];
    newMatrix[index][field] = Number(value) || 0;
    setKaratMatrix(newMatrix);
  };

  // --- STATE: Diamonds & Color Stones ---
  const [diamondData, setDiamondData] = useState([
    { id: 1, division: 'L', shape: 'RD', color: 'H-I', clarity: 'SI', sizeFrom: '-2', rate: 118000 },
    { id: 2, division: 'C', shape: 'PEAR', color: 'EMERALD', clarity: 'AA', sizeFrom: '1ct', rate: 45000 },
  ]);

  const handleDiamondChange = (index: number, field: string, value: any) => {
    const newData = [...diamondData];
    newData[index] = { ...newData[index], [field]: value };
    setDiamondData(newData);
  };

  const addDiamondRow = () => {
    saveSnapshot();
    const newId = diamondData.length > 0 ? Math.max(...diamondData.map(d => d.id)) + 1 : 1;
    setDiamondData([...diamondData, { id: newId, division: 'L', shape: '', color: '', clarity: '', sizeFrom: '', rate: 0 }]);
  };

  const deleteSelectedDiamonds = useCallback(() => {
    if (selectedDiamonds.length === 0) return;
    saveSnapshot();
    setDiamondData(prev => prev.filter(row => !selectedDiamonds.includes(row.id)));
    setSelectedDiamonds([]);
  }, [selectedDiamonds, saveSnapshot]);

  const handleDiamondPaste = (e: ClipboardEvent<HTMLTableSectionElement>) => {
    if (!isEditingDiamond) return;
    const clipboardData = e.clipboardData.getData('Text');
    if (!clipboardData) return;
    
    const rows = clipboardData.split('\n').filter(row => row.trim() !== '');
    if (rows.length > 0) {
      e.preventDefault();
      saveSnapshot();
      
      const newRows = rows.map((row, index) => {
        const cols = row.split('\t');
        const currentMaxId = diamondData.length > 0 ? Math.max(...diamondData.map(d => d.id)) : 0;
        return {
          id: currentMaxId + index + 1,
          division: cols[0] || 'L',
          shape: cols[1] || '',
          color: cols[2] || '',
          clarity: cols[3] || '',
          sizeFrom: cols[4] || '',
          rate: Number(cols[5]) || 0
        };
      });
      setDiamondData([...diamondData, ...newRows]);
    }
  };

  // --- STATE: Labour Charges ---
  const [labourData, setLabourData] = useState([
    { id: 1, division: '.', type: 'GENERAL', category: 'RAW', weightFrom: 0.001, weightTo: 2, rate: 3500 },
    { id: 2, division: '.', type: 'GENERAL', category: 'RAW', weightFrom: 2.001, weightTo: 100, rate: 2700 },
  ]);

  const handleLabourChange = (index: number, field: string, value: any) => {
    const newData = [...labourData];
    newData[index] = { ...newData[index], [field]: value };
    setLabourData(newData);
  };

  const addLabourRow = () => {
    saveSnapshot();
    const newId = labourData.length > 0 ? Math.max(...labourData.map(d => d.id)) + 1 : 1;
    setLabourData([...labourData, { id: newId, division: '.', type: '', category: '', weightFrom: 0, weightTo: 0, rate: 0 }]);
  };

  const deleteSelectedLabours = useCallback(() => {
    if (selectedLabours.length === 0) return;
    saveSnapshot();
    setLabourData(prev => prev.filter(row => !selectedLabours.includes(row.id)));
    setSelectedLabours([]);
  }, [selectedLabours, saveSnapshot]);

  const handleLabourPaste = (e: ClipboardEvent<HTMLTableSectionElement>) => {
    if (!isEditingLabour) return;
    const clipboardData = e.clipboardData.getData('Text');
    if (!clipboardData) return;

    const rows = clipboardData.split('\n').filter(row => row.trim() !== '');
    if (rows.length > 0) {
      e.preventDefault();
      saveSnapshot();
      
      const newRows = rows.map((row, index) => {
        const cols = row.split('\t');
        const currentMaxId = labourData.length > 0 ? Math.max(...labourData.map(d => d.id)) : 0;
        return {
          id: currentMaxId + index + 1,
          division: cols[0] || '.',
          type: cols[1] || '',
          category: cols[2] || '',
          weightFrom: Number(cols[3]) || 0,
          weightTo: Number(cols[4]) || 0,
          rate: Number(cols[5]) || 0
        };
      });
      setLabourData([...labourData, ...newRows]);
    }
  };

  // --- GLOBAL KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = (e.target as HTMLElement).tagName === 'INPUT';

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (!isInput) e.preventDefault(); 
        if (history.length > 0) {
          const lastState = history[history.length - 1];
          setDiamondData(lastState.d);
          setLabourData(lastState.l);
          setHistory(prev => prev.slice(0, -1));
          setSelectedDiamonds([]);
          setSelectedLabours([]);
        }
      }

      if (e.key === 'Delete' && !isInput) {
        if (selectedDiamonds.length > 0) deleteSelectedDiamonds();
        if (selectedLabours.length > 0) deleteSelectedLabours();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, selectedDiamonds, selectedLabours, deleteSelectedDiamonds, deleteSelectedLabours]);

  // --- THE FIX: PUSH SETTINGS TO DATABASE ---
  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pricingMode,
          manualGoldRate24K: baseGold24k,
          manualSilverRate: baseSilver925
        })
      });
      const data = await res.json();
      if (data.success) {
        setLastSynced(`Today, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
      }
    } catch (error) {
      console.error("Failed to sync matrix to database", error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[var(--brand-primary)]">
        <svg className="animate-spin w-8 h-8 mb-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span className="text-xs font-bold tracking-widest uppercase">Connecting to Enterprise Database...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] p-10 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER & GLOBAL SYNC */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-[var(--bg-surface)] p-8 rounded-[2rem] border border-[var(--glass-border)] shadow-sm backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-light tracking-wide text-[var(--text-main)]">Master Pricing Engine</h1>
            <p className="text-sm text-[var(--text-muted)] mt-2">Control global metal baselines, component rates, and synchronization triggers.</p>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-end space-y-3">
            <div className="flex items-center space-x-3">
              <select value={syncSchedule} onChange={(e) => setSyncSchedule(e.target.value)} className="bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] text-sm font-medium px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 shadow-sm cursor-pointer transition-all">
                <option value="OFF">Schedule: OFF</option>
                <option value="1H">Sync Every 1 Hour</option>
                <option value="1800">Sync Daily @ 18:00 IST</option>
              </select>
              <button onClick={handleForceSync} disabled={isSyncing} className="flex items-center px-8 py-3 bg-[var(--brand-primary)] text-[var(--brand-text)] text-sm font-semibold tracking-wide rounded-xl shadow-md hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 transition-all">
                {isSyncing ? 'Pushing DB Updates...' : 'Apply & Sync Global Rates'}
              </button>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">Last Global Update: {lastSynced}</p>
          </div>
        </div>

        {/* SECTION 1: METALS & PURITY MATRIX */}
        <div className="bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-[2rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-[var(--border-color)] pb-6">
            <div>
              <h2 className="text-xl font-light tracking-wide">Precious Metal Rates</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Updates cascade down to all active karatages instantly.</p>
            </div>
            <div className="flex bg-[var(--bg-base)] p-1.5 rounded-xl border border-[var(--border-color)] shadow-inner">
              <button onClick={() => setPricingMode('MANUAL')} className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${pricingMode === 'MANUAL' ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Manual Base</button>
              <button onClick={() => setPricingMode('LIVE_API')} className={`px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${pricingMode === 'LIVE_API' ? 'bg-emerald-600 text-white shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Live API Base</button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-amber-600 uppercase tracking-wider">Base Gold (24KT / 1g)</span>
                  <span className="text-[var(--text-muted)] font-mono text-xs bg-[var(--text-muted)]/10 px-2 py-1 rounded-md">API: ₹{liveGold.toFixed(2)}</span>
                </div>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">₹</span>
                  <input type="number" value={pricingMode === 'LIVE_API' ? liveGold : baseGold24k} onChange={(e) => setBaseGold24k(Number(e.target.value))} disabled={pricingMode === 'LIVE_API'} className={`w-full pl-10 pr-5 py-4 text-2xl font-light font-mono rounded-xl border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all ${pricingMode === 'LIVE_API' ? 'bg-[var(--bg-base)] text-emerald-600 border-emerald-500/30' : 'bg-[var(--bg-surface)] hover:border-[var(--brand-primary)]/50 text-[var(--text-main)]'}`} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider">Base Silver (999 / 1g)</span>
                  <span className="text-[var(--text-muted)] font-mono text-xs bg-[var(--text-muted)]/10 px-2 py-1 rounded-md">API: ₹{liveSilver.toFixed(2)}</span>
                </div>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium">₹</span>
                  <input type="number" value={pricingMode === 'LIVE_API' ? liveSilver : baseSilver925} onChange={(e) => setBaseSilver925(Number(e.target.value))} disabled={pricingMode === 'LIVE_API'} className={`w-full pl-10 pr-5 py-4 text-2xl font-light font-mono rounded-xl border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 transition-all ${pricingMode === 'LIVE_API' ? 'bg-[var(--bg-base)] text-emerald-600 border-emerald-500/30' : 'bg-[var(--bg-surface)] hover:border-[var(--brand-primary)]/50 text-[var(--text-main)]'}`} />
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-base)] rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col shadow-sm">
              <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-surface)]/50 flex justify-between items-center">
                <h3 className="text-sm font-semibold tracking-wide">Purity & Markup Matrix</h3>
                <button 
                  onClick={() => setIsEditingKarat(!isEditingKarat)} 
                  className={`flex items-center text-xs font-semibold px-4 py-1.5 rounded-lg transition-all ${isEditingKarat ? 'bg-emerald-600 text-white' : 'bg-[var(--text-muted)]/10 text-[var(--text-main)] hover:bg-[var(--text-muted)]/20'}`}
                >
                  {!isEditingKarat && (
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  )}
                  {isEditingKarat ? 'Save Matrix' : 'Edit Matrix'}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider bg-[var(--bg-base)]">
                    <tr>
                      <th className="px-6 py-3 font-semibold border-b border-[var(--border-color)]">Purity Level</th>
                      <th className="px-3 py-3 font-semibold text-center border border-[var(--border-color)]">Base (%)</th>
                      <th className="px-3 py-3 font-semibold text-center border border-[var(--border-color)]">Markup (%)</th>
                      <th className="px-6 py-3 font-semibold text-right border-b border-[var(--border-color)]">Final Rate (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {karatMatrix.map((row, index) => {
                      const baseMetalRate = row.metal === 'Gold' ? activeGold : activeSilver;
                      const finalValue = (baseMetalRate * (row.purity / 100)) * (1 + (row.markup / 100));
                      return (
                        <tr key={row.id} className={`${isEditingKarat ? 'bg-[var(--brand-primary)]/5' : 'hover:bg-[var(--bg-surface)]'} transition-colors duration-200`}>
                          <td className="px-6 py-3 border-b border-[var(--border-color)]">
                            <span className="font-semibold text-[var(--text-main)]">{row.id}</span>
                            <span className="ml-2 text-[10px] bg-[var(--text-muted)]/10 text-[var(--text-muted)] px-2 py-0.5 rounded-md uppercase tracking-wide">{row.metal}</span>
                          </td>
                          <td className={`p-0 border border-[var(--border-color)] w-24 ${isEditingKarat ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}>
                            <TableInput value={row.purity} onChange={(e: any) => handleKaratChange(index, 'purity', e.target.value)} type="number" align="center" isEditing={isEditingKarat} />
                          </td>
                          <td className={`p-0 border border-[var(--border-color)] w-24 ${isEditingKarat ? 'bg-amber-50 text-black' : 'bg-transparent text-[var(--text-main)]'}`}>
                            <TableInput value={row.markup} onChange={(e: any) => handleKaratChange(index, 'markup', e.target.value)} type="number" align="center" isEditing={isEditingKarat} />
                          </td>
                          <td className="px-6 py-3 border-b border-[var(--border-color)] text-right font-mono text-base text-[var(--brand-primary)] font-medium">
                            {finalValue.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMPONENT SPREADSHEETS */}
        <div className="bg-[var(--bg-surface)] border border-[var(--glass-border)] rounded-[2rem] p-8 shadow-sm overflow-hidden">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-xl font-light tracking-wide">Component Matrix Rules</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Click row numbers to select. Use Excel paste or direct cell edits.</p>
            </div>
          </div>

          <div className="space-y-12">
            {/* Diamonds & Stones */}
            <div className="rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="flex justify-between items-center bg-[var(--bg-base)] p-4 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold tracking-wide flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] mr-3"></span>
                  Diamonds & Color Stones
                </h3>
                <div className="space-x-3 flex items-center">
                  {isEditingDiamond && selectedDiamonds.length > 0 && (
                    <button onClick={deleteSelectedDiamonds} className="text-xs font-semibold bg-red-50 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-all">Delete ({selectedDiamonds.length})</button>
                  )}
                  {isEditingDiamond ? (
                    <>
                      <button onClick={addDiamondRow} className="text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-color)] px-4 py-1.5 rounded-lg hover:bg-[var(--text-muted)]/5 transition-all">+ Add Row</button>
                      <button onClick={() => { setIsEditingDiamond(false); setSelectedDiamonds([]); }} className="text-xs font-semibold bg-emerald-600 text-white px-5 py-1.5 rounded-lg shadow-sm hover:bg-emerald-700 transition-all">Save Matrix</button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditingDiamond(true)} className="flex items-center text-xs font-semibold bg-[var(--text-muted)]/10 text-[var(--text-main)] px-4 py-1.5 rounded-lg hover:bg-[var(--text-muted)]/20 transition-all">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit Matrix
                    </button>
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto bg-[var(--bg-surface)]">
                <table className="w-full text-sm text-left whitespace-nowrap border-collapse">
                  <thead className="bg-[var(--bg-base)] text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    <tr>
                      <th className="border border-[var(--border-color)] bg-[var(--bg-surface)] text-center py-2 w-12 font-semibold">#</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold w-24">Div</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold">Shape</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold">Color</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold">Clarity</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold">Size From</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold text-right">Selling Rate (₹)</th>
                    </tr>
                  </thead>
                  <tbody onPaste={handleDiamondPaste}>
                    {diamondData.map((row, index) => {
                      const isSelected = selectedDiamonds.includes(row.id);
                      return (
                        <tr key={row.id} className={`${isSelected ? 'bg-red-50 text-black' : isEditingDiamond ? 'hover:bg-[var(--brand-primary)]/5' : 'hover:bg-[var(--bg-base)]'} transition-colors duration-75`}>
                          <td 
                            className={`p-0 text-center text-xs font-mono border border-[var(--border-color)] select-none ${isEditingDiamond ? 'cursor-pointer hover:bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'} ${isSelected ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] font-bold' : ''}`}
                            onClick={() => {
                              if (!isEditingDiamond) return;
                              setSelectedDiamonds(prev => prev.includes(row.id) ? prev.filter(id => id !== row.id) : [...prev, row.id]);
                            }}
                          >
                            {index + 1}
                          </td>
                          <td className={`p-0 border border-[var(--border-color)] ${isEditingDiamond ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.division} onChange={(e: any) => handleDiamondChange(index, 'division', e.target.value)} isEditing={isEditingDiamond} align="center" /></td>
                          <td className={`p-0 border border-[var(--border-color)] ${isEditingDiamond ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.shape} onChange={(e: any) => handleDiamondChange(index, 'shape', e.target.value)} isEditing={isEditingDiamond} /></td>
                          <td className={`p-0 border border-[var(--border-color)] ${isEditingDiamond ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.color} onChange={(e: any) => handleDiamondChange(index, 'color', e.target.value)} isEditing={isEditingDiamond} /></td>
                          <td className={`p-0 border border-[var(--border-color)] ${isEditingDiamond ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.clarity} onChange={(e: any) => handleDiamondChange(index, 'clarity', e.target.value)} isEditing={isEditingDiamond} /></td>
                          <td className={`p-0 border border-[var(--border-color)] ${isEditingDiamond ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.sizeFrom} onChange={(e: any) => handleDiamondChange(index, 'sizeFrom', e.target.value)} isEditing={isEditingDiamond} /></td>
                          <td className={`p-0 border border-[var(--border-color)] font-mono text-[var(--brand-primary)] ${isEditingDiamond ? 'bg-white' : 'bg-transparent'}`}><TableInput value={row.rate} onChange={(e: any) => handleDiamondChange(index, 'rate', Number(e.target.value))} type="number" isEditing={isEditingDiamond} align="right" /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Labour Charges */}
            <div className="rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm">
              <div className="flex justify-between items-center bg-[var(--bg-base)] p-4 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-semibold tracking-wide flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></span>
                  Labour & Making Charges
                </h3>
                <div className="space-x-3 flex items-center">
                  {isEditingLabour && selectedLabours.length > 0 && (
                    <button onClick={deleteSelectedLabours} className="text-xs font-semibold bg-red-50 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-all">Delete ({selectedLabours.length})</button>
                  )}
                  {isEditingLabour ? (
                    <>
                      <button onClick={addLabourRow} className="text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-color)] px-4 py-1.5 rounded-lg hover:bg-[var(--text-muted)]/5 transition-all">+ Add Row</button>
                      <button onClick={() => { setIsEditingLabour(false); setSelectedLabours([]); }} className="text-xs font-semibold bg-emerald-600 text-white px-5 py-1.5 rounded-lg shadow-sm hover:bg-emerald-700 transition-all">Save Matrix</button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditingLabour(true)} className="flex items-center text-xs font-semibold bg-[var(--text-muted)]/10 text-[var(--text-main)] px-4 py-1.5 rounded-lg hover:bg-[var(--text-muted)]/20 transition-all">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      Edit Matrix
                    </button>
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto bg-[var(--bg-surface)]">
                <table className="w-full text-sm text-left whitespace-nowrap border-collapse">
                  <thead className="bg-[var(--bg-base)] text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    <tr>
                      <th className="border border-[var(--border-color)] bg-[var(--bg-surface)] text-center py-2 w-12 font-semibold">#</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold w-24">Div</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold">Labour Type</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold">Category</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold text-center">Gram From</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold text-center">Gram To</th>
                      <th className="border border-[var(--border-color)] px-3 py-2 font-semibold text-right">Cost Rate (₹)</th>
                    </tr>
                  </thead>
                  <tbody onPaste={handleLabourPaste}>
                    {labourData.map((row, index) => {
                      const isSelected = selectedLabours.includes(row.id);
                      return (
                        <tr key={row.id} className={`${isSelected ? 'bg-red-50 text-black' : isEditingLabour ? 'hover:bg-[var(--brand-primary)]/5' : 'hover:bg-[var(--bg-base)]'} transition-colors duration-75`}>
                          <td 
                            className={`p-0 text-center text-xs font-mono border border-[var(--border-color)] select-none ${isEditingLabour ? 'cursor-pointer hover:bg-emerald-500/10 text-emerald-600' : 'bg-[var(--bg-surface)] text-[var(--text-muted)]'} ${isSelected ? 'bg-emerald-500/20 text-emerald-700 font-bold' : ''}`}
                            onClick={() => {
                              if (!isEditingLabour) return;
                              setSelectedLabours(prev => prev.includes(row.id) ? prev.filter(id => id !== row.id) : [...prev, row.id]);
                            }}
                          >
                            {index + 1}
                          </td>
                          <td className={`p-0 border border-[var(--border-color)] ${isEditingLabour ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.division} onChange={(e: any) => handleLabourChange(index, 'division', e.target.value)} isEditing={isEditingLabour} align="center" /></td>
                          <td className={`p-0 border border-[var(--border-color)] ${isEditingLabour ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.type} onChange={(e: any) => handleLabourChange(index, 'type', e.target.value)} isEditing={isEditingLabour} /></td>
                          <td className={`p-0 border border-[var(--border-color)] ${isEditingLabour ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.category} onChange={(e: any) => handleLabourChange(index, 'category', e.target.value)} isEditing={isEditingLabour} /></td>
                          <td className={`p-0 border border-[var(--border-color)] font-mono ${isEditingLabour ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.weightFrom} onChange={(e: any) => handleLabourChange(index, 'weightFrom', Number(e.target.value))} type="number" isEditing={isEditingLabour} align="center" /></td>
                          <td className={`p-0 border border-[var(--border-color)] font-mono ${isEditingLabour ? 'bg-white text-black' : 'bg-transparent text-[var(--text-main)]'}`}><TableInput value={row.weightTo} onChange={(e: any) => handleLabourChange(index, 'weightTo', Number(e.target.value))} type="number" isEditing={isEditingLabour} align="center" /></td>
                          <td className={`p-0 border border-[var(--border-color)] font-mono text-[var(--brand-primary)] ${isEditingLabour ? 'bg-white' : 'bg-transparent'}`}><TableInput value={row.rate} onChange={(e: any) => handleLabourChange(index, 'rate', Number(e.target.value))} type="number" isEditing={isEditingLabour} align="right" /></td>
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
    </div>
  );
}