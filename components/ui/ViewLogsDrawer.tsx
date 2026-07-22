'use client';

import React, { useState, useEffect, useRef } from 'react';

export type LogEntry = {
  id: string;
  user: string;
  initials: string;
  avatarColor: string;
  activity: string;
  date: string;
  time: string;
};

interface ViewLogsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  logs: LogEntry[];
}

export const ViewLogsDrawer: React.FC<ViewLogsDrawerProps> = ({ isOpen, onClose, moduleName, logs }) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [logSearch, setLogSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate "Loading Gathering amazing data as the spaceships loads" from Image 2
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const filteredLogs = logs.filter(l => 
    l.activity.toLowerCase().includes(logSearch.toLowerCase()) || 
    l.user.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <>
      {/* Drawer Overlay (No backdrop per Rule #11) */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_50px_rgba(0,0,0,0.7)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}
      >
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)]">
             <h3 className="text-[var(--text-main)] font-semibold">View Logs</h3>
             <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          {/* Subheader Block */}
          <div className="flex items-center gap-4 p-6 border-b border-[var(--border-color)]">
             <div className="w-12 h-12 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
             </div>
             <div>
                <h4 className="text-[var(--text-main)] font-bold text-sm">{moduleName}</h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 truncate max-w-[300px]">
                  {logs.length > 0 ? `Last modified on ${logs[0].date} at ${logs[0].time} by ${logs[0].user}` : 'No recent modifications.'}
                </p>
             </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4">
             <div className="flex items-center gap-2 bg-black/5 dark:bg-[#121212] rounded-md px-4 py-2.5 border border-transparent focus-within:border-[var(--brand-primary)] transition-all shadow-inner">
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

          {/* Table Rows & Loading State */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
             {isLoading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[var(--bg-surface)]/80 backdrop-blur-sm z-10 animate-in fade-in">
                 <div className="w-10 h-10 border-4 border-[var(--brand-primary)]/30 border-t-[var(--brand-primary)] rounded-full animate-spin mb-4"></div>
                 <h4 className="text-[var(--text-main)] font-bold text-sm mb-1">Loading</h4>
                 <p className="text-xs text-[var(--text-muted)]">Gathering amazing data as the spaceships loads.</p>
               </div>
             ) : null}

             {filteredLogs.length === 0 && !isLoading ? (
                <div className="p-8 text-center text-[var(--text-muted)] text-sm">No logs found.</div>
             ) : (
                filteredLogs.map(log => (
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
                <span>1-10 of {filteredLogs.length}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:text-[var(--text-main)] disabled:opacity-30"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                  <button className="p-1 hover:text-[var(--text-main)] disabled:opacity-30"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </div>
             </div>
          </div>
      </div>
    </>
  );
};
