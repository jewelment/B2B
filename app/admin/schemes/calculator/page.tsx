'use client';
import React, { useState, useEffect } from 'react';

type Scheme = {
  id: string;
  name: string;
  totalTenureMonths: number;
  bonusInstallments: number;
  minInstallment: number;
  maxInstallment: number;
  faqs?: string;
};

export default function CalculatorPage() {
  const [monthlyInstallment, setMonthlyInstallment] = useState<number>(5000);
  const [goldReturnPct, setGoldReturnPct] = useState<number>(5);
  const [goldRate, setGoldRate] = useState<number>(0);
  const [pricingMode, setPricingMode] = useState<string>('MANUAL');
  const [brandName, setBrandName] = useState<string>('Ashok Jewels'); // Dynamic Brand Name
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Dynamic Schemes Data
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);

  // Computed properties based on selected scheme or defaults
  const activeScheme = schemes.find(s => s.id === selectedSchemeId);
  const tenure = activeScheme?.totalTenureMonths || 11;
  const bonusCount = activeScheme?.bonusInstallments || 1;
  const minInst = activeScheme?.minInstallment || 1000;
  const maxInst = activeScheme?.maxInstallment || 100000;

  // Fetch Global Master Pricing Settings
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const [settingsRes, schemesRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/schemes?status=ACTIVE')
        ]);
        
        const data = await settingsRes.json();
        if (data.success && data.settings) {
          setPricingMode(data.settings.pricingMode);
          const activeRate = data.settings.pricingMode === 'LIVE_API' ? 7410 : data.settings.manualGoldRate24K;
          setGoldRate(activeRate);
          
          if (data.settings.brandName) {
            setBrandName(data.settings.brandName);
          }
        }
        
        const schemesData = await schemesRes.json();
        if (schemesData.success && schemesData.schemes.length > 0) {
          setSchemes(schemesData.schemes);
          setSelectedSchemeId(schemesData.schemes[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        setGoldRate(7150); // Fallback
      } finally {
        setIsLoadingRate(false);
      }
    };
    fetchPricing();
  }, []);
  
  // Handlers for stepping the installment
  const handleDecrement = () => {
    setMonthlyInstallment(prev => Math.max(1000, prev - 1000));
    setMonthlyInstallment(prev => Math.max(minInst, prev - 1000));
  };
  const handleIncrement = () => {
    setMonthlyInstallment(prev => Math.min(maxInst, prev + 1000));
  };

  // Calculations
  const customerTotal = monthlyInstallment * tenure;
  const bonus = monthlyInstallment * bonusCount;
  const totalValue = customerTotal + bonus;
  const goldReturns = Math.round(totalValue * (goldReturnPct / 100));
  const totalWorth = totalValue + goldReturns;

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  // Simulated FAQs for the Calculator View (Fallback if scheme has no FAQs)
  const defaultFaqs = [
    {
      q: `What is the ${brandName} Savings Scheme?`,
      a: `It is an exclusive jewelry savings plan where you pay fixed monthly installments, and ${brandName} pays a bonus. After maturity, you can purchase jewelry worth the total amount.`
    },
    {
      q: `Can I buy Gold Coins or Bars instead of Jewelry?`,
      a: `No, this plan is exclusively designed for purchasing beautifully crafted jewelry from ${brandName}. Purchases of gold coins, silver coins, or bullion bars are restricted under this scheme.`
    },
    {
      q: `What happens if I miss a monthly installment?`,
      a: `If you miss an installment, your maturity date will be delayed by the number of months missed. However, to receive the full bonus from ${brandName}, we highly recommend setting up Auto-Pay or paying before the due date.`
    },
    {
      q: `Can I close my account early?`,
      a: `Yes, you can close your account early. However, you will only be able to purchase jewelry for the exact amount you have deposited. The ${brandName} bonus is strictly applicable only upon successful completion of the full tenure.`
    }
  ];

  let displayFaqs = defaultFaqs;
  if (activeScheme?.faqs) {
    try {
      displayFaqs = JSON.parse(activeScheme.faqs);
    } catch (e) {
      // JSON parse error, use default
    }
  }

  return (
    <div className="p-8 max-w-[1000px] mx-auto animate-in fade-in duration-700 relative pb-32">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[var(--brand-primary)]/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[var(--text-main)] mb-3 tracking-tight">Calculate & Compare Plans</h1>
        <p className="text-[var(--text-muted)] text-sm tracking-wide">Simulate your {brandName} Savings Plan</p>
      </div>

      {/* Scheme Selector */}
      {schemes.length > 0 && (
        <div className="max-w-md mx-auto mb-10 bg-[rgba(255,255,255,0.02)] dark:bg-[#121212]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <label className="block text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider mb-2 relative z-10">Select Active Scheme</label>
          <div className="relative z-10">
            <select 
              value={selectedSchemeId || ''} 
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full bg-black/20 dark:bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--text-main)] font-semibold outline-none focus:border-[var(--brand-primary)] transition-all cursor-pointer appearance-none shadow-inner"
            >
              {schemes.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="w-[450px] relative group">
           {/* Ambient Glow */}
           <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-primary)]/0 via-[var(--brand-primary)]/30 to-[var(--brand-primary)]/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
           
           <div className="relative bg-[rgba(255,255,255,0.02)] dark:bg-[#121212]/80 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-between overflow-hidden">
             
             {/* Noise Texture */}
             <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

             <div className="relative z-10">
               <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] mb-1.5">Your Monthly Installment</p>
               <div className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight drop-shadow-md">
                 {formatCurrency(monthlyInstallment)}
               </div>
             </div>
             <div className="flex items-center gap-3 relative z-10">
               <button onClick={handleDecrement} className="w-12 h-12 rounded-full bg-black/20 dark:bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-300 text-2xl font-light shadow-sm">
                 -
               </button>
               <button onClick={handleIncrement} className="w-12 h-12 rounded-full bg-black/20 dark:bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-main)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] hover:scale-105 active:scale-95 active:shadow-inner transition-all duration-300 text-2xl font-light shadow-sm">
                 +
               </button>
             </div>
           </div>
        </div>
        
        <div className="mt-6 flex items-center gap-2.5 text-sm text-[var(--text-muted)] font-medium bg-black/5 dark:bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-md shadow-sm">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${pricingMode === 'LIVE_API' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'}`}></span>
          Current 24KT Gold Rate: 
          {isLoadingRate ? (
            <span className="w-16 h-4 bg-black/10 dark:bg-white/10 animate-pulse rounded"></span>
          ) : (
            <span className="text-[var(--text-main)] font-bold tracking-wide">
              ₹{goldRate.toLocaleString('en-IN')}/gm
              <span className="text-[10px] ml-2 text-[var(--text-muted)] uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded">
                {pricingMode === 'LIVE_API' ? 'LIVE MCX' : 'MANUAL'}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Breakdown Table (Luxury Glassmorphism) */}
      <div className="relative bg-[rgba(255,255,255,0.03)] dark:bg-[#121212]/60 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-2 bg-black/10 dark:bg-black/40 border-b border-white/5">
          <div className="p-6 pl-8 font-bold text-[var(--text-muted)] text-xs uppercase tracking-[0.15em]">Benefits</div>
          <div className="relative p-6 font-bold text-[var(--brand-text)] bg-gradient-to-br from-[var(--brand-primary)] to-[#c59c5a] text-center text-xs uppercase tracking-[0.15em] shadow-inner flex items-center justify-center gap-2 overflow-hidden">
             {/* Shimmer Effect */}
             <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-[-15deg] animate-[shimmer_3s_infinite]"></div>
            <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <span className="relative z-10">{activeScheme?.name || `${brandName} Savings`}</span>
          </div>
        </div>

        {/* Rows */}
        <div className="grid grid-cols-2 border-b border-white/5 group hover:bg-white/5 transition-colors duration-300">
          <div className="p-6 pl-8 border-r border-white/5 text-[var(--text-main)] font-medium flex items-center justify-between">
            <span>Your Contribution</span>
            <span className="px-2.5 py-1 rounded bg-black/10 dark:bg-white/5 text-[10px] font-bold text-[var(--text-muted)] border border-white/10 tracking-widest">({tenure} MONTHS)</span>
          </div>
          <div className="p-6 text-center font-bold text-[var(--text-main)] text-lg tracking-wide drop-shadow-sm">{formatCurrency(customerTotal)}</div>
        </div>

        <div className="grid grid-cols-2 border-b border-white/5 group hover:bg-white/5 transition-colors duration-300">
          <div className="p-6 pl-8 border-r border-white/5 text-[var(--text-main)] font-medium flex items-center justify-between">
            <span>{brandName} Bonus</span>
            <span className="px-2.5 py-1 rounded bg-black/10 dark:bg-white/5 text-[10px] font-bold text-[var(--brand-primary)] border border-white/10 tracking-widest">({bonusCount} MONTH BONUS)</span>
          </div>
          <div className="p-6 text-center font-bold text-[var(--text-main)] text-lg tracking-wide drop-shadow-sm">{formatCurrency(bonus)}</div>
        </div>

        <div className="grid grid-cols-2 border-b border-white/5 bg-[var(--brand-primary)]/5 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--brand-primary)]"></div>
          <div className="p-6 pl-8 border-r border-white/5">
            <p className="text-[var(--text-main)] font-semibold mb-1 flex items-center gap-1 text-sm">
              Gold Value Returns
              <span className="text-[12px] text-[var(--brand-primary)] font-bold">*</span>
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mb-5 tracking-wide">(Adjust slider to see approx returns)</p>
            
            <div className="flex items-center gap-5 pr-4">
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="1"
                value={goldReturnPct}
                onChange={(e) => setGoldReturnPct(parseInt(e.target.value))}
                className="w-full accent-[var(--brand-primary)] h-1 bg-black/20 dark:bg-white/10 rounded-lg appearance-none cursor-pointer hover:scale-[1.02] transition-transform"
              />
              <span className="text-sm font-bold text-[var(--brand-primary)] w-10 text-right drop-shadow-md">{goldReturnPct}%</span>
            </div>
          </div>
          <div className="p-6 text-center font-bold text-[var(--brand-primary)] flex items-center justify-center text-lg tracking-wide drop-shadow-md">
            {formatCurrency(goldReturns)}
            <span className="text-[12px] ml-1">*</span>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-white/5 group hover:bg-white/5 transition-colors duration-300">
          <div className="p-6 pl-8 border-r border-white/5 text-[var(--text-main)] font-medium flex items-center justify-between">
            <span>{brandName} Bonus</span>
            <span className="px-2.5 py-1 rounded bg-black/10 dark:bg-white/5 text-[10px] font-bold text-[var(--brand-primary)] border border-white/10 tracking-widest">(12TH MONTH)</span>
          </div>
          <div className="p-6 text-center font-bold text-[var(--text-main)] text-lg tracking-wide drop-shadow-sm">{formatCurrency(bonus)}</div>
        </div>

        <div className="grid grid-cols-2 bg-green-500/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent skew-x-[-15deg] animate-[shimmer_5s_infinite]"></div>
          <div className="p-8 pl-8 border-r border-white/5 text-[var(--text-main)] font-bold text-lg tracking-wide relative z-10 flex items-center">Buy Jewellery Worth</div>
          <div className="p-8 text-center font-extrabold text-green-500 dark:text-green-400 text-2xl tracking-tight drop-shadow-md relative z-10 flex items-center justify-center">
            {formatCurrency(totalWorth)}
          </div>
        </div>

      </div>

      <p className="text-[10px] text-[var(--text-muted)] mt-8 text-center max-w-4xl mx-auto leading-relaxed opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[var(--brand-primary)] font-bold text-xs">*</span> This example reflects potential benefits if gold prices increase by the selected percentage over your tenure. In case of a drop in gold rates, the difference will be borne by the customer. {brandName} cannot be held liable for any loss due to market fluctuations. Read our full Terms & Conditions.
      </p>

      <div className="mt-12 flex justify-center pb-16 border-b border-white/5">
        <button className="inline-flex items-center justify-center px-12 py-5 rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[#d4af37] text-[var(--brand-text)] border border-transparent hover:border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)] shimmer-hover overflow-hidden relative text-sm font-bold uppercase tracking-[0.2em] group">
          <span className="relative z-10 flex items-center">
            Proceed to Enroll
            <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </span>
        </button>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-[var(--text-muted)]">Everything you need to know about the {activeScheme?.name || 'Savings Plan'}</p>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq: any, index: number) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className={`bg-[rgba(255,255,255,0.02)] dark:bg-[#121212]/40 border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[var(--brand-primary)]/40 shadow-[0_4px_20px_rgba(212,175,55,0.05)]' : 'border-white/10 dark:border-white/5 hover:border-white/20'}`}
              >
                <button 
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className={`font-semibold text-sm md:text-base pr-4 ${isOpen ? 'text-[var(--text-main)]' : 'text-[var(--text-main)]/90'}`}>
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${isOpen ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'bg-white/5 text-[var(--text-muted)]'}`}>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
                >
                  <div className="pt-2 border-t border-white/5 text-sm leading-relaxed text-[var(--text-muted)]">
                    {faq.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
