'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- Dev Security Check ---
const isDev = process.env.NODE_ENV === 'development';

export default function DevRoadmapDashboard() {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'pseudo_code' | 'documentation' | 'qc_testing'>('roadmap');
  
  const [isQC, setIsQC] = useState(false);
  const [qcResults, setQcResults] = useState<any>(null);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{success: boolean, message: string} | null>(null);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  const handleGitSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    setSyncLogs([]);
    try {
      const res = await fetch('/api/admin/git-sync', { method: 'POST' });
      if (!res.body) throw new Error("No response body");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let finalSuccess = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              setSyncLogs(prev => [...prev, data.message]);
              if (data.status === 'SUCCESS' && data.message.includes('successfully synced')) {
                finalSuccess = true;
              }
              if (data.status === 'ERROR') {
                finalSuccess = false;
                setSyncStatus({ success: false, message: data.message });
              }
            } catch(e) {}
          }
        }
      }
      
      if (finalSuccess) {
        setSyncStatus({ success: true, message: 'Successfully synced to GitHub!' });
      } else if (!syncStatus) {
        setSyncStatus({ success: false, message: 'Sync process completed with warnings.' });
      }
    } catch (e: any) {
      setSyncStatus({ success: false, message: e.message || 'Network error occurred.' });
    } finally {
      setIsSyncing(false);
      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        setSyncStatus(null);
        setSyncLogs([]);
      }, 8000);
    }
  };

  const runQC = async () => {
    setIsQC(true);
    try {
      const res = await fetch('/api/admin/qc-runner');
      const data = await res.json();
      setQcResults(data);
    } catch(e) {
      console.error(e);
      setQcResults({ systemStatus: 'ERROR', results: [] });
    } finally {
      setIsQC(false);
    }
  };

  const toggleTask = (id: string) => {
    setExpandedTask(expandedTask === id ? null : id);
  };

  if (!isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-main)]">
        <h1 className="text-2xl font-mono text-red-500">404 - DEV MODE ONLY</h1>
      </div>
    );
  }
  const roadmapData = [
    {
      phase: "1.0 ADMIN CATALOG INFRASTRUCTURE",
      description: "Core database, PIM, and mass-ingestion tools.",
      tasks: [
        { name: "1.1 Interactive PIM Grid", profile: "Admin", status: "Completed", progress: 100, url: "/admin/catalog" },
        { name: "1.2 Bulk-Sync API Engine", profile: "Admin", status: "Completed", progress: 100, url: "/api/admin/products/bulk-sync" },
        { name: "1.3 System Route Auditor", profile: "Admin", status: "Completed", progress: 100, url: "/admin/system-routes" },
        { name: "1.4 Route Consolidation", profile: "Admin", status: "Completed", progress: 100, url: "next.config.mjs" },
        { name: "1.5 Appearance Theme Engine", profile: "Admin", status: "Completed", progress: 100, url: "/admin/settings" }
      ]
    },
    {
      phase: "2.0 GATEWAY & ACCESS CONTROL (RBAC)",
      description: "Securing the platform and segregating user profiles.",
      tasks: [
        { name: "2.1 NextAuth JWT Setup", profile: "All", status: "Completed", progress: 100, url: "/api/auth" },
        { name: "2.2 B2B Login & Registration UI", profile: "All", status: "Completed", progress: 100, url: "/login" },
        { name: "2.3 RBAC Edge Middleware", profile: "All", status: "Completed", progress: 100, url: "middleware.ts" },
        { name: "2.4 User Verification CRM", profile: "Admin, Salesman", status: "Completed", progress: 100, url: "/admin/clients" }
      ]
    },
    {
      phase: "3.0 B2B PRESENTATION LAYER",
      description: "The luxury digital showroom and curation tools.",
      tasks: [
        { name: "3.1 Master Lookbook Grid", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard" },
        { name: "3.2 Framer Motion Flipbook", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard (Grid Replaced)" },
        { name: "3.3 PIN Gatekeeper", profile: "Business Owner", status: "Completed", progress: 100, url: "/login" },
        { name: "3.4 Price Breakup Export", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard/history" }
      ]
    },
    {
      phase: "4.0 UNIFIED PO MATRIX & CART",
      description: "Frictionless wholesale ordering and cart logic.",
      tasks: [
        { name: "4.1 Global Cart State", profile: "Business Owner", status: "Completed", progress: 100, url: "store/useCartStore.ts" },
        { name: "4.2 PO Matrix Checkout UI", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard/cart" },
        { name: "4.3 Real-Time Price Breakup", profile: "Business Owner", status: "Completed", progress: 100, url: "components/MatrixModal.tsx" },
        { name: "4.4 Draft PO Generation", profile: "Business Owner", status: "Completed", progress: 100, url: "/api/checkout/execute" }
      ]
    },
    {
      phase: "5.0 MARGIN AUTOMATION & INTERNAL CRM",
      description: "Protecting profitability and empowering field sales.",
      tasks: [
        { name: "5.1 MCX Live Bullion Sync", profile: "Admin", status: "Completed", progress: 100, url: "/api/pricing/mcx" },
        { name: "5.2 Dynamic Margin Calculator", profile: "Admin", status: "Completed", progress: 100, url: "lib/pricing/calculator.ts" },
        { name: "5.3 Discount CRM Engine", profile: "Admin, Sales", status: "Completed", progress: 100, url: "/admin/discounts" },
        { name: "5.4 Tiered B2B Discounts", profile: "Admin", status: "Completed", progress: 100, url: "lib/pricing/discounts.ts" },
        { name: "5.5 Sales Rep Dashboard", profile: "Salesman", status: "Completed", progress: 100, url: "/admin" },
        { name: "5.6 Client Impersonation", profile: "Salesman", status: "Completed", progress: 100, url: "/api/auth/impersonate" },
        { name: "5.7 Client Profile Hub", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard/settings" }
      ]
    },
    {
      phase: "6.0 FULFILLMENT & ERP ECOSYSTEM",
      description: "Finalizing the operational loop and notifications.",
      tasks: [
        { name: "6.1 PO Inbox & Triage Kanban", profile: "Admin", status: "Completed", progress: 100, url: "/admin/orders" },
        { name: "6.2 ERP Webhook Engine", profile: "Admin", status: "Completed", progress: 100, url: "/api/webhooks/erp" },
        { name: "6.3 SendGrid Automations", profile: "Admin", status: "Completed", progress: 100, url: "lib/mail/sendgrid.ts" }
      ]
    },
    {
      phase: "7.0 GLOBAL THEME CUSTOMIZATION",
      description: "Admin panel for dynamic styling, branding, and color schemas.",
      tasks: [
        { name: "7.1 Theme Configuration Store", profile: "Admin", status: "Completed", progress: 100, url: "/admin/settings/theme" },
        { name: "7.2 CSS Variable Injection API", profile: "Admin", status: "Completed", progress: 100, url: "/api/admin/theme" },
        { name: "7.3 Live Preview Engine", profile: "Admin", status: "Completed", progress: 100, url: "/admin/settings/theme" }
      ]
    },
    {
      phase: "8.0 V2: MULTI-TENANT ISOLATION (SAAS PIVOT)",
      description: "Database migration to PostgreSQL & Next.js Subdomain Middleware.",
      tasks: [
        { name: "8.1 PostgreSQL Tenant Schema", profile: "Super Admin", status: "Completed", progress: 100, url: "prisma/schema.prisma" },
        { name: "8.2 Edge Subdomain Routing", profile: "System Wide", status: "Completed", progress: 100, url: "middleware.ts" },
        { name: "8.3 Headless JWT Strict Auth", profile: "All Profiles", status: "Completed", progress: 100, url: "/api/auth/[...nextauth]" },
        { name: "8.4 Multi-Tenant Public Branding (Favicons & Meta)", profile: "System Wide", status: "Completed", progress: 100, url: "/catalog/view/[id]" },
        { name: "8.5 Brand Asset Bundler & Downloads", profile: "Admin, Client", status: "Completed", progress: 100, url: "/api/brand/assets" }
      ]
    },
    {
      phase: "9.0 V2: SERVER-DRIVEN UI & NATIVE APP",
      description: "Decoupling API for React Native Expo App & Dynamic Builders.",
      tasks: [
        { name: "9.1 Admin SDUI Layout Builder", profile: "Super Admin, Admin", status: "Not Started", progress: 0, url: "/admin/layout-builder" },
        { name: "9.2 Native Mobile Auth (Expo)", profile: "Client, Sales", status: "Not Started", progress: 0, url: "/api/mobile/auth" },
        { name: "9.3 Headless PO Matrix Checkout", profile: "Client, Sales", status: "Not Started", progress: 0, url: "/api/checkout/execute" },
        { name: "9.4 Mobile Responsive Flipbook", profile: "Client, Sales", status: "Completed", progress: 100, url: "/catalog/flipbook/[id]" }
      ]
    },
    {
      phase: "10.0 V2: OTA SCALE & SUPER ADMIN COMMAND",
      description: "Automated scaling, APK deployment, and multi-tenant troubleshooting.",
      tasks: [
        { name: "10.1 Bulk Sync Data Validation", profile: "Super Admin, Admin", status: "Completed", progress: 100, url: "/admin/inventory/import" },
        { name: "10.2 Expo EAS OTA Update Pipeline", profile: "Super Admin", status: "Not Started", progress: 0, url: "eas.json" },
        { name: "10.3 Impersonation JWT Token Swap", profile: "Super Admin", status: "Not Started", progress: 0, url: "/api/admin/impersonate" }
      ]
    },
    {
      phase: "11.0 V2: ENTERPRISE INFRASTRUCTURE & BACKUPS",
      description: "Custom DNS mapping, BYODB Enterprise Tiers, and PITR cloud backups.",
      tasks: [
        { name: "11.1 Custom Domain DNS Resolver", profile: "Super Admin", status: "Not Started", progress: 0, url: "middleware.ts" },
        { name: "11.2 BYODB (Bring Your Own DB) Router", profile: "Super Admin", status: "Not Started", progress: 0, url: "lib/prisma.ts" },
        { name: "11.3 Automated PITR Cloud Backups", profile: "Super Admin", status: "Not Started", progress: 0, url: "AWS / Supabase" },
        { name: "11.4 QLDB Tamper-Proof PO Ledger", profile: "System", status: "Not Started", progress: 0, url: "AWS QLDB" }
      ]
    },
    {
      phase: "12.0 AGILE TICKETING & DEVELOPMENT HUB",
      description: "Jira-style Kanban boards for clients to report issues and developers to track resolutions.",
      tasks: [
        { name: "12.1 Client Ticket Submission UI", profile: "Admin", status: "Not Started", progress: 0, url: "/admin/support" },
        { name: "12.2 Master Kanban Board (Drag & Drop)", profile: "Master Admin", status: "Not Started", progress: 0, url: "/superadmin/tickets" },
        { name: "12.3 Ticket Analytics (Client Load)", profile: "Master Admin", status: "Not Started", progress: 0, url: "/superadmin/analytics" },
        { name: "12.4 Developer Assignment Engine", profile: "Master Admin", status: "Not Started", progress: 0, url: "schema.prisma" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'In Progress': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-slate-500/10 text-[var(--text-muted)] border-[var(--border-color)]';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress > 0) return 'bg-amber-500';
    return 'bg-[var(--border-color)]';
  };

  // Calculate global progress
  const totalTasks = roadmapData.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTasks = roadmapData.reduce((acc, phase) => acc + phase.tasks.filter(t => t.status === 'Completed').length, 0);
  const globalProgress = Math.round((completedTasks / totalTasks) * 100);

  // Process data for the new layout
  const allIncompleteTasks: any[] = [];
  const completedPhases: any[] = [];

  roadmapData.forEach((phase, pIdx) => {
    const incomplete = phase.tasks.filter(t => t.status !== 'Completed');
    const complete = phase.tasks.filter(t => t.status === 'Completed');

    if (incomplete.length > 0) {
      // Assign priority based on phase for now
      let priority = 'Medium';
      if (phase.phase.startsWith('9.') || phase.phase.startsWith('12.')) priority = 'High';
      if (phase.phase.startsWith('11.')) priority = 'Low';

      incomplete.forEach((t) => {
        allIncompleteTasks.push({
          ...t,
          phaseName: phase.phase,
          priority,
          originalPhaseIdx: pIdx,
          originalTaskIdx: phase.tasks.indexOf(t)
        });
      });
    }

    if (complete.length > 0) {
      completedPhases.push({
        ...phase,
        originalPhaseIdx: pIdx,
        tasks: complete.map(t => ({ ...t, originalTaskIdx: phase.tasks.indexOf(t) }))
      });
    }
  });

  // Sort incomplete tasks by priority
  const priorityOrder: Record<string, number> = { 'High': 1, 'Medium': 2, 'Low': 3 };
  allIncompleteTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-12 pb-24">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* HEADER BENTO */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-widest uppercase shadow-sm">
            Temporary Dev Mode
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-normal tracking-tight">Project Master Ledger</h1>
              <p className="text-sm text-[var(--text-muted)] mt-2 font-mono">Ashok Jewels B2B Architecture</p>
              
              {/* NEW: QUICK ACCESS TABS */}
              <div className="mt-5 flex items-center gap-3">
                <Link 
                  href="/admin/system-routes" 
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-base)] border border-[var(--border-color)] text-[var(--text-main)] hover:border-emerald-500 hover:text-emerald-600 transition-all rounded-lg text-xs font-bold uppercase tracking-widest shadow-sm group"
                >
                  <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  System Route Auditor
                </Link>

                {/* GITHUB SYNC CTA */}
                <div className="relative z-50 flex items-center gap-3">
                  <button 
                    onClick={handleGitSync}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-[#171515] hover:bg-[#2b2828] text-white transition-all rounded-lg text-xs font-bold uppercase tracking-widest shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSyncing ? (
                      <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : (
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    )}
                    {isSyncing ? 'Syncing...' : 'Sync to GitHub'}
                  </button>
                  
                  {syncStatus && (
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border ${syncStatus.success ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                      {syncStatus.message}
                    </span>
                  )}

                  {/* LIVE TERMINAL LOGS */}
                  {syncLogs.length > 0 && (
                    <div className="absolute top-full mt-3 right-0 w-[450px] bg-[#0d1117] text-[#3fb950] p-4 rounded-xl border border-[#30363d] shadow-2xl z-50 h-56 overflow-y-auto custom-scrollbar flex flex-col gap-2 font-mono text-[11px] leading-relaxed">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#30363d] sticky top-0 bg-[#0d1117]">
                        <span className="text-[#8b949e] font-bold">GitHub Sync Terminal</span>
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                        </div>
                      </div>
                      {syncLogs.map((log, i) => (
                        <div key={i} className="break-words">
                          <span className="text-[#8b949e] mr-2">[{new Date().toLocaleTimeString()}]</span>
                          <span className={log.startsWith('>') ? 'text-[#58a6ff]' : log.includes('Failed') ? 'text-[#f85149]' : ''}>{log}</span>
                        </div>
                      ))}
                      {isSyncing && (
                        <div className="animate-pulse text-[#8b949e] mt-1">_</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-[var(--bg-base)] border border-[var(--border-color)] px-6 py-4 rounded-xl shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Global Completion</p>
                <p className="text-2xl font-bold text-[var(--text-main)]">{globalProgress}%</p>
              </div>
              <div className="w-16 h-16 flex items-center justify-center relative bg-[var(--bg-base)] rounded-full p-1 border border-[var(--border-color)]">
                <svg viewBox="0 0 60 60" className="absolute inset-1 w-full h-full -rotate-90">
                  <circle cx="30" cy="30" r="26" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[var(--border-color)]" />
                  <circle cx="30" cy="30" r="26" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="163" strokeDashoffset={163 - (163 * globalProgress) / 100} className="text-emerald-500 transition-all duration-1000" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex space-x-1 border-b border-[var(--border-color)] pb-px overflow-x-auto">
          {[
            { id: 'roadmap', label: 'Roadmap Ledger' },
            { id: 'pseudo_code', label: 'Pseudo Code' },
            { id: 'documentation', label: 'Detail Documentation' },
            { id: 'qc_testing', label: 'Auto QC & Diagnostics' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${activeTab === tab.id ? 'border-[var(--brand-primary)] text-[var(--brand-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT: ROADMAP GRID */}
        {activeTab === 'roadmap' && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* SECTION 1: ACTIVE PRIORITIES */}
          <div className="space-y-6">
            <div className="border-b border-[var(--border-color)] pb-3">
              <h2 className="text-2xl font-bold tracking-tight text-[var(--brand-primary)] flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Active Development Priorities
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">High-priority tasks queued or currently in progress.</p>
            </div>

            {allIncompleteTasks.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl">
                All scheduled tasks are completed!
              </div>
            ) : (
              <div className="bg-[var(--bg-surface)] border border-amber-500/20 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-amber-500/5 border-b border-amber-500/20">
                        <th className="py-4 px-6 text-xs font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase w-[30%]">Task Name</th>
                        <th className="py-4 px-6 text-xs font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase w-[15%]">Phase</th>
                        <th className="py-4 px-6 text-xs font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase w-[15%] text-center">Priority</th>
                        <th className="py-4 px-6 text-xs font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase w-[20%] text-center">Progress</th>
                        <th className="py-4 px-6 text-xs font-bold text-amber-600 dark:text-amber-500 tracking-wider uppercase w-[20%] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {allIncompleteTasks.map((task, idx) => {
                        const taskId = `${task.originalPhaseIdx}-${task.originalTaskIdx}`;
                        const isExpanded = expandedTask === taskId;
                        return (
                          <React.Fragment key={taskId}>
                            <tr className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isExpanded ? 'bg-black/5 dark:bg-white/5' : ''}`}>
                              <td className="py-4 px-6 text-sm font-bold text-[var(--text-main)]">{task.name}</td>
                              <td className="py-4 px-6">
                                <span className="text-[10px] font-bold text-[var(--text-muted)] truncate max-w-[150px] inline-block">
                                  {task.phaseName}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                  task.priority === 'High' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                  task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                  'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                }`}>
                                  {task.priority}
                                </span>
                              </td>
                              <td className="py-4 px-6 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className="w-full h-2 bg-[var(--bg-base)] rounded-full border border-[var(--border-color)] overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-500 ${getProgressColor(task.progress)}`} style={{ width: `${task.progress}%` }}></div>
                                  </div>
                                  <span className="text-xs font-mono font-bold text-[var(--text-muted)] w-8 text-right">{task.progress}%</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right space-x-2">
                                <button 
                                  onClick={() => toggleTask(taskId)}
                                  className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] transition-colors"
                                >
                                  {isExpanded ? 'Hide Details' : 'Details'}
                                </button>
                                <a 
                                  href={task.url.startsWith('/') ? task.url : `/${task.url}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border border-transparent bg-[var(--brand-primary)] text-white hover:opacity-90 transition-opacity"
                                >
                                  Open
                                  <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                </a>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                                <td colSpan={5} className="px-6 py-6 border-l-4 border-[var(--brand-primary)] whitespace-normal">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--border-color)]">
                                      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Implementation Details
                                      </h4>
                                      <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--text-main)]">
                                        <li>Architectural specification and pseudo-code definition based on roadmap guidelines.</li>
                                        <li>Ensuring full isolation and non-breaking implementations relative to existing legacy cord.</li>
                                        <li>Deploying necessary database updates, routing configurations, and NextAuth wrappers for this module.</li>
                                      </ul>
                                    </div>
                                    <div className="bg-emerald-500/5 p-5 rounded-xl border border-emerald-500/20">
                                      <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        QA & Testing Pointers
                                      </h4>
                                      <ul className="list-disc pl-5 text-sm space-y-2 text-emerald-700/80 dark:text-emerald-400/80">
                                        <li>Verify route guards block unauthorized profile access (e.g., Salesman vs Super Admin).</li>
                                        <li>Execute boundary tests on edge cases (e.g., invalid tokens, malformed POST payloads).</li>
                                        <li>Confirm global styling consistency and contrast visibility in dark/light modes.</li>
                                      </ul>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: COMPLETED DEVELOPMENTS */}
          <div className="space-y-6 pt-8 border-t-2 border-dashed border-[var(--border-color)] opacity-80 hover:opacity-100 transition-opacity">
            <div className="border-b border-[var(--border-color)] pb-3">
              <h2 className="text-2xl font-bold tracking-tight text-emerald-600 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Completed Developments
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Successfully deployed architecture and modules.</p>
            </div>

            {completedPhases.map((phase) => (
              <div key={phase.originalPhaseIdx} className="space-y-4 mb-8">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-[var(--text-main)]">{phase.phase}</h3>
                </div>
                
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                          <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[30%]">Task Name</th>
                          <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[15%]">Profile</th>
                          <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[15%] text-center">Status</th>
                          <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[20%] text-center">Progress</th>
                          <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[20%] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)]">
                        {phase.tasks.map((task: any) => {
                          const taskId = `${phase.originalPhaseIdx}-${task.originalTaskIdx}`;
                          const isExpanded = expandedTask === taskId;
                          return (
                            <React.Fragment key={taskId}>
                              <tr className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isExpanded ? 'bg-black/5 dark:bg-white/5' : ''}`}>
                                <td className="py-3 px-6 text-sm font-medium text-[var(--text-main)]">{task.name}</td>
                                <td className="py-3 px-6">
                                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md shadow-sm">
                                    {task.profile}
                                  </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(task.status)}`}>
                                    {task.status}
                                  </span>
                                </td>
                                <td className="py-3 px-6 align-middle">
                                  <div className="flex items-center gap-3">
                                    <div className="w-full h-2 bg-[var(--bg-base)] rounded-full border border-[var(--border-color)] overflow-hidden">
                                      <div className={`h-full rounded-full transition-all duration-500 ${getProgressColor(task.progress)}`} style={{ width: `${task.progress}%` }}></div>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-[var(--text-muted)] w-8 text-right">{task.progress}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-6 text-right space-x-2">
                                  <button 
                                    onClick={() => toggleTask(taskId)}
                                    className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] transition-colors"
                                  >
                                    {isExpanded ? 'Hide' : 'Details'}
                                  </button>
                                  <a 
                                    href={task.url.startsWith('/') ? task.url : `/${task.url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-lg border border-transparent bg-[var(--bg-base)] text-[var(--text-main)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors border-[var(--border-color)] shadow-sm"
                                  >
                                    Open
                                  </a>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                                  <td colSpan={5} className="px-6 py-6 border-l-4 border-emerald-500 whitespace-normal">
                                    <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--border-color)]">
                                      <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        Completed Module Details
                                      </h4>
                                      <p className="text-sm text-[var(--text-main)]">This module has been successfully integrated into the platform architecture and passed automated QA. Check the specific system route via the Open button to interact with it directly in the live environment.</p>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
        )}

        {/* TAB CONTENT: PSEUDO CODE */}
        {activeTab === 'pseudo_code' && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-xl font-bold tracking-tight mb-6">Core Engines: Pseudo-Code Algorithms</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">1. The Matrix Checkout Engine</h3>
                <div className="bg-black/80 text-emerald-400 p-5 rounded-xl font-mono text-xs overflow-x-auto">
<pre>{`// Pseudo-code for /api/checkout/execute
function executeMatrixCheckout(userId, cartItems) {
    // 1. Verify Session
    const session = getSession();
    if (!session || session.userId !== userId) throw Error("Unauthorized");

    // 2. Fetch Live Commodity Rates (MCX)
    const liveRates = fetchLiveRatesFromMCX(); // { GOLD_24K: 7200, SILVER: 85 }

    let orderTotal = 0;
    let processedLineItems = [];

    // 3. Process the Matrix Grid
    for (let item of cartItems) {
        const productVariant = db.ProductVariant.findById(item.variantId);
        
        // Calculate Metal Value based on Purity (e.g. 18K is 75% of 24K)
        const purityMultiplier = getPurityMultiplier(productVariant.metal); 
        const metalCost = productVariant.weight * (liveRates.GOLD_24K * purityMultiplier);
        
        // Add Making Charges / Markup
        const finalItemPrice = metalCost + productVariant.markup;
        const lineTotal = finalItemPrice * item.quantity;
        
        orderTotal += lineTotal;
        processedLineItems.push({
            variantId: productVariant.id,
            quantity: item.quantity,
            priceLocked: finalItemPrice
        });
    }

    // 4. Atomic Database Transaction
    const newOrder = db.transaction(() => {
        return db.Order.create({
            userId: userId,
            status: "PENDING",
            totalValue: orderTotal,
            lineItems: processedLineItems
        });
    });

    // 5. Trigger Post-Checkout Hooks
    triggerEmailInvoice(newOrder);
    return newOrder.id;
}`}</pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">2. The Responsive Immersive Flipbook Engine</h3>
                <div className="bg-black/80 text-sky-400 p-5 rounded-xl font-mono text-xs overflow-x-auto">
<pre>{`// Pseudo-code for /catalog/flipbook/[id]/FlipbookClient.tsx
function renderFlipbook(catalogData, config) {
    // 1. Listen for viewport changes
    const windowState = useWindowSizeListener();
    
    // 2. Dynamic Layout Calculation
    // If device height > width (Portrait phone), force Single Page Mode
    const isPortrait = windowState.height > windowState.width && windowState.width < 1024;
    
    // 3. Contrast Calculation Algorithm
    // If texture is dark wood or marble, text must be white to prevent blending artifacts
    const darkTextures = ["WOOD", "MARBLE", "VELVET", "SLATE"];
    const isBackgroundDark = darkTextures.includes(config.viewerBackground);
    const textColorClass = isBackgroundDark ? "text-white drop-shadow-md" : "text-black";

    // 4. Render Engine
    return (
        <FlipBookEngine 
            usePortrait={isPortrait} 
            width={isPortrait ? windowState.width - 40 : 450} 
            height={isPortrait ? windowState.height - 180 : 636}
            centerOffset={isPortrait ? 0 : calculateDesktopOffset(currentPage)}
        >
            {catalogData.pages.map(page => (
                <Page content={page} overlayTextColor={textColorClass} />
            ))}
        </FlipBookEngine>
    );
}`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">3. Headless Subdomain Routing (SaaS Pivot)</h3>
                <div className="bg-black/80 text-amber-400 p-5 rounded-xl font-mono text-xs overflow-x-auto">
<pre>{`// Pseudo-code for middleware.ts
export function middleware(req) {
    const url = req.nextUrl.clone();
    const hostname = req.headers.get("host");

    // 1. Extract Tenant Subdomain (e.g. tanishq.ajb2b.com -> tanishq)
    const currentHost = hostname.replace(\`.$\{process.env.NEXT_PUBLIC_ROOT_DOMAIN}\`, "");

    // 2. Ignore static files and API routes
    if (url.pathname.startsWith('/api') || url.pathname.includes('.')) return NextResponse.next();

    // 3. Invisible Rewrite to Dynamic Tenant Folder
    url.pathname = \`/[domain]/$\{currentHost}$\{url.pathname}\`;
    return NextResponse.rewrite(url);
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: DETAIL DOCUMENTATION (USER MANUAL) */}
        {activeTab === 'documentation' && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8 text-[var(--text-main)]">
            <div className="border-b border-[var(--border-color)] pb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Platform User Manual</h2>
                <p className="text-[var(--text-muted)]">The complete B2B guide on how to navigate the portal, use the matrix cart, and view immersive catalogs.</p>
              </div>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] uppercase font-bold tracking-widest rounded-lg">Version 1.0</span>
            </div>
            
            {/* INDEX */}
            <div className="bg-[var(--bg-base)] p-6 rounded-xl border border-[var(--border-color)] mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">Manual Index</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[var(--brand-primary)] font-medium">
                <li><a href="#section-1" className="hover:underline">1. Getting Started & Secure Access</a></li>
                <li><a href="#section-2" className="hover:underline">2. The Immersive 3D Flipbook</a></li>
                <li><a href="#section-3" className="hover:underline">3. Ordering via the Wholesale Matrix Cart</a></li>
                <li><a href="#section-4" className="hover:underline">4. Tracking Purchase Orders & History</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              
              {/* SECTION 1 */}
              <div id="section-1" className="space-y-3 pt-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><span className="w-6 h-6 rounded bg-[var(--text-main)] text-[var(--bg-base)] flex items-center justify-center text-xs">1</span> Getting Started & Secure Access</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  The B2B Portal is strictly invitation-only. To gain access, you must first be approved by an administrator. Once approved, you will log in using your registered email and a secure PIN/Password.
                </p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--text-muted)] mt-2">
                  <li>Navigate to the <code>/login</code> portal.</li>
                  <li>Enter your verified email address and secure password.</li>
                  <li>If accessing a strictly confidential collection, a secondary 4-digit PIN may be required.</li>
                </ul>
              </div>

              {/* SECTION 2 */}
              <div id="section-2" className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <h3 className="text-lg font-bold flex items-center gap-2"><span className="w-6 h-6 rounded bg-[var(--text-main)] text-[var(--bg-base)] flex items-center justify-center text-xs">2</span> The Immersive 3D Flipbook</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Instead of static PDFs, we use a fully interactive 3D digital lookbook that adapts to your device.
                </p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--text-muted)] mt-2">
                  <li><strong>Navigation:</strong> Click the corners of the book or swipe on touchscreens to turn the page.</li>
                  <li><strong>Device Orientation:</strong> On mobile phones held vertically (portrait), the book will display one maximized page at a time for better readability. Turn your phone horizontally (landscape) to view the luxurious two-page spread.</li>
                  <li><strong>Quick Add:</strong> Click any product image inside the book to instantly open its purchasing grid.</li>
                </ul>
              </div>

              {/* SECTION 3 */}
              <div id="section-3" className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <h3 className="text-lg font-bold flex items-center gap-2"><span className="w-6 h-6 rounded bg-[var(--text-main)] text-[var(--bg-base)] flex items-center justify-center text-xs">3</span> Ordering via the Wholesale Matrix Cart</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  As a wholesale buyer, you often need to order multiple variants of a single design simultaneously. We built the Matrix Cart specifically for this.
                </p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--text-muted)] mt-2">
                  <li><strong>The Grid:</strong> When you select a product, a spreadsheet-like grid will appear showing all available Metals (14K, 18K) and Sizes.</li>
                  <li><strong>Bulk Entry:</strong> Simply type the quantity you want for each specific combination (e.g., 5 quantities of 14K Gold in Size 6).</li>
                  <li><strong>Live Estimation:</strong> The system automatically calculates your Purchase Order (PO) total based on today's live metal rates and your account's specific discount tier.</li>
                  <li><strong>Checkout:</strong> Review your matrix cart and click "Generate PO" to send the order directly to manufacturing.</li>
                </ul>
              </div>

              {/* SECTION 4 */}
              <div id="section-4" className="space-y-3 pt-4 border-t border-[var(--border-color)]">
                <h3 className="text-lg font-bold flex items-center gap-2"><span className="w-6 h-6 rounded bg-[var(--text-main)] text-[var(--bg-base)] flex items-center justify-center text-xs">4</span> Tracking Purchase Orders & History</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                  Your Client Dashboard serves as your historical ledger.
                </p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--text-muted)] mt-2">
                  <li>Navigate to the <code>/dashboard/history</code> tab.</li>
                  <li>Here you can view the live status of all your Purchase Orders (Pending, Processing in Manufacturing, Shipped).</li>
                  <li>You can instantly download a Proforma PDF invoice for any past order for your accounting records.</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {/* TAB CONTENT: AUTO QC */}
        {activeTab === 'qc_testing' && (
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[var(--border-color)] pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Automated System QC</h2>
                <p className="text-[var(--text-muted)] text-sm">Run a live diagnostic ping across the database, edge routing, and authentication layers.</p>
              </div>
              
              <button 
                onClick={runQC}
                disabled={isQC}
                className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isQC ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Running Diagnostics...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Execute Auto QC
                  </>
                )}
              </button>
            </div>

            {!qcResults && !isQC && (
              <div className="py-12 flex flex-col items-center justify-center text-[var(--text-muted)] border-2 border-dashed border-[var(--border-color)] rounded-xl">
                <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                <p>Click "Execute Auto QC" to begin the system diagnostic sweep.</p>
              </div>
            )}

            {qcResults && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  qcResults.systemStatus === 'HEALTHY' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Global System Status</p>
                    <h3 className={`text-xl font-bold tracking-tight ${qcResults.systemStatus === 'HEALTHY' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {qcResults.systemStatus}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Timestamp</p>
                    <p className="text-sm font-mono">{new Date(qcResults.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {qcResults.results.map((res: any, idx: number) => (
                    <div key={idx} className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-5 flex items-start justify-between group hover:border-[var(--brand-primary)] transition-colors">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          res.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-500' : 
                          res.status === 'WARN' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {res.status === 'PASS' ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          ) : res.status === 'WARN' ? (
                            <span className="font-bold">!</span>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                            {res.name}
                            <span className="text-[10px] bg-[var(--bg-surface)] border border-[var(--border-color)] px-2 py-0.5 rounded font-mono font-normal text-[var(--text-muted)]">
                              {res.timeMs}ms
                            </span>
                          </h4>
                          <p className="text-xs text-[var(--text-muted)] mt-1">{res.description}</p>
                          <div className="mt-3 p-3 bg-[var(--bg-surface)] rounded border border-[var(--border-color)] border-l-2 border-l-[var(--brand-primary)] text-xs font-mono text-[var(--text-main)] opacity-80">
                            {res.detail}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${
                        res.status === 'PASS' ? 'border-emerald-500/30 text-emerald-500' : 
                        res.status === 'WARN' ? 'border-amber-500/30 text-amber-500' : 'border-red-500/30 text-red-500'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}