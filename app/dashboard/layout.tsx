'use client';

import React, { useState, useEffect } from 'react';
import GlobalHeader from '@/components/GlobalHeader';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark Mode DOM Injection
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    // THE FIX: "flex-row h-screen" forces the Sidebar to the left and Content to the right
    <div className="flex h-screen bg-[var(--bg-base)] transition-colors duration-300 overflow-hidden font-sans">
      
      {/* 1. Full Height Sidebar on the Left */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* 2. Main Content Area on the Right (Stacking Header & Page Content) */}
      <div className="flex flex-col flex-1 overflow-hidden relative bg-[var(--bg-base)]">
        
        <GlobalHeader />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto pb-20">
            {children}
          </div>
        </main>

      </div>
      
    </div>
  );
}