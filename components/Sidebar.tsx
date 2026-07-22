'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useCartStore } from '@/store/useCartStore';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed, isDarkMode, setIsDarkMode }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const { data: session } = useSession();
  const user = session?.user as any;

  useEffect(() => {
    setMounted(true);
  }, []);

  // UPDATED: Replaced manual hard-redirect with graceful Next-Auth termination
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoggingOut(true);
    
    try {
      await signOut({ 
        redirect: true, 
        callbackUrl: '/login' 
      });
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { name: 'Wholesale Catalog', path: '/dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
    { name: 'Order History', path: '/dashboard/history', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { name: 'My Schemes', path: '/dashboard/schemes', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { name: 'Account Settings', path: '/dashboard/settings', icon: ( <> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37-2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> </> ) }
  ];

  if (user?.role === 'ADMIN' || user?.role === 'SALES') {
    navLinks.push({
      name: user.role === 'ADMIN' ? 'Admin Portal' : 'Sales Portal',
      path: '/admin',
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
    });
  }

  return (
    <aside className={`bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col h-screen transition-all duration-300 ease-in-out relative z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* GEMINI-STYLE COLLAPSE BUTTON */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-full flex items-center justify-center shadow-sm hover:bg-[var(--text-muted)]/10 transition-all z-50 text-[var(--text-muted)]"
      >
        <svg className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* DYNAMIC LOGO AREA */}
      <div className="h-20 flex items-center justify-center px-4 border-b border-[var(--border-color)] relative overflow-hidden">
        {isCollapsed ? (
          <div className="animate-in zoom-in duration-300">
            <img 
              src={isDarkMode ? "/brand/favicon-gold.png" : "/brand/favicon-maroon.png"} 
              alt="Ashok Jewels" 
              width={32} 
              height={32} 
              className="object-contain pointer-events-auto cursor-pointer" 
            />
          </div>
        ) : (
          <div className="animate-in fade-in duration-300 w-full flex justify-center">
            <img 
              src={isDarkMode ? "/brand/logo-gold.png" : "/logo.png"} 
              alt="Ashok Jewels" 
              width={160} 
              height={40} 
              className="object-contain pointer-events-auto cursor-pointer" 
            />
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 py-6 flex flex-col gap-2 overflow-y-auto px-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link 
              key={link.name} href={link.path} title={isCollapsed ? link.name : ''} 
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-sm' : 'text-[var(--text-muted)] hover:bg-[var(--text-muted)]/10 hover:text-[var(--text-main)]'
              }`}
            >
              <svg className={`w-5 h-5 shrink-0 ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {link.icon}
              </svg>
              {!isCollapsed && <span className="text-xs font-bold tracking-wide animate-in fade-in duration-300 whitespace-nowrap">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* BOTTOM ACTIONS */}
      <div className={`p-4 border-t border-[var(--border-color)] flex flex-col gap-4 ${isCollapsed ? 'items-center' : ''}`}>
        
        <Link href="/dashboard/cart" title={isCollapsed ? "Current PO" : ""} className={`flex items-center bg-[var(--brand-primary)] text-[var(--brand-text)] rounded-xl shadow-md hover:opacity-90 transition-all ${isCollapsed ? 'p-3 justify-center' : 'px-4 py-3 justify-between w-full'}`}>
          {isCollapsed ? (
            <div className="relative">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {mounted && totalItems > 0 && <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </div>
          ) : (
            <>
              <span className="text-sm font-semibold tracking-wide">Current PO</span>
              {mounted && totalItems > 0 && <span className="bg-black/20 dark:bg-black/40 text-[var(--brand-text)] text-xs font-bold px-2 py-0.5 rounded-md">{totalItems} Units</span>}
            </>
          )}
        </Link>

        {/* Theme Switcher */}
        <button onClick={() => setIsDarkMode(!isDarkMode)} title={isCollapsed ? (isDarkMode ? "Light Mode" : "Dark Mode") : ""} className={`flex items-center text-[var(--text-muted)] bg-[var(--text-muted)]/5 hover:bg-[var(--text-muted)]/10 rounded-xl transition-colors ${isCollapsed ? 'p-3 justify-center' : 'px-4 py-3 justify-between w-full'}`}>
          {!isCollapsed && <span className="text-xs font-bold tracking-wide">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isDarkMode ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />}
          </svg>
        </button>

        <div className={`pt-4 border-t border-[var(--border-color)] flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center shrink-0 border border-[var(--brand-primary)]/20">
                <span className="text-sm font-bold text-[var(--brand-primary)]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'V'}
                </span>
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-[var(--text-main)] truncate">{user?.name || 'Partner Admin'}</span>
                <span className="text-[10px] text-[var(--text-muted)] truncate">
                  {user?.role === 'ADMIN' ? 'HQ Access' : user?.role === 'SALES' ? 'Sales Rep' : 'B2B Client'}
                </span>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout} disabled={isLoggingOut} title={isCollapsed ? "Secure Logout" : ""}
            className={`text-[var(--text-muted)] hover:text-red-600 transition-colors ${isCollapsed ? 'p-2' : 'p-2 bg-[var(--text-muted)]/5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20'}`}
          >
            {isLoggingOut ? (
               <svg className="animate-spin w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </aside>
  );
}