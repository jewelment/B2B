'use client';

import React, { useState, useEffect } from 'react';
import { ViewLogsDrawer, LogEntry } from '@/components/ui/ViewLogsDrawer';
import { CustomerProfileDrawer, CustomerProfile } from '@/components/ui/CustomerProfileDrawer';

import { CustomDropdown } from '@/components/ui/CustomDropdown';

// --- Create Customer Modal ---
const CreateCustomerModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [customerType, setCustomerType] = useState('B2B Wholesale');
  const [policy, setPolicy] = useState('No Policy Assigned');
  const [gender, setGender] = useState('Not Specified');
  const [maritalStatus, setMaritalStatus] = useState('Not Specified');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="relative bg-[var(--bg-surface)] border border-[var(--border-color)] w-full max-w-[600px] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--text-main)]">Create New Customer</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-red-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Full Name</label>
              <input type="text" className="w-full bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" placeholder="e.g. Rahul Sharma" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Email ID</label>
              <input type="email" className="w-full bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" placeholder="rahul@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Phone</label>
              <input type="text" className="w-full bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" placeholder="+91" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Date of Birth</label>
              <input type="date" className="w-full bg-black/5 dark:bg-black/20 border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--brand-primary)] transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="col-span-1">
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Customer Type</label>
                <CustomDropdown label="" options={['B2B Wholesale', 'B2C Retail', 'Both']} value={customerType} onChange={setCustomerType} />
             </div>
             <div className="col-span-1">
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Gender</label>
                <CustomDropdown label="" options={['Male', 'Female', 'Not Specified']} value={gender} onChange={setGender} />
             </div>
             <div className="col-span-1">
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Marital Status</label>
                <CustomDropdown label="" options={['Single', 'Married', 'Not Specified']} value={maritalStatus} onChange={setMaritalStatus} />
             </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 mt-4">Assign to Policy (User Group)</label>
            <div className="w-full">
              <CustomDropdown 
                label="Policy" 
                options={['No Policy Assigned', 'VIP Wholesalers (Active)', 'Bridal Segment (South) (Active)']} 
                value={policy} 
                onChange={setPolicy} 
              />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-2">Assigning a policy will automatically apply demographic constraints and segment this user.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full bg-black/10 dark:bg-white/10 text-[var(--text-main)] text-sm font-medium hover:bg-black/20 dark:hover:bg-white/20 transition-colors">Cancel</button>
          <button onClick={onClose} className="px-6 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] text-sm font-bold shadow-lg shadow-[var(--brand-primary)]/20 hover:scale-105 transition-all shimmer-hover overflow-hidden">
            <span className="relative z-10">Create Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
};


