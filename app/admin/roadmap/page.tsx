'use client';

import React from 'react';
import Link from 'next/link';

// --- Dev Security Check ---
const isDev = process.env.NODE_ENV === 'development';

export default function DevRoadmapDashboard() {
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
        { name: "7.1 Theme Configuration Store", profile: "Admin", status: "Not Started", progress: 0, url: "/admin/settings/theme" },
        { name: "7.2 CSS Variable Injection API", profile: "Admin", status: "Not Started", progress: 0, url: "/api/admin/theme" },
        { name: "7.3 Live Preview Engine", profile: "Admin", status: "Not Started", progress: 0, url: "/admin/settings/theme" }
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
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-[var(--bg-base)] border border-[var(--border-color)] px-6 py-4 rounded-xl shadow-sm">
              <div className="text-right">
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Global Completion</p>
                <p className="text-2xl font-bold text-[var(--text-main)]">{globalProgress}%</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-[var(--bg-surface)] flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[var(--border-color)]" />
                  <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="175" strokeDashoffset={175 - (175 * globalProgress) / 100} className="text-emerald-500 transition-all duration-1000" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* PHASES GRID */}
        <div className="space-y-12">
          {roadmapData.map((phase, pIdx) => (
            <div key={pIdx} className="space-y-4">
              <div className="border-b border-[var(--border-color)] pb-3">
                <h2 className="text-xl font-bold tracking-tight">{phase.phase}</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">{phase.description}</p>
              </div>
              
              <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                        <th className="py-4 px-6 text-xs font-bold text-[var(--text-main)] tracking-wider uppercase w-[30%]">Task Name</th>
                        <th className="py-4 px-6 text-xs font-bold text-[var(--text-main)] tracking-wider uppercase w-[15%]">Profile</th>
                        <th className="py-4 px-6 text-xs font-bold text-[var(--text-main)] tracking-wider uppercase w-[15%] text-center">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-[var(--text-main)] tracking-wider uppercase w-[20%] text-center">Progress</th>
                        <th className="py-4 px-6 text-xs font-bold text-[var(--text-main)] tracking-wider uppercase w-[20%]">Dev File / URL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {phase.tasks.map((task, tIdx) => (
                        <tr key={tIdx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6 text-sm font-medium">{task.name}</td>
                          <td className="py-4 px-6">
                            <span className="text-[10px] font-bold text-[var(--text-main)] uppercase tracking-widest px-2 py-1 bg-[var(--bg-base)] border border-[var(--border-color)] rounded-md shadow-sm">
                              {task.profile}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(task.status)}`}>
                              {task.status}
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
                          <td className="py-4 px-6">
                            <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-base)] border border-[var(--border-color)] px-2 py-1 rounded">
                              {task.url}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}