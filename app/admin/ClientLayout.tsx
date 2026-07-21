'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  // Dynamic Title Updater
  useEffect(() => {
    if (!pathname) return;
    
    const segments = pathname.split('/').filter(Boolean);
    let pageTitle = 'Dashboard';
    
    // If we are deeper than just /admin
    if (segments.length > 1) {
      const lastSegment = segments[segments.length - 1];
      
      // Auto-format segment to title case
      if (lastSegment === 'grid') {
        pageTitle = 'Product Grid';
      } else {
        pageTitle = lastSegment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    document.title = `AJ B2B | ${pageTitle}`;
  }, [pathname]);

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
    <div className="flex min-h-screen bg-[var(--bg-base)] transition-colors duration-300 font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 relative bg-[var(--bg-base)] transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <main className="flex-1 p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
