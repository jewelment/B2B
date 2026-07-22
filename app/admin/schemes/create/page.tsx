'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateSchemePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Policies & FAQs');
  
  // UX State
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Media State
  const [desktopImage, setDesktopImage] = useState<string | null>(null);
  const [mobileImage, setMobileImage] = useState<string | null>(null);

  // Scheme Data State
  const [name, setName] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [totalTenureMonths, setTotalTenureMonths] = useState(12);
  const [bonusInstallments, setBonusInstallments] = useState(1);
  const [shortDescription, setShortDescription] = useState('');
  const [minInstallment, setMinInstallment] = useState(1000);
  const [maxInstallment, setMaxInstallment] = useState(100000);
  const [termsAndConditions, setTermsAndConditions] = useState('');

  // FAQ State
  const [faqs, setFaqs] = useState<{ q: string, a: string }[]>([
    { q: '', a: '' }
  ]);

  const addFaq = () => setFaqs([...faqs, { q: '', a: '' }]);
  const removeFaq = (index: number) => setFaqs(faqs.filter((_, i) => i !== index));
  const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSaveScheme = async () => {
    setIsSaving(true);
    
    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          status,
          totalTenureMonths,
          bonusInstallments,
          shortDescription,
          minInstallment,
          maxInstallment,
          termsAndConditions,
          faqs: JSON.stringify(faqs),
          desktopBannerUrl: desktopImage,
          mobileBannerUrl: mobileImage
        })
      });

      if (res.ok) {
        setShowSuccessToast(true);
        setTimeout(() => {
          router.push('/admin/schemes');
        }, 1500);
      } else {
        alert('Failed to save scheme');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving scheme');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'desktop') setDesktopImage(url);
      if (type === 'mobile') setMobileImage(url);
    }
  };

  const tabs = ['Basic Info', 'Financials', 'Policies & FAQs', 'Media'];

  return (
    <div className="p-8 max-w-[1200px] mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <button onClick={() => router.back()} className="text-[var(--text-muted)] hover:text-[var(--brand-primary)] flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-2 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Schemes
          </button>
          <h1 className="text-3xl font-bold text-[var(--text-main)]">Create 11+1 Scheme</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Status:</span>
             <select 
               value={status}
               onChange={(e) => setStatus(e.target.value)}
               className="w-[140px] bg-[#1a1a1a] border border-[#333] rounded-full px-4 py-2.5 text-sm text-[var(--text-main)] font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors cursor-pointer appearance-none"
             >
               <option value="DRAFT">Draft</option>
               <option value="ACTIVE">Active</option>
               <option value="INACTIVE">Inactive</option>
             </select>
           </div>
           <button 
             onClick={handleSaveScheme}
             disabled={isSaving}
             className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--brand-primary)] text-[var(--brand-text)] border border-[var(--brand-primary)] hover:opacity-90 transition-all shadow-md shimmer-hover overflow-hidden relative text-xs font-bold uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {isSaving ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Saving...
               </span>
             ) : (
               'Save Scheme'
             )}
           </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Navigation Sidebar */}
        <div className="w-64 shrink-0">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl p-2 sticky top-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]' : 'text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-main)]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm">
            
            {activeTab === 'Basic Info' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="border-b border-[var(--border-color)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--text-main)] mb-1">Basic Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Scheme Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors" 
                      placeholder="e.g. Swarna Adhikari 11+1" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Total Tenure (Months)</label>
                      <input 
                        type="number" 
                        value={totalTenureMonths}
                        onChange={(e) => setTotalTenureMonths(Number(e.target.value))}
                        className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Bonus Installments</label>
                      <input 
                        type="number" 
                        value={bonusInstallments}
                        onChange={(e) => setBonusInstallments(Number(e.target.value))}
                        className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Short Description</label>
                    <textarea 
                      rows={3} 
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors resize-none" 
                      placeholder="A brief pitch for the customer..."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Financials' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-6 pb-4 border-b border-[var(--border-color)]">Financial Configuration</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Min Installment Amount (₹)</label>
                    <input type="number" defaultValue={1000} className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Max Installment Amount (₹)</label>
                    <input type="number" defaultValue={100000} className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Ashok Jewelment Bonus Discount (%)</label>
                  <input type="number" defaultValue={100} className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors" placeholder="Usually 100% of 1 month" />
                  <p className="text-[10px] text-[var(--text-muted)] mt-2">The percentage of a single installment given as a bonus at the end of the tenure.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Grace Period (Days)</label>
                  <input type="number" defaultValue={7} className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors" />
                  <p className="text-[10px] text-[var(--text-muted)] mt-2">Number of days after the due date before an installment is marked overdue.</p>
                </div>
              </div>
            )}

            {activeTab === 'Policies & FAQs' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-6 pb-4 border-b border-[var(--border-color)]">Policies & Terms</h2>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-2">Terms & Conditions</label>
                  <textarea 
                    rows={6} 
                    value={termsAndConditions}
                    onChange={(e) => setTermsAndConditions(e.target.value)}
                    className="w-full bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:border-[var(--brand-primary)] outline-none transition-colors" 
                    placeholder="Enter HTML or Markdown formatted terms..."
                  ></textarea>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between items-end mb-4">
                    <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide">Frequently Asked Questions</label>
                    <button onClick={addFaq} className="text-xs font-bold text-[var(--brand-primary)] hover:text-[#d4af37] transition-colors flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      Add Question
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-black/5 dark:bg-[#121212] border border-[var(--border-color)] rounded-xl p-4 relative group">
                        <button 
                          onClick={() => removeFaq(index)}
                          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove Question"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="mb-3 pr-8">
                          <input 
                            type="text" 
                            value={faq.q}
                            onChange={(e) => updateFaq(index, 'q', e.target.value)}
                            className="w-full bg-transparent border-b border-[var(--border-color)] pb-2 text-sm text-[var(--text-main)] font-semibold focus:border-[var(--brand-primary)] outline-none transition-colors" 
                            placeholder="Question (e.g. Can I withdraw my money early?)" 
                          />
                        </div>
                        <div>
                          <textarea 
                            rows={2} 
                            value={faq.a}
                            onChange={(e) => updateFaq(index, 'a', e.target.value)}
                            className="w-full bg-transparent text-sm text-[var(--text-muted)] outline-none resize-none" 
                            placeholder="Answer..."
                          ></textarea>
                        </div>
                      </div>
                    ))}
                    {faqs.length === 0 && (
                      <div className="text-center py-6 border border-dashed border-[var(--border-color)] rounded-xl text-[var(--text-muted)] text-sm">
                        No FAQs added yet. Click "Add Question" above.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Media' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div>
                  <h2 className="text-xl font-bold text-[var(--text-main)] mb-2">Promotional Media</h2>
                  <p className="text-sm text-[var(--text-muted)] pb-4 border-b border-[var(--border-color)]">Upload banners to display on the Customer Portal and mobile apps.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Desktop Upload */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wide mb-3 flex items-center justify-between">
                      <span>Desktop View <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-[var(--text-muted)] normal-case font-medium bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">1920x1080px (16:9)</span>
                    </label>
                    <label className="relative border-2 border-dashed border-[var(--border-color)] rounded-2xl h-48 flex flex-col items-center justify-center text-center bg-black/5 dark:bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group overflow-hidden">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'desktop')} />
                      
                      {desktopImage ? (
                        <>
                          <img src={desktopImage} alt="Desktop Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <h4 className="text-sm font-bold text-[var(--text-main)] mb-1">Upload Desktop Banner</h4>
                          <p className="text-xs text-[var(--text-muted)] max-w-[200px]">Click to browse files</p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Mobile Upload */}
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wide mb-3 flex items-center justify-between">
                      <span>Mobile / Adaptive View</span>
                      <span className="text-[10px] text-[var(--text-muted)] normal-case font-medium bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">1080x1080px (1:1)</span>
                    </label>
                    <label className="relative border-2 border-dashed border-[var(--border-color)] rounded-2xl h-48 flex flex-col items-center justify-center text-center bg-black/5 dark:bg-black/20 hover:bg-black/10 transition-colors cursor-pointer group overflow-hidden">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'mobile')} />
                      
                      {mobileImage ? (
                        <>
                          <img src={mobileImage} alt="Mobile Preview" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-[var(--bg-surface)] shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                          </div>
                          <h4 className="text-sm font-bold text-[var(--text-main)] mb-1">Upload Mobile Banner</h4>
                          <p className="text-xs text-[var(--text-muted)] max-w-[200px]">Optional. If not provided, the Desktop image will be used dynamically.</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* Success Toast Overlay */}
      {showSuccessToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-[#121212] border border-[#2A2A2A] rounded-full px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Scheme Saved Successfully!</p>
              <p className="text-xs text-gray-400">Redirecting to schemes list...</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
