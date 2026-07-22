'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// CRM Rule #12: Custom Dropdown Component
const CustomDropdown = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) => {
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
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all ${isOpen ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 text-[var(--brand-primary)]' : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-main)] hover:border-[var(--text-muted)] shadow-sm'}`}
      >
        <span className="opacity-70 text-xs uppercase tracking-wider">{label}:</span>
        <span>{value}</span>
        <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      
      {isOpen && (
        <div className="absolute top-full mt-2 w-full min-w-[220px] z-50 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          <ul className="py-2 max-h-64 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <li 
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === option ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold' : 'text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function MasterEventsLogsPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const users = ['All Users', 'Admin User 1', 'Admin User 2', 'System Daemon', 'Sales Rep 1'];
  const categories = ['All Categories', 'Products', 'Orders', 'Inventory', 'Parameters', 'Price Master'];
  
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Global Audit Database (Mock)
  const [logs] = useState([
    { id: 'EVT-1001', date: '20-07-2026', time: '14:32:05', user: 'Admin User 1', initials: 'A1', color: 'bg-purple-500/20 text-purple-500 border-purple-500/50', category: 'Parameters', action: 'Category (Mangalsutra Bracelets) updated operation occurs!', changes: 'Changed parent ID from 4 to 12. Updated SEO title.', ip: '192.168.1.45', location: 'Mumbai, IN' },
    { id: 'EVT-1002', date: '20-07-2026', time: '13:15:22', user: 'Admin User 2', initials: 'A2', color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50', category: 'Price Master', action: 'Global Gold Rate updated.', changes: 'Updated 22K Gold Rate from ₹6800 to ₹7150 per gram.', ip: '10.0.0.12', location: 'Surat, IN' },
    { id: 'EVT-1003', date: '20-07-2026', time: '10:31:00', user: 'System Daemon', initials: 'SD', color: 'bg-slate-500/20 text-slate-500 border-slate-500/50', category: 'Products', action: 'Bulk Export Triggered.', changes: '5000 products exported successfully to CSV.', ip: '127.0.0.1', location: 'AWS ap-south-1' },
    { id: 'EVT-1004', date: '19-07-2026', time: '18:45:10', user: 'Sales Rep 1', initials: 'S1', color: 'bg-blue-500/20 text-blue-500 border-blue-500/50', category: 'Inventory', action: 'Stock Transferred.', changes: 'Moved 50 units of KFLBR50302AC from HQ to C184.', ip: '114.143.20.10', location: 'Delhi, IN' },
    { id: 'EVT-1005', date: '19-07-2026', time: '09:12:33', user: 'Admin User 1', initials: 'A1', color: 'bg-purple-500/20 text-purple-500 border-purple-500/50', category: 'Orders', action: 'Order Status Changed.', changes: 'Order #ORD-9932 changed from Pending to Shipped.', ip: '192.168.1.45', location: 'Mumbai, IN' },
    { id: 'EVT-1006', date: '18-07-2026', time: '16:05:00', user: 'System Daemon', initials: 'SD', color: 'bg-slate-500/20 text-slate-500 border-slate-500/50', category: 'Products', action: 'Nightly Sync.', changes: 'Synced 12,045 SKUs with master ERP database.', ip: '127.0.0.1', location: 'AWS ap-south-1' },
  ]);

  // Filtering Engine
  const filteredLogs = logs.filter(log => {
    const matchUser = selectedUser === 'All Users' || log.user === selectedUser;
    const matchCat = selectedCategory === 'All Categories' || log.category === selectedCategory;
    const matchSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        log.changes.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        log.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUser && matchCat && matchSearch;
  });

  return (
    <div className="p-8 max-w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
      
      {/* Header Panel */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Global Events & Logs Engine</h1>
          <p className="text-[var(--text-muted)] text-sm mt-2">Comprehensive audit trail of all systemic changes, data exports, and user activity.</p>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <button className="px-6 py-2.5 rounded-full text-sm font-bold border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Clear Logs
            </button>
          )}
          <button className="px-6 py-2.5 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            {selectedCategory === 'All Categories' ? 'Export Global Logs' : `Export ${selectedCategory} Logs`}
          </button>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden flex flex-col">
        
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-[var(--border-color)] flex flex-wrap justify-between items-center gap-6 bg-black/5 dark:bg-white/5">
          <div className="flex items-center gap-4 z-20">
            <CustomDropdown label="User Profile" options={users} value={selectedUser} onChange={setSelectedUser} />
            <CustomDropdown label="Module" options={categories} value={selectedCategory} onChange={setSelectedCategory} />
          </div>
          
          <div className="flex items-center gap-3 bg-white dark:bg-[#121212] rounded-full px-5 py-2.5 border border-[var(--border-color)] focus-within:border-[var(--brand-primary)] transition-all shadow-inner w-full md:w-96">
            <svg className="w-4 h-4 text-[var(--text-muted)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              placeholder="Search actions, ID, or changes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" 
            />
          </div>
        </div>

        {/* Global Audit Matrix */}
        <div className="overflow-x-auto custom-scrollbar w-full min-h-[500px]">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead className="sticky top-0 z-10 bg-[var(--bg-surface)] shadow-sm">
              <tr className="bg-black/10 dark:bg-[#121212] border-b border-[var(--border-color)] text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-5 px-6 w-40">TIMESTAMP</th>
                <th className="py-5 px-6 w-56">USER / MEMBER</th>
                <th className="py-5 px-6 w-48">NETWORK / LOCATION</th>
                <th className="py-5 px-6 w-32">MODULE</th>
                <th className="py-5 px-6">EVENT DETAILS & REQUIRED CHANGES</th>
                <th className="py-5 px-6 w-24 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg className="w-12 h-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <p>No audit logs found for the selected filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-5 px-6 whitespace-nowrap">
                      <p className="text-[13px] font-mono text-[var(--text-main)] font-bold">{log.date}</p>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">{log.time}</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${log.color} shrink-0 shadow-sm`}>
                          {log.initials}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-[var(--text-main)]">{log.user}</p>
                          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">{log.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[12px] font-mono text-[var(--text-main)]">
                          <svg className="w-3 h-3 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                          {log.ip}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {log.location}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-[13px] font-semibold text-[var(--text-main)]">
                      {log.category}
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-[13px] font-bold text-[var(--brand-primary)] mb-1">{log.action}</p>
                      <p className="text-[12px] text-[var(--text-muted)] leading-relaxed max-w-2xl">{log.changes}</p>
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                        Success
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination UI */}
        <div className="p-5 border-t border-[var(--border-color)] flex items-center justify-between bg-black/5 dark:bg-[#121212]">
          <span className="text-xs font-medium text-[var(--text-muted)]">Showing 1 to {filteredLogs.length} of {logs.length} Events</span>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-medium transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-1.5 rounded-full bg-[var(--brand-primary)] text-[#121212] text-sm font-bold shadow-md">1</button>
            <button className="px-4 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-medium transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
