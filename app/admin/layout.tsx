'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync with document class (persisted from dashboard if user navigated via SPA, but we manage local state here)
  useEffect(() => {
    // On initial load, check if 'dark' is already there
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen bg-[var(--bg-base)] transition-colors duration-300 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <AdminSidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden relative bg-[var(--bg-base)] ml-64 p-8">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
