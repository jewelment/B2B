'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CustomDropdown = ({ options, value, onChange, placeholder, widthClass }: { options: string[], value: string, onChange: (val: string) => void, placeholder: string, widthClass?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative w-full ${widthClass || 'xl:w-48'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-black/5 dark:bg-[#121212] border ${isOpen ? 'border-[var(--brand-primary)]' : 'border-transparent hover:border-[var(--border-color)]'} rounded-xl px-4 py-3.5 text-sm outline-none transition-colors shadow-inner`}
      >
        <span className={value ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}>
          {value || placeholder}
        </span>
        <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-40 top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1e1e1e] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <ul className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map(option => (
              <li key={option}>
                <button 
                  onClick={() => { onChange(option); setIsOpen(false); }}
                  className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${value === option ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 font-medium' : 'text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function InventoryDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [logSearch, setLogSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals & Drawers State
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<any>(null);

  const logsDrawerRef = useRef<HTMLDivElement>(null);

  // Initial Data
  const [stores, setStores] = useState([
    {
      id: 1,
      name: 'Hadapsar - Pune - Maharashtra',
      address: 'Unit No. WB-FF-34B, Amanora Mall, Amanora Park Township, Village, Sadesatranali (17- 1/2 Nali), Hadapsar, Taluka Haveli Maharashtra 411028 India',
      code: 'F188',
      variants: 0,
      bagCount: 0,
      status: 'Active',
      city: 'Pune',
      manager: 'Ravi Kumar',
      phone: '+91 98765 43210',
      email: 'pune.hadapsar@store.com',
      gst: '27AADCA1234F1Z5'
    },
    {
      id: 2,
      name: 'Spectrum Mall - Noida - Uttar Pradesh',
      address: 'Ground Floor, Tower C, Spectrum mall, 8A and 8B, Phase-1, Sector 75 Uttar Pradesh 201301 India',
      code: 'C184',
      variants: 0,
      bagCount: 0,
      status: 'Active',
      city: 'Noida',
      manager: 'Sneha Patel',
      phone: '+91 91234 56789',
      email: 'noida.spectrum@store.com',
      gst: '09AADCA1234F1Z5'
    },
    {
      id: 3,
      name: 'Sarath City Capital Mall - Hyderabad - Telangana',
      address: 'UGF 121, Sarath City Capital Mall Miyapur - Gachibowli Rd, Kondapur, Whitefields, HITEC City Telangana 500084 India',
      code: 'F181',
      variants: 238,
      bagCount: 243,
      status: 'Active',
      city: 'Hyderabad',
      manager: 'Mohammed Ali',
      phone: '+91 99887 76655',
      email: 'hyd.sarath@store.com',
      gst: '36AADCA1234F1Z5'
    },
    {
      id: 4,
      name: 'Kisna Diamond Jewellery - Visakhapatnam',
      address: 'Salagramapuram Andhra Pradesh 530024 India',
      code: 'F183',
      variants: 469,
      bagCount: 484,
      status: 'In-Active',
      city: 'Visakhapatnam',
      manager: 'Priya Sharma',
      phone: '+91 98765 11223',
      email: 'vizag.kisna@store.com',
      gst: '37AADCA1234F1Z5'
    }
  ]);

  const logs = [
    {
      id: 1,
      user: 'System Admin',
      initials: 'SA',
      avatarColor: 'bg-purple-500/20 text-purple-500',
      activity: 'Store Inventory (F181) synced successfully.',
      date: '07-07-2026',
      time: '11:15 am'
    }
  ];

  // Derived State
  const counts = {
    'All': stores.length,
    'Active': stores.filter(s => s.status === 'Active').length,
    'In-Active': stores.filter(s => s.status === 'In-Active').length,
    'Archived': stores.filter(s => s.status === 'Archived').length,
  };

  const tabs = [
    { id: 'All', label: `All (${counts['All']})` },
    { id: 'Active', label: `Active (${counts['Active']})` },
    { id: 'In-Active', label: `In Active (${counts['In-Active']})` },
    { id: 'Archived', label: `Archived (${counts['Archived']})` }
  ];

  const filteredStores = stores.filter(store => {
    let matchesTab = true;
    if (activeTab !== 'All') {
      matchesTab = store.status === activeTab;
    }
    
    let matchesSearch = true;
    if (search) {
      matchesSearch = store.name.toLowerCase().includes(search.toLowerCase()) || store.code.toLowerCase().includes(search.toLowerCase());
    }

    return matchesTab && matchesSearch;
  });

  // Event Handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLogsOpen && logsDrawerRef.current && !logsDrawerRef.current.contains(event.target as Node)) {
        setIsLogsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLogsOpen]);

  const handleViewStore = (id: number) => {
    router.push(`/admin/inventory/${id}`);
  };

  const handleDeleteClick = (store: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setStoreToDelete(store);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setStores(stores.filter(s => s.id !== storeToDelete.id));
    setIsDeleteModalOpen(false);
    setStoreToDelete(null);
  };

  const handleArchive = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setStores(stores.map(s => s.id === id ? { ...s, status: 'Archived' } : s));
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap';
      case 'In-Active':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 whitespace-nowrap';
      case 'Archived':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/30 whitespace-nowrap';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/30 whitespace-nowrap';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen">
      
      {/* Header Panel */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Inventory</h1>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <button onClick={() => setIsLogsOpen(true)} className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
            View Logs
          </button>
          <button className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
            Transfer Inventory
          </button>
          <button className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
            Purge Inventory
          </button>
          <button className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
            Export
          </button>
          <button className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
            Import
          </button>
          <button 
            onClick={() => router.push('/admin/inventory/add')}
            className="px-6 py-2.5 bg-[var(--brand-primary)] text-white dark:text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover uppercase tracking-wide"
          >
            + Add Store
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden flex flex-col">
        
        {/* Tabs */}
        <div className="flex px-4 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters Toolbar */}
        <div className="px-6 py-6 pb-8 border-t border-[var(--border-color)] flex flex-col xl:flex-row items-center gap-4">
          
          {/* Search Bar matching Reviews style */}
          <div className="flex items-center w-full bg-black/5 dark:bg-[#121212] rounded-xl border border-transparent focus-within:border-[var(--border-color)] transition-colors shadow-inner flex-1">
            <div className="pl-4 pr-2">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent py-3.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto">
            <CustomDropdown 
              options={['Pune', 'Noida', 'Hyderabad', 'Visakhapatnam']} 
              value={selectedCity} 
              onChange={setSelectedCity} 
              placeholder="Select the City" 
              widthClass="xl:w-48"
            />
            
            <CustomDropdown 
              options={['Active', 'In-Active', 'Archived']} 
              value={selectedStatus} 
              onChange={setSelectedStatus} 
              placeholder="Status" 
              widthClass="xl:w-36"
            />
            
            <button className="flex items-center gap-2 px-5 py-3.5 bg-black/5 dark:bg-[#121212] border border-transparent rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors shadow-inner whitespace-nowrap">
              Sort
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
            </button>
          </div>
        </div>

        {/* Master Data Grid */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              {/* Emphasized Table Header */}
              <tr className="bg-black/10 dark:bg-white/10 border-y border-[var(--border-color)] text-[11px] font-extrabold text-[var(--text-main)] uppercase tracking-wider shadow-sm">
                <th className="py-4 px-6 w-12"><input type="checkbox" className="rounded border-[#333] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-transparent cursor-pointer" /></th>
                <th className="py-4 px-6">SELECT STORE</th>
                <th className="py-4 px-6 w-32">BRANCH CODE</th>
                <th className="py-4 px-6 w-28 text-right">VARIANTS</th>
                <th className="py-4 px-6 w-28 text-right">BAG COUNT</th>
                <th className="py-4 px-6 w-36 text-center">STATUS</th>
                <th className="py-4 px-6 w-56 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                    No stores found for the active filters.
                  </td>
                </tr>
              ) : (
                filteredStores.map((store) => (
                  <tr 
                    key={store.id} 
                    onClick={() => handleViewStore(store.id)}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-6 px-6 align-top" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-[var(--border-color)] bg-transparent text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                    </td>
                    <td className="py-6 px-6 align-top pr-12">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-[var(--brand-primary)] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          <p className="text-[15px] font-semibold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors truncate">{store.name}</p>
                          <p className="text-[13px] text-[var(--text-muted)] line-clamp-2 leading-relaxed">{store.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 align-top font-medium text-[var(--text-main)]">
                      {store.code}
                    </td>
                    <td className="py-6 px-6 align-top text-right text-[var(--text-muted)] font-mono">
                      {store.variants}
                    </td>
                    <td className="py-6 px-6 align-top text-right text-[var(--text-muted)] font-mono">
                      {store.bagCount}
                    </td>
                    <td className="py-6 px-6 text-center align-top">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(store.status)}`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-center align-top">
                      <div className="flex justify-center gap-4" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleViewStore(store.id)} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] dark:hover:text-white transition-colors" title="View">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] dark:hover:text-white transition-colors" title="Edit">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={(e) => handleArchive(store.id, e)} className="text-[var(--text-muted)] hover:text-amber-500 transition-colors" title="Archive">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        </button>
                        <button onClick={(e) => handleDeleteClick(store, e)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors" title="Delete">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
             <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">Delete Store</h3>
             <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed">
               Are you sure you want to delete <strong className="text-[var(--text-main)]">{storeToDelete?.name}</strong>? This action cannot be undone and will completely remove the store from the inventory matrix.
             </p>
             <div className="flex justify-end gap-4">
               <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2.5 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                 Cancel
               </button>
               <button onClick={handleConfirmDelete} className="px-6 py-2.5 rounded-full text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                 Confirm Delete
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Standardized View Logs Drawer Overlay */}
      <div 
        ref={logsDrawerRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_50px_rgba(0,0,0,0.7)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLogsOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}
      >
          
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)]">
             <h3 className="text-[var(--text-main)] font-semibold">View Logs</h3>
             <button onClick={() => setIsLogsOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          {/* Subheader Block */}
          <div className="flex items-center gap-4 p-6 border-b border-[var(--border-color)]">
             <div className="w-12 h-12 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
             </div>
             <div>
                <h4 className="text-[var(--text-main)] font-bold text-sm">Inventory Module</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1">Last modified on {logs[0]?.date || ''} at {logs[0]?.time || ''} by {logs[0]?.user || ''}</p>
             </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4">
             <div className="flex items-center gap-2 bg-black/5 dark:bg-[#121212] rounded-md px-4 py-2.5 border border-transparent focus-within:border-[var(--border-color)] transition-colors shadow-inner">
                <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" 
                />
             </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[100px_1fr_100px] px-6 py-2 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] border-y border-[var(--border-color)] bg-black/5 dark:bg-[#121212]">
             <div>User</div>
             <div>Activity</div>
             <div className="text-right">Date & Time</div>
          </div>

          {/* Table Rows */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {logs.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)] text-sm">No logs found.</div>
             ) : (
                logs.map(log => (
                  <div key={log.id} className="grid grid-cols-[100px_1fr_100px] px-6 py-2.5 text-[11.5px] text-[var(--text-main)] border-b border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 items-center gap-4 transition-colors">
                     <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] ${log.avatarColor} shrink-0`}>
                           {log.initials}
                        </div>
                        <span className="truncate flex-1 font-medium">{log.user}</span>
                     </div>
                     <div className="leading-tight">{log.activity}</div>
                     <div className="text-[10px] text-[var(--text-muted)] text-right whitespace-nowrap font-mono">
                        {log.date}<br/>at {log.time}
                     </div>
                  </div>
               ))
             )}
          </div>

          {/* Pagination Footer */}
          <div className="flex justify-end items-center p-4 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] gap-6 bg-black/5 dark:bg-[#121212]">
             <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select className="bg-transparent outline-none cursor-pointer text-[var(--text-main)] focus:ring-0 border-none font-medium">
                   <option>10</option>
                   <option>25</option>
                   <option>50</option>
                </select>
             </div>
             <span>1-1 of 1</span>
             <div className="flex items-center gap-3">
                <button className="hover:text-[var(--text-main)] disabled:opacity-50 transition-colors" disabled>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button className="hover:text-[var(--text-main)] disabled:opacity-50 transition-colors" disabled>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
             </div>
          </div>

      </div>

    </div>
  );
}
