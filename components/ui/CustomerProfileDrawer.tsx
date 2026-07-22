'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  type: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  policy: string;
  totalSpent: string;
  totalOrders: number;
  status: string;
  isRegisteredAccount?: boolean;
}

const PillSelector = ({ options, value, onChange }: { options: string[], value: string, onChange: (val: string) => void }) => (
  <div className="flex gap-1 bg-black/5 dark:bg-[#121212] p-1 rounded-xl border border-[var(--border-color)]">
    {options.map(opt => (
      <button 
        key={opt}
        onClick={() => onChange(opt)}
        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${value === opt ? 'bg-[var(--brand-primary)] text-[var(--brand-text)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/10 dark:hover:bg-white/5'}`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export const CustomerProfileDrawer = ({ 
  isOpen, 
  onClose, 
  customer 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  customer: CustomerProfile | null;
}) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditing, setIsEditing] = useState(false);

  // Edit Form States (Mocked)
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAltPhone, setEditAltPhone] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editMarital, setEditMarital] = useState('');
  const [editDob, setEditDob] = useState('');

  // Initialize edit state when toggling
  const handleToggleEdit = () => {
    if (customer && !isEditing) {
      setEditName(customer.name);
      setEditEmail(customer.email);
      setEditPhone(customer.phone);
      setEditAltPhone(customer.alternatePhone || '');
      setEditGender(customer.gender);
      setEditMarital(customer.maritalStatus);
      
      // Convert DD-MM-YYYY to YYYY-MM-DD for standard date input
      try {
         const parts = customer.dob.split('-');
         if (parts.length === 3) {
            setEditDob(`${parts[2]}-${parts[1]}-${parts[0]}`);
         } else {
            setEditDob('');
         }
      } catch (e) {
         setEditDob('');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  if (!isOpen || !customer) return null;

  const mockOrders = [
    { id: 'ORD-8921', date: '21-07-2026', total: '₹ 1,42,000', items: 3, status: 'Delivered' },
    { id: 'ORD-8810', date: '15-06-2026', total: '₹ 45,500', items: 1, status: 'Returned' },
    { id: 'ORD-8705', date: '10-05-2026', total: '₹ 2,10,000', items: 5, status: 'Delivered' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div 
        className="absolute inset-0" 
        onClick={handleClose}
      />
      <div className="relative w-full max-w-[600px] h-full bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-[-20px_0_50px_rgba(0,0,0,0.7)] animate-in slide-in-from-right duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-start bg-black/5 dark:bg-black/20">
          {!isEditing ? (
            <div className="flex gap-4 items-center animate-in fade-in zoom-in-95">
              <div className="relative group w-16 h-16 rounded-full bg-black/10 dark:bg-white/5 flex items-center justify-center text-2xl font-bold border-2 border-[var(--brand-primary)]/30 overflow-hidden cursor-pointer" onClick={handleToggleEdit}>
                {customer.gender === 'Male' ? (
                  <svg viewBox="0 0 64 64" className="w-10 h-10 text-[var(--brand-primary)]/70" fill="currentColor"><path d="M32 35.8c7.4 0 13.4-6 13.4-13.4S39.4 9 32 9s-13.4 6-13.4 13.4S24.6 35.8 32 35.8zm0-22.8c5.2 0 9.4 4.2 9.4 9.4s-4.2 9.4-9.4 9.4-9.4-4.2-9.4-9.4 4.2-9.4 9.4-9.4zM45.5 39.5c-3.8-1.5-8.5-2.2-13.5-2.2s-9.7.7-13.5 2.2C13.2 41.5 10 46 10 51v4h44v-4c0-5-3.2-9.5-8.5-11.5z"/></svg>
                ) : customer.gender === 'Female' ? (
                  <svg viewBox="0 0 64 64" className="w-10 h-10 text-[var(--brand-primary)]/70" fill="currentColor"><path d="M32 35.8c7.4 0 13.4-6 13.4-13.4S39.4 9 32 9s-13.4 6-13.4 13.4S24.6 35.8 32 35.8zm0-22.8c5.2 0 9.4 4.2 9.4 9.4s-4.2 9.4-9.4 9.4-9.4-4.2-9.4-9.4 4.2-9.4 9.4-9.4zM53.1 55l-3.3-17c-1-5.1-4.7-9.5-9.6-11.4-2.5-1-5.3-1.6-8.2-1.6s-5.7.5-8.2 1.6c-4.9 1.9-8.6 6.3-9.6 11.4l-3.3 17H53.1z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-[var(--brand-primary)]/70" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                )}
                
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-[8px] font-bold text-white tracking-wider uppercase">Edit DP</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-main)]">{customer.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-[var(--text-muted)]">{customer.email}</span>
                  <span className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${customer.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                    {customer.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-500">
                    {customer.type}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4">
              <button onClick={handleToggleEdit} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--brand-primary)]/10 hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">Edit Profile</h2>
                <p className="text-[var(--text-muted)] mt-1 text-sm">Update customer details and demographics.</p>
              </div>
            </div>
          )}
          <button onClick={handleClose} className="p-2 text-[var(--text-muted)] hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* View Mode */}
        {!isEditing && (
          <>
            <div className="flex px-6 border-b border-[var(--border-color)] animate-in fade-in">
              {['Overview', 'Order History', 'Activity Logs'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 text-sm font-bold relative transition-colors ${activeTab === tab ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-primary)] shadow-[0_0_8px_var(--brand-primary)]" />}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {activeTab === 'Overview' && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/5 dark:bg-[#121212] rounded-xl border border-[var(--border-color)]">
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Total Lifetime Spent</p>
                      <p className="text-xl font-bold text-[var(--text-main)]">{customer.totalSpent}</p>
                    </div>
                    <div className="p-4 bg-black/5 dark:bg-[#121212] rounded-xl border border-[var(--border-color)]">
                      <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Total Orders</p>
                      <p className="text-xl font-bold text-[var(--text-main)]">{customer.totalOrders}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)] mb-4 border-b border-[var(--border-color)] pb-2">Demographic Profile</h3>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)]">Date of Birth</p>
                        <p className="text-sm font-medium text-[var(--text-main)] mt-1">{customer.dob}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)]">Gender</p>
                        <p className="text-sm font-medium text-[var(--text-main)] mt-1">{customer.gender}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)]">Marital Status</p>
                        <p className="text-sm font-medium text-[var(--text-main)] mt-1">{customer.maritalStatus}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-muted)]">Contact Phone</p>
                        <p className="text-sm font-medium text-[var(--text-main)] mt-1">{customer.phone}</p>
                      </div>
                      {customer.alternatePhone && (
                        <div>
                          <p className="text-xs font-bold text-[var(--text-muted)]">Alternate Phone</p>
                          <p className="text-sm font-medium text-[var(--text-main)] mt-1">{customer.alternatePhone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)] mb-4 border-b border-[var(--border-color)] pb-2">Active Policy Rules (User Group)</h3>
                    {customer.policy ? (
                      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--brand-primary)]/30 bg-[var(--brand-primary)]/5">
                        <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse"></span>
                        <span className="text-sm font-bold text-[var(--text-main)]">{customer.policy}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--text-muted)] italic">No specific policy rules assigned.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Order History' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {mockOrders.map(order => (
                    <Link key={order.id} href={`/admin/orders/${order.id}`} className="block p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--brand-primary)] transition-colors group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">{order.id}</h4>
                          <p className="text-xs font-medium text-[var(--text-muted)]">{order.date}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-end border-t border-[var(--border-color)] pt-3">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Total Amount</p>
                          <p className="text-sm font-bold text-[var(--text-main)]">{order.total} ({order.items} items)</p>
                        </div>
                        <button className="text-xs font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] flex items-center gap-1 group-hover:underline" onClick={(e) => e.preventDefault()}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download Invoice
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {activeTab === 'Activity Logs' && (
                <div className="relative pl-6 border-l-2 border-[var(--border-color)] space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--brand-primary)]" />
                    <p className="text-xs font-bold text-[var(--brand-primary)] mb-1">Today, 10:30 AM</p>
                    <div className="p-3 rounded-lg border border-[var(--border-color)] bg-black/5 dark:bg-[#121212]">
                      <p className="text-sm text-[var(--text-main)]">Customer updated their shipping address.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)]" />
                    <p className="text-xs font-bold text-[var(--text-muted)] mb-1">21-07-2026, 14:20 PM</p>
                    <div className="p-3 rounded-lg border border-[var(--border-color)] bg-black/5 dark:bg-[#121212]">
                      <p className="text-sm text-[var(--text-main)]">Placed order ORD-8921 for ₹ 1,42,000.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-color)]" />
                    <p className="text-xs font-bold text-[var(--text-muted)] mb-1">15-06-2026, 09:15 AM</p>
                    <div className="p-3 rounded-lg border border-[var(--border-color)] bg-black/5 dark:bg-[#121212]">
                      <p className="text-sm text-[var(--text-main)]">Initiated return for order ORD-8810.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] font-bold shadow-lg shadow-[var(--brand-primary)]/20 hover:scale-[1.02] transition-all shimmer-hover overflow-hidden">
                <span className="relative z-10">Send Notification</span>
              </button>
              <button onClick={handleToggleEdit} className="px-6 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[var(--text-main)] font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                Edit Profile
              </button>
            </div>
          </>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[var(--bg-surface)] animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-6 space-y-8 flex-1">
              
              {/* DP Editor */}
              <div className="flex flex-col items-center">
                <div className="relative group w-24 h-24 rounded-full bg-black/10 dark:bg-white/5 flex items-center justify-center text-4xl font-bold border-2 border-[var(--brand-primary)]/30 overflow-hidden cursor-pointer shadow-xl">
                  {customer.gender === 'Male' ? (
                    <svg viewBox="0 0 64 64" className="w-16 h-16 text-[var(--brand-primary)]/70" fill="currentColor"><path d="M32 35.8c7.4 0 13.4-6 13.4-13.4S39.4 9 32 9s-13.4 6-13.4 13.4S24.6 35.8 32 35.8zm0-22.8c5.2 0 9.4 4.2 9.4 9.4s-4.2 9.4-9.4 9.4-9.4-4.2-9.4-9.4 4.2-9.4 9.4-9.4zM45.5 39.5c-3.8-1.5-8.5-2.2-13.5-2.2s-9.7.7-13.5 2.2C13.2 41.5 10 46 10 51v4h44v-4c0-5-3.2-9.5-8.5-11.5z"/></svg>
                  ) : customer.gender === 'Female' ? (
                    <svg viewBox="0 0 64 64" className="w-16 h-16 text-[var(--brand-primary)]/70" fill="currentColor"><path d="M32 35.8c7.4 0 13.4-6 13.4-13.4S39.4 9 32 9s-13.4 6-13.4 13.4S24.6 35.8 32 35.8zm0-22.8c5.2 0 9.4 4.2 9.4 9.4s-4.2 9.4-9.4 9.4-9.4-4.2-9.4-9.4 4.2-9.4 9.4-9.4zM53.1 55l-3.3-17c-1-5.1-4.7-9.5-9.6-11.4-2.5-1-5.3-1.6-8.2-1.6s-5.7.5-8.2 1.6c-4.9 1.9-8.6 6.3-9.6 11.4l-3.3 17H53.1z"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-16 h-16 text-[var(--brand-primary)]/70" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[10px] font-bold text-white tracking-wider uppercase">Upload Photo</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-3">Click to crop or upload image</p>
              </div>

              {/* Form Grid */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex justify-between">
                    <span>Email Address</span>
                    {customer.isRegisteredAccount && <span className="text-amber-500 font-bold">Linked Account</span>}
                  </label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={e => setEditEmail(e.target.value)} 
                    disabled={customer.isRegisteredAccount}
                    className={`w-full border rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none transition-colors ${customer.isRegisteredAccount ? 'bg-black/10 dark:bg-black/40 border-[var(--border-color)] opacity-70 cursor-not-allowed' : 'bg-black/5 dark:bg-[#121212] border-[var(--border-color)] focus:border-[var(--brand-primary)]'}`} 
                  />
                  {customer.isRegisteredAccount && <p className="text-[10px] text-[var(--text-muted)] mt-1.5">This email is verified and linked to a Google SSO login. It cannot be changed.</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Contact Phone</label>
                    <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Alternate Phone</label>
                    <input type="text" value={editAltPhone} onChange={e => setEditAltPhone(e.target.value)} placeholder="e.g. Office line" className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Date of Birth</label>
                    {/* Themed HTML5 Date Input */}
                    <div className="relative border border-[var(--border-color)] rounded-xl bg-black/5 dark:bg-[#121212] focus-within:border-[var(--brand-primary)] transition-colors overflow-hidden flex items-center pr-3">
                      <input 
                        type="date" 
                        value={editDob} 
                        onChange={e => setEditDob(e.target.value)} 
                        className="w-full bg-transparent px-4 py-3 text-sm text-[var(--text-main)] outline-none appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                      />
                      <svg className="w-5 h-5 text-[var(--text-muted)] pointer-events-none absolute right-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Gender</label>
                    <PillSelector options={['Male', 'Female', 'Other']} value={editGender} onChange={setEditGender} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Marital Status</label>
                    <div className="w-1/2 pr-3">
                       <PillSelector options={['Single', 'Married', 'Other']} value={editMarital} onChange={setEditMarital} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-surface)] flex justify-end gap-3">
              <button onClick={handleToggleEdit} className="px-6 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[var(--text-main)] font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button onClick={handleToggleEdit} className="px-8 py-3 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-text)] font-bold shadow-lg shadow-[var(--brand-primary)]/20 hover:scale-[1.02] transition-all shimmer-hover overflow-hidden">
                <span className="relative z-10">Save Changes</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
