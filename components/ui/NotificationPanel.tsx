'use client';

import React, { useState, useEffect, useRef } from 'react';

export type NotificationEvent = {
  id: string;
  timestamp: string;
  message: string;
  details: string;
  downloadLink?: string;
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationEvent[];
  onClear: () => void;
  onDismiss: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications, onClear, onDismiss }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={panelRef}
      className="absolute top-16 right-4 z-50 w-96 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <h3 className="text-[var(--text-main)] font-semibold text-sm">Notification</h3>
          <button onClick={onClear} className="text-[var(--brand-primary)] text-xs font-semibold hover:underline">Clear</button>
        </div>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar p-3 space-y-2 bg-black/5 dark:bg-[#121212]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] text-sm">No new notifications.</div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="relative bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm group hover:border-[var(--brand-primary)]/50 transition-colors">
              <button 
                onClick={() => onDismiss(notif.id)}
                className="absolute top-3 right-3 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </button>
              
              <div className="text-[10px] font-mono text-[var(--text-muted)] mb-2">
                {notif.timestamp}
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm text-[var(--text-main)] font-semibold leading-tight">
                    {notif.message} 
                    {notif.downloadLink && (
                      <a href={notif.downloadLink} className="text-blue-500 hover:underline ml-1 font-medium">Download Link</a>
                    )}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{notif.details}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Pagination (Mocked as in Image 1) */}
      <div className="p-3 border-t border-[var(--border-color)] flex justify-center items-center gap-2 bg-[var(--bg-surface)]">
        <button className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <button className="w-6 h-6 rounded bg-[var(--brand-primary)] text-[#121212] text-xs font-bold">1</button>
        <button className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium">2</button>
        <button className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium">3</button>
        <span className="text-[var(--text-muted)] text-xs">...</span>
        <button className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 text-xs font-medium">26</button>
        <button className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
      </div>
    </div>
  );
};
