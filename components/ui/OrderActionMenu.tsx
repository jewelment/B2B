'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export interface ActionMenuItem {
  label: string;
  onClick?: () => void;
  href?: string;
  isDestructive?: boolean;
}

interface OrderActionMenuProps {
  actions: ActionMenuItem[];
}

export function OrderActionMenu({ actions }: OrderActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleActionClick = (e: React.MouseEvent, action: ActionMenuItem) => {
    e.stopPropagation();
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-1.5 rounded-full hover:bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] transition-colors focus:outline-none"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-[-5px_10px_30px_rgba(0,0,0,0.15)] dark:shadow-[-5px_10px_30px_rgba(0,0,0,0.8)] z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden py-1">
          {actions.map((action, idx) => {
            const className = `block w-full text-left px-4 py-2.5 text-xs font-semibold ${
              action.isDestructive 
                ? 'text-red-500 hover:bg-red-500/10' 
                : 'text-[var(--text-main)] hover:bg-[var(--text-muted)]/10 hover:text-[var(--brand-primary)]'
            } transition-colors border-l-2 border-transparent hover:border-[var(--brand-primary)] ${action.isDestructive ? 'hover:border-red-500' : ''}`;
            
            if (action.href) {
              return (
                <Link key={idx} href={action.href} className={className} onClick={(e) => e.stopPropagation()}>
                  {action.label}
                </Link>
              );
            }
            return (
              <button key={idx} onClick={(e) => handleActionClick(e, action)} className={className}>
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
