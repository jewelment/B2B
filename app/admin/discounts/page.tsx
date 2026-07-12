'use client';

import React, { useState, useMemo } from 'react';
import BrandLogo from '../../../components/BrandLogo';

// --- REUSABLE ICONS ---
const IconPlus = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>;
const IconList = () => <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const IconChart = () => <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const IconEdit = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const IconPower = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconStop = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>;
const IconDelete = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconShare = () => <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;

// --- UI HELPERS (Moved OUTSIDE main component to fix the focus bug) ---
const FormGroup = ({ label, children, required = false }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

// Dummy Customer Database
const CUSTOMER_DB = [
  { id: 'C001', name: 'Malabar Gold Wholesale', code: 'MGW-99' },
  { id: 'C002', name: 'Tanishq Franchise (Mumbai)', code: 'TAN-MH' },
  { id: 'C003', name: 'Kalyan Jewellers', code: 'KAL-HQ' },
  { id: 'C004', name: 'Senco Gold & Diamonds', code: 'SNC-01' },
];

export default function DiscountSchemeBuilder() {
  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState<'NEW' | 'LIST' | 'ANALYTICS'>('LIST');

  // --- SCHEME MASTER STATE ---
  const [schemeName, setSchemeName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- CUSTOMER TARGETING STATE ---
  const [customerScope, setCustomerScope] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // --- DISCOUNT CONFIG STATE ---
  const [discountType, setDiscountType] = useState<'COMPONENT' | 'TOTAL'>('COMPONENT');
  const [totalDiscountPercent, setTotalDiscountPercent] = useState(0);
  const [componentConfig, setComponentConfig] = useState({
    metal: { enabled: false, discount: 0 },
    diamond: { enabled: true, discount: 70 },
    colorStone: { enabled: false, discount: 0 },
    labour: { enabled: true, discount: 15 },
  });

  // --- RULES & MARGINS STATE ---
  const [minOrderValue, setMinOrderValue] = useState<number | ''>('');
  const [usageLimit, setUsageLimit] = useState<number | ''>('');
  const [priority, setPriority] = useState(1);
  const [minMarginWarning, setMinMarginWarning] = useState<number | ''>(10);
  const [minMarginBlock, setMinMarginBlock] = useState<number | ''>(5);

  // --- MESSAGING STATE ---
  const [disclaimer, setDisclaimer] = useState('Applies to Diamond & Making charges only. Metal billed at live actuals.');

  // --- SAVED SCHEMES DB ---
  const [savedSchemes, setSavedSchemes] = useState<any[]>([
    { id: 1, name: 'Diwali Diamond Fest', code: 'DAM70', detail: 'Diamond 70% | Labour 15%', disclaimer: 'Metal Excluded', type: 'Component', scope: 'ALL', status: 'ACTIVE', priority: 1, startDate: '2026-10-01', uses: 142 },
    { id: 2, name: 'Malabar Bulk Deal Q3', code: 'AJ-X7B9Q', detail: 'Total 5% Flat', disclaimer: 'Min Order 500g', type: 'Total', scope: 'SPECIFIC', status: 'INACTIVE', priority: 2, startDate: '2026-07-01', uses: 5 },
    { id: 3, name: 'Kalyan Launch Special', code: 'KAL100', detail: 'Labour 100%', disclaimer: 'First Order Only', type: 'Component', scope: 'SPECIFIC', status: 'FORCED_STOP', priority: 1, startDate: '2026-01-15', uses: 22 },
  ]);

  // --- LIST FILTER STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  // --- FORM ACTIONS ---
  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'AJ-';
    for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setPromoCode(result);
  };

  const handleComponentChange = (component: keyof typeof componentConfig, field: 'enabled' | 'discount', value: any) => {
    setComponentConfig(prev => ({ ...prev, [component]: { ...prev[component], [field]: value } }));
  };

  const toggleCustomer = (id: string) => {
    setSelectedCustomers(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  };

  const handleSave = () => {
    if (!schemeName || !promoCode) return alert("Please fill in the Scheme Name and Promo Code.");
    const detailString = discountType === 'TOTAL' ? `Total ${totalDiscountPercent}% Flat` : 
      `Diam ${componentConfig.diamond.enabled ? componentConfig.diamond.discount : 0}% | Lab ${componentConfig.labour.enabled ? componentConfig.labour.discount : 0}%`;
    
    const newScheme = {
      id: Date.now(), name: schemeName, code: promoCode, detail: detailString, disclaimer: disclaimer, type: discountType === 'TOTAL' ? 'Total' : 'Component', scope: customerScope, status: status, priority: priority, startDate: startDate || new Date().toISOString().split('T')[0], uses: 0
    };
    
    setSavedSchemes([newScheme, ...savedSchemes]);
    setActiveTab('LIST');
  };

  // --- TABLE ACTIONS ---
  const toggleSchemeStatus = (id: number) => {
    setSavedSchemes(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : s));
  };

  const forceStopScheme = (id: number) => {
    setSavedSchemes(prev => prev.map(s => s.id === id ? { ...s, status: 'FORCED_STOP' } : s));
  };

  const deleteScheme = (id: number) => {
    if(window.confirm('Are you sure you want to permanently delete this scheme?')) {
      setSavedSchemes(prev => prev.filter(s => s.id !== id));
    }
  };

  // --- NATIVE SHARE FUNCTIONALITY ---
  const handleShare = async () => {
    const shareData = {
      title: `${schemeName || 'Exclusive Partner Offer'}`,
      text: `Ashok Jewels B2B Portal: Use code ${promoCode || 'PROMO'} to unlock your exclusive partner discount.\n\n${disclaimer}`,
      url: window.location.origin + '/login'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\nLogin here: ${shareData.url}`);
      alert('Offer details copied to clipboard! You can paste them into WhatsApp or Email.');
    }
  };

  // --- FILTERED SCHEMES ---
  const filteredSchemes = useMemo(() => {
    return savedSchemes.filter(scheme => {
      const matchSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) || scheme.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'ALL' || scheme.status === filterStatus;
      const matchPriority = filterPriority === 'ALL' || scheme.priority.toString() === filterPriority;
      return matchSearch && matchStatus && matchPriority;
    });
  }, [searchQuery, filterStatus, filterPriority, savedSchemes]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] p-6 md:p-10 font-sans pb-24">
      <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR: NAVIGATION --- */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-10 space-y-8">
            <div>
              <h2 className="text-xl font-light tracking-wide mb-6 text-[var(--text-main)]">Discount Engine</h2>
              <nav className="space-y-2">
                <button onClick={() => setActiveTab('LIST')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'LIST' ? 'bg-[var(--brand-primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)] border border-transparent'}`}>
                  <IconList /> Active Schemes
                </button>
                <button onClick={() => setActiveTab('NEW')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'NEW' ? 'bg-[var(--brand-primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)] border border-transparent'}`}>
                  <IconEdit /> Create New Scheme
                </button>
                <button onClick={() => setActiveTab('ANALYTICS')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === 'ANALYTICS' ? 'bg-[var(--brand-primary)] text-white shadow-md' : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface)] border border-transparent'}`}>
                  <IconChart /> Redemption Analytics
                </button>
              </nav>
            </div>
            {activeTab === 'ANALYTICS' && (
              <div className="bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">System Health</h3>
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <span className="text-sm font-medium text-emerald-700">API Sync</span>
                  <span className="flex items-center h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- CENTER CONTENT AREA --- */}
        <div className="flex-1 min-w-0">
          
          {/* ========================================== */}
          {/* VIEW: ACTIVE SCHEMES LIST */}
          {/* ========================================== */}
          {activeTab === 'LIST' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-light tracking-wide text-[var(--text-main)]">Active Schemes</h1>
                  <p className="text-sm text-[var(--text-muted)] mt-2">Manage all live, inactive, and forced-stopped promotional codes.</p>
                </div>
                <button onClick={() => setActiveTab('NEW')} className="px-6 py-2.5 bg-[var(--brand-primary)] text-white text-sm font-semibold rounded-xl shadow-md hover:-translate-y-0.5 transition-all">
                  + Create Scheme
                </button>
              </div>

              {/* Filters */}
              <div className="bg-[var(--bg-surface)] p-4 rounded-2xl border border-[var(--border-color)] shadow-sm flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" placeholder="Search by Scheme Name or Promo Code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-[var(--brand-primary)] transition-all" />
                </div>
                <div className="flex gap-4">
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--brand-primary)]">
                    <option value="ALL">Status: All</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive / Draft</option>
                    <option value="FORCED_STOP">Forced Stop</option>
                  </select>
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl text-sm font-medium focus:outline-none focus:border-[var(--brand-primary)]">
                    <option value="ALL">Priority: All</option>
                    <option value="1">Priority 1</option>
                    <option value="2">Priority 2</option>
                    <option value="3">Priority 3</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-[var(--bg-base)] text-[10px] text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Scheme Name</th>
                        <th className="px-4 py-4 font-semibold">Promo Code</th>
                        <th className="px-4 py-4 font-semibold">Discount Detail</th>
                        <th className="px-4 py-4 font-semibold">Disclaimer</th>
                        <th className="px-4 py-4 font-semibold">Type</th>
                        <th className="px-4 py-4 font-semibold text-center">Status</th>
                        <th className="px-4 py-4 font-semibold text-center">Priority</th>
                        <th className="px-4 py-4 font-semibold">Start Date</th>
                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {filteredSchemes.map((scheme) => (
                        <tr key={scheme.id} className="hover:bg-[var(--bg-base)] transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-[var(--text-main)] block">{scheme.name}</span>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase">{scheme.scope === 'ALL' ? 'Public' : 'Targeted'}</span>
                          </td>
                          <td className="px-4 py-4 font-mono text-[var(--brand-primary)] font-bold">{scheme.code}</td>
                          <td className="px-4 py-4 text-xs font-medium">{scheme.detail}</td>
                          <td className="px-4 py-4 text-xs text-[var(--text-muted)] truncate max-w-[120px]" title={scheme.disclaimer}>{scheme.disclaimer}</td>
                          <td className="px-4 py-4 text-xs">{scheme.type}</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`text-[10px] px-2.5 py-1 rounded-md uppercase font-bold tracking-wider ${
                              scheme.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                              scheme.status === 'FORCED_STOP' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>{scheme.status}</span>
                          </td>
                          <td className="px-4 py-4 text-center font-mono">{scheme.priority}</td>
                          <td className="px-4 py-4 text-xs">{scheme.startDate}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end space-x-2">
                              <button onClick={() => alert('Edit applicability opens modal in Phase 2')} title="Edit Applicability" className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><IconEdit /></button>
                              <button onClick={() => toggleSchemeStatus(scheme.id)} title={scheme.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} className={`p-1.5 rounded-md transition-colors ${scheme.status === 'ACTIVE' ? 'text-gray-600 hover:bg-gray-100' : 'text-emerald-600 hover:bg-emerald-50'}`}><IconPower /></button>
                              <button onClick={() => forceStopScheme(scheme.id)} disabled={scheme.status === 'FORCED_STOP'} title="Forced Stop" className="p-1.5 text-amber-600 hover:bg-amber-50 disabled:opacity-30 rounded-md transition-colors"><IconStop /></button>
                              <button onClick={() => deleteScheme(scheme.id)} title="Delete Scheme" className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"><IconDelete /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* VIEW: REDEMPTION ANALYTICS */}
          {/* ========================================== */}
          {activeTab === 'ANALYTICS' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-8">
                <h1 className="text-3xl font-light tracking-wide text-[var(--text-main)]">Redemption Analytics</h1>
                <p className="text-sm text-[var(--text-muted)] mt-2">Monitor financial impact and usage trends across all active promotional schemes.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Active Schemes</p>
                  <p className="text-4xl font-light text-[var(--text-main)] mt-3">24</p>
                </div>
                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Total Discount Given</p>
                  <p className="text-4xl font-light text-emerald-600 mt-3">₹12.4L</p>
                </div>
                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">POs Closed via Promos</p>
                  <p className="text-4xl font-light text-[var(--brand-primary)] mt-3">147</p>
                </div>
                <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Most Popular</p>
                  <p className="text-2xl font-mono text-[var(--text-main)] mt-4">DAM70</p>
                </div>
              </div>

              <div className="bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm">
                <h3 className="text-sm font-semibold tracking-wide mb-8">Discount Redemption Volume (Last 30 Days)</h3>
                <div className="h-64 w-full flex items-end justify-between space-x-2 px-4 relative border-b border-dashed border-[var(--border-color)]">
                  <div className="absolute left-0 h-full flex flex-col justify-between text-[10px] text-[var(--text-muted)] pb-2 -ml-2">
                    <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
                  </div>
                  {[30, 45, 20, 60, 80, 55, 90, 100, 70, 40, 85, 65, 50, 75, 40, 20, 50, 80, 95, 60, 45, 30, 55, 75, 90, 40, 60, 85, 100, 70].map((val, i) => (
                    <div key={i} className="w-full relative group flex flex-col justify-end h-full">
                      <div className="w-full bg-[var(--brand-primary)]/20 rounded-t-sm group-hover:bg-[var(--brand-primary)] transition-all duration-300" style={{ height: `${val}%` }}></div>
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                        {val} uses
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-4 uppercase tracking-wider font-semibold px-4 pl-8">
                  <span>Start of Month</span><span>Mid Month</span><span>Today</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* VIEW: CREATE NEW SCHEME & LUXURY PREVIEW */}
          {/* ========================================== */}
          {activeTab === 'NEW' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col xl:flex-row gap-10">
              
              {/* THE FORM */}
              <div className="flex-1 space-y-8">
                <div className="flex justify-between items-end pb-6 border-b border-[var(--border-color)]">
                  <div>
                    <h1 className="text-3xl font-light tracking-wide text-[var(--text-main)]">Configure Scheme</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-2">Define promotional parameters, rules, and margins.</p>
                  </div>
                  <button onClick={handleSave} className="px-8 py-3 bg-[var(--brand-primary)] text-white text-sm font-semibold tracking-wide rounded-xl shadow-md hover:bg-[var(--brand-primary-hover)] hover:-translate-y-0.5 transition-all">Save Scheme</button>
                </div>

                <div className="space-y-8">
                  {/* 1. MASTER DETAILS */}
                  <div className="bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold tracking-wide">1. Scheme Identity</h2>
                      <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input type="checkbox" className="sr-only" checked={status === 'ACTIVE'} onChange={(e) => setStatus(e.target.checked ? 'ACTIVE' : 'INACTIVE')} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${status === 'ACTIVE' ? 'transform translate-x-4' : ''}`}></div>
                          </div>
                          <div className="ml-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{status}</div>
                      </label>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <FormGroup label="Event / Campaign Name" required>
                        <input type="text" value={schemeName} onChange={(e) => setSchemeName(e.target.value)} placeholder="e.g. Exclusive Wholesale Fest" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)] transition-all" />
                      </FormGroup>

                      <FormGroup label="Promo Code" required>
                        <div className="flex items-center space-x-3">
                          <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="e.g. VIP2026" className="flex-1 px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl font-mono text-[var(--brand-primary)] font-bold focus:outline-none focus:border-[var(--brand-primary)] uppercase transition-all" />
                          <button onClick={generateUniqueCode} className="px-5 py-3 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[var(--bg-base)] transition-all whitespace-nowrap">Auto Generate</button>
                        </div>
                      </FormGroup>

                      <div className="grid grid-cols-2 gap-6">
                        <FormGroup label="Start Date">
                          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)] transition-all" />
                        </FormGroup>
                        <FormGroup label="End Date">
                          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)] transition-all" />
                        </FormGroup>
                      </div>
                    </div>
                  </div>

                  {/* 2. CUSTOMER TARGETING */}
                  <div className="bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <h2 className="text-lg font-semibold tracking-wide mb-6">2. Customer Scope</h2>
                    <div className="flex space-x-6 mb-6">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="scope" checked={customerScope === 'ALL'} onChange={() => setCustomerScope('ALL')} className="w-4 h-4 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]" />
                        <span className="ml-2 text-sm font-medium">All Customers (Public)</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="scope" checked={customerScope === 'SPECIFIC'} onChange={() => setCustomerScope('SPECIFIC')} className="w-4 h-4 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)]" />
                        <span className="ml-2 text-sm font-medium">Specific Authorized Buyers</span>
                      </label>
                    </div>

                    {customerScope === 'SPECIFIC' && (
                      <div className="p-5 bg-[var(--bg-base)] rounded-xl border border-[var(--border-color)] animate-in fade-in duration-300">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold mb-4">Selected Partners</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedCustomers.length === 0 && <span className="text-sm text-[var(--text-muted)] italic">No buyers selected.</span>}
                          {selectedCustomers.map(id => {
                            const c = CUSTOMER_DB.find(cust => cust.id === id);
                            return c ? (
                              <div key={id} className="flex items-center bg-white shadow-sm px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-sm font-medium">
                                {c.name} <span className="mx-2 text-gray-300">|</span> <span className="font-mono text-xs text-[var(--text-muted)]">{c.code}</span>
                                <button onClick={() => toggleCustomer(id)} className="ml-3 text-gray-400 hover:text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                              </div>
                            ) : null;
                          })}
                        </div>
                        <div className="border-t border-[var(--border-color)] pt-4 relative">
                          <svg className="w-4 h-4 absolute left-3 top-7 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                          <select onChange={(e) => { if(e.target.value) toggleCustomer(e.target.value); e.target.value=''; }} className="w-full pl-9 pr-4 py-3 bg-white border border-[var(--border-color)] rounded-xl text-sm focus:outline-none focus:border-[var(--brand-primary)] appearance-none">
                            <option value="">Search and select authorized customer...</option>
                            {CUSTOMER_DB.filter(c => !selectedCustomers.includes(c.id)).map(c => (
                              <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. DISCOUNT LOGIC */}
                  <div className="bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                       <h2 className="text-lg font-semibold tracking-wide">3. Discount Logic</h2>
                       <div className="flex bg-[var(--bg-base)] p-1 rounded-xl border border-[var(--border-color)]">
                          <button onClick={() => setDiscountType('COMPONENT')} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${discountType === 'COMPONENT' ? 'bg-[var(--brand-primary)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Component Based</button>
                          <button onClick={() => setDiscountType('TOTAL')} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${discountType === 'TOTAL' ? 'bg-[var(--brand-primary)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>Flat Total</button>
                       </div>
                    </div>

                    {discountType === 'TOTAL' ? (
                       <FormGroup label="Total Purchase Discount (%)">
                          <div className="relative w-1/3 min-w-[200px]">
                            <input type="number" min="0" max="100" value={totalDiscountPercent} onChange={(e) => setTotalDiscountPercent(Number(e.target.value))} className="w-full px-4 py-3 font-mono text-lg bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)]" />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">%</span>
                          </div>
                       </FormGroup>
                    ) : (
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { id: 'metal', label: 'Gold / Metal Base' },
                            { id: 'diamond', label: 'Diamond Values' },
                            { id: 'colorStone', label: 'Color Stones' },
                            { id: 'labour', label: 'Making / Labour' }
                          ].map((comp) => {
                            const key = comp.id as keyof typeof componentConfig;
                            const data = componentConfig[key];
                            return (
                              <div key={comp.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${data.enabled ? 'bg-white border-[var(--border-color)] shadow-sm' : 'bg-[var(--bg-base)] border-dashed border-[var(--border-color)] opacity-70'}`}>
                                 <div className="flex items-center space-x-3">
                                   <input type="checkbox" checked={data.enabled} onChange={(e) => handleComponentChange(key, 'enabled', e.target.checked)} className="w-4 h-4 rounded border-[var(--border-color)] accent-[var(--brand-primary)] cursor-pointer" />
                                   <span className={`font-semibold text-sm ${data.enabled ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>{comp.label}</span>
                                 </div>
                                 {data.enabled && (
                                   <div className="relative w-24">
                                     <input type="number" min="0" max="100" value={data.discount} onChange={(e) => handleComponentChange(key, 'discount', Number(e.target.value))} className="w-full px-3 py-1.5 text-right font-mono text-sm bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--brand-primary)]" />
                                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[10px] font-bold">%</span>
                                   </div>
                                 )}
                              </div>
                            )
                          })}
                       </div>
                    )}
                  </div>

                  {/* 4. RULES & MARGIN PROTECTION */}
                  <div className="bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <h2 className="text-lg font-semibold tracking-wide mb-6">4. Rules & Margin Protection</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormGroup label="Min Order Value (₹)">
                        <input type="number" value={minOrderValue} onChange={(e) => setMinOrderValue(Number(e.target.value) || '')} placeholder="0" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)] transition-all" />
                      </FormGroup>
                      <FormGroup label="Max Global Usages">
                        <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(Number(e.target.value) || '')} placeholder="Unlimited" className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)] transition-all" />
                      </FormGroup>
                      <FormGroup label="Conflict Priority">
                        <select value={priority} onChange={(e) => setPriority(Number(e.target.value))} className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)] transition-all cursor-pointer">
                          <option value={1}>1 (Highest Priority)</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4 (Lowest Priority)</option>
                        </select>
                      </FormGroup>
                    </div>

                    <div className="mt-8 p-6 bg-red-50/50 border border-red-100 rounded-2xl">
                       <h3 className="text-sm font-semibold text-red-700 mb-4 flex items-center">
                         <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                         Margin Protection Thresholds
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-bold text-red-900/60 uppercase tracking-wider mb-2">Block checkout if Margin falls below (%)</label>
                            <input type="number" value={minMarginBlock} onChange={(e) => setMinMarginBlock(Number(e.target.value) || '')} placeholder="5" className="w-full px-4 py-3 bg-white border border-red-200 rounded-xl font-mono text-red-600 focus:outline-none focus:border-red-400" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-amber-900/60 uppercase tracking-wider mb-2">Flag order for review if Margin falls below (%)</label>
                            <input type="number" value={minMarginWarning} onChange={(e) => setMinMarginWarning(Number(e.target.value) || '')} placeholder="10" className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl font-mono text-amber-600 focus:outline-none focus:border-amber-400" />
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* 5. FRONT-END MESSAGING */}
                  <div className="bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm">
                    <h2 className="text-lg font-semibold tracking-wide mb-6">5. Legal & Messaging</h2>
                    <div className="space-y-6">
                      <FormGroup label="Disclaimer Text (Shows on Shareable Card & Invoice)">
                        <textarea value={disclaimer} onChange={(e) => setDisclaimer(e.target.value)} rows={3} className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:border-[var(--brand-primary)] transition-all resize-none"></textarea>
                      </FormGroup>
                    </div>
                  </div>

                </div>
              </div>

              {/* --- RIGHT SIDEBAR: LUXURY SHAREABLE E-GIFT CARD PREVIEW --- */}
              <div className="w-full xl:w-[400px] flex-shrink-0">
                <div className="sticky top-10 space-y-6">
                  
                  <div className="flex justify-between items-end">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                      E-Gift Card Preview
                    </h3>
                    <button onClick={handleShare} className="flex items-center text-[10px] font-bold uppercase tracking-wider bg-[#dfae61]/10 text-[#dfae61] px-3 py-1.5 rounded-lg hover:bg-[#dfae61] hover:text-gray-900 transition-all">
                      <IconShare /> Share Asset
                    </button>
                  </div>
                  
                  {/* The Luxury Card UI (Bespoke Black & Gold Theme) */}
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-b from-[#111111] to-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] isolate p-1.5 border-2 border-transparent" style={{ backgroundClip: 'padding-box, border-box', backgroundImage: 'linear-gradient(#111, #000), linear-gradient(to bottom, #dfae61, #5c4316)' }}>
                    
                    {/* Inner Content Container */}
                    <div className="w-full h-full relative flex flex-col items-center justify-between p-8 z-10 text-center">
                      
                      {/* Top Brand Logo */}
                      <div className="mt-2 mb-6">
                         <BrandLogo theme="DARK" variant="FULL" width={160} height={55} className="mx-auto" />
                      </div>

                      <div className="space-y-4 w-full mt-4">
                        <h4 className="text-[10px] font-bold text-[#dfae61] uppercase tracking-[0.3em]">
                          {customerScope === 'SPECIFIC' && selectedCustomers.length > 0 ? 'Exclusive Partner Offer' : 'Special Offer'}
                        </h4>
                        
                        <h2 className="text-3xl font-serif text-white tracking-wide leading-tight">
                          {schemeName || 'Your Campaign Name'}
                        </h2>

                        <div className="py-6 w-full">
                           <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-3">Use Promo Code</p>
                           <div className="inline-block border-y border-[#dfae61]/30 py-4 px-8 w-full">
                             <span className="font-mono text-2xl text-[#dfae61] font-bold tracking-[0.3em]">
                               {promoCode || 'PROMO-CODE'}
                             </span>
                           </div>
                        </div>

                        {/* Minimalist Discount Details */}
                        <div className="space-y-3 text-[13px] text-gray-300 font-medium">
                          {discountType === 'TOTAL' ? (
                             <p>{totalDiscountPercent}% Flat Purchase Discount</p>
                          ) : (
                             <>
                                {componentConfig.diamond.enabled && componentConfig.diamond.discount > 0 && <p>{componentConfig.diamond.discount}% Off Diamonds</p>}
                                {componentConfig.labour.enabled && componentConfig.labour.discount > 0 && <p>{componentConfig.labour.discount}% Off Making</p>}
                                {componentConfig.colorStone.enabled && componentConfig.colorStone.discount > 0 && <p>{componentConfig.colorStone.discount}% Off Color Stones</p>}
                                {componentConfig.metal.enabled && componentConfig.metal.discount > 0 && <p>{componentConfig.metal.discount}% Off Metal</p>}
                             </>
                          )}
                        </div>
                      </div>

                      <div className="w-full mt-auto pt-8">
                        <button className="w-full py-4 bg-[#dfae61] text-gray-900 text-[11px] font-bold uppercase tracking-widest rounded shadow-[0_0_20px_rgba(223,174,97,0.3)] hover:bg-[#c99a53] transition-colors">
                          Explore Store
                        </button>
                        <p className="mt-6 text-[8px] text-gray-500 uppercase tracking-[0.1em] px-4 leading-[1.6]">
                          {disclaimer || 'Applies to Diamond & Making charges only. Metal billed at live actuals.'}
                          {endDate && <span className="block mt-1">Valid Until: {new Date(endDate).toLocaleDateString('en-IN')}</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-[10px] text-[var(--text-muted)] mt-4">Screenshot this asset or click 'Share' to send directly to buyers via WhatsApp.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}