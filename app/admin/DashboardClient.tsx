'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import GlobalMap from '@/components/dashboard/GlobalMap';

export default function AdminIndex() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'Admin';

  const [performanceFilter, setPerformanceFilter] = useState('This Week');
  const [locationFilter, setLocationFilter] = useState('This Week');
  const [liveVisitors, setLiveVisitors] = useState(0);

  useEffect(() => {
    setLiveVisitors(Math.floor(Math.random() * 15) + 5);
    const interval = setInterval(() => {
      setLiveVisitors(prev => {
        const change = Math.floor(Math.random() * 5) - 2;
        const newVal = prev + change;
        return newVal < 1 ? 1 : newVal > 45 ? 45 : newVal;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Panel */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl relative overflow-hidden">
        {/* Subtle Background Noise / Texture for Luxury Feel */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-main)] mb-1 tracking-tight">
              Good morning, {userName} <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">
              {currentDate}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              Here's what's happening in your business today.
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">Orders +24% <span className="text-emerald-600/70 dark:text-emerald-500/70 font-normal">this week</span></span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">Revenue +12% <span className="text-emerald-600/70 dark:text-emerald-500/70 font-normal">this week</span></span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent border border-[var(--border-color)] text-[var(--text-main)] rounded-full text-xs font-bold uppercase tracking-widest hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all w-full sm:w-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              EXPORT LOGS
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent border border-[var(--border-color)] text-[var(--text-main)] rounded-full text-xs font-bold uppercase tracking-widest hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5 transition-all w-full sm:w-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              EXPORT EVENT LOGS
            </button>
          </div>
        </div>
      </div>

      {/* Live Visitors Bar */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl flex items-center gap-4 relative overflow-hidden group cursor-default">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center gap-2 px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full border border-[var(--border-color)]">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-xs font-bold text-[var(--text-main)] uppercase tracking-widest">Live Visitors</span>
        </div>
        <span className="text-2xl font-black text-[var(--text-main)] transition-all duration-300">{liveVisitors}</span>
      </div>

      {/* Store Performance Panel */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-[var(--text-main)]">Store Performance</h3>
          <div className="flex gap-2">
            {['This Week', 'This Month', 'This Year', 'Custom'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setPerformanceFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                  performanceFilter === tab ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20' 
                  : 'bg-transparent text-[var(--text-muted)] border-transparent hover:border-[var(--border-color)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="p-5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]/50 transition-all group relative overflow-hidden">
             <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 text-[var(--brand-primary)]">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Revenue</p>
             <h4 className="text-2xl font-black text-[var(--text-main)] mb-3">₹2.34L</h4>
             <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
               +12% <span className="text-[var(--text-muted)] font-normal">vs last week</span>
             </p>
          </div>
          
          <div className="p-5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]/50 transition-all group relative overflow-hidden">
             <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 text-[var(--brand-primary)]">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
             </div>
             <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Orders</p>
             <h4 className="text-2xl font-black text-[var(--text-main)] mb-3">19</h4>
             <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
               +24% <span className="text-[var(--text-muted)] font-normal">vs last week</span>
             </p>
          </div>
          
          <div className="p-5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]/50 transition-all group relative overflow-hidden">
             <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 text-[var(--brand-primary)]">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             </div>
             <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Customers</p>
             <h4 className="text-2xl font-black text-[var(--text-main)] mb-3">14</h4>
             <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
               +18% <span className="text-[var(--text-muted)] font-normal">vs last week</span>
             </p>
          </div>
          
          <div className="p-5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]/50 transition-all group relative overflow-hidden">
             <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 text-[var(--brand-primary)]">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
             </div>
             <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Engagement</p>
             <h4 className="text-2xl font-black text-[var(--text-main)] mb-3">5%</h4>
             <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
               +5% <span className="text-[var(--text-muted)] font-normal">vs last week</span>
             </p>
          </div>
          
          <div className="p-5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-[var(--brand-primary)]/50 transition-all group relative overflow-hidden">
             <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 text-[var(--brand-primary)]">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
             </div>
             <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Conversions</p>
             <h4 className="text-2xl font-black text-[var(--text-main)] mb-3">2.4%</h4>
             <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 flex items-center gap-1">
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
               +2% <span className="text-[var(--text-muted)] font-normal">vs last week</span>
             </p>
          </div>
        </div>
      </div>

      {/* Top Sales Locations */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-[var(--text-main)]">Top Sales Locations</h3>
          <div className="flex gap-2">
            {['This Week', 'This Month', 'This Year', 'Custom'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setLocationFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                  locationFilter === tab ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20' 
                  : 'bg-transparent text-[var(--text-muted)] border-transparent hover:border-[var(--border-color)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Interactive Global Heatmap */}
          <div className="flex-1 w-full relative h-[300px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] overflow-hidden flex items-center justify-center">
            <GlobalMap />
          </div>
          
          <div className="flex-1 w-full space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm font-bold text-[var(--text-main)]">Mumbai</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[var(--text-main)] mr-2">₹1.00</span>
                  <span className="text-[10px] text-[var(--text-muted)]">1 orders</span>
                </div>
              </div>
              <div className="w-full bg-[var(--bg-base)] rounded-full h-3 border border-[var(--border-color)] overflow-hidden">
                <div className="bg-[var(--brand-primary)] h-3 rounded-full w-full"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm font-bold text-[var(--text-main)]">Dubai</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[var(--text-main)] mr-2">₹0.00</span>
                  <span className="text-[10px] text-[var(--text-muted)]">0 orders</span>
                </div>
              </div>
              <div className="w-full bg-[var(--bg-base)] rounded-full h-3 border border-[var(--border-color)] overflow-hidden">
                <div className="bg-transparent h-3 rounded-full w-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