export default function AllCustomersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Active', 'In-Active', 'Archived', 'Blacklisted'];

  // Filters
  const [location, setLocation] = useState('All');
  const [orders, setOrders] = useState('Any');
  const [spent, setSpent] = useState('Any');
  const [status, setStatus] = useState('Any');
  const [customerType, setCustomerType] = useState('All Types');
  const [sort, setSort] = useState('Newest');

  const [isLoading, setIsLoading] = useState(true);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Profile Drawer State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  // Mock Logs for View Logs Drawer
  const mockLogs: LogEntry[] = [
    { id: '1', user: 'Admin System', initials: 'AS', avatarColor: 'bg-emerald-500/20 text-emerald-500', activity: 'Created new B2B profile for Jewelers Hub.', date: '21-07-2026', time: '14:20 pm' },
    { id: '2', user: 'Vijay Yadav', initials: 'VY', avatarColor: 'bg-purple-500/20 text-purple-500', activity: 'Suspended B2C customer account (Fraud flagged).', date: '20-07-2026', time: '09:15 am' }
  ];

  const mockCustomers: CustomerProfile[] = [
    { id: 'CUST-101', name: 'Ashok Kumar', email: 'ashok.kumar@example.com', phone: '+91 98765 43210', alternatePhone: '+91 88888 77777', type: 'B2B Wholesale', dob: '12-05-1985', gender: 'Male', maritalStatus: 'Married', policy: 'VIP Wholesalers', totalSpent: '₹ 45,20,000', totalOrders: 124, status: 'Active', isRegisteredAccount: true },
    { id: 'CUST-102', name: 'Suhana Reddy', email: 'suhana.r@example.com', phone: '+91 87654 32109', type: 'B2C Retail', dob: '23-08-1992', gender: 'Female', maritalStatus: 'Single', policy: 'Bridal Segment (South)', totalSpent: '₹ 2,15,000', totalOrders: 3, status: 'Active', isRegisteredAccount: false },
    { id: 'CUST-103', name: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', phone: '+91 76543 21098', type: 'B2B Wholesale', dob: '05-11-1978', gender: 'Male', maritalStatus: 'Married', policy: '', totalSpent: '₹ 12,50,000', totalOrders: 45, status: 'In-Active', isRegisteredAccount: false },
  ];

  const filteredCustomers = mockCustomers.filter(cust => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return cust.status === 'Active';
    if (activeTab === 'In-Active') return cust.status === 'In-Active';
    if (activeTab === 'Archived' || activeTab === 'Blacklisted') return false; 
    return true;
  });

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 min-h-screen">
      
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">All Customers</h1>
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
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide"
          >
            <span className="relative z-10">+ Add New</span>
          </button>
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        
        {/* Tabs & Country Flag */}
        <div className="flex justify-between items-end px-6 pt-4 border-b border-[var(--border-color)]">
          <div className="flex gap-8">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-primary)] rounded-t-full dark:shadow-[0_0_8px_var(--brand-primary)]" />}
              </button>
            ))}
          </div>
          <div className="pb-3 flex items-center gap-2 text-sm text-[var(--text-main)] font-medium">
            <span>🇮🇳</span> India
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex justify-between items-center gap-4 bg-black/5 dark:bg-black/20 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2 bg-[var(--bg-base)] rounded-lg px-4 py-2 border border-[var(--border-color)] focus-within:border-[var(--brand-primary)] transition-colors w-72 shrink-0">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Search..." className="bg-transparent text-sm w-full outline-none text-[var(--text-main)] placeholder-[var(--text-muted)]" />
          </div>
          
          <div className="flex gap-3 flex-nowrap">
            <CustomDropdown label="Type" options={['All Types', 'B2B', 'B2C']} value={customerType} onChange={setCustomerType} />
            <CustomDropdown label="Location" options={['All', 'Mumbai', 'Delhi', 'Surat']} value={location} onChange={setLocation} />
            <CustomDropdown label="No of Orders" options={['Any', '0', '1-5', '5+']} value={orders} onChange={setOrders} />
            <CustomDropdown label="Total Spent" options={['Any', '< ₹50k', '₹50k - ₹1L', '> ₹1L']} value={spent} onChange={setSpent} />
            <CustomDropdown label="Status" options={['Any', 'Active', 'In-Active']} value={status} onChange={setStatus} />
            <CustomDropdown label="Sort" options={['Newest', 'Oldest', 'Highest Spent']} value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Data Grid */}
        <div className="flex-1 overflow-x-auto">
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center text-[var(--text-muted)] animate-in fade-in duration-500">
               <div className="w-8 h-8 border-4 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-sm font-medium">Loading Customers...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-black/5 dark:bg-black/20 text-xs uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Orders</th>
                  <th className="px-6 py-4 font-bold">Total Spent</th>
                  <th className="px-6 py-4 font-bold">Policy</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-muted)] italic">No customers found in this category.</td>
                  </tr>
                ) : filteredCustomers.map((cust) => (
                  <tr 
                    key={cust.id} 
                    onClick={() => setSelectedCustomer(cust)}
                    className="border-b border-[var(--border-color)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] flex items-center justify-center font-bold text-xs border border-[var(--brand-primary)]/30 group-hover:scale-110 transition-transform">
                            {cust.name.substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                            <p className="font-bold text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">{cust.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">{cust.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--text-muted)]">{cust.type}</td>
                    <td className="px-6 py-4 font-bold text-[var(--text-main)]">{cust.totalOrders}</td>
                    <td className="px-6 py-4 font-bold text-[var(--text-main)]">{cust.totalSpent}</td>
                    <td className="px-6 py-4">
                      {cust.policy ? (
                        <span className="px-2 py-1 rounded text-xs font-bold bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30">{cust.policy}</span>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${cust.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                        {cust.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      <ViewLogsDrawer 
        isOpen={isLogsOpen} 
        onClose={() => setIsLogsOpen(false)} 
        moduleName="All Customers" 
        logs={mockLogs} 
      />

      <CustomerProfileDrawer 
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      />

      <CreateCustomerModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}
