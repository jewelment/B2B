'use client';

import React, { useState } from 'react';
import { ViewLogsDrawer, LogEntry } from '@/components/ui/ViewLogsDrawer';
import { CustomDropdown } from '@/components/ui/CustomDropdown';

export default function UserGroupsPolicyEngine() {
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [viewState, setViewState] = useState<'list' | 'editor'>('list');
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);
  
  // Policy State
  const [policyName, setPolicyName] = useState('');
  const [isSmartPolicy, setIsSmartPolicy] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [gender, setGender] = useState('All');
  const [ageRange, setAgeRange] = useState('All');
  const [maritalStatus, setMaritalStatus] = useState('All');
  const [orderHistory, setOrderHistory] = useState('Any');
  const [customLocation, setCustomLocation] = useState('');
  
  const handleAddLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customLocation.trim() !== '') {
      e.preventDefault();
      if (!selectedLocations.includes(customLocation.trim())) {
        setSelectedLocations([...selectedLocations, customLocation.trim()]);
      }
      setCustomLocation('');
    }
  };

  const removeLocation = (loc: string) => {
    setSelectedLocations(selectedLocations.filter(l => l !== loc));
  };

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', user: 'Vijay Yadav', initials: 'VY', avatarColor: 'bg-purple-500/20 text-purple-500', activity: 'Created "South India High Value" B2B policy.', date: '22-07-2026', time: '11:00 am' }
  ]);

  const handleEditPolicy = (name: string) => {
    setEditingPolicy(name);
    setPolicyName(name);
    setViewState('editor');
  };

  const handleCreateNew = () => {
    setEditingPolicy(null);
    setPolicyName('');
    setIsSmartPolicy(true);
    setSelectedLocations([]);
    setGender('All');
    setAgeRange('All');
    setMaritalStatus('All');
    setOrderHistory('Any');
    setViewState('editor');
  };

  const handleSavePolicy = () => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      user: 'Partner Admin',
      initials: 'PA',
      avatarColor: 'bg-emerald-500/20 text-emerald-500',
      activity: editingPolicy ? `Updated rules for policy "${policyName}".` : `Created new policy "${policyName || 'Untitled Policy'}".`,
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    };
    setLogs([newLog, ...logs]);
    setViewState('list');
  };

  if (viewState === 'list') {
    return (
      <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">Active Policies & User Groups</h1>
            <p className="text-[var(--text-muted)] mt-2 text-sm">Manage and organize your smart and manual customer segments.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsLogsOpen(true)} className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide">
              View Logs
            </button>
            <button onClick={handleCreateNew} className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
              <span className="relative z-10">+ Create Policy</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div onClick={() => handleEditPolicy('VIP Wholesalers')} className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm hover:border-[var(--brand-primary)] hover:shadow-lg transition-all cursor-pointer group flex flex-col min-h-[220px] relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">VIP Wholesalers</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>Smart Policy</span>
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--text-main)] font-bold text-sm">
                  142
               </div>
             </div>
             
             <div className="mt-auto pt-6 border-t border-[var(--border-color)]">
               <p className="text-xs text-[var(--text-muted)] mb-1">Order History: <span className="font-semibold text-[var(--text-main)]">Wholesale VIP</span></p>
               <p className="text-xs text-[var(--text-muted)]">Location: <span className="font-semibold text-[var(--text-main)]">All</span></p>
             </div>
             <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--brand-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </div>

          <div onClick={() => handleEditPolicy('Bridal Segment (South)')} className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm hover:border-[var(--brand-primary)] hover:shadow-lg transition-all cursor-pointer group flex flex-col min-h-[220px] relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="text-lg font-bold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">Bridal Segment (South)</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[var(--text-main)] text-[10px] font-bold">Manual Assignment</span>
                  </div>
               </div>
               <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-[var(--text-main)] font-bold text-sm">
                  38
               </div>
             </div>
             
             <div className="mt-auto pt-6 border-t border-[var(--border-color)]">
               <p className="text-xs text-[var(--text-muted)] mb-1">Marital Status: <span className="font-semibold text-[var(--text-main)]">Married</span></p>
               <p className="text-xs text-[var(--text-muted)]">Location: <span className="font-semibold text-[var(--text-main)]">South India</span></p>
             </div>
             <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--brand-primary)] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </div>
        </div>

        <ViewLogsDrawer isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} moduleName="User Groups (Policies)" logs={logs} />
      </div>
    );
  }

  // --- Editor View ---
  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-right-8 duration-500 min-h-screen">
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewState('list')} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--brand-primary)]/10 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">{editingPolicy ? `Edit Policy: ${editingPolicy}` : 'Create New Policy'}</h1>
            <p className="text-[var(--text-muted)] mt-1 text-sm">Configure targeting rules and segmentation assignments.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSavePolicy} className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
            <span className="relative z-10">Save Policy Rule</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm">
          <h3 className="text-[var(--text-main)] font-semibold mb-4">Policy Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Policy Name</label>
              <input type="text" value={policyName} onChange={(e) => setPolicyName(e.target.value)} placeholder="e.g. VIP B2B Clients - South India" className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors"/>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Assignment Type</label>
              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => setIsSmartPolicy(true)} className={`cursor-pointer p-4 rounded-xl border transition-all ${isSmartPolicy ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10' : 'border-[var(--border-color)] bg-black/5 dark:bg-black/20 hover:border-[var(--text-main)]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSmartPolicy ? 'border-[var(--brand-primary)]' : 'border-[var(--text-muted)]'}`}>
                      {isSmartPolicy && <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />}
                    </div>
                    <span className={`font-bold text-sm ${isSmartPolicy ? 'text-[var(--brand-primary)]' : 'text-[var(--text-main)]'}`}>Smart Policy</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] ml-6">Customers matching demographic rules are automatically added.</p>
                </div>
                <div onClick={() => setIsSmartPolicy(false)} className={`cursor-pointer p-4 rounded-xl border transition-all ${!isSmartPolicy ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/10' : 'border-[var(--border-color)] bg-black/5 dark:bg-black/20 hover:border-[var(--text-main)]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!isSmartPolicy ? 'border-[var(--brand-primary)]' : 'border-[var(--text-muted)]'}`}>
                      {!isSmartPolicy && <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />}
                    </div>
                    <span className={`font-bold text-sm ${!isSmartPolicy ? 'text-[var(--brand-primary)]' : 'text-[var(--text-main)]'}`}>Manual Assignment</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] ml-6">Add customers to this group one by one manually.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 mt-6">Geographical Locations</label>
              <input type="text" value={customLocation} onChange={(e) => setCustomLocation(e.target.value)} onKeyDown={handleAddLocation} placeholder="Type location and press Enter (e.g. Mumbai, North India)" className="w-full bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors mb-3"/>
              <div className="flex flex-wrap gap-3">
                {selectedLocations.map(loc => (
                  <div key={loc} className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--brand-primary)] shadow-sm">
                    <span>{loc}</span>
                    <button onClick={() => removeLocation(loc)} className="text-[var(--brand-primary)]/70 hover:text-[var(--brand-primary)]"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                  </div>
                ))}
                {selectedLocations.length === 0 && <span className="text-xs text-[var(--text-muted)] italic">No locations specified.</span>}
              </div>
            </div>
          </div>
        </div>

        <div className={`bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm transition-opacity duration-300 ${!isSmartPolicy ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-[var(--text-main)] font-semibold">Demographic Parameters</h3>
            {!isSmartPolicy && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500">Disabled in Manual Mode</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Gender</label>
                <CustomDropdown options={['All', 'Male', 'Female']} value={gender} onChange={setGender} disabled={!isSmartPolicy} />
             </div>
             <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Age Range</label>
                <CustomDropdown options={['All', '18 - 25', '26 - 35', '36 - 50', '50+']} value={ageRange} onChange={setAgeRange} disabled={!isSmartPolicy} />
             </div>
             <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Marital Status</label>
                <CustomDropdown options={['All', 'Single', 'Married']} value={maritalStatus} onChange={setMaritalStatus} disabled={!isSmartPolicy} />
             </div>
             <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Order History</label>
                <CustomDropdown options={['Any', 'First Time Buyer', 'Returning Customer', 'Wholesale VIP (> 50 Orders)']} value={orderHistory} onChange={setOrderHistory} disabled={!isSmartPolicy} />
             </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <h3 className="text-[var(--text-main)] font-semibold">Customers in this Policy</h3>
               {isSmartPolicy && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>Auto-Updating</span>}
             </div>
             {!isSmartPolicy && (
               <button className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">Import / Add Customer</button>
             )}
          </div>
          <div className="space-y-2">
             <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-color)] bg-black/5 dark:bg-black/20">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] flex items-center justify-center text-xs font-bold">AK</div>
                   <div>
                      <p className="text-sm font-bold text-[var(--text-main)]">Ashok Kumar</p>
                      <p className="text-[10px] text-[var(--text-muted)]">South India • Wholesale VIP</p>
                   </div>
                </div>
                <button className="text-[var(--text-muted)] hover:text-red-500 text-xs font-medium">Remove</button>
             </div>
             <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-color)] bg-black/5 dark:bg-black/20">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">SR</div>
                   <div>
                      <p className="text-sm font-bold text-[var(--text-main)]">Suhana Reddy</p>
                      <p className="text-[10px] text-[var(--text-muted)]">South India • Wholesale VIP</p>
                   </div>
                </div>
                <button className="text-[var(--text-muted)] hover:text-red-500 text-xs font-medium">Remove</button>
             </div>
          </div>
        </div>
      </div>
      <ViewLogsDrawer isOpen={isLogsOpen} onClose={() => setIsLogsOpen(false)} moduleName="User Groups (Policies)" logs={logs} />
    </div>
  );
}
