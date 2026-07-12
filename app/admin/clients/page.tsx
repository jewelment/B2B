'use client';

import React, { useEffect, useState } from 'react';

type Client = {
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  createdAt: string;
};

export default function AdminClientsCRM() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/admin/clients');
      if (res.ok) {
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setClients(data);
        } else if (data && Array.isArray(data.clients)) {
          setClients(data.clients);
        } else if (data && Array.isArray(data.data)) {
          setClients(data.data);
        } else if (data && Array.isArray(data.users)) {
          setClients(data.users);
        } else {
          setClients([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch clients", error);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (userId: string, newStatus: 'PENDING' | 'APPROVED' | 'SUSPENDED') => {
    // Optimistic UI Update for instant feedback
    const previousClients = [...clients];
    setClients(clients.map(client => 
      client.id === userId ? { ...client, status: newStatus } : client
    ));

    try {
      const res = await fetch('/api/admin/clients', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Database update failed');
      }
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert if API fails
      setClients(previousClients);
      alert("Failed to update client status. Please check server logs.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-8 animate-in fade-in duration-700 text-[var(--text-main)] font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-light tracking-tight mb-2 text-[var(--text-main)]">Partner CRM</h1>
          <p className="text-sm text-[var(--text-muted)] font-medium tracking-wide">
            Manage wholesale access requests and triage B2B pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-muted)] shadow-sm">
             Total Records: {clients.length}
           </div>
        </div>
      </div>

      {/* Modern Card Table */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-[var(--bg-base)]/50 border-b border-[var(--border-color)]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em]">Company</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em]">Contact Info</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em]">Applied On</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.15em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center">
                    <div className="flex justify-center items-center gap-3 text-[var(--text-muted)]">
                       <div className="w-5 h-5 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-xs font-bold uppercase tracking-widest">Syncing Database...</span>
                    </div>
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-[var(--text-muted)]">
                    <span className="text-sm font-medium">No wholesale accounts found in the pipeline.</span>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[var(--bg-base)]/50 transition-colors duration-200 group">
                    <td className="px-8 py-6">
                      <span className="font-semibold text-[var(--text-main)] text-sm tracking-wide">{client.companyName}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-[var(--text-main)] text-sm">{client.email}</span>
                        <span className="text-[var(--text-muted)] text-[11px] font-mono">{client.phone || 'NO PHONE PROVIDED'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[var(--text-muted)] text-xs font-medium">
                        {new Date(client.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {/* Modern Pill Badges */}
                      <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full border ${
                        client.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                        client.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                        'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      }`}>
                        {client.status === 'PENDING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>}
                        {client.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {/* Fixed Action Logic */}
                      <div className="flex justify-end items-center gap-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                        
                        {client.status === 'PENDING' && (
                          <button 
                            onClick={() => updateStatus(client.id, 'APPROVED')}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm transition-all active:scale-95"
                          >
                            Approve Access
                          </button>
                        )}
                        
                        {client.status === 'APPROVED' && (
                          <button 
                            onClick={() => updateStatus(client.id, 'SUSPENDED')}
                            className="px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] hover:border-amber-500/30 hover:bg-amber-500/5 text-[var(--text-muted)] hover:text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95"
                          >
                            Suspend
                          </button>
                        )}
                        
                        {client.status === 'SUSPENDED' && (
                          <button 
                            onClick={() => updateStatus(client.id, 'APPROVED')}
                            className="px-4 py-2 bg-[var(--brand-primary)] hover:opacity-90 text-[var(--brand-text)] text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm transition-all active:scale-95"
                          >
                            Reactivate
                          </button>
                        )}
                        
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}