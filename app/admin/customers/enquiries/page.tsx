'use client';

import React, { useState } from 'react';
import { ViewLogsDrawer, LogEntry } from '@/components/ui/ViewLogsDrawer';

// --- Types & Mock Data ---
type Enquiry = {
  id: string;
  createdOn: string;
  time: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  subject: string;
  message: string;
  // Specific to Appointments
  productName?: string;
  productSku?: string;
  productImage?: string;
  // Specific to Leads
  city?: string;
  pincode?: string;
};

const mockEnquiries: Record<string, Enquiry[]> = {
  Support: [
    { id: '#ENQ-0125049', createdOn: 'Jan 6th', time: '12:07pm', customerName: 'Sunita', customerEmail: 'suneeta.sweet123@gmail.com', customerPhone: '9891944635', subject: 'N/A', message: 'When will I get refund ?' },
    { id: '#ENQ-0123752', createdOn: 'Jan 2nd', time: '12:53am', customerName: 'Jiaur Rahman RAHMAN', subject: 'N/A', message: 'My order till now not delivered' },
    { id: '#ENQ-0123411', createdOn: 'Dec 31st', time: '08:54pm', customerName: 'Pranshu Kapoor Kapoor', subject: 'N/A', message: 'We order mangalsutra through online mode , which was delivered to sector 14 Vegas mall. Today, when we went to pick up the delivery from the Vegas mall store , the product had defect...' },
  ],
  Appointment: [
    { id: '#APT-0002118', createdOn: '15-07-2026', time: '', customerName: 'Pavani', customerPhone: '+91-7981022820', productName: 'Thomas Diamond Band For Him', productSku: 'W90024G', subject: 'Video Call', message: 'N/A' },
    { id: '#APT-0002117', createdOn: '14-07-2026', time: '', customerName: 'Naveena R', customerPhone: '+91-9866904451', productName: 'Blooming Grace Diamond Mangalsutra Pendant', productSku: 'KFTN70089', subject: 'Video Call', message: 'N/A' },
  ],
  Lead: [
    { id: '#LEAD-0219983', createdOn: '15-07-2026', time: '11:08 AM', customerName: 'Priyanka Boruah', customerPhone: '+91-9520208267', city: 'Dibrugarh', pincode: '786005', subject: 'N/A', message: 'N/A' },
    { id: '#LEAD-0219982', createdOn: '15-07-2026', time: '10:56 AM', customerName: 'Monalisa', customerPhone: '+91-8093416760', city: 'Bhubaneswar', pincode: '751024', subject: 'N/A', message: 'N/A' },
    { id: '#LEAD-0219981', createdOn: '15-07-2026', time: '10:48 AM', customerName: 'Shruti Kumari', customerPhone: '+91-8102199952', city: 'Bokaro', pincode: '827004', subject: 'N/A', message: 'N/A' },
  ]
};

