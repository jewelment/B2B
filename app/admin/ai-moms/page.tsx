'use client';

import React, { useState, useEffect } from 'react';

type Mom = {
  id: string;
  filename: string;
  category: string;
  categoryName: string;
  content: string;
  lastModified: string;
};

export default function AIMOMsPage() {
  const [moms, setMoms] = useState<Mom[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMom, setSelectedMom] = useState<Mom | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/ai-moms')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMoms(data.data);
          if (data.data.length > 0) {
            setSelectedMom(data.data[0]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: 'all', name: 'All Backups' },
    { id: 'daily_progress', name: 'Daily Progress' },
    { id: 'healthy_conversations', name: 'Discussions' },
    { id: 'finalized_outcomes', name: 'Finalized Outcomes' },
  ];

  const filteredMoms = activeCategory === 'all' 
    ? moms 
    : moms.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
              AI MOM & Conversations
              <span className="px-3 py-1 bg-purple-500/10 text-purple-600 border border-purple-500/20 text-[10px] uppercase font-bold tracking-widest rounded-lg">System V16.9</span>
            </h1>
            <p className="text-[var(--text-muted)] text-sm max-w-2xl leading-relaxed">
              Automated ledger to backup, categorize, and summarize daily AI progress. View architectural discussions, daily checkpoints, and finalized pseudocode structures securely stored in the local repository.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (List) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-[var(--brand-primary)] text-white shadow-md' 
                        : 'bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-color)]'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-4 shadow-sm h-[600px] overflow-y-auto space-y-3">
              {loading ? (
                <div className="p-8 text-center text-[var(--text-muted)] animate-pulse">Loading backups...</div>
              ) : filteredMoms.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)]">No backups found in this category.</div>
              ) : (
                filteredMoms.map((mom) => (
                  <button
                    key={mom.id}
                    onClick={() => setSelectedMom(mom)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedMom?.id === mom.id
                        ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]'
                        : 'bg-[var(--bg-base)] border-[var(--border-color)] hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        {mom.categoryName}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {new Date(mom.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className={`font-bold truncate ${selectedMom?.id === mom.id ? 'text-[var(--brand-primary)]' : 'text-[var(--text-main)]'}`}>
                      {mom.filename.replace('.md', '')}
                    </h3>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Content (Viewer) */}
          <div className="lg:col-span-8">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-sm h-[680px] flex flex-col">
              {selectedMom ? (
                <>
                  <div className="border-b border-[var(--border-color)] pb-6 mb-6 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] uppercase font-bold tracking-widest rounded-lg">
                          {selectedMom.categoryName}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          Last Updated: {new Date(selectedMom.lastModified).toLocaleString()}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight">{selectedMom.filename}</h2>
                    </div>
                    <button 
                      onClick={() => {
                        const blob = new Blob([selectedMom.content], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = selectedMom.filename;
                        a.click();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto bg-black/80 rounded-xl p-6 border border-[var(--border-color)]">
                    <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                      {selectedMom.content}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] text-center">
                  <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No File Selected</p>
                  <p className="text-sm">Select a MOM backup from the left panel to view its contents.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
