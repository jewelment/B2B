'use client';
import React, { useState, useEffect } from 'react';

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch('/api/admin/schemes/withdrawals');
      const data = await res.json();
      if (data.success) {
        setWithdrawals(data.withdrawals);
      }
    } catch (error) {
      console.error("Failed to fetch withdrawals", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async (enrollmentId: string, action: 'APPROVE' | 'REJECT') => {
    if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this withdrawal request?`)) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/schemes/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, action })
      });
      const data = await res.json();
      
      if (data.success) {
        fetchWithdrawals(); // Refresh the list
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (error) {
      alert('Error processing request');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--text-main)] mb-1">Withdrawal Requests</h1>
        <p className="text-[var(--text-muted)] text-sm">Manage early scheme termination requests from customers.</p>
      </div>

      {withdrawals.length === 0 ? (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)] mb-2">No Pending Requests</h3>
          <p className="text-[var(--text-muted)] text-sm max-w-sm mx-auto">You have processed all early withdrawal requests.</p>
        </div>
      ) : (
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Scheme</th>
                <th className="p-4">Started On</th>
                <th className="p-4 text-right">Total Paid (Settlement)</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-sm">
              {withdrawals.map((req) => (
                <tr key={req.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-[var(--text-main)]">{req.client?.name || req.client?.email || 'Unknown Client'}</p>
                    <p className="text-xs text-[var(--text-muted)]">{req.client?.email}</p>
                  </td>
                  <td className="p-4 font-medium text-[var(--text-main)]">{req.scheme?.name}</td>
                  <td className="p-4 text-[var(--text-muted)]">{new Date(req.startDate).toLocaleDateString()}</td>
                  <td className="p-4 text-right font-bold text-[var(--brand-primary)] text-lg">
                    {formatCurrency(req.totalPaid)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleAction(req.id, 'APPROVE')}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 transition-all text-xs font-bold uppercase tracking-wider"
                      >
                        Approve & Settle
                      </button>
                      <button 
                        onClick={() => handleAction(req.id, 'REJECT')}
                        disabled={isProcessing}
                        className="px-3 py-1.5 rounded-full bg-transparent text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all text-xs font-bold uppercase tracking-wider"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