// --- View Details Modal Component ---
const EnquiryDetailsModal = ({ isOpen, onClose, enquiry }: { isOpen: boolean, onClose: () => void, enquiry: Enquiry | null }) => {
  if (!isOpen || !enquiry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border-color)] w-full max-w-[500px] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">Enquiry ID: {enquiry.id}</h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">{enquiry.createdOn}, at {enquiry.time}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
            <span className="text-[var(--text-muted)]">Subject</span>
            <span className="text-[var(--text-main)] font-medium">{enquiry.subject}</span>
          </div>
          
          <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-start">
            <span className="text-[var(--text-muted)]">Message</span>
            <span className="text-[var(--text-main)] leading-relaxed">{enquiry.message}</span>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-center">
            <span className="text-[var(--text-muted)] flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
              Images
            </span>
            <a href="#" className="text-[var(--brand-primary)] hover:underline font-medium">Image 1</a>
          </div>

          <div className="h-px w-full bg-[var(--border-color)] my-2" />

          <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-center">
            <span className="text-[var(--text-muted)]">Customer</span>
            <span className="text-[var(--text-main)] font-medium">{enquiry.customerName}</span>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-center">
            <span className="text-[var(--text-muted)]">Email</span>
            <span className="text-[var(--text-main)]">{enquiry.customerEmail || 'N/A'}</span>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4 text-sm items-center">
            <span className="text-[var(--text-muted)]">Phone</span>
            <span className="text-[var(--text-main)]">{enquiry.customerPhone || 'N/A'}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 rounded-full bg-black/10 dark:bg-white/10 text-[var(--text-main)] text-sm font-medium hover:bg-black/20 dark:hover:bg-white/20 transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function EnquiriesPage() {
  const tabs = ['Support', 'Help & FAQ', 'Contact Support', 'Newsletter', 'Appointment', 'Return/Exchange', 'Cancel Requests', 'Lead'];
  const [activeTab, setActiveTab] = useState('Support');
  
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const currentData = mockEnquiries[activeTab] || [];

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">Enquiries</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsLogsOpen(true)} className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide">
            View Logs
          </button>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-transparent hover:border-[var(--border-color)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide">
            Import
          </button>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--bg-surface)] text-[var(--text-main)] border border-[var(--border-color)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all shadow-sm shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
            Export
          </button>
          <button className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide">
            <span className="relative z-10">Subject Settings</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden min-h-[700px] flex flex-col">
        
        {/* Scrollable Tabs */}
        <div className="flex overflow-x-auto custom-scrollbar px-2 pt-2 border-b border-[var(--border-color)] bg-black/5 dark:bg-black/20">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-[13px] font-bold tracking-wide whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-primary)] dark:shadow-[0_0_8px_var(--brand-primary)]" />}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-surface)]">
          <div className="flex items-center gap-2 bg-[var(--bg-base)] rounded-lg px-4 py-2 border border-[var(--border-color)] focus-within:border-[var(--brand-primary)] transition-colors w-72 shadow-inner">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search..." className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" />
          </div>
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm font-medium cursor-pointer hover:text-[var(--text-main)] transition-colors">
             <span>Sort</span>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
          </div>
        </div>

        {/* Data Grid */}
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-black/5 dark:bg-black/20 border-b border-[var(--border-color)]">
              <tr>
                {/* Dynamic Columns based on active tab */}
                {activeTab === 'Lead' ? (
                  <>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">CREATED ON</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">CUSTOMER</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">CITY</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">PINCODE</th>
                  </>
                ) : activeTab === 'Appointment' ? (
                  <>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider w-32">ENQUIRY ID</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">CREATED ON ↓</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">PRODUCT</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">CUSTOMER</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">SUBJECT</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">MESSAGE</th>
                  </>
                ) : (
                  <>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider w-32">ENQUIRY ID</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">CREATED ON ↓</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">CUSTOMER</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider w-40">SUBJECT</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">MESSAGE</th>
                  </>
                )}
                <th className="py-4 px-6 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[var(--text-muted)]">
                    No enquiries found in {activeTab}.
                  </td>
                </tr>
              ) : (
                currentData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                    
                    {/* ID (if applicable) */}
                    {activeTab !== 'Lead' && (
                       <td className="py-4 px-6 text-[13px] font-semibold text-[var(--brand-primary)] whitespace-nowrap">
                         {row.id}
                       </td>
                    )}

                    {/* Created On */}
                    <td className="py-4 px-6">
                       <p className="text-[13px] font-bold text-[var(--text-main)]">{row.createdOn}</p>
                       {row.time && <p className="text-[11px] text-[var(--text-muted)] mt-0.5">at {row.time}</p>}
                    </td>

                    {/* Product (Appointment only) */}
                    {activeTab === 'Appointment' && (
                       <td className="py-4 px-6">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded bg-white flex items-center justify-center shrink-0">
                             {/* Placeholder ring icon */}
                             <div className="w-6 h-6 rounded-full border-2 border-amber-300"></div>
                           </div>
                           <div>
                             <p className="text-[12px] font-bold text-[var(--text-main)] leading-tight">{row.productName}</p>
                             <p className="text-[10px] text-[var(--text-muted)] mt-0.5">SKU: {row.productSku}</p>
                           </div>
                         </div>
                       </td>
                    )}

                    {/* Customer Info */}
                    <td className="py-4 px-6">
                       <p className="text-[13px] font-medium text-[var(--brand-primary)] hover:underline cursor-pointer">{row.customerName}</p>
                       {row.customerPhone && <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{row.customerPhone}</p>}
                    </td>

                    {/* Lead specific Columns */}
                    {activeTab === 'Lead' && (
                       <>
                         <td className="py-4 px-6 text-[13px] text-[var(--text-main)]">{row.city}</td>
                         <td className="py-4 px-6 text-[13px] text-[var(--text-main)]">{row.pincode}</td>
                       </>
                    )}

                    {/* Subject & Message (if applicable) */}
                    {activeTab !== 'Lead' && (
                       <>
                         <td className="py-4 px-6 text-[13px] text-[var(--text-main)]">{row.subject}</td>
                         <td className="py-4 px-6 text-[13px] text-[var(--text-main)]">
                           <p className="line-clamp-2 pr-8">{row.message}</p>
                         </td>
                       </>
                    )}

                    {/* Action Eye Icon */}
                    <td className="py-4 px-6 text-right">
                       <button 
                         onClick={() => setSelectedEnquiry(row)}
                         className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ViewLogsDrawer 
        isOpen={isLogsOpen} 
        onClose={() => setIsLogsOpen(false)} 
        moduleName={`Enquiries - ${activeTab}`} 
        logs={[]} 
      />

      <EnquiryDetailsModal 
        isOpen={selectedEnquiry !== null}
        onClose={() => setSelectedEnquiry(null)}
        enquiry={selectedEnquiry}
      />

    </div>
  );
}
