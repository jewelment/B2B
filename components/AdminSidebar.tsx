'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import BrandLogo from './BrandLogo';

export default function AdminSidebar({ isCollapsed = false, setIsCollapsed = () => { }, isDarkMode = false, setIsDarkMode = () => { } }: { isCollapsed?: boolean, setIsCollapsed?: (val: boolean) => void, isDarkMode?: boolean, setIsDarkMode?: (val: boolean) => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);

  React.useEffect(() => {
    if (!pathname) return;
    setExpandedMenus(prev => {
      const activeGroups = navGroups.flatMap(g => g.links)
        .filter(l => l.subLinks && (pathname.startsWith(l.path) || l.subLinks.some(s => pathname.startsWith(s.path))))
        .map(l => l.name);
      
      const newExpanded = new Set([...prev, ...activeGroups]);
      return Array.from(newExpanded);
    });
  }, [pathname]);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch('/api/admin/schemes/withdrawals');
        const data = await res.json();
        if (data.success && data.withdrawals) {
          const count = data.withdrawals.filter((w: any) => w.status === 'WITHDRAWAL_REQUESTED').length;
          setPendingWithdrawals(count);
        }
      } catch (err) {}
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleMenu = (menuName: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedMenus(prev => prev.includes(menuName) ? prev.filter(n => n !== menuName) : [...prev, menuName]);
  };

  const navGroups = [
    {
      title: "Main",
      links: [
        { name: "Dashboard", path: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }
      ]
    },
    {
      title: "B2B CRM & Orders",
      links: [
        { 
          name: "Orders", 
          path: "/admin/orders/all", 
          icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
          subLinks: [
            { name: "All Orders", path: "/admin/orders/all" },
            { name: "All Transactions", path: "/admin/orders/transactions" },
            { name: "All POs", path: "/admin/orders/all-pos" },
            { name: "PO Inbox", path: "/admin/orders" }
          ]
        },
        { 
          name: "11+1 Scheme", 
          path: "/admin/schemes", 
          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          subLinks: [
            { name: "Schemes", path: "/admin/schemes" },
            { name: "Enrollments", path: "/admin/schemes/enrollments" },
            { name: "Withdrawals", path: "/admin/schemes/withdrawals", badge: pendingWithdrawals > 0 },
            { name: "Calculator (Customer View)", path: "/admin/schemes/calculator" }
          ]
        },
        { 
          name: "Customers", 
          path: "/admin/customers", 
          icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          subLinks: [
            { name: "All Customers", path: "/admin/customers" },
            { name: "User Groups", path: "/admin/customers/user-groups" },
            { name: "Enquiries", path: "/admin/customers/enquiries" }
          ]
        }
      ]
    },
    {
      title: "Inventory & Assets",
      links: [
        {
          name: "Products",
          path: "/admin/products",
          icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
          subLinks: [
            { name: "All Products", path: "/admin/products" },
            { name: "Product Grid (Old)", path: "/admin/inventory/grid" },
            { name: "Master Grid (New)", path: "/admin/inventory/master-grid" },
            { name: "Product MetaFields", path: "/admin/inventory/fields" },
            { name: "Import Products", path: "/admin/inventory/import" },
            { name: "Inventory", path: "/admin/inventory" },
            { name: "Reviews", path: "/admin/reviews" }
          ]
        },
        {
          name: "Product Parameters",
          path: "/admin/parameters",
          icon: "M4 6h16M4 12h16M4 18h7",
          subLinks: [
            { name: "Categories", path: "/admin/parameters/categories" },
            { name: "Collections", path: "/admin/parameters/collections" },
            { name: "Global Options", path: "/admin/parameters/options" },
            { name: "Option Sets", path: "/admin/parameters/options/sets" },
            { name: "Tags & Badges", path: "/admin/parameters/tags" },
            { name: "Vendors", path: "/admin/parameters/vendors" }
          ]
        },
        { name: "Catalog", path: "/admin/catalog", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
        { name: "Asset Library", path: "/admin/assets", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }
      ]
    },
    {
      title: "Pricing & Promotions",
      links: [
        {
          name: "Master Component Pricing",
          path: "/admin/pricing",
          icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          subLinks: [
            { name: "Base Pricing Engine (Old)", path: "/admin/pricing" },
            { name: "Live Rates & Matrices (New)", path: "/admin/pricing/live-rates" }
          ]
        },
        { name: "Discount Engine", path: "/admin/discounts", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }
      ]
    },
    {
      title: "Storefront & Builders",
      roles: ['ADMIN'],
      links: [
        { name: "Web Pages Manager", path: "/admin/pages", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
        { name: "Mobile App Screens", path: "/admin/app-screens", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
        { name: "Banner Merchandising", path: "/admin/banners", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }
      ]
    },
    {
      title: "Platform Settings",
      roles: ['ADMIN'],
      links: [
        { name: "Branding & Theme", path: "/admin/settings/theme", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" }
      ]
    },

    {
      title: "Dev & Tracking",
      roles: ['ADMIN'],
      links: [
        { name: "System Routes", path: "/admin/system-routes", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
        { name: "Global Events & Logs", path: "/admin/events-logs", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
        { name: "Roadmap / Progress", path: "/admin/roadmap", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { name: "B2B Client Portal", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }
      ]
    }
  ];

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} h-[100dvh] bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col fixed left-0 top-0 z-[100] transition-all duration-300`}>

      {/* GEMINI-STYLE COLLAPSE BUTTON */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-full flex items-center justify-center shadow-sm hover:bg-[var(--text-muted)]/10 transition-all z-[110] text-[var(--text-muted)]"
      >
        <svg className={`w-3 h-3 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className={`p-8 pb-4 flex justify-center ${isCollapsed ? 'px-4' : ''}`}>
        <Link href="/admin">
          {isCollapsed ? (
            <img src={isDarkMode ? "/brand/favicon-gold.png" : "/brand/favicon-maroon.png"} alt="Ashok Jewels" width={32} height={32} className="object-contain cursor-pointer" />
          ) : (
            <BrandLogo theme={isDarkMode ? "DARK" : "LIGHT"} width={180} height={60} className="mb-1 cursor-pointer hover:opacity-80 transition-opacity" />
          )}
        </Link>
      </div>

      <div className={`flex-1 py-6 space-y-8 ${isCollapsed ? 'px-2' : 'px-4'} overflow-y-auto overflow-x-hidden`}>
        {navGroups.filter(group => !group.roles || group.roles.includes(user?.role)).map((group, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 px-4">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.links.map((link: any, lIdx) => {
                const isActive = pathname?.startsWith(link.path) || (link.subLinks && link.subLinks.some((sub: any) => pathname?.startsWith(sub.path)));
                const isExpanded = expandedMenus.includes(link.name);

                // If it's a parent link with no sublinks OR it's a sublink parent that is active, we use the active background
                const isBgActive = isActive && !link.subLinks;

                return (
                  <div key={lIdx} className="flex flex-col">
                    {link.subLinks ? (
                      <button onClick={(e) => toggleMenu(link.name, e)} title={isCollapsed ? link.name : ''} className={`flex items-center justify-between rounded-xl text-sm font-medium transition-all duration-200 group w-full ${isCollapsed ? 'justify-center p-3 mb-2' : 'px-4 py-2.5'} ${isBgActive ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-sm border border-[var(--brand-primary)]/10' : 'text-[var(--text-muted)] hover:bg-[var(--text-muted)]/10 hover:text-[var(--brand-primary)] hover:translate-x-1 border border-transparent'} ${isActive ? 'text-[var(--brand-primary)] font-bold' : ''}`}>
                        <div className="flex items-center">
                          <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]'} ${!isCollapsed && 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                          </svg>
                          {!isCollapsed && link.name}
                        </div>
                        {!isCollapsed && (
                          <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    ) : (
                      <Link href={link.path} title={isCollapsed ? link.name : ''} className={`flex items-center rounded-xl text-sm font-medium transition-all duration-200 group ${isCollapsed ? 'justify-center p-3 mb-2' : 'px-4 py-2.5'} ${isBgActive ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-sm border border-[var(--brand-primary)]/10' : 'text-[var(--text-muted)] hover:bg-[var(--text-muted)]/10 hover:text-[var(--brand-primary)] hover:translate-x-1 border border-transparent'}`}>
                        <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]'} ${!isCollapsed && 'mr-3'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                        </svg>
                        {!isCollapsed && link.name}
                      </Link>
                    )}
                    
                    {link.subLinks && !isCollapsed && (
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out`} style={{ maxHeight: isExpanded ? `${link.subLinks.length * 40 + 20}px` : '0px', opacity: isExpanded ? 1 : 0 }}>
                        <div className="pl-11 pr-4 py-2 space-y-1">
                          {link.subLinks.map((sub: any, sIdx: number) => {
                            const isSubActive = pathname === sub.path;
                            return (
                              <Link key={sIdx} href={sub.path} className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isSubActive ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-base)]'}`}>
                                {sub.name}
                                {sub.badge && (
                                  <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 border-t border-[var(--border-color)] flex flex-col gap-4 ${isCollapsed ? 'items-center' : ''}`}>
        {/* Theme Switcher */}
        <button onClick={() => setIsDarkMode(!isDarkMode)} title={isCollapsed ? (isDarkMode ? "Light Mode" : "Dark Mode") : ""} className={`flex items-center text-[var(--text-muted)] bg-[var(--text-muted)]/5 hover:bg-[var(--text-muted)]/10 rounded-xl transition-colors ${isCollapsed ? 'p-3 justify-center' : 'px-4 py-3 justify-between w-full'}`}>
          {!isCollapsed && <span className="text-xs font-bold tracking-wide">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isDarkMode ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />}
          </svg>
        </button>

        <div className={`pt-4 border-t border-[var(--border-color)] flex items-center ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#4e080f] text-white flex items-center justify-center font-serif text-sm mr-3 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="truncate pr-2">
                <p className="text-xs font-bold text-[var(--text-main)] truncate max-w-[100px]">{user?.name || 'Partner Admin'}</p>
                <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.role === 'ADMIN' ? 'Super Admin' : user?.role === 'SALES' ? 'Sales Rep' : 'Admin Portal'}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className={`text-[var(--text-muted)] hover:text-red-600 transition-colors ${isCollapsed ? 'p-2' : 'p-2 bg-[var(--text-muted)]/5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg'}`}
            title="Secure Logout"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}