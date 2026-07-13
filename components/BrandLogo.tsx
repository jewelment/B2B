'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface BrandLogoProps {
  theme?: 'DARK' | 'LIGHT';     
  variant?: 'FULL' | 'ICON' | 'TEXT'; 
  className?: string;
  width?: number;
  height?: number;
  tenantId?: string;
  settings?: any;
}

export default function BrandLogo({ 
  theme = 'LIGHT', 
  variant = 'FULL',
  className = '',
  width = 150,
  height = 50,
  tenantId,
  settings
}: BrandLogoProps) {
  
  const [imgError, setImgError] = useState(false);
  const [activeLogo, setActiveLogo] = useState<string | null>(null);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [dynamicName, setDynamicName] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  // Context Menu State
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuPos(null);
      }
    };
    if (menuPos) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuPos]);

  useEffect(() => {
    setImgError(false);

    // Use passed settings immediately if available (for server-rendered pages)
    if (settings) {
      setActiveLogo(theme === 'DARK' ? settings.logoDark : settings.logoLight);
      setActiveIcon(theme === 'DARK' ? settings.faviconDark : settings.faviconLight);
      if (settings.brandName) setDynamicName(settings.brandName);
      return;
    }

    // Fetch dynamic branding (for client-rendered admin pages without settings prop)
    fetch('/api/admin/theme')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setActiveLogo(theme === 'DARK' ? data.settings.logoDark : data.settings.logoLight);
          setActiveIcon(theme === 'DARK' ? data.settings.faviconDark : data.settings.faviconLight);
          
          if (data.settings.brandName) {
            setDynamicName(data.settings.brandName);
          }
        }
      })
      .catch(console.error);
  }, [variant, theme, settings]);

  // Bulletproof fallback check
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalHeight === 0) {
      setImgError(true);
    }
  }, [activeLogo, activeIcon]);

  // The locked-in Sans-Serif Text Variant
  if (variant === 'TEXT' || imgError) {
    const textColor = theme === 'DARK' ? 'text-[#dfae61]' : 'text-[#4e080f]';
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className={`font-sans font-semibold text-3xl tracking-[0.25em] uppercase ${textColor}`}>
          {dynamicName || 'ASHOK JEWELS'}
        </span>
      </div>
    );
  }

  const defaultLogoPath = theme === 'DARK' ? '/brand/logo-gold.png' : '/brand/logo-maroon.png';
  const defaultIconPath = theme === 'DARK' ? '/brand/favicon-gold.png' : '/brand/favicon-maroon.png';

  const currentDisplayPath = variant === 'FULL' 
    ? (activeLogo || defaultLogoPath) 
    : (activeIcon || defaultIconPath);

  // Handlers
  const handleLeftClick = (e: React.MouseEvent) => {
    if (menuPos) return; // Prevent redirect if menu is open
    router.push('/dashboard');
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const copyImageToClipboard = async (urlToCopy: string, label: string) => {
    setMenuPos(null);
    try {
      const response = await fetch(urlToCopy);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      showToast(`${label} copied!`);
    } catch (err) {
      console.error('Failed to copy image', err);
      // Fallback to text copy
      await navigator.clipboard.writeText(window.location.origin + urlToCopy);
      showToast(`URL copied!`);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <>
      <div 
        className={`relative flex items-center justify-center cursor-pointer ${className}`}
        onClick={handleLeftClick}
        onContextMenu={handleRightClick}
      >
        <img 
          ref={imgRef}
          src={currentDisplayPath} 
          alt={dynamicName || "Ashok Jewels"} 
          width={width} 
          height={height} 
          className="object-contain hover:opacity-80 transition-opacity"
          onError={(e) => {
            e.currentTarget.style.display = 'none'; 
            setImgError(true);
          }} 
        />
      </div>

      {menuPos && (
        <div 
          ref={menuRef}
          className="fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 w-56 animate-in fade-in slide-in-from-top-1 text-sm font-medium text-gray-800"
          style={{ top: menuPos.y, left: menuPos.x }}
        >
          <button 
            onClick={() => copyImageToClipboard(activeIcon || defaultIconPath, "Icon")}
            className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-l-[#4e080f] group"
          >
            <svg className="w-4 h-4 mr-3 text-gray-500 group-hover:text-[#4e080f] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Copy icon
          </button>
          
          <button 
            onClick={() => copyImageToClipboard(activeLogo || defaultLogoPath, "Logo")}
            className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-l-[#4e080f] group border-b border-gray-100"
          >
            <svg className="w-4 h-4 mr-3 text-gray-500 group-hover:text-[#4e080f] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Copy logo
          </button>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const link = document.createElement('a');
              link.href = tenantId ? `/api/brand/assets?tenantId=${tenantId}` : "/api/brand/assets";
              link.download = "brand_assets.zip";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setMenuPos(null);
            }}
            className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-l-[#4e080f] group mt-1 rounded-b-2xl"
          >
            <svg className="w-4 h-4 mr-3 text-gray-500 group-hover:text-[#4e080f] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Get brand assets
          </button>
        </div>
      )}

      {/* Modern Inline Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-[var(--bg-surface)]/80 backdrop-blur-md text-[var(--text-primary)] px-5 py-4 rounded-xl shadow-2xl border border-[var(--border-color)] animate-in slide-in-from-bottom-5 fade-in flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <p className="font-medium text-sm">{toast}</p>
        </div>
      )}
    </>
  );
}