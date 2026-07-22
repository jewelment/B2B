'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerSchemeDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState<any>(null); // holds installment data for receipt

  const fetchEnrollment = async () => {
    try {
      const res = await fetch('/api/customer/schemes');
      const data = await res.json();
      if (data.success) {
        const found = data.enrollments.find((e: any) => e.id === params.id);
        setEnrollment(found);
      }
    } catch (error) {
      console.error("Failed to fetch enrollment", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollment();
  }, [params.id]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const handlePayInstallment = async (installmentId: string) => {
    setIsProcessing(true);
    try {
      // Simulate Payment Gateway Delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await fetch(`/api/customer/schemes/${params.id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installmentId })
      });
      const data = await res.json();
      
      if (data.success) {
        // Find the installment to show receipt
        const inst = enrollment.installments.find((i: any) => i.id === installmentId);
        setShowReceipt({ ...inst, amount: enrollment.monthlyInstallment });
        fetchEnrollment(); // Refresh data
      } else {
        alert(data.error || 'Payment failed');
      }
    } catch (error) {
      alert('Error processing payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdrawal = async () => {
    const confirm = window.confirm(
      "WARNING: By requesting an early withdrawal, you will only receive the exact amount you have paid. You will forfeit ALL bonus benefits and gold rate returns. Do you wish to proceed?"
    );
    if (!confirm) return;

    setIsProcessing(true);
    try {
      const res = await fetch(`/api/customer/schemes/${params.id}/withdraw`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        alert('Withdrawal request submitted successfully. Our team will contact you shortly.');
        fetchEnrollment();
      } else {
        alert(data.error || 'Failed to request withdrawal');
      }
    } catch (error) {
      alert('Error requesting withdrawal');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!enrollment) {
    return <div className="p-8 text-center text-[var(--text-muted)]">Enrollment not found.</div>;
  }

  const isFrozen = enrollment.status === 'WITHDRAWAL_REQUESTED' || enrollment.status === 'CLOSED';

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-700 relative pb-32">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <button onClick={() => router.push('/dashboard/schemes')} className="text-[var(--brand-primary)] text-sm font-bold flex items-center gap-2 mb-4 hover:underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Plans
          </button>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] mb-2">{enrollment.scheme.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-[var(--text-muted)] text-sm">Started {new Date(enrollment.startDate).toLocaleDateString()}</span>
            {enrollment.status === 'ACTIVE' && <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">Active</span>}
            {enrollment.status === 'WITHDRAWAL_REQUESTED' && <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-orange-500/20">Withdrawal Requested</span>}
            {enrollment.status === 'CLOSED' && <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-500/20">Closed</span>}
          </div>
        </div>
        
        {!isFrozen && (
          <button 
            onClick={handleWithdrawal}
            disabled={isProcessing}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-transparent text-[var(--text-muted)] border border-[var(--border-color)] hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all shadow-none text-xs font-bold uppercase tracking-wide"
          >
            Request Early Withdrawal
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Monthly Installment</p>
          <p className="text-2xl font-bold text-[var(--text-main)]">{formatCurrency(enrollment.monthlyInstallment)}</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Total Paid</p>
          <p className="text-2xl font-bold text-[var(--brand-primary)]">{formatCurrency(enrollment.totalPaid)}</p>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Bonus Expected</p>
          <p className="text-2xl font-bold text-[var(--text-main)]">{formatCurrency(enrollment.monthlyInstallment * enrollment.scheme.bonusInstallments)}</p>
        </div>
      </div>

      {/* Timeline */}
      <h2 className="text-xl font-bold text-[var(--text-main)] mb-6 pb-4 border-b border-[var(--border-color)]">Payment Timeline</h2>
      
      <div className="space-y-4">
        {enrollment.installments.map((inst: any, index: number) => {
          const isPaid = inst.status === 'PAID';
          const isPending = inst.status === 'PENDING';
          const isOverdue = inst.status === 'OVERDUE';
          const isBonus = inst.status === 'BONUS';
          
          return (
            <div key={inst.id} className={`flex items-center justify-between p-5 rounded-2xl border ${isPaid ? 'bg-green-500/5 border-green-500/20' : 'bg-[var(--bg-surface)] border-[var(--border-color)]'} transition-colors`}>
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${isPaid ? 'bg-green-500/20 text-green-500' : isBonus ? 'bg-[var(--brand-primary)]/20 text-[var(--brand-primary)]' : 'bg-black/10 dark:bg-white/5 text-[var(--text-muted)]'}`}>
                  {isBonus ? '★' : `${inst.monthNumber}`}
                </div>
                <div>
                  <p className="font-bold text-[var(--text-main)]">{isBonus ? 'Bonus Installment' : `Installment ${inst.monthNumber}`}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {isBonus ? 'Credited at maturity' : `Due by ${new Date(inst.dueDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className={`font-bold ${isPaid ? 'text-green-500' : isBonus ? 'text-[var(--brand-primary)]' : 'text-[var(--text-main)]'}`}>
                    {formatCurrency(enrollment.monthlyInstallment)}
                  </p>
                  {isPaid && <p className="text-xs text-green-500 font-medium">Paid on {new Date(inst.paidDate).toLocaleDateString()}</p>}
                </div>
                
                <div className="w-[140px] text-right">
                  {isPaid ? (
                    <button 
                      onClick={() => setShowReceipt({ ...inst, amount: enrollment.monthlyInstallment })}
                      className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wide hover:underline"
                    >
                      View Receipt
                    </button>
                  ) : isPending && !isFrozen ? (
                    <button 
                      onClick={() => handlePayInstallment(inst.id)}
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover text-xs font-bold uppercase tracking-wide"
                    >
                      {isProcessing ? 'Processing...' : 'Pay Now'}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">
                      {isBonus ? 'Pending' : inst.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mock Receipt Modal Overlay */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--brand-primary)] to-amber-200"></div>
            
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Payment Successful</h2>
                <p className="text-gray-400 text-sm">Receipt for Installment {showReceipt.monthNumber}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-[#333] pb-4">
                  <span className="text-gray-400">Transaction ID</span>
                  <span className="text-white font-mono">{showReceipt.transactionId || `TXN-${Math.floor(Math.random() * 900000)}`}</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-4">
                  <span className="text-gray-400">Date Paid</span>
                  <span className="text-white">{new Date(showReceipt.paidDate).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-[#333] pb-4">
                  <span className="text-gray-400">Scheme</span>
                  <span className="text-white">{enrollment.scheme.name}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-400 font-bold">Amount Paid</span>
                  <span className="text-[var(--brand-primary)] font-bold text-xl">{formatCurrency(showReceipt.amount)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowReceipt(null)}
                  className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#2a2a2a] text-white border border-[#444] hover:bg-[#333] transition-all text-sm font-bold uppercase tracking-wide"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    alert("Downloading PDF receipt...");
                    setShowReceipt(null);
                  }}
                  className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all text-sm font-bold uppercase tracking-wide shimmer-hover overflow-hidden relative"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
