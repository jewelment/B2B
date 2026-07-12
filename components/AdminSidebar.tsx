'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import BrandLogo from './BrandLogo';

export default function AdminSidebar({ isDarkMode = false, setIsDarkMode = () => {} }: { isDarkMode?: boolean, setIsDarkMode?: (val: boolean) => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;

  const navGroups = [
    {
      title: "Inventory & Assets",
      links: [
        { 
          name: "Master Inventory", 
          path: "/admin/inventory", 
          icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
          subLinks: [
            { name: "Product Grid", path: "/admin/inventory/grid" },
            { name: "Metafields", path: "/admin/inventory/fields" },
            { name: "Data Import", path: "/admin/inventory/import" }
          ]
        },
        { name: "Master Catalog", path: "/admin/catalog", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
        { name: "Asset Library", path: "/admin/assets", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }
      ]
    },
    {
      title: "Pricing & Promotions",
      links: [
        { name: "Master Pricing", path: "/admin/pricing", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        { name: "Discount Engine", path: "/admin/discounts", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }
      ]
    },
    {
      title: "B2B CRM & Orders",
      links: [
        { name: "Partner Network", path: "/admin/clients", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
        { name: "PO Inbox", path: "/admin/orders", icon: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" }
      ]
    },
    {
      title: "Dev & Tracking",
      roles: ['ADMIN'],
      links: [
        { name: "System Routes", path: "/admin/system-routes", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
        { name: "Roadmap / Progress", path: "/admin/roadmap", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { name: "B2B Client Portal", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }
      ]
    }
  ];

  return (
    <div className="w-64 min-h-screen bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col fixed left-0 top-0 overflow-y-auto z-[100] transition-colors duration-300">
      <div className="p-8 pb-4">
        <Link href="/admin">
          <BrandLogo theme={isDarkMode ? "DARK" : "LIGHT"} width={180} height={60} className="mb-1 cursor-pointer hover:opacity-80 transition-opacity" />
        </Link>
      </div>

      <div className="flex-1 px-4 py-6 space-y-8">
        {navGroups.filter(group => !group.roles || group.roles.includes(user?.role)).map((group, idx) => (
          <div key={idx}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 px-4">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.links.map((link: any, lIdx) => {
                const isActive = pathname?.startsWith(link.path);
                
                // If it's a parent link with no sublinks OR it's a sublink parent that is active, we use the active background
                const isBgActive = isActive && !link.subLinks;

                return (
                  <div key={lIdx} className="flex flex-col">
                    <Link href={link.subLinks ? link.subLinks[0].path : link.path} className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isBgActive ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] shadow-sm border border-[var(--brand-primary)]/10' : 'text-[var(--text-muted)] hover:bg-[var(--text-muted)]/10 hover:text-[var(--brand-primary)] hover:translate-x-1 border border-transparent'} ${isActive && link.subLinks ? 'text-[var(--brand-primary)] font-bold' : ''}`}>
                      <svg className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--brand-primary)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                      </svg>
                      {link.name}
                    </Link>
                    {link.subLinks && isActive && (
                      <div className="pl-11 pr-4 py-2 space-y-1">
                        {link.subLinks.map((sub: any, sIdx: number) => {
                          const isSubActive = pathname === sub.path;
                          return (
                            <Link key={sIdx} href={sub.path} className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isSubActive ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--bg-base)]'}`}>
                              {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-[var(--border-color)] space-y-4">
        {/* Theme Switcher */}
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center text-[var(--text-muted)] bg-[var(--text-muted)]/5 hover:bg-[var(--text-muted)]/10 rounded-xl transition-colors px-4 py-3 justify-between w-full">
          <span className="text-xs font-bold tracking-wide">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isDarkMode ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />}
          </svg>
        </button>

        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-color)] transition-colors">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#4e080f] text-white flex items-center justify-center font-serif text-sm mr-3">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="truncate pr-2">
              <p className="text-xs font-bold text-[var(--text-main)] truncate max-w-[100px]">{user?.name || 'Partner Admin'}</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.role === 'ADMIN' ? 'Super Admin' : user?.role === 'SALES' ? 'Sales Rep' : 'Admin Portal'}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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