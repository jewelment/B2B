'use client';
import React, { useState, useRef, useEffect } from 'react';

interface CustomDropdownProps {
  label?: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const CustomDropdown = ({ label, options, value, onChange, disabled = false }: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-none 
          ${disabled ? 'opacity-50 cursor-not-allowed bg-black/5 dark:bg-[#121212] border-[var(--border-color)]' : 'cursor-pointer bg-black/5 dark:bg-[#121212] hover:border-[var(--brand-primary)]'}
          ${isOpen ? 'border-[var(--brand-primary)] shadow-[0_0_15px_var(--brand-primary)]/10' : 'border-[var(--border-color)]'}
          text-[var(--text-main)]`}
      >
        <span className="whitespace-nowrap truncate">{label ? `${label}: ` : ''}{value}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-[#1A1A1A] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <ul className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => {
              const isSelected = value === option;
              return (
                <li 
                  key={option}
                  onClick={() => { onChange(option); setIsOpen(false); }}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors relative flex items-center
                    ${isSelected 
                      ? 'text-[var(--brand-primary)] font-bold bg-[var(--brand-primary)]/5' 
                      : 'text-[var(--text-main)] hover:bg-black/20 hover:text-[var(--brand-primary)]'}
                  `}
                >
                  {/* The Golden Left Border Highlight */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${isSelected ? 'bg-[var(--brand-primary)]' : 'bg-transparent hover:bg-[var(--brand-primary)]/50'}`} />
                  {option}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
