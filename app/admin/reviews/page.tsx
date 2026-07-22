'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CustomDropdown = ({ options, value, onChange, placeholder, widthClass }: { options: string[], value: string, onChange: (val: string) => void, placeholder: string, widthClass?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div ref={dropdownRef} className={`relative w-full ${widthClass || 'xl:w-48'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-black/5 dark:bg-[#121212] border ${isOpen ? 'border-[var(--brand-primary)]' : 'border-transparent hover:border-[var(--border-color)]'} rounded-xl px-4 py-3.5 text-sm outline-none transition-colors shadow-inner`}
      >
        <span className={value ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}>
          {value || placeholder}
        </span>
        <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-40 top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-[#1e1e1e] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <ul className="py-2 max-h-60 overflow-y-auto custom-scrollbar">
             <li>
                <button 
                  onClick={() => { onChange(''); setIsOpen(false); }}
                  className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${!value ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 font-medium' : 'text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  All Sources
                </button>
             </li>
            {options.map(option => (
              <li key={option}>
                <button 
                  onClick={() => { onChange(option); setIsOpen(false); }}
                  className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${value === option ? 'text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 font-medium' : 'text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ProductReviewsDashboard() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSource, setSelectedSource] = useState('');
  
  // State for modals
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [logSearch, setLogSearch] = useState('');

  // Moderation Drawer State
  const [isModerationDrawerOpen, setIsModerationDrawerOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isVisibleOnPortal, setIsVisibleOnPortal] = useState(true);

  const drawerRef = useRef<HTMLDivElement>(null);
  const moderationDrawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLogsOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsLogsOpen(false);
      }
      if (isModerationDrawerOpen && moderationDrawerRef.current && !moderationDrawerRef.current.contains(event.target as Node)) {
        setIsModerationDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLogsOpen, isModerationDrawerOpen]);

  const tabs = ['All', 'Pending', 'Approved', 'Disapproved', 'Archived'];

  // Mock data matching the screenshot
  const [reviews, setReviews] = useState([
    {
      id: 'REVIEW-0000127',
      rating: 5,
      reviewText: 'it has a good quality',
      productName: 'Nitara Ring',
      source: 'B2C Website',
      date: '06/07/2026',
      time: '01:42am',
      customerName: 'Sunita',
      status: 'Pending'
    },
    {
      id: 'REVIEW-0000126',
      rating: 5,
      reviewText: 'Awesome Design , Good Quality',
      productName: 'Mini Bloom Gold Kids Earring',
      source: 'B2B Website',
      date: '03/07/2026',
      time: '03:06pm',
      customerName: 'Jayendra TEST Dalvi',
      status: 'Pending'
    },
    {
      id: 'REVIEW-0000125',
      rating: 5,
      reviewText: 'Its a nice lightweight bangle.',
      productName: 'Adisa Diamond Toggle Bangle',
      source: 'B2C App',
      date: '27/06/2026',
      time: '01:06pm',
      customerName: 'Susmita Chakraborty',
      status: 'Pending'
    },
    {
      id: 'REVIEW-0000124',
      rating: 1,
      reviewText: 'Poor quality , I don\'t not like. Return bhi nahi liya',
      productName: 'Classic Diamond Earring For Him',
      source: 'B2B App',
      date: '25/06/2026',
      time: '10:47am',
      customerName: 'Priyatosh Roy',
      status: 'Pending'
    }
  ]);

  const [logs, setLogs] = useState([
    {
      id: 1,
      user: 'Vijay Yadav',
      initials: 'VY',
      avatarColor: 'bg-purple-500/20 text-purple-500',
      activity: 'Review (REVIEW-0000126) approved operation occurs!',
      date: '07-07-2026',
      time: '10:15 am'
    },
    {
      id: 2,
      user: 'System Admin',
      initials: 'SA',
      avatarColor: 'bg-blue-500/20 text-blue-500',
      activity: 'Review (REVIEW-0000124) disapproved operation occurs!',
      date: '06-07-2026',
      time: '04:30 pm'
    }
  ]);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    if (selectedReview?.id === id) {
      setSelectedReview({ ...selectedReview, status: newStatus });
    }

    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'pm' : 'am'}`;
    
    let avatarColor = 'bg-gray-500/20 text-gray-500';
    if (newStatus === 'Approved') avatarColor = 'bg-emerald-500/20 text-emerald-500';
    if (newStatus === 'Disapproved') avatarColor = 'bg-orange-500/20 text-orange-500';
    if (newStatus === 'Archived') avatarColor = 'bg-gray-500/20 text-gray-500';

    setLogs([{
      id: Date.now(),
      user: 'Partner Admin',
      initials: 'PA',
      avatarColor: avatarColor,
      activity: `Review (${id}) ${newStatus.toLowerCase()} operation occurs!`,
      date: dateStr,
      time: timeStr
    }, ...logs]);
  };

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
    if (selectedReview?.id === id) {
      setIsModerationDrawerOpen(false);
    }
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'pm' : 'am'}`;
    
    setLogs([{
      id: Date.now(),
      user: 'Partner Admin',
      initials: 'PA',
      avatarColor: 'bg-red-500/20 text-red-500',
      activity: `Review (${id}) deleted operation occurs!`,
      date: dateStr,
      time: timeStr
    }, ...logs]);
  };

  const openModerationDrawer = (review: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedReview(review);
    setReplyText('');
    setIsLiked(false);
    setIsVisibleOnPortal(true);
    setIsModerationDrawerOpen(true);
  };

  const handlePostReply = () => {
    // Simulate posting reply logic
    setIsModerationDrawerOpen(false);
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
    const timeStr = `${now.getHours() % 12 || 12}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'pm' : 'am'}`;
    
    setLogs([{
      id: Date.now(),
      user: 'Partner Admin',
      initials: 'PA',
      avatarColor: 'bg-blue-500/20 text-blue-500',
      activity: `Replied to Review (${selectedReview.id}) - Visibility: ${isVisibleOnPortal ? 'Public' : 'Hidden'}`,
      date: dateStr,
      time: timeStr
    }, ...logs]);
  };

  const filteredReviews = reviews.filter(r => {
    if (activeTab !== 'All' && r.status !== activeTab) return false;
    if (selectedSource && r.source !== selectedSource) return false;
    if (search && !r.reviewText.toLowerCase().includes(search.toLowerCase()) && !r.productName.toLowerCase().includes(search.toLowerCase()) && !r.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredLogs = logs.filter(log => {
    if (logSearch && !log.activity.toLowerCase().includes(logSearch.toLowerCase()) && !log.user.toLowerCase().includes(logSearch.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 whitespace-nowrap';
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap';
      case 'Disapproved':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 whitespace-nowrap';
      case 'Archived':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/30 whitespace-nowrap';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/30 whitespace-nowrap';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative min-h-screen">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-main)]">Product Reviews</h1>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setIsLogsOpen(true)} className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors">
            View Logs
          </button>
          <button className="px-6 py-2.5 bg-[var(--brand-primary)] text-white dark:text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover uppercase tracking-wide">
            + Create Reviews
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl overflow-hidden flex flex-col">
        
        {/* Tabs */}
        <div className="flex px-4 overflow-x-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-color)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters Toolbar */}
        <div className="px-6 py-6 pb-8 border-t border-[var(--border-color)] flex flex-col xl:flex-row items-center gap-4">
          <div className="flex items-center w-full bg-black/5 dark:bg-[#121212] rounded-xl border border-transparent focus-within:border-[var(--border-color)] transition-colors shadow-inner flex-1">
            <div className="pl-4 pr-2">
              <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent py-3.5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto">
            <CustomDropdown 
              options={['B2B Website', 'B2C Website', 'B2B App', 'B2C App']} 
              value={selectedSource} 
              onChange={setSelectedSource} 
              placeholder="Select Portal" 
              widthClass="xl:w-48"
            />
            
            <button className="flex items-center gap-2 px-5 py-3.5 bg-black/5 dark:bg-[#121212] border border-transparent rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors shadow-inner whitespace-nowrap">
              Sort
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
            </button>
          </div>
        </div>

        {/* Master Data Grid */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="bg-black/10 dark:bg-white/10 border-y border-[var(--border-color)] text-[11px] font-extrabold text-[var(--text-main)] uppercase tracking-wider shadow-sm">
                <th className="py-4 px-6 w-12"><input type="checkbox" className="rounded border-[#333] text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] bg-transparent cursor-pointer" /></th>
                <th className="py-4 px-6">REVIEWS</th>
                <th className="py-4 px-6 w-48">SOURCE / PORTAL</th>
                <th className="py-4 px-6 w-48">CUSTOMER</th>
                <th className="py-4 px-6 w-36 text-center">STATUS</th>
                <th className="py-4 px-6 w-56 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[var(--text-muted)]">
                    No reviews found for the active filters.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr 
                    key={review.id} 
                    onClick={(e) => openModerationDrawer(review, e)}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-6 px-6 align-top" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-[var(--border-color)] bg-transparent text-[var(--brand-primary)] focus:ring-[var(--brand-primary)] cursor-pointer" />
                    </td>
                    <td className="py-6 px-6 align-top pr-12">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-medium text-[var(--text-muted)]">{review.id}</span>
                          <div className="flex gap-1 text-[var(--brand-primary)]">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'fill-transparent stroke-current opacity-30'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-[15px] font-semibold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">{review.reviewText}</p>
                        <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] font-medium">
                          <span>{review.productName}</span>
                          <span>•</span>
                          <span>{review.date}</span>
                          <span>•</span>
                          <span>{review.time}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6 align-top">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-[var(--text-main)]">
                         {review.source.includes('Website') ? (
                           <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                         ) : (
                           <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                         )}
                         {review.source}
                      </div>
                    </td>
                    <td className="py-6 px-6 align-top font-medium text-[var(--text-main)]">
                      {review.customerName}
                    </td>
                    <td className="py-6 px-6 text-center align-top">
                      <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(review.status)}`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="py-6 px-6 text-center align-top">
                      <div className="flex justify-center gap-4" onClick={e => e.stopPropagation()}>
                        <button onClick={(e) => openModerationDrawer(review, e)} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] dark:hover:text-white transition-colors" title="View & Reply">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>
                        <button onClick={(e) => openModerationDrawer(review, e)} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] dark:hover:text-white transition-colors" title="Moderate">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(review.id)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors" title="Delete">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Logs Drawer */}
      <div 
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[480px] bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_50px_rgba(0,0,0,0.7)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLogsOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}
      >
          <div className="flex justify-between items-center p-5 border-b border-[var(--border-color)]">
             <h3 className="text-[var(--text-main)] font-semibold">View Logs</h3>
             <button onClick={() => setIsLogsOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
             {/* Log Content here (omitted for brevity as it's not the focus) */}
             <div className="text-center text-[var(--text-muted)] text-sm">Logs would be displayed here.</div>
          </div>
      </div>

      {/* Moderation & Reply Drawer */}
      {isModerationDrawerOpen && selectedReview && (
         <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"></div>
      )}
      <div 
        ref={moderationDrawerRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-[600px] bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-20px_0_50px_rgba(0,0,0,0.7)] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isModerationDrawerOpen ? 'translate-x-0' : 'translate-x-[100%]'}`}
      >
          {/* Drawer Header */}
          <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
             <div>
                <h3 className="text-lg font-bold text-[var(--text-main)]">Review Moderation</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Review ID: {selectedReview?.id}</p>
             </div>
             <button onClick={() => setIsModerationDrawerOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)] bg-white/5 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
             
             {/* Original Review Card */}
             <div className="bg-black/5 dark:bg-[#121212] rounded-2xl p-6 border border-[var(--border-color)] shadow-inner space-y-4">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] flex items-center justify-center font-bold">
                         {selectedReview?.customerName.charAt(0)}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-[var(--text-main)]">{selectedReview?.customerName}</p>
                         <p className="text-[11px] font-medium text-[var(--text-muted)]">{selectedReview?.date} • {selectedReview?.source}</p>
                      </div>
                   </div>
                   <div className="flex gap-1 text-[var(--brand-primary)]">
                     {[...Array(5)].map((_, i) => (
                       <svg key={i} className={`w-4 h-4 ${i < (selectedReview?.rating || 0) ? 'fill-current' : 'fill-transparent stroke-current opacity-30'}`} viewBox="0 0 20 20">
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                     ))}
                   </div>
                </div>
                <p className="text-sm text-[var(--text-main)] leading-relaxed italic border-l-2 border-[var(--brand-primary)] pl-4">
                  "{selectedReview?.reviewText}"
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-[var(--border-color)]">
                   <p className="text-xs font-semibold text-[var(--text-muted)]">Product: <span className="text-[var(--text-main)]">{selectedReview?.productName}</span></p>
                   <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(selectedReview?.status || '')}`}>
                     {selectedReview?.status}
                   </span>
                </div>
             </div>

             {/* Moderation Actions */}
             <div className="space-y-6">
                <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-2">
                   <svg className="w-4 h-4 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                   Moderation Desk
                </h4>
                
                {/* Status Update Buttons */}
                <div className="flex gap-3">
                   <button onClick={() => handleUpdateStatus(selectedReview.id, 'Approved')} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors">
                     Approve
                   </button>
                   <button onClick={() => handleUpdateStatus(selectedReview.id, 'Pending')} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 transition-colors">
                     Mark Pending
                   </button>
                   <button onClick={() => handleUpdateStatus(selectedReview.id, 'Disapproved')} className="flex-1 py-2 rounded-xl text-sm font-semibold border border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors">
                     Disapprove
                   </button>
                </div>

                {/* Reaction Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-black/5 dark:bg-[#121212]">
                   <div>
                      <p className="text-sm font-semibold text-[var(--text-main)]">Like this Review</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">Show a heart reaction to the customer</p>
                   </div>
                   <button onClick={() => setIsLiked(!isLiked)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-black/10 dark:bg-white/10 text-[var(--text-muted)] hover:bg-red-500/10 hover:text-red-400'}`}>
                      <svg className={`w-6 h-6 transition-transform ${isLiked ? 'fill-current scale-110' : 'fill-none scale-100'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isLiked ? 0 : 2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                   </button>
                </div>

                {/* Reply Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-[var(--text-main)]">Draft Reply</label>
                      <div className="flex items-center gap-2">
                         <span className={`text-xs font-medium ${isVisibleOnPortal ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'}`}>Visible on Portal</span>
                         <button 
                           onClick={() => setIsVisibleOnPortal(!isVisibleOnPortal)}
                           className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isVisibleOnPortal ? 'bg-[var(--brand-primary)]' : 'bg-[var(--border-color)]'}`}
                         >
                           <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isVisibleOnPortal ? 'translate-x-4' : 'translate-x-1'}`} />
                         </button>
                      </div>
                   </div>
                   <textarea 
                     value={replyText}
                     onChange={(e) => setReplyText(e.target.value)}
                     placeholder={`Hi ${selectedReview?.customerName.split(' ')[0] || 'Customer'}, thank you for your feedback...`} 
                     rows={5} 
                     className="w-full p-4 bg-black/5 dark:bg-[#121212] rounded-xl text-sm text-[var(--text-main)] border border-transparent focus:border-[var(--brand-primary)] outline-none transition-colors shadow-inner resize-none" 
                   />
                </div>
             </div>
          </div>
          
          {/* Drawer Footer Actions */}
          <div className="p-6 border-t border-[var(--border-color)] bg-black/5 dark:bg-white/5 flex gap-4">
             <button onClick={() => setIsModerationDrawerOpen(false)} className="flex-1 px-6 py-3.5 rounded-full text-sm font-medium border border-[var(--border-color)] text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
               Cancel
             </button>
             <button onClick={handlePostReply} disabled={!replyText.trim() && !isLiked} className="flex-1 px-6 py-3.5 bg-[var(--brand-primary)] text-white dark:text-[#121212] rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(var(--brand-primary-rgb),0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all shimmer-hover disabled:opacity-50 disabled:cursor-not-allowed">
               Post Reply
             </button>
          </div>
      </div>

    </div>
  );
}
