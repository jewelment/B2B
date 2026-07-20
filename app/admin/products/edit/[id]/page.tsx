'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import Quill to avoid SSR window errors
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

// --- SVGs ---
const IconChevronLeft = () => <svg className="w-5 h-5 text-current transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconInfo = ({ text }: { text: string }) => <span title={text}><svg className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors inline-block ml-1.5 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>;
const IconClose = (props: any) => <svg {...props} className={`w-5 h-5 text-current transition-colors cursor-pointer ${props.className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconUpload = () => <svg className="w-6 h-6 text-[var(--brand-primary)] mb-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const IconWand = () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;

// --- Custom Select Component ---
const CustomSelect = ({ label, options, value, onChange, className = '', required = false, iconInfo, rightAction, size = 'default' }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const paddingClass = size === 'sm' ? 'px-3 py-2.5 text-xs' : 'px-4 py-3 text-sm';

  return (
    <div className="relative" ref={dropdownRef}>
      {(label || rightAction) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <label className="flex items-center text-[10px] font-bold text-[var(--text-muted)] tracking-wider uppercase">
              {label} {required && <span className="text-red-500 ml-1">*</span>} {iconInfo && <IconInfo text={iconInfo} />}
            </label>
          )}
          {rightAction}
        </div>
      )}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-transparent border rounded-xl ${paddingClass} flex justify-between items-center cursor-pointer transition-all shadow-sm ${isOpen ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]' : 'border-[var(--border-color)] hover:border-[var(--brand-primary)]/40'} ${className}`}
      >
        <span className={value ? 'text-[var(--text-main)] font-semibold' : 'text-[var(--text-muted)]'}>{value || 'Select option'}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180 text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="absolute z-50 w-full mt-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-2xl py-2 overflow-hidden max-h-60 overflow-y-auto"
        >
          {options.map((opt: string) => (
            <div 
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === opt ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-bold border-l-2 border-[var(--brand-primary)]' : 'text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 border-l-2 border-transparent font-medium'}`}
            >
              {opt}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// --- Modern Mini Select for Image Cards ---
const MiniSelect = ({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        className={`bg-[var(--bg-base)] hover:bg-black/5 dark:hover:bg-white/5 text-[10px] font-bold text-[var(--text-main)] px-2.5 py-1.5 rounded-lg border cursor-pointer flex items-center justify-between gap-2 shadow-sm transition-colors ${isOpen ? 'border-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]' : 'border-[var(--border-color)]'}`}
      >
        <span>{value === 'Description Image' ? 'Misc / Description' : value}</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute z-50 mt-1 w-36 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden py-1">
            {options.map(opt => (
              <div 
                key={opt} 
                onClick={() => { onChange(opt); setIsOpen(false); }} 
                className={`px-3 py-2 text-[10px] font-bold cursor-pointer transition-colors ${value === opt ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                {opt === 'Description Image' ? 'Misc / Description' : opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Custom Modern Date & Time Picker ---
const CustomDateTimePicker = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const parseDate = (val: string) => {
    if (!val) return new Date();
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };
  
  const [currentDate, setCurrentDate] = useState(parseDate(value));
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth());
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    if (value) setCurrentDate(parseDate(value));
  }, [value]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  
  const handleDateClick = (day: number) => {
    const newD = new Date(currentDate);
    newD.setFullYear(viewYear);
    newD.setMonth(viewMonth);
    newD.setDate(day);
    onChange(new Date(newD.getTime() - newD.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  };

  const handleTimeChange = (type: 'h'|'m'|'p', val: string) => {
    let h = currentDate.getHours();
    let m = currentDate.getMinutes();
    let isPM = h >= 12;
    let h12 = h % 12 || 12;

    if (type === 'h') h12 = parseInt(val);
    if (type === 'm') m = parseInt(val);
    if (type === 'p') isPM = val === 'PM';

    let newH = h12 === 12 ? (isPM ? 12 : 0) : (isPM ? h12 + 12 : h12);
    const newD = new Date(currentDate);
    newD.setHours(newH, m);
    onChange(new Date(newD.getTime() - newD.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  
  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  let h12 = currentDate.getHours() % 12 || 12;
  let ampm = currentDate.getHours() >= 12 ? 'PM' : 'AM';
  let m = currentDate.getMinutes();

  const isToday = currentDate.toDateString() === new Date().toDateString();
  const currentHour24 = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  const isHourDisabled = (h: number) => {
    if (!isToday) return false;
    let hour24 = h === 12 ? (ampm === 'PM' ? 12 : 0) : (ampm === 'PM' ? h + 12 : h);
    return hour24 < currentHour24;
  };
  
  const isMinuteDisabled = (min: number) => {
    if (!isToday) return false;
    let hour24 = h12 === 12 ? (ampm === 'PM' ? 12 : 0) : (ampm === 'PM' ? h12 + 12 : h12);
    if (hour24 < currentHour24) return true;
    if (hour24 === currentHour24) return min < currentMinute;
    return false;
  };

  const isAmPmDisabled = (period: string) => {
    if (!isToday) return false;
    if (period === 'AM' && currentHour24 >= 12) return true;
    return false;
  };

  return (
    <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-4 select-none shadow-inner">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[var(--text-main)] transition-colors"><IconChevronLeft /></button>
        <span className="font-bold text-sm text-[var(--text-main)]">{new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-[var(--text-main)] transition-colors"><svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[var(--text-muted)] mb-2">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4 border-b border-[var(--border-color)] pb-4">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isSelected = day === currentDate.getDate() && viewMonth === currentDate.getMonth() && viewYear === currentDate.getFullYear();
          const dateObj = new Date(viewYear, viewMonth, day);
          const isPastDate = dateObj < new Date(new Date().setHours(0,0,0,0));
          return (
            <button
              key={day}
              type="button"
              disabled={isPastDate}
              onClick={() => handleDateClick(day)}
              className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto transition-all ${isPastDate ? 'opacity-30 cursor-not-allowed' : isSelected ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] font-bold shadow-md scale-110' : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-main)] hover:font-bold'}`}
            >
              {day}
            </button>
          );
        })}
      </div>
      
      {/* Time Selector */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Time
        </span>
        <div className="flex gap-1.5 items-center">
          <select value={h12} onChange={e => handleTimeChange('h', e.target.value)} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md px-1 py-1 text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer shadow-sm">
            {Array.from({ length: 12 }).map((_, i) => <option key={i+1} value={i+1} disabled={isHourDisabled(i+1)}>{String(i+1).padStart(2, '0')}</option>)}
          </select>
          <span className="font-bold text-[var(--text-muted)]">:</span>
          <select value={m} onChange={e => handleTimeChange('m', e.target.value)} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md px-1 py-1 text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer shadow-sm">
            {Array.from({ length: 60 }).map((_, i) => <option key={i} value={i} disabled={isMinuteDisabled(i)}>{String(i).padStart(2, '0')}</option>)}
          </select>
          <select value={ampm} onChange={e => handleTimeChange('p', e.target.value)} className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-md px-1 py-1 text-xs font-semibold text-[var(--text-main)] focus:outline-none focus:border-[var(--brand-primary)] cursor-pointer ml-1 shadow-sm">
            <option value="AM" disabled={isAmPmDisabled('AM')}>AM</option>
            <option value="PM" disabled={isAmPmDisabled('PM')}>PM</option>
          </select>
        </div>
      </div>
    </div>
  );
};


export default function SingleProductEditAccurateUI({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // States
  const [activeStep, setActiveStep] = useState(1);
  const [status, setStatus] = useState('Active');
  const [title, setTitle] = useState('Gradiant Triangle Diamond Ring');
  const [desc, setDesc] = useState('<p>Premium diamond jewellery crafted for elegance.</p>');
  
  // Custom Select States
  const [cat, setCat] = useState('Rings');
  const [subCat, setSubCat] = useState('Diamond Female');
  const [vendor, setVendor] = useState('Ashok Jewels');
  const [collection, setCollection] = useState('None');
  const [chain, setChain] = useState('None');
  const [metal, setMetal] = useState('Gold');
  const [purity, setPurity] = useState('14KT');
  const [color, setColor] = useState('Yellow');
  const [diamond, setDiamond] = useState('SI-HI, VVS-FG');
  const [size, setSize] = useState('7');
  
  // Dynamic Options States
  const [subCategories, setSubCategories] = useState([
    { id: 1, name: 'Diamond Female', usedInOther: true },
    { id: 2, name: 'Gold Female', usedInOther: false },
    { id: 3, name: 'Platinum Male', usedInOther: true }
  ]);
  const [isSubCatModalOpen, setIsSubCatModalOpen] = useState(false);
  const [newSubCatName, setNewSubCatName] = useState('');

  const [tags, setTags] = useState(['Modern', 'Trendy']);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  // Schedule Launch State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  // Media State
  const [media, setMedia] = useState([
    { id: 1, color: 'Yellow', type: 'PRIMARY IMAGE', active: true },
    { id: 2, color: 'Yellow', type: 'MAKE PRIMARY', active: false },
    { id: 3, color: 'Yellow', type: 'MAKE PRIMARY', active: false },
    { id: 4, color: 'Rose', type: 'MAKE PRIMARY', active: false },
    { id: 5, color: 'White', type: 'MAKE PRIMARY', active: false },
    { id: 6, color: 'White', type: 'MAKE PRIMARY', active: false },
    { id: 7, color: 'Description Image', type: 'MAKE PRIMARY', active: false },
  ]);

  // SEO State
  const [isEditingSEO, setIsEditingSEO] = useState(false);
  const [seoTitle, setSeoTitle] = useState("Buy Gradiant Triangle Diamond Design Ring | Ashok Jewels");
  const [seoDesc, setSeoDesc] = useState("Shop Gradiant Triangle Diamond Ring online at Ashok Jewels. Premium diamond jewellery crafted for elegance. Explore authentic Design with secure shopping.");

  // Preview State Sync (Now filtered by Color!)
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Filter media based on the currently selected variant color (Yellow/Rose/White)
  const filteredMedia = media.filter(m => m.color === color || m.color === 'Description Image');
  
  // Ensure we don't go out of bounds if colors switch
  let safeMainIdx = mainImageIdx;
  if (safeMainIdx >= filteredMedia.length) {
    safeMainIdx = 0;
  }
  const currentPreviewMedia = filteredMedia.length > 0 ? filteredMedia[safeMainIdx] : null;

  // Save Status State
  const [saveStatus, setSaveStatus] = useState('All changes saved');

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setSaveStatus('Saving...');
        setTimeout(() => setSaveStatus('All changes saved'), 800);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        console.log('Undo action triggered via global shortcut');
        // TODO: Implement actual undo stack logic
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-save simulation when fields change
  useEffect(() => {
    setSaveStatus('Saving...');
    const timer = setTimeout(() => {
      setSaveStatus('All changes saved');
    }, 1200);
    return () => clearTimeout(timer);
  }, [title, desc, cat, subCat, vendor, collection, metal, purity, color, diamond, size]);

  useEffect(() => { setMounted(true); }, []);

  const steps = [
    { id: 1, label: 'Product Info' },
    { id: 2, label: 'Options' },
    { id: 3, label: 'Price Master' },
    { id: 4, label: 'Variants' },
    { id: 5, label: 'More Features' },
  ];

  const removeMedia = (id: number) => {
    setMedia(media.filter(m => m.id !== id));
  };

  const handleSetPrimary = (id: number) => {
    const targetImg = media.find(m => m.id === id);
    if (targetImg && targetImg.color !== 'Description Image') {
      // Auto-switch the variant dropdown to match the selected primary image!
      setColor(targetImg.color);
      setMainImageIdx(0);
    }
    
    setMedia(media.map(m => ({
      ...m,
      active: m.id === id,
      type: m.id === id ? 'PRIMARY IMAGE' : 'MAKE PRIMARY'
    })));
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newMedia = { id: Date.now(), color: color !== 'Description Image' ? color : 'Yellow', type: 'MAKE PRIMARY', active: false };
      setMedia([...media, newMedia]);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans transition-colors duration-400 pb-20">
      
      {/* 1. TOP HEADER WITH FULL-WIDTH STICKY GLASSMORPHISM */}
      <div className="sticky top-0 -mx-4 sm:-mx-8 -mt-4 sm:-mt-8 px-6 sm:px-12 py-5 z-40 glass-panel flex items-center justify-between mb-8 shadow-sm border-t-0 border-x-0 rounded-none">
        
        {/* Back & Title */}
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin/inventory/master-grid')} className="p-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full hover:border-[var(--brand-primary)] text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-all shadow-sm">
            <IconChevronLeft />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-[var(--text-main)] truncate tracking-wide leading-tight">{title || 'Untitled Product'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'Saving...' ? 'bg-amber-400 animate-pulse' : 'bg-[#00B060]'}`}></div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{saveStatus}</span>
            </div>
          </div>
        </div>

        {/* Actions with Smoother Shimmer Hover */}
        <div className="flex items-center justify-end gap-3 text-xs font-bold tracking-widest uppercase">
          <button onClick={() => console.log('Duplicate action pending')} className="px-5 py-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all shadow-sm shimmer-hover">Duplicate</button>
          <button onClick={() => console.log('Preview pending')} className="px-5 py-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all shadow-sm shimmer-hover">Preview</button>
          <button onClick={() => console.log('Price Sync pending')} className="px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] shadow-md transition-all shimmer-hover">Price Sync</button>
        </div>
      </div>

      {/* 2. BODY GRID */}
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_380px] 2xl:grid-cols-[1fr_420px] gap-8">
        
        {/* LEFT COLUMN: THE FORM FIELDS */}
        <div className="space-y-8">
          
          {/* Animated Horizontal Timeline Stepper */}
          <div className="w-full flex justify-center py-6 mb-4">
            <div className="flex items-center w-[85%] max-w-2xl justify-between relative">
              {/* Background Line & Progress Line Wrapper */}
              <div className="absolute top-[10px] left-[11px] right-[11px] h-[3px] bg-gray-200 dark:bg-gray-700 rounded-full">
                <motion.div 
                  className="h-full bg-[var(--brand-primary)] origin-left rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              
              {steps.map((step) => {
                const isActive = activeStep === step.id;
                const isPassed = activeStep > step.id;
                return (
                  <div key={step.id} className="flex flex-col items-center cursor-pointer group relative z-10" onClick={() => setActiveStep(step.id)}>
                    {/* The Animated Dot */}
                    <motion.div 
                      animate={{ 
                        scale: isActive ? 1.25 : 1,
                        backgroundColor: isActive || isPassed ? 'var(--brand-primary)' : 'var(--bg-base)',
                        borderColor: isActive || isPassed ? 'var(--brand-primary)' : 'var(--border-color)',
                      }}
                      transition={{ duration: 0.3 }}
                      className={`w-[24px] h-[24px] rounded-full border-[3px] shadow-sm flex items-center justify-center bg-white ${isActive ? 'ring-4 ring-[var(--brand-primary)]/20' : 'group-hover:border-[var(--brand-primary)]/50'}`} 
                    >
                      {(isActive || isPassed) && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 rounded-full bg-[var(--bg-surface)]" />}
                    </motion.div>
                    {/* The label */}
                    <span className={`text-[10px] whitespace-nowrap font-bold tracking-widest uppercase transition-colors absolute top-8 ${isActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TITLE & STATUS */}
          <div className="flex gap-8 items-end">
            <div className="flex-1">
              <label className="block font-bold text-[var(--text-muted)] mb-2 tracking-wider uppercase text-[10px]">Title <span className="text-red-500">*</span> <IconInfo text="The primary product title shown on the storefront and B2B ordering catalogs." /></label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all shadow-sm" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-bold text-[var(--text-muted)] tracking-wider uppercase text-[10px]">Product Status</label>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full p-1 shadow-sm">
                  {['Active', 'Draft', 'Pending'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => setStatus(s)}
                      className={`px-6 py-2.5 text-xs font-bold tracking-wide rounded-full transition-all ${status === s ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <button onClick={() => setIsScheduleOpen(!isScheduleOpen)} className="text-xs px-5 py-3 rounded-full bg-[var(--bg-surface)] text-[var(--brand-primary)] border border-[var(--border-color)] flex items-center gap-2 cursor-pointer hover:border-[var(--brand-primary)] transition-all font-bold tracking-wide shadow-sm shimmer-hover">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
                    {scheduleDate ? new Date(scheduleDate).toLocaleDateString() : 'Schedule Launch'}
                  </button>
                  
                  {isScheduleOpen && (
                    <div className="absolute top-full right-0 mt-3 w-80 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                      <label className="block font-bold text-[var(--text-main)] mb-3 tracking-wider uppercase text-[10px]">Select Date & Time</label>
                      
                      {/* Presets */}
                      <div className="flex flex-col gap-2 mb-5">
                        <button 
                          onClick={() => {
                            const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(9, 0, 0); 
                            setScheduleDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                          }} 
                          className="text-left px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 rounded-xl text-xs font-semibold text-[var(--text-main)] transition-colors flex justify-between items-center"
                        >
                          Tomorrow Morning <span>9:00 AM</span>
                        </button>
                        <button 
                          onClick={() => {
                            const d = new Date(); d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7 || 7); d.setHours(9, 0, 0);
                            setScheduleDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                          }} 
                          className="text-left px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 rounded-xl text-xs font-semibold text-[var(--text-main)] transition-colors flex justify-between items-center"
                        >
                          Next Monday <span>9:00 AM</span>
                        </button>
                        <button 
                          onClick={() => {
                            const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(0); d.setHours(23, 59, 59);
                            setScheduleDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
                          }} 
                          className="text-left px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 rounded-xl text-xs font-semibold text-[var(--text-main)] transition-colors flex justify-between items-center"
                        >
                          End of Month <span>11:59 PM</span>
                        </button>
                      </div>

                      <div className="relative mb-5 group">
                        <CustomDateTimePicker value={scheduleDate} onChange={setScheduleDate} />
                      </div>
                      
                      <button 
                        onClick={() => {
                          setIsScheduleOpen(false);
                          if (scheduleDate && new Date(scheduleDate) > new Date()) {
                            setStatus('Draft');
                          }
                        }} 
                        className="w-full py-3 bg-[var(--brand-primary)] text-[var(--brand-text)] font-bold text-[10px] tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity shadow-sm shimmer-hover"
                      >
                        Confirm Schedule
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block font-bold text-[var(--text-muted)] mb-2 tracking-wider uppercase text-[10px]">Description <IconInfo text="Rich text description supporting HTML formatting." /></label>
            <div className="rounded-xl bg-[var(--bg-surface)] shadow-sm text-[var(--text-main)] font-sans quill-modern-container transition-all hover:shadow-md">
              <style jsx global>{`
                .quill-modern-container .ql-toolbar { border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; border-color: var(--border-color); background: var(--bg-surface); }
                .quill-modern-container .ql-container { border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; border-color: var(--border-color); min-height: 180px; font-family: inherit; font-size: 0.875rem; }
                .quill-modern-container .ql-editor:focus { border-color: var(--brand-primary); outline: none; }
              `}</style>
              <ReactQuill theme="snow" value={desc} onChange={setDesc} />
            </div>
          </div>

          {/* HSN CODE */}
          <div className="w-1/2 pr-4">
            <label className="block font-bold text-[var(--text-muted)] mb-2 tracking-wider uppercase text-[10px]">HSN Code <span className="text-red-500">*</span> <IconInfo text="Harmonized System of Nomenclature code for taxation." /></label>
            <input type="text" defaultValue="71131930" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] transition-all shadow-sm" />
          </div>

          {/* MEDIA SECTION */}
          <div className="mt-10">
            <p className="text-[10px] text-[var(--brand-primary)] mb-3 font-bold uppercase tracking-widest">Gallery & Visuals</p>
            
            <div className="surface-panel p-6 mb-6">
              <div className="flex justify-between items-center mb-6 border-b border-[var(--border-color)] pb-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)] tracking-wide">Manual Upload</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Upload product photos/videos, set primary, and sort the gallery order.</p>
                </div>
                <button className="px-5 py-2.5 bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] rounded-full text-[10px] text-[var(--text-main)] font-bold tracking-widest uppercase transition-all shadow-sm shimmer-hover">PRIMARY CONTROL</button>
              </div>
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {media.map((img) => (
                  <div key={img.id} className="bg-white rounded-2xl aspect-square relative flex flex-col justify-between p-3 border border-gray-200 shadow-sm overflow-visible group hover:shadow-md hover:border-[var(--brand-primary)]/40 transition-all">
                    {/* Top Action Bar */}
                    <div className="flex justify-between items-start z-20">
                      <MiniSelect 
                        value={img.color} 
                        onChange={(val: string) => {
                          const newMedia = media.map(m => m.id === img.id ? { ...m, color: val } : m);
                          setMedia(newMedia);
                        }} 
                        options={['Yellow', 'Rose', 'White', 'Description Image']} 
                      />
                      <button onClick={() => removeMedia(img.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors">
                        <IconClose />
                      </button>
                    </div>

                    {/* Image Circle Placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                       <svg className={`w-full h-full p-8 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm ${img.color === 'Yellow' ? 'text-yellow-300' : img.color === 'Rose' ? 'text-rose-200' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="8" strokeWidth="1.5"/></svg>
                    </div>
                    
                    {/* Bottom Primary Button */}
                    <div className="flex justify-center z-20">
                      <button 
                        onClick={() => handleSetPrimary(img.id)}
                        className={`w-full py-2.5 text-[9px] font-bold tracking-widest uppercase rounded-xl transition-all ${img.active ? 'bg-[#00B060] text-white shadow-md shimmer-hover' : 'bg-[var(--bg-base)] text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[var(--text-main)] hover:text-[var(--bg-base)] shimmer-hover'}`}
                      >
                        {img.type} {img.active && '★'}
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Upload Box */}
                <label className="border-2 border-dashed border-[var(--brand-primary)] rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--brand-primary)]/10 transition-colors group shadow-sm bg-[var(--brand-primary)]/5">
                  <IconUpload />
                  <span className="text-xs font-bold text-[var(--brand-primary)] tracking-wide">Add Image/Video</span>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] mt-1">Drop files here</span>
                  <input type="file" multiple className="hidden" onChange={handleSimulatedUpload} />
                </label>
              </div>
            </div>

            {/* AI Generate Banner */}
            <div className="surface-panel p-6 relative hover:shadow-lg transition-shadow">
              <div className="absolute top-5 right-5 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full border border-[var(--brand-primary)]/20">AI Assist</div>
              <h3 className="text-base font-bold text-[var(--text-main)] mb-1 tracking-wide">Auto AI Generate</h3>
              <p className="text-xs text-[var(--text-muted)] mb-6 font-medium border-b border-[var(--border-color)] pb-5">Generate visuals with AI and add selected output directly to your media gallery.</p>
              
              <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between shadow-inner">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-main)]">AI Image Generator</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Generate new looks and styles for your product in seconds.</p>
                </div>
                <button className="flex items-center px-6 py-3 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30 rounded-xl text-xs font-bold tracking-wide hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text)] transition-all shadow-sm shimmer-hover">
                  <IconWand /> Click to generate
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCT TYPE SECTION */}
          <div className="surface-panel p-6 mt-8">
            <h2 className="text-base font-bold text-[var(--text-main)] mb-6 tracking-wide border-b border-[var(--border-color)] pb-4">Product Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <CustomSelect 
                label="Category" 
                required 
                iconInfo="Defines the high-level grouping in your Master Catalog. Affects global search."
                value={cat} 
                onChange={setCat} 
                options={['Rings', 'Bracelets', 'Necklaces', 'Earrings']} 
                className="bg-[var(--bg-surface)]"
              />
              <CustomSelect 
                label="Sub-Category" 
                iconInfo="Specific product archetype. Impacts detailed attribute routing and pricing tables."
                rightAction={
                  <button 
                    type="button"
                    className="text-[10px] text-[var(--brand-primary)] font-bold hover:underline cursor-pointer focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsSubCatModalOpen(true);
                    }}
                  >
                    + Add / Manage
                  </button>
                }
                value={subCat} 
                onChange={setSubCat} 
                options={subCategories.map(s => s.name)} 
                className="bg-[var(--bg-surface)]"
              />
              <CustomSelect 
                label="Vendor Name" 
                iconInfo="The authorized supplier or manufacturing unit for this SKU."
                value={vendor} 
                onChange={setVendor} 
                options={['Ashok Jewels', 'Hari Krishna Exports']} 
                className="bg-[var(--bg-surface)]"
              />
            </div>

            <div className="mb-6">
              <CustomSelect 
                label="Collections" 
                iconInfo="Assign this SKU to curated lists like seasonal catalogs or exclusive buyer groups."
                value={collection} 
                onChange={setCollection} 
                options={['None', 'Summer Collection 2026', 'Wedding Specials']} 
                className="bg-[var(--bg-surface)]"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center font-bold text-[var(--text-muted)] tracking-wider uppercase text-[10px]">Tags <IconInfo text="Searchable keywords used by the recommendation engine and internal search." /></label>
              </div>
              <div 
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 min-h-[55px] flex gap-2 items-center flex-wrap shadow-sm focus-within:ring-1 focus-within:ring-[var(--brand-primary)] focus-within:border-[var(--brand-primary)] transition-all cursor-text"
                onClick={() => document.getElementById('tag-input-field')?.focus()}
              >
                {tags.map(tag => (
                  <span key={tag} className="bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 hover:border-[var(--brand-primary)] transition-colors">
                    {tag} 
                    <IconClose className="cursor-pointer hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); setTags(tags.filter(t => t !== tag)); }} />
                  </span>
                ))}
                <input 
                  id="tag-input-field"
                  type="text" 
                  value={newTagName} 
                  onChange={e => setNewTagName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
                      e.preventDefault();
                      const val = newTagName.trim().replace(/,/g, '');
                      if (val && !tags.includes(val)) {
                        setTags([...tags, val]);
                      }
                      setNewTagName('');
                    } else if (e.key === 'Backspace' && newTagName === '' && tags.length > 0) {
                      setTags(tags.slice(0, -1));
                    }
                  }}
                  placeholder={tags.length === 0 ? "Type keywords and press Enter or Comma..." : ""} 
                  className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50"
                />
              </div>
            </div>

            <div className="mb-6">
              <CustomSelect 
                label="Chain" 
                iconInfo="If applicable, specifies the included chain type and length for pendants."
                value={chain} 
                onChange={setChain} 
                options={['None', 'Cable Chain', 'Rope Chain']} 
                className="bg-[var(--bg-surface)]"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-color)]">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
              <label className="text-sm font-semibold text-[var(--text-main)]">Is duplicate allowed?</label>
            </div>
          </div>

          {/* SELLING CHANNELS */}
          <div className="surface-panel p-6 mt-8">
            <h2 className="text-base font-bold text-[var(--text-main)] mb-4 flex items-center tracking-wide">Selling Channels <IconInfo text="Determine if this SKU is visible to Wholesale B2B buyers, Retail B2C customers, or both." /></h2>
            <div className="flex gap-8 border-t border-[var(--border-color)] pt-4">
              {['B2B Only', 'B2C Only', 'Both Channels'].map(c => (
                <label key={c} className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="channel" className="w-4 h-4 text-[var(--brand-primary)] border-gray-300 focus:ring-[var(--brand-primary)] cursor-pointer" defaultChecked={c==='Both Channels'} />
                  <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* INVENTORY */}
          <div className="surface-panel p-6 space-y-6 mt-8">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center tracking-wide border-b border-[var(--border-color)] pb-4">Inventory <IconInfo text="Stock keeping logic" /></h2>
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2 text-[10px]">SKU <span className="text-red-500">*</span> <IconInfo text="Unique Stock Keeping Unit identifier across the global inventory system." /></label>
                <input type="text" defaultValue="KFLR12203" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] shadow-sm transition-all" />
              </div>
              <div className="flex-1">
                <label className="block font-bold text-[var(--text-muted)] tracking-wider uppercase mb-2 text-[10px]">Barcode (ISBN, UPC, GTIN etc.) <IconInfo text="Scannable GTIN/UPC code for physical warehouse tracking and POS integration." /></label>
                <input type="text" placeholder="Enter Barcode" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] shadow-sm transition-all" />
              </div>
            </div>
            
            <div className="border-t border-[var(--border-color)] pt-5">
              <label className="block font-bold text-[var(--text-muted)] tracking-wider uppercase mb-4 text-[10px]">Track Inventory on variant <IconInfo text="Enable variant-level tracking for granular stock management." /></label>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                  <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">Continue to sell when out of stock <IconInfo text="Allow backorders. Users can place orders even when physical stock is zero." /></span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                  <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">Meta Available</span>
                </label>
              </div>
            </div>
          </div>

          {/* PRICE */}
          <div className="surface-panel p-6 mt-8">
            <div className="flex justify-between items-center cursor-pointer group mb-2">
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center tracking-wide">Price <IconInfo text="Configure the dynamic pricing matrix based on live metal and diamond rates." /></h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-medium pb-4 border-b border-[var(--border-color)]">Add Variant options to create variants and manage pricing <span className="text-[var(--brand-primary)] font-bold underline cursor-pointer hover:text-[var(--brand-primary-hover)] transition-colors" onClick={() => setActiveStep(2)}>(Add Variants)</span></p>
            <div className="space-y-4 pt-5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">Enable Dynamic Pricing <IconInfo text="Link base pricing to real-time market rate APIs." /></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">Show Price Breakup <IconInfo text="Display granular breakdown of Metal, Making Charges, and Gemstone costs to buyers." /></span>
              </label>
            </div>
          </div>

          {/* SHIPPING */}
          <div className="surface-panel p-6 mt-8">
            <h2 className="text-base font-bold text-[var(--text-main)] tracking-wide border-b border-[var(--border-color)] pb-4 mb-5">Shipping</h2>
            <div>
              <p className="text-sm font-bold text-[var(--text-main)]">Enter Product's Weight and Dimensions</p>
              <p className="text-xs font-medium text-[var(--text-muted)] mt-1 mb-5">Change Units in <span className="text-[var(--brand-primary)] hover:underline cursor-pointer font-bold">Regional settings</span></p>
              
              <div className="flex items-center gap-4">
                <div className="relative w-40">
                  <input type="text" placeholder="Enter Weight" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] shadow-sm" />
                  <span className="absolute right-3 top-3.5 text-xs text-[var(--text-muted)] font-bold">kg</span>
                </div>
                <div className="relative w-40">
                  <input type="text" placeholder="Enter Length" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] shadow-sm" />
                  <span className="absolute right-3 top-3.5 text-xs text-[var(--text-muted)] font-bold">cm</span>
                </div>
                <span className="text-[var(--text-muted)] font-bold text-lg">×</span>
                <div className="relative w-40">
                  <input type="text" placeholder="Enter Height" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] shadow-sm" />
                  <span className="absolute right-3 top-3.5 text-xs text-[var(--text-muted)] font-bold">cm</span>
                </div>
                <span className="text-[var(--text-muted)] font-bold text-lg">×</span>
                <div className="relative w-40">
                  <input type="text" placeholder="Enter Width" className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] shadow-sm" />
                  <span className="absolute right-3 top-3.5 text-xs text-[var(--text-muted)] font-bold">cm</span>
                </div>
              </div>
            </div>
            <div className="pt-5 mt-5 border-t border-[var(--border-color)]">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                <span className="text-sm font-semibold text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">Is this item available for shipping abroad?</span>
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="surface-panel p-6 mt-8">
            <h2 className="text-base font-bold text-[var(--text-main)] flex items-center tracking-wide border-b border-[var(--border-color)] pb-4 mb-5">Search Engine Optimisation <IconInfo text="Google snippet simulator to preview how this product appears in organic search." /></h2>
            
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-[var(--text-muted)] tracking-wider uppercase text-[10px]">Metadata Preview</p>
              <button 
                onClick={() => setIsEditingSEO(!isEditingSEO)} 
                className="text-xs text-[var(--brand-primary)] font-bold hover:underline px-2 py-1"
              >
                {isEditingSEO ? 'Save' : 'Edit'}
              </button>
            </div>
            
            <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--border-color)] shadow-inner">
              {isEditingSEO ? (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1 text-[10px] uppercase tracking-wider">Title</label>
                    <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] shadow-sm" />
                  </div>
                  <div>
                    <label className="block font-bold text-[var(--text-muted)] mb-1 text-[10px] uppercase tracking-wider">Description</label>
                    <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3} className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)] shadow-sm"></textarea>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <p className="text-sm text-[var(--text-muted)] font-bold">Title : <span className="text-[var(--brand-primary)]">{seoTitle}</span></p>
                  <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed">Description : {seoDesc}</p>
                </motion.div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: STICKY PREVIEW SECTION */}
        <div className="hidden lg:flex sticky top-28 self-start flex-col surface-panel p-6 transition-all duration-300 w-[380px] 2xl:w-[420px] shrink-0">
          <h2 className="text-[10px] shrink-0 font-bold text-[var(--text-muted)] tracking-widest uppercase mb-4 border-b border-[var(--border-color)] pb-3">Live Preview</h2>
          
          {/* Main Image Slider - 1:1 Responsive */}
          <div className="w-full mb-6">
            <div 
              className="bg-white rounded-2xl relative flex items-center justify-center border border-[var(--border-color)] overflow-hidden group shadow-inner"
              style={{ aspectRatio: '1/1', width: '100%' }}
            >
              {currentPreviewMedia ? (
                <svg className={`w-full h-full p-6 drop-shadow-xl transition-transform duration-700 group-hover:scale-110 ${currentPreviewMedia.color === 'Yellow' ? 'text-yellow-400' : currentPreviewMedia.color === 'Rose' ? 'text-rose-300' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="8" strokeWidth="1"/></svg>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">No media</span>
                </div>
              )}
              
              {filteredMedia.length > 1 && (
                <>
                  <div onClick={() => setMainImageIdx((prev) => (prev > 0 ? prev - 1 : filteredMedia.length - 1))} className="absolute left-2 w-7 h-7 sm:left-3 sm:w-8 sm:h-8 bg-white shadow-md rounded-full flex items-center justify-center cursor-pointer text-gray-500 hover:text-[var(--brand-primary)] opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><IconChevronLeft /></div>
                  <div onClick={() => setMainImageIdx((prev) => (prev < filteredMedia.length - 1 ? prev + 1 : 0))} className="absolute right-2 w-7 h-7 sm:right-3 sm:w-8 sm:h-8 bg-white shadow-md rounded-full flex items-center justify-center cursor-pointer text-gray-500 hover:text-[var(--brand-primary)] opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><svg className="w-5 h-5 text-current transition-colors cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
                </>
              )}
              
              <div onClick={() => { if(currentPreviewMedia) setIsFullscreen(true); }} className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-black/20 hover:bg-black/60 backdrop-blur-md rounded-xl flex items-center justify-center cursor-pointer text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {/* Thumbnails mapped directly from FILTERED media array */}
          {filteredMedia.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filteredMedia.map((img, idx) => (
                <div 
                  key={img.id} 
                  onClick={() => setMainImageIdx(idx)}
                  className={`rounded-xl shrink-0 w-10 h-10 flex justify-center items-center p-0.5 cursor-pointer transition-all border-2 bg-white ${safeMainIdx === idx ? 'border-[var(--brand-primary)] scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400 opacity-100'}`}
                >
                  <svg className={`w-6 h-6 ${img.color === 'Yellow' ? 'text-yellow-400' : img.color === 'Rose' ? 'text-rose-300' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="8" strokeWidth="1.5"/></svg>
                </div>
              ))}
            </div>
          )}

          {/* Details synced with state */}
          <h2 className="text-lg font-bold text-[var(--text-main)] mb-1 leading-tight">{title || 'Untitled Product'}</h2>
          <p className="text-[10px] text-[var(--text-muted)] font-bold mb-6 uppercase tracking-widest">{cat} <span className="mx-1 text-gray-300">|</span> {subCat} <span className="mx-1 text-gray-300">|</span> {vendor}</p>

          {/* Variant Forms - Compact Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-color)]">
            <CustomSelect label="Metal" value={metal} onChange={setMetal} options={['Gold', 'Platinum']} className="bg-[var(--bg-surface)]" size="sm" />
            <CustomSelect label="Purity" value={purity} onChange={setPurity} options={['14KT', '18KT', '22KT']} className="bg-[var(--bg-surface)]" size="sm" />
            
            {/* When Color changes, we reset the preview slider to the first image of the new color */}
            <CustomSelect 
              label="Gold Color" 
              value={color} 
              onChange={(val: string) => { setColor(val); setMainImageIdx(0); }} 
              options={['Yellow', 'Rose', 'White']} 
              className="bg-[var(--bg-surface)]" 
              size="sm"
            />
            
            <CustomSelect 
              label="Size" 
              value={size} 
              onChange={setSize} 
              options={['6', '7', '8', '9', '10']} 
              className="bg-[var(--bg-surface)]" 
              size="sm"
            />
            
            {/* The emphasized diamond dropdown */}
            <div className="col-span-2">
              <CustomSelect 
                label="Diamond" 
                value={diamond} 
                onChange={setDiamond} 
                options={['SI-HI, VVS-FG', 'VVS-EF', 'SI-IJ']} 
                className="text-[var(--brand-primary)] border-[var(--brand-primary)]/30 font-bold bg-[var(--brand-primary)]/5" 
                size="sm"
              />
            </div>
          </div>
        </div>

        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {isFullscreen && currentPreviewMedia && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8 backdrop-blur-xl" 
            onClick={() => setIsFullscreen(false)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-[var(--brand-primary)] bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors">
              <IconClose />
            </button>
            <div 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl lg:max-w-4xl aspect-square max-h-[85vh] flex items-center justify-center relative overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <svg className={`w-1/2 h-1/2 drop-shadow-sm ${currentPreviewMedia.color === 'Yellow' ? 'text-yellow-400' : currentPreviewMedia.color === 'Rose' ? 'text-rose-300' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="8" strokeWidth="1"/></svg>
              
              {filteredMedia.length > 1 && (
                <>
                  <div onClick={(e) => { e.stopPropagation(); setMainImageIdx((prev) => (prev > 0 ? prev - 1 : filteredMedia.length - 1))}} className="absolute left-6 w-14 h-14 bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer text-gray-600 hover:text-[var(--brand-primary)] transition-all hover:scale-110">
                    <IconChevronLeft />
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); setMainImageIdx((prev) => (prev < filteredMedia.length - 1 ? prev + 1 : 0))}} className="absolute right-6 w-14 h-14 bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer text-gray-600 hover:text-[var(--brand-primary)] transition-all hover:scale-110">
                    <svg className="w-7 h-7 text-current transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUB-CATEGORY MANAGEMENT MODAL */}
      <AnimatePresence>
        {isSubCatModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSubCatModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Dialog */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-base)]">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Manage Sub-Categories</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">Add new categories or delete existing ones from the master list.</p>
                </div>
                <button onClick={() => setIsSubCatModalOpen(false)} className="p-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <IconClose />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Add New Section */}
                <div className="flex gap-3 mb-8">
                  <input 
                    type="text" 
                    value={newSubCatName}
                    onChange={(e) => setNewSubCatName(e.target.value)}
                    placeholder="Enter new sub-category name..."
                    className="flex-1 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-primary)]"
                  />
                  <button 
                    onClick={() => {
                      if (newSubCatName.trim()) {
                        setSubCategories([...subCategories, { id: Date.now(), name: newSubCatName.trim(), usedInOther: false }]);
                        setNewSubCatName('');
                      }
                    }}
                    className="px-6 py-2.5 bg-[var(--brand-primary)] text-[var(--brand-text)] font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap shimmer-hover"
                  >
                    + Add New
                  </button>
                </div>

                {/* Table of Pre-Activated Categories */}
                <h3 className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase mb-3 border-b border-[var(--border-color)] pb-2">Pre-Activated Categories</h3>
                <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-inner">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
                        <th className="px-5 py-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Sub-Category Name</th>
                        <th className="px-5 py-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {subCategories.map(sub => (
                        <tr key={sub.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3 text-sm font-semibold text-[var(--text-main)]">{sub.name}</td>
                          <td className="px-5 py-3 text-sm">
                            <span className="px-2.5 py-1 bg-[#00B060]/10 text-[#00B060] rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end relative group">
                              <button 
                                disabled={sub.usedInOther}
                                onClick={() => setSubCategories(subCategories.filter(s => s.id !== sub.id))}
                                className={`p-2 rounded-lg transition-all ${sub.usedInOther ? 'text-gray-400 cursor-not-allowed opacity-50' : 'text-red-400 hover:bg-red-50 hover:text-red-600'}`}
                              >
                                <IconClose />
                              </button>
                              
                              {/* Custom Tooltip for Disabled State */}
                              {sub.usedInOther && (
                                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10 w-48 bg-gray-900 text-white text-[10px] font-medium p-2 rounded-lg shadow-xl text-center">
                                  This sub-category is already active on other products and cannot be deleted.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {subCategories.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-sm text-[var(--text-muted)] font-medium">No sub-categories found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
