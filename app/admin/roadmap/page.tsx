'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { taskDetailsMap } from '@/lib/roadmapDetails';
// --- Dev Security Check ---
const isDev = process.env.NODE_ENV === 'development';

export default function DevRoadmapDashboard() {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'pseudo_code' | 'documentation' | 'qc_testing'>('roadmap');

  const [isQC, setIsQC] = useState(false);
  const [qcResults, setQcResults] = useState<any>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ success: boolean, message: string } | null>(null);
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
            } catch (e) { }
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
    } catch (e) {
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
      ticket: "1.0 ADMIN CATALOG INFRASTRUCTURE",
      description: "Core database, PIM, and mass-ingestion tools.",
      tasks: [
        { name: "1.1 Interactive PIM Grid", profile: "Admin", status: "Completed", progress: 100, url: "/admin/catalog" },
        { name: "1.2 Bulk-Sync API Engine", profile: "Admin", status: "Completed", progress: 100, url: "/api/admin/products/bulk-sync" },
        { name: "1.3 System Route Auditor", profile: "Admin", status: "Completed", progress: 100, url: "/admin/system-routes" },
        { name: "1.4 Route Consolidation", profile: "Admin", status: "Completed", progress: 100, url: "next.config.mjs" },
        { name: "1.5 Appearance Theme Engine", profile: "Admin", status: "Completed", progress: 100, url: "/admin/settings" },
        { name: "1.6 Real Inventory CSV Import", profile: "Admin", status: "Completed", progress: 100, url: "scripts/import_inventory.ts" }
      ]
    },
    {
      ticket: "2.0 GATEWAY & ACCESS CONTROL (RBAC)",
      description: "Securing the platform and segregating user profiles.",
      tasks: [
        { name: "2.1 NextAuth JWT Setup", profile: "All", status: "Completed", progress: 100, url: "/api/auth" },
        { name: "2.2 B2B Login & Registration UI", profile: "All", status: "Completed", progress: 100, url: "/login" },
        { name: "2.3 RBAC Edge Middleware", profile: "All", status: "Completed", progress: 100, url: "middleware.ts" },
        { name: "2.4 User Verification CRM", profile: "Admin, Salesman", status: "Completed", progress: 100, url: "/admin/clients" }
      ]
    },
    {
      ticket: "3.0 B2B PRESENTATION LAYER",
      description: "The luxury digital showroom and curation tools.",
      tasks: [
        { name: "3.1 Master Lookbook Grid", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard" },
        { name: "3.2 Framer Motion Flipbook", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard (Grid Replaced)" },
        { name: "3.3 PIN Gatekeeper", profile: "Business Owner", status: "Completed", progress: 100, url: "/login" },
        { name: "3.4 Price Breakup Export", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard/history" }
      ]
    },
    {
      ticket: "4.0 UNIFIED PO MATRIX & CART",
      description: "Frictionless wholesale ordering and cart logic.",
      tasks: [
        { name: "4.1 Global Cart & PDP Pages", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard/product" },
        { name: "4.2 PO Matrix Checkout UI", profile: "Business Owner", status: "Completed", progress: 100, url: "/dashboard/cart" },
        { name: "4.3 Real-Time Price Breakup", profile: "Business Owner", status: "Completed", progress: 100, url: "components/MatrixModal.tsx" },
        { name: "4.4 Draft PO Generation", profile: "Business Owner", status: "Completed", progress: 100, url: "/api/checkout/execute" }
      ]
    },
    {
      ticket: "5.0 MARGIN AUTOMATION & INTERNAL CRM",
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
      ticket: "6.0 FULFILLMENT & ERP ECOSYSTEM",
      description: "Finalizing the operational loop and notifications.",
      tasks: [
        { name: "6.1 PO Inbox & Triage Kanban", profile: "Admin", status: "Completed", progress: 100, url: "/admin/orders" },
        { name: "6.2 ERP Webhook Engine", profile: "Admin", status: "Completed", progress: 100, url: "/api/webhooks/erp" },
        { name: "6.3 SendGrid Automations", profile: "Admin", status: "Completed", progress: 100, url: "lib/mail/sendgrid.ts" }
      ]
    },
    {
      ticket: "7.0 GLOBAL THEME CUSTOMIZATION",
      description: "Admin panel for dynamic styling, branding, and color schemas.",
      tasks: [
        { name: "7.1 Theme Configuration Store", profile: "Admin", status: "Completed", progress: 100, url: "/admin/settings/theme" },
        { name: "7.2 CSS Variable Injection API", profile: "Admin", status: "Completed", progress: 100, url: "/api/admin/theme" },
        { name: "7.3 Live Preview Engine", profile: "Admin", status: "Completed", progress: 100, url: "/admin/settings/theme" }
      ]
    },
    {
      ticket: "8.0 V2: MULTI-TENANT ISOLATION (SAAS PIVOT)",
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
      ticket: "9.0 V2: SERVER-DRIVEN UI & NATIVE APP",
      description: "Decoupling API for React Native Expo App & Dynamic Builders.",
      tasks: [
        { name: "9.1 Admin SDUI Layout Builder", profile: "Super Admin, Admin", status: "Completed", progress: 100, url: "/admin/layout-builder" },
        { name: "9.2 Native Mobile Auth (Expo)", profile: "Client, Sales", status: "Completed", progress: 100, url: "/api/mobile/auth" },
        { name: "9.3 Headless PO Matrix Checkout", profile: "Client, Sales", status: "In Progress", progress: 15, url: "/api/checkout/execute" },
        { name: "9.4 Mobile Responsive Flipbook", profile: "Client, Sales", status: "Completed", progress: 100, url: "/catalog/flipbook/[id]" }
      ]
    },
    {
      ticket: "10.0 V2: OTA SCALE & SUPER ADMIN COMMAND",
      description: "Automated scaling, APK deployment, and multi-tenant troubleshooting.",
      tasks: [
        { name: "10.1 Bulk Sync Data Validation", profile: "Super Admin, Admin", status: "Completed", progress: 100, url: "/admin/inventory/import" },
        { name: "10.2 React Native CLI & CodePush Pipeline", profile: "Super Admin", status: "Completed", progress: 100, url: "/mobile" },
        { name: "10.3 Impersonation JWT Token Swap", profile: "Super Admin", status: "Completed", progress: 100, url: "/api/admin/impersonate" }
      ]
    },
    {
      ticket: "11.0 PHASE 2: ORDERS MODULE",
      description: "Bento grid order management, PO generation, and matrix ledger.",
      tasks: [
        { name: "11.1 Master PO Ledger", profile: "Admin", status: "Completed", progress: 100, url: "/admin/orders/all-pos" },
        { name: "11.2 Store Orders Split", profile: "Admin", status: "Completed", progress: 100, url: "/admin/orders/store" },
        { name: "11.3 E-Com Orders Split", profile: "Admin", status: "Completed", progress: 100, url: "/admin/orders/ecommerce" },
        { name: "11.4 Unified Action Architecture", profile: "Admin", status: "Completed", progress: 100, url: "/admin/orders/all" },
        { name: "11.5 Payment Link Conditioning", profile: "Admin", status: "Completed", progress: 100, url: "/admin/orders/[id]" }
      ]
    },
    {
      ticket: "12.0 V2: FLIPBOOK ANALYTICS & TELEMETRY",
      description: "Tracking catalog impressions, page views, and user engagement metrics.",
      tasks: [
        { name: "12.1 Flipbook Telemetry Engine", profile: "Admin", status: "Completed", progress: 100, url: "/catalog/flipbook/[id]" },
        { name: "12.2 Real-time Dashboard Analytics", profile: "Admin", status: "Completed", progress: 100, url: "/admin/analytics" },
        { name: "12.3 Conversion Funnel Tracking", profile: "Admin", status: "Completed", progress: 100, url: "/api/analytics/track" }
      ]
    },
    {
      ticket: "11.0 V2: ENTERPRISE INFRASTRUCTURE & BACKUPS",
      description: "Custom DNS mapping, BYODB Enterprise Tiers, and PITR cloud backups.",
      tasks: [
        { name: "11.1 Custom Domain DNS Resolver", profile: "Super Admin", status: "Completed", progress: 100, url: "middleware.ts" },
        { name: "11.2 BYODB (Bring Your Own DB) Router", profile: "Super Admin", status: "Completed", progress: 100, url: "lib/prisma.ts" },
        { name: "11.3 Automated PITR Cloud Backups", profile: "Super Admin", status: "Completed", progress: 100, url: "AWS / Supabase" },
        { name: "11.4 QLDB Tamper-Proof PO Ledger", profile: "System", status: "Completed", progress: 100, url: "AWS QLDB" }
      ]
    },
    {
      ticket: "12.0 AGILE TICKETING & DEVELOPMENT HUB",
      description: "Jira-style Kanban boards for clients to report issues and developers to track resolutions.",
      tasks: [
        { name: "12.1 Client Ticket Submission UI", profile: "Admin", status: "Completed", progress: 100, url: "/dashboard/support" },
        { name: "12.2 Master Kanban Board (Drag & Drop)", profile: "Master Admin", status: "Completed", progress: 100, url: "/admin/tickets" },
        { name: "12.3 Ticket Analytics (Client Load)", profile: "Master Admin", status: "Completed", progress: 100, url: "/admin/analytics" },
        { name: "12.4 Developer Assignment Engine", profile: "Master Admin", status: "Completed", progress: 100, url: "schema.prisma" }
      ]
    },
    {
      ticket: "13.0 V3: ELEMENTOR-STYLE SDUI THEME BUILDER",
      description: "Advanced drag-and-drop template builder with liquidity forms (Shopify/Elementor style).",
      tasks: [
        { name: "13.1 Dynamic Component Engine", profile: "Admin", status: "Completed", progress: 100, url: "/admin/theme-builder" },
        { name: "13.2 Visual Property Editor (Liquidity Form)", profile: "Admin", status: "Completed", progress: 100, url: "/admin/theme-builder" },
        { name: "13.3 Banner Module (Image, Video, Live Text)", profile: "Admin", status: "Completed", progress: 100, url: "/admin/theme-builder" },
        { name: "13.4 Advanced Styling Controls (Colors, Layout)", profile: "Admin", status: "Completed", progress: 100, url: "/admin/theme-builder" },
        { name: "13.5 Advanced SDUI Drag-and-Drop", profile: "Admin", status: "Completed", progress: 100, url: "/admin/pages" },
        { name: "13.6 Multi-Environment Publishing", profile: "Admin", status: "Completed", progress: 100, url: "/dashboard" }
      ]
    },
    {
      ticket: "14.0 INVENTORY SYNC & TESTING",
      description: "Testing real-world data import via CSV to validate system stability.",
      tasks: [
        { name: "14.1 Real Inventory CSV Import Test", profile: "Admin", status: "Completed", progress: 100, url: "/admin/inventory/import" }
      ]
    },
    {
      ticket: "15.0 SECURE MEDIA PROXY & OPTIMIZATION",
      description: "Dynamic image proxy to securely serve product images and optimize them on-the-fly.",
      tasks: [
        { name: "15.1 Secure Media Proxy Engine", profile: "System", status: "Completed", progress: 100, url: "/api/media/[id]" },
        { name: "15.2 On-the-fly WebP Optimization", profile: "System", status: "Completed", progress: 100, url: "sharp/memory" },
        { name: "15.3 Image Configurations UI", profile: "Admin", status: "Completed", progress: 100, url: "/dashboard/settings" },
        { name: "15.4 Smart Downloading URLs", profile: "Frontend", status: "Completed", progress: 100, url: "/dashboard/product" }
      ]
    },
    {
      ticket: "16.0 V3: UPCOMING BUSINESS SCOPES & ENHANCEMENTS",
      description: "Enterprise onboarding, flipbook optimizations, sidebar overhaul, matrix segregation, auto QC, and SDUI platform.",
      tasks: [
        { name: "16.1 Enterprise Onboarding Workflow", profile: "Super Admin", status: "Pending", progress: 0, url: "/admin/onboarding" },
        { name: "16.2 Master Inventory Advanced Filters", profile: "Admin", status: "Pending", progress: 0, url: "/dashboard" },
        { name: "16.3 Advanced PDF Generation Engine", profile: "System", status: "Pending", progress: 0, url: "/api/catalog/pdf" },
        { name: "16.4 Flipbook Rendering & UI Bug Fixes", profile: "Client", status: "Pending", progress: 0, url: "/catalog/flipbook/[id]" },
        { name: "16.5 Left Sidebar RBAC Overhaul", profile: "All Profiles", status: "Pending", progress: 0, url: "components/Sidebar.tsx" },
        { name: "16.6 Segment-Oriented PO Matrix Engine", profile: "Admin", status: "Pending", progress: 0, url: "/admin/matrix-builder" },
        { name: "16.7 SDUI Global Website Builder Platform", profile: "Admin", status: "Pending", progress: 0, url: "/admin/theme-builder" },
        { name: "16.8 Auto QC & Diagnostics Interface", profile: "Super Admin", status: "Pending", progress: 0, url: "/admin/roadmap" },
        { name: "16.9 AI MOM & Conversations Manager", profile: "System", status: "Pending", progress: 0, url: "AI_MOM_Backups" },
        { name: "16.10 Comprehensive Pseudocode & Manual", profile: "System", status: "Pending", progress: 0, url: "/admin/roadmap" }
      ]
    },
    {
      ticket: "17.0 PARAMETERS & DYNAMIC VARIANT ENGINE",
      description: "Advanced product configuration architecture, managing specific component variants (metal, size, gem) through hierarchical option sets and categories.",
      tasks: [
        { name: "17.1 Options Master Grid", profile: "Admin", status: "Completed", progress: 100, url: "/admin/parameters/options", lastModified: "2026-07-21T10:15:00", isRecent: true },
        { name: "17.2 Option Sets Hierarchy Builder", profile: "Admin", status: "Completed", progress: 100, url: "/admin/parameters/options", lastModified: "2026-07-21T10:30:00", isRecent: true },
        { name: "17.3 Product Categories Management", profile: "Admin", status: "Completed", progress: 100, url: "/admin/parameters/categories" },
        { name: "17.4 Collections Matrix (Manual & Rule-Based)", profile: "Admin", status: "Completed", progress: 100, url: "/admin/parameters/collections" },
        { name: "17.5 Collection Sub-Section Media Architecture", profile: "Admin", status: "Completed", progress: 100, url: "/admin/parameters/collections" }
      ]
    },
    {
      ticket: "18.0 MASTER CATALOG & INVENTORY",
      description: "Extensive product-level configuration, displaying a segmented timeline editor for pricing, multi-level variants, and stock store allocation.",
      tasks: [
        { name: "18.1 Single Product Editable Timeline", profile: "Admin", status: "Completed", progress: 100, url: "/admin/products/edit/[id]", lastModified: "2026-07-21T10:45:00", isRecent: false },
        { name: "18.2 Automated Variant Matrix UI", profile: "Admin", status: "Completed", progress: 100, url: "/admin/products", lastModified: "2026-07-21T11:15:00", isRecent: false },
        { name: "18.3 Variant Media Upload Modal", profile: "Admin", status: "Completed", progress: 100, url: "/admin/products/edit/[id]", lastModified: "2026-07-21T11:45:00", isRecent: true },
        { name: "18.4 Inventory Store Allocation Grid", profile: "Manager", status: "Completed", progress: 100, url: "/admin/inventory/stores", lastModified: "2026-07-21T11:45:00", isRecent: true },
        { name: "18.5 Product Reviews Workflow", profile: "Support", status: "Completed", progress: 100, url: "/admin/inventory/reviews", lastModified: "2026-07-21T11:45:00", isRecent: true },
        { name: "18.6 Master Inventory Grid", profile: "Admin", status: "Completed", progress: 100, url: "/admin/products", lastModified: "2026-07-21T11:18:00", isRecent: false }
      ]
    },
    {
      ticket: "19.0 OMNICHANNEL PRICING & LIVE RATES",
      description: "Core algorithmic pricing module syncing live MCX bullion rates and calculating specific gemstone, pearl, and labor making charges.",
      tasks: [
        { name: "19.1 Live Metal Price Dashboard", profile: "System", status: "Completed", progress: 100, url: "/admin/pricing", lastModified: new Date().toISOString(), isRecent: true },
        { name: "19.2 Diamond & Gemstone Price Master Matrix", profile: "Admin", status: "Completed", progress: 100, url: "/admin/pricing", lastModified: new Date().toISOString(), isRecent: true },
        { name: "19.3 Standard Details Configuration Modal", profile: "Admin", status: "Completed", progress: 100, url: "/admin/pricing", lastModified: new Date().toISOString(), isRecent: true },
        { name: "19.4 Making Charges & Pearl Price Matrices", profile: "Admin", status: "Completed", progress: 100, url: "/admin/pricing", lastModified: new Date().toISOString(), isRecent: true }
      ]
    },
    {
      ticket: "20.0 ADVANCED SDUI & BANNER MERCHANDISING",
      description: "Visual directory for routing high-fidelity promotional banners directly into storefront landing pages and PLP catalog grids.",
      tasks: [
        { name: "20.1 Banner Management Directory", profile: "Admin", status: "Pending", progress: 0, url: "/admin/banners" },
        { name: "20.2 Edit Banner Modal & Responsive Media Mapping", profile: "Admin", status: "Pending", progress: 0, url: "/admin/banners" },
        { name: "20.3 PLP In-Grid Promo Banner Integration", profile: "Admin", status: "Pending", progress: 0, url: "/admin/banners" },
        { name: "20.4 Frontend Hero Landing Page Automation", profile: "System", status: "Pending", progress: 0, url: "/admin/banners/landing" },
        { name: "20.5 Theme Builder & Assets Library", profile: "Admin", status: "Pending", progress: 0, url: "/admin/theme-builder" }
      ]
    },
    {
      ticket: "21.0 ORDER RECONCILIATION & 11+1 SCHEMES",
      description: "Tracking engine for comprehensive order lifecycle events, advanced log filtering, inventory weight bagging, and gold savings schemes.",
      tasks: [
        { name: "21.1 All Orders & Ecom Orders Advanced Filters", profile: "Sales", status: "Pending", progress: 0, url: "/admin/orders" },
        { name: "21.2 Single Order Detail View & Timeline Logging", profile: "Sales", status: "Pending", progress: 0, url: "/admin/orders" },
        { name: "21.3 Inventory Bagging & Weight Reconciliation Tool", profile: "Admin", status: "Pending", progress: 0, url: "/admin/orders" },
        { name: "21.4 All Transactions & Payment Gateway Status", profile: "Finance", status: "Pending", progress: 0, url: "/admin/orders" },
        { name: "21.5 11+1 Monthly Gold Savings Scheme Dashboard", profile: "Admin", status: "Pending", progress: 0, url: "/admin/schemes" },
        { name: "21.6 Return Management (Reverse Pickup)", profile: "Support", status: "Pending", progress: 0, url: "/admin/returns" }
      ]
    },
    {
      ticket: "22.0 CRM, ENQUIRIES & TEAM PERMISSIONS",
      description: "Centralized support hub for tracking video appointments, resolving client tickets, and establishing internal enterprise HR roles.",
      tasks: [
        { name: "22.1 All Customers & User Group Policy routing", profile: "Sales", status: "Completed", progress: 100, url: "/admin/customers" },
        { name: "22.2 Enquiries Dashboard", profile: "Support", status: "Completed", progress: 100, url: "/admin/customers/enquiries" },
        { name: "22.3 Customer Inquiry Modal & Ticket Resolution", profile: "Support", status: "Pending", progress: 0, url: "/admin/customers/enquiries" },
        { name: "22.4 Teams & Permission Roles Access Control", profile: "Super Admin", status: "Pending", progress: 0, url: "/admin/teams" }
      ]
    },
    {
      ticket: "23.0 ENTERPRISE SETTINGS & DOMAIN MAPPING",
      description: "Global multi-tenant configuration establishing unique SaaS brand identities, typography, domain DNS mapping, and 3rd-party software routing.",
      tasks: [
        { name: "23.1 Brand Profile & Logo Asset Management", profile: "Super Admin", status: "Pending", progress: 0, url: "/admin/settings" },
        { name: "23.2 Appearance & Theme Colors Configuration", profile: "Admin", status: "Pending", progress: 0, url: "/admin/settings" },
        { name: "23.3 3rd Party Integrations", profile: "Super Admin", status: "Pending", progress: 0, url: "/admin/settings" },
        { name: "23.4 Advanced Configuration (Domain DNS Setup)", profile: "System", status: "Pending", progress: 0, url: "/admin/settings" },
        { name: "23.5 Social Media & OG Image Routing", profile: "Admin", status: "Pending", progress: 0, url: "/admin/settings/social" }
      ]
    },
    {
      ticket: "24.0 EXECUTIVE DASHBOARD & SYSTEM LOGS",
      description: "Primary performance indicators and global audit logging to ensure operational accountability across all users.",
      tasks: [
        { name: "24.1 Executive Dashboard Analytics", profile: "Super Admin", status: "Pending", progress: 0, url: "/admin/dashboard" },
        { name: "24.2 Global Events & Logs Panel", profile: "System", status: "Completed", progress: 100, url: "/admin/events-logs" }
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
  const completedTickets: any[] = [];

  roadmapData.forEach((phase, pIdx) => {
    const incomplete = phase.tasks.filter(t => t.status !== 'Completed');
    const complete = phase.tasks.filter(t => t.status === 'Completed');

    if (incomplete.length > 0) {
      // Assign priority based on phase for now
      let priority = 'Medium';
      if (phase.ticket.startsWith('9.') || phase.ticket.startsWith('12.')) priority = 'High';
      if (phase.ticket.startsWith('11.')) priority = 'Low';

      incomplete.forEach((t) => {
        allIncompleteTasks.push({
          ...t,
          ticketName: phase.ticket,
          priority,
          originalTicketIdx: pIdx,
          originalTaskIdx: phase.tasks.indexOf(t)
        });
      });
    }

    if (complete.length > 0) {
      completedTickets.push({
        ...phase,
        originalTicketIdx: pIdx,
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

        <div className="relative bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-8 md:p-10 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          {/* BACKGROUND GLOW WRAPPER */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-primary)] opacity-5 blur-[100px] rounded-full"></div>
          </div>

          {/* LEFT: TITLE & CTA */}
          <div className="relative z-10 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[var(--text-main)] mb-2 flex items-center gap-4">
                Project <strong className="font-bold bg-[var(--brand-primary)] text-[var(--brand-text)] px-3 py-1 rounded-lg shadow-sm">Master</strong> Ledger
              </h1>
              <p className="text-[var(--text-muted)] font-mono text-sm">Jewelment B2B Architecture</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  )}
                  {isSyncing ? 'Syncing...' : 'Sync to GitHub'}
                </button>

                {syncStatus && (
                  <div className={`absolute top-full mt-3 left-0 whitespace-nowrap text-[11px] uppercase font-bold tracking-widest px-4 py-2 rounded-lg border shadow-lg z-50 animate-in fade-in slide-in-from-top-2 ${syncStatus.success ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'}`}>
                    <div className="flex items-center gap-2">
                      {syncStatus.success ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      )}
                      {syncStatus.message}
                    </div>
                  </div>
                )}

                {/* LIVE TERMINAL LOGS */}
                {syncLogs.length > 0 && !syncStatus && (
                  <div className="absolute top-full mt-3 left-0 w-[450px] bg-[#0d1117] text-[#3fb950] p-4 rounded-xl border border-[#30363d] shadow-2xl z-50 h-56 overflow-y-auto custom-scrollbar flex flex-col gap-2 font-mono text-[11px] leading-relaxed animate-in fade-in slide-in-from-top-2">
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

          {/* RIGHT: DASHBOARD METRICS */}
          <div className="relative z-10 w-full xl:w-1/2 grid grid-cols-2 gap-4">

            {/* Metric 1: Global Completion (Brand Primary Tinted Glass) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-primary)]/10 to-[var(--brand-primary)]/5 backdrop-blur-2xl border border-[var(--brand-primary)]/20 p-5 rounded-2xl shadow-sm flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[var(--brand-primary)]/40">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--brand-primary)] opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand-primary)]">Global Progress</p>
              <div className="mt-4 flex items-end justify-between relative z-10">
                <div className="text-3xl lg:text-4xl font-bold text-[var(--text-main)] font-mono tracking-tighter">{globalProgress}%</div>
                <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-2 bg-[var(--brand-primary)] opacity-20 blur-md rounded-full group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                  <svg className="w-full h-full transform -rotate-90 overflow-visible relative z-10" viewBox="0 0 36 36">
                    <path className="text-[var(--brand-primary)] opacity-20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-[var(--brand-primary)] transition-all duration-1500 ease-out" strokeDasharray={`${globalProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Metric 2: Completed Modules (Emerald Tinted Glass) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-2xl border border-emerald-500/20 p-5 rounded-2xl shadow-sm flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-500/40">
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">Deployed Tasks</p>
              <div className="mt-4 flex items-end justify-between relative z-10">
                <div className="text-3xl lg:text-4xl font-bold text-emerald-600 dark:text-emerald-500 font-mono tracking-tighter drop-shadow-sm">{completedTasks}<span className="text-sm text-emerald-600/50 dark:text-emerald-500/50">/{totalTasks}</span></div>

                {/* Mini Bar Chart Graph */}
                <div className="flex items-end gap-1 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-3 bg-emerald-500/40 rounded-t-sm"></div>
                  <div className="w-1.5 h-4 bg-emerald-500/50 rounded-t-sm"></div>
                  <div className="w-1.5 h-2 bg-emerald-500/60 rounded-t-sm"></div>
                  <div className="w-1.5 h-6 bg-emerald-500/70 rounded-t-sm"></div>
                  <div className="w-1.5 h-4 bg-emerald-500/80 rounded-t-sm group-hover:h-7 transition-all duration-300"></div>
                  <div className="w-1.5 h-8 bg-emerald-500 rounded-t-sm shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>
            </div>

            {/* Metric 3: Active Priorities (Amber Tinted Glass) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-2xl border border-amber-500/20 p-5 rounded-2xl shadow-sm flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-amber-500/40">
              <div className="absolute -right-5 -bottom-5 w-24 h-24 bg-amber-500 opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Active Queue</p>
              <div className="mt-4 flex items-end justify-between relative z-10">
                <div className="text-3xl lg:text-4xl font-bold text-amber-600 dark:text-amber-500 font-mono tracking-tighter drop-shadow-sm">{allIncompleteTasks.length}</div>

                {/* Descending Mini Graph */}
                <div className="flex items-end gap-1 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div className="w-1.5 h-8 bg-amber-500 rounded-t-sm shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-1.5 h-6 bg-amber-500/80 rounded-t-sm"></div>
                  <div className="w-1.5 h-4 bg-amber-500/60 rounded-t-sm"></div>
                  <div className="w-1.5 h-3 bg-amber-500/50 rounded-t-sm group-hover:h-2 transition-all duration-300"></div>
                  <div className="w-1.5 h-2 bg-amber-500/40 rounded-t-sm"></div>
                  <div className="w-1.5 h-1 bg-amber-500/30 rounded-t-sm"></div>
                </div>
              </div>
            </div>

            {/* Metric 4: Dev Ticket (Purple Tinted Glass) */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-2xl border border-purple-500/20 p-5 rounded-2xl shadow-sm flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-purple-500/40">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500 opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity"></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Current Ticket</p>
              <div className="mt-4 flex items-end justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 tracking-tighter">v2.0</div>
                  <div className="relative flex h-3 w-3 -mt-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                  </div>
                </div>
                <div className="text-[9px] uppercase font-bold text-purple-600/70 dark:text-purple-400/70 text-right leading-tight tracking-widest">Multi-Tenant<br />SaaS Pivot</div>
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
                <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <thead>
                        <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                          <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[30%]">Task Name</th>
                          <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[15%]">Ticket / Epic</th>
                          <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[10%] text-center">Priority</th>
                          <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[15%] text-center">Last Modified</th>
                          <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[15%] text-center">Progress</th>
                          <th className="py-4 px-6 text-xs font-bold text-[var(--brand-primary)] tracking-wider uppercase w-[15%] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-color)]">
                        {allIncompleteTasks.map((task, idx) => {
                          const taskId = `${task.originalTicketIdx}-${task.originalTaskIdx}`;
                          const isExpanded = expandedTask === taskId;
                          return (
                            <React.Fragment key={taskId}>
                              <tr className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isExpanded ? 'bg-black/5 dark:bg-white/5' : ''}`}>
                                <td className="py-4 px-6 text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                                  {task.name}
                                  {task.isRecent && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold bg-[var(--brand-primary)] text-[var(--brand-text)] animate-pulse shadow-sm">Recent</span>}
                                </td>
                                <td className="py-4 px-6">
                                  <span className="text-[10px] font-bold text-[var(--text-muted)] truncate max-w-[150px] inline-block">
                                    {task.ticketName}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${task.priority === 'High' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                                      task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                        'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                    }`}>
                                    {task.priority}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-center text-[10px] font-mono text-[var(--text-muted)]">
                                  {task.lastModified ? new Date(task.lastModified).toLocaleDateString('en-GB') : '--'}
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
                                    className="inline-flex items-center text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border border-transparent bg-[var(--brand-primary)] text-[var(--brand-text)] hover:opacity-90 transition-opacity"
                                  >
                                    Open
                                    <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                  </a>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                                  <td colSpan={5} className="px-6 py-6 border-l-4 border-[var(--brand-primary)] whitespace-normal">
                                    <div className="flex flex-col gap-6">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--border-color)]">
                                          <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Implementation Details
                                          </h4>
                                          <p className="text-sm text-[var(--text-main)] mb-3 leading-relaxed">
                                            {taskDetailsMap[task.name]?.description || "Architectural specification and pseudo-code definition based on roadmap guidelines."}
                                          </p>
                                        </div>
                                        <div className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/20">
                                          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            QA & Testing Pointers
                                          </h4>
                                          <ul className="list-disc pl-5 text-sm space-y-2 text-amber-700/80 dark:text-amber-400/80">
                                            <li>{taskDetailsMap[task.name]?.howToTest || "Execute boundary tests on edge cases (e.g., invalid tokens, malformed POST payloads)."}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      {taskDetailsMap[task.name]?.images && (
                                        <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--border-color)]">
                                          <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)] mb-4 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            Visual Architecture & Layout References
                                          </h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {taskDetailsMap[task.name]?.images?.map((img, i) => (
                                              <div key={i} className="flex flex-col gap-3 group">
                                                <div className="relative rounded-lg overflow-hidden border border-[var(--border-color)] bg-black/5 dark:bg-white/5 shadow-sm group-hover:border-[var(--brand-primary)] transition-colors">
                                                  <img src={img.src} alt={img.caption} className="w-full h-auto max-h-[300px] object-cover" />
                                                </div>
                                                <p className="text-xs font-mono text-[var(--text-muted)] text-center px-2">{img.caption}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
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

              {completedTickets.map((ticket) => (
                <div key={ticket.originalTicketIdx} className="space-y-4 mb-8">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-[var(--text-main)]">{ticket.ticket}</h3>
                  </div>

                  <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                          <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                            <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[30%]">Task Name</th>
                            <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[15%]">Ticket</th>
                            <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[10%] text-center">Status</th>
                            <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[15%] text-center">Last Modified</th>
                            <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[15%] text-center">Progress</th>
                            <th className="py-3 px-6 text-xs font-bold text-[var(--text-muted)] tracking-wider uppercase w-[15%] text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                          {ticket.tasks.map((task: any) => {
                            const taskId = `${ticket.originalTicketIdx}-${task.originalTaskIdx}`;
                            const isExpanded = expandedTask === taskId;
                            return (
                              <React.Fragment key={taskId}>
                                <tr className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isExpanded ? 'bg-black/5 dark:bg-white/5' : ''}`}>
                                  <td className="py-3 px-6 text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                                    {task.name}
                                    {task.isRecent && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold bg-[var(--brand-primary)] text-[var(--brand-text)] animate-pulse shadow-sm">Recent</span>}
                                  </td>
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
                                  <td className="py-3 px-6 text-center text-[10px] font-mono text-[var(--text-muted)]">
                                    {task.lastModified ? new Date(task.lastModified).toLocaleDateString('en-GB') : '--'}
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
                                      className="inline-flex items-center text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-lg border border-transparent bg-[var(--bg-base)] text-[var(--text-main)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text)] transition-colors border-[var(--border-color)] shadow-sm"
                                    >
                                      Open
                                    </a>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                                    <td colSpan={5} className="px-6 py-6 border-l-4 border-emerald-500 whitespace-normal">
                                      <div className="flex flex-col gap-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--border-color)]">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3 flex items-center gap-2">
                                              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                              Completed Module Details
                                            </h4>
                                            <p className="text-sm text-[var(--text-main)] mb-3 leading-relaxed">
                                              {taskDetailsMap[task.name]?.description || "This module has been successfully integrated into the platform architecture and passed automated QA."}
                                            </p>
                                          </div>
                                          <div className="bg-emerald-500/5 p-5 rounded-xl border border-emerald-500/20">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                              Testing Instructions
                                            </h4>
                                            <ul className="list-disc pl-5 text-sm space-y-2 text-emerald-700/80 dark:text-emerald-400/80">
                                              <li>{taskDetailsMap[task.name]?.howToTest || "Check the specific system route via the Open button to interact with it directly in the live environment."}</li>
                                            </ul>
                                          </div>
                                        </div>
                                        {taskDetailsMap[task.name]?.images && (
                                          <div className="bg-[var(--bg-base)] p-5 rounded-xl border border-[var(--border-color)]">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4 flex items-center gap-2">
                                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                              Deployed Visual Architecture
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                              {taskDetailsMap[task.name]?.images?.map((img, i) => (
                                                <div key={i} className="flex flex-col gap-3 group">
                                                  <div className="relative rounded-lg overflow-hidden border border-[var(--border-color)] bg-black/5 dark:bg-white/5 shadow-sm group-hover:border-emerald-500/50 transition-colors">
                                                    <img src={img.src} alt={img.caption} className="w-full h-auto max-h-[300px] object-cover" />
                                                  </div>
                                                  <p className="text-xs font-mono text-[var(--text-muted)] text-center px-2">{img.caption}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
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
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">4. Dynamic BYODB (Bring Your Own DB) Router</h3>
                <div className="bg-black/80 text-purple-400 p-5 rounded-xl font-mono text-xs overflow-x-auto">
                  <pre>{`// Pseudo-code for lib/prisma.ts
function getTenantPrisma(tenantId) {
    // 1. Check if we already have a cached Prisma Client for this tenant
    if (global.prismaClients[tenantId]) return global.prismaClients[tenantId];

    // 2. Fetch the Enterprise Tenant's specific Database URL
    const tenantConfig = db.Tenant.findById(tenantId);
    
    // 3. Fallback to default DB if no custom URL is provided
    const connectionUrl = tenantConfig.customDbUrl || process.env.DATABASE_URL;

    // 4. Instantiate a new Prisma Client specifically for this database
    const newPrisma = new PrismaClient({
        datasources: { db: { url: connectionUrl } }
    });

    // 5. Cache and return
    global.prismaClients[tenantId] = newPrisma;
    return newPrisma;
}`}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">5. Agile Support Kanban (Optimistic UI)</h3>
                <div className="bg-black/80 text-pink-400 p-5 rounded-xl font-mono text-xs overflow-x-auto">
                  <pre>{`// Pseudo-code for /admin/tickets Kanban Drag & Drop
async function handleDragEnd(event) {
    const { activeTicketId, newStatusColumn } = event;

    // 1. Optimistic UI Update (Instant visual feedback)
    setLocalTickets(prev => prev.map(ticket => 
        ticket.id === activeTicketId ? { ...ticket, status: newStatusColumn } : ticket
    ));

    try {
        // 2. Background Database Sync
        await fetch(\`/api/tickets/\${activeTicketId}\`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatusColumn })
        });
    } catch (error) {
        // 3. Revert UI if the server request fails
        toast.error("Failed to sync status");
        revertLocalTickets();
    }
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
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-main)] mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--brand-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Table of Contents
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[var(--brand-primary)] font-medium">
                <li><a href="#section-1" className="hover:underline flex items-center gap-2"><span className="text-[var(--text-muted)]">01.</span> Getting Started & Secure Access</a></li>
                <li><a href="#section-2" className="hover:underline flex items-center gap-2"><span className="text-[var(--text-muted)]">02.</span> The Immersive 3D Flipbook</a></li>
                <li><a href="#section-3" className="hover:underline flex items-center gap-2"><span className="text-[var(--text-muted)]">03.</span> Ordering via Wholesale Matrix Cart</a></li>
                <li><a href="#section-4" className="hover:underline flex items-center gap-2"><span className="text-[var(--text-muted)]">04.</span> Tracking Purchase Orders & History</a></li>
                <li><a href="#section-5" className="hover:underline flex items-center gap-2"><span className="text-[var(--text-muted)]">05.</span> Client Support & Ticketing</a></li>
                <li><a href="#section-6" className="hover:underline flex items-center gap-2"><span className="text-[var(--text-muted)]">06.</span> Product Variant & Parameters Engine</a></li>
              </ul>
            </div>

            <div className="space-y-12">

              {/* SECTION 1 */}
              <div id="section-1" className="space-y-4 pt-4 scroll-mt-20">
                <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] flex items-center justify-center text-sm shadow-sm font-extrabold">1</span> Getting Started & Secure Access</h3>
                <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-[var(--text-main)] mb-4">
                    The B2B Portal is strictly invitation-only. To gain access, you must first be approved by an administrator. Once approved, you will log in using your registered email and a secure PIN/Password.
                  </p>
                  <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                    <li className="flex gap-3"><svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Navigate to the <code>/login</code> portal.</li>
                    <li className="flex gap-3"><svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Enter your verified email address and secure password.</li>
                    <li className="flex gap-3"><svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> If accessing a strictly confidential collection, a secondary 4-digit PIN may be required.</li>
                  </ul>
                  <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    [Screenshot: B2B Login & Registration Gateway]
                  </div>
                </div>
              </div>

              {/* SECTION 2 */}
              <div id="section-2" className="space-y-4 pt-4 border-t border-[var(--border-color)] scroll-mt-20">
                <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] flex items-center justify-center text-sm shadow-sm font-extrabold">2</span> The Immersive 3D Flipbook</h3>
                <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-[var(--text-main)] mb-4">
                    Instead of static PDFs, we use a fully interactive 3D digital lookbook that adapts to your device.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ul className="space-y-4 text-sm text-[var(--text-muted)]">
                      <li className="bg-[var(--bg-surface)] p-3 rounded border border-[var(--border-color)]"><strong>Navigation:</strong> Click the corners of the book or swipe on touchscreens to turn the page.</li>
                      <li className="bg-[var(--bg-surface)] p-3 rounded border border-[var(--border-color)]"><strong>Device Orientation:</strong> On mobile phones held vertically (portrait), the book will display one maximized page at a time. Turn horizontally (landscape) to view the two-page spread.</li>
                      <li className="bg-[var(--bg-surface)] p-3 rounded border border-[var(--border-color)]"><strong>Quick Add:</strong> Click any product image inside the book to instantly open its purchasing grid.</li>
                    </ul>
                    <div className="flex flex-col gap-2">
                      <div className="h-full p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 text-xs text-center">
                        <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        [Screenshot: 3D Flipbook Interface]
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3 */}
              <div id="section-3" className="space-y-4 pt-4 border-t border-[var(--border-color)] scroll-mt-20">
                <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] flex items-center justify-center text-sm shadow-sm font-extrabold">3</span> Ordering via the Wholesale Matrix Cart</h3>
                <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-[var(--text-main)] mb-4">
                    As a wholesale buyer, you often need to order multiple variants of a single design simultaneously. We built the Matrix Cart specifically for this.
                  </p>
                  <ul className="list-decimal pl-5 text-sm space-y-3 text-[var(--text-muted)] font-medium">
                    <li><strong className="text-[var(--text-main)]">The Grid:</strong> When you select a product, a spreadsheet-like grid will appear showing all available Metals (14K, 18K) and Sizes.</li>
                    <li><strong className="text-[var(--text-main)]">Bulk Entry:</strong> Simply type the quantity you want for each specific combination.</li>
                    <li><strong className="text-[var(--text-main)]">Live Estimation:</strong> The system automatically calculates your Purchase Order (PO) total based on today's live metal rates and your discount tier.</li>
                    <li><strong className="text-[var(--text-main)]">Checkout:</strong> Review your cart and click "Generate PO" to send the order to manufacturing.</li>
                  </ul>
                  <div className="mt-6 p-4 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    [Screenshot: Matrix Cart Slide-Out]
                  </div>
                </div>
              </div>

              {/* SECTION 4 */}
              <div id="section-4" className="space-y-4 pt-4 border-t border-[var(--border-color)] scroll-mt-20">
                <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] flex items-center justify-center text-sm shadow-sm font-extrabold">4</span> Tracking Purchase Orders & History</h3>
                <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-[var(--text-main)] mb-4">
                    Your Client Dashboard serves as your historical ledger for tracking active fulfillment.
                  </p>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <span className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <p className="text-sm text-[var(--text-main)]"><strong>Pending:</strong> Order received, awaiting manufacturing approval.</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 shrink-0"></span>
                        <p className="text-sm text-[var(--text-main)]"><strong>Processing:</strong> Currently in the production cycle.</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <span className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <p className="text-sm text-[var(--text-main)]"><strong>Shipped:</strong> Dispatched. You can download the Proforma PDF.</p>
                      </div>
                    </div>
                    <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs text-center">
                      [Screenshot: History Ledger & Status Tags]
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5 */}
              <div id="section-5" className="space-y-4 pt-4 border-t border-[var(--border-color)] scroll-mt-20">
                <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] flex items-center justify-center text-sm shadow-sm font-extrabold">5</span> Client Support & Ticketing</h3>
                <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-[var(--text-main)] mb-4">
                    If you experience any issues, require new features, or have general questions, you can use our built-in Jira-style Agile Ticketing System.
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--text-muted)] mt-2">
                    <li>Navigate to the <code>/dashboard/support</code> tab.</li>
                    <li>Fill out the form, categorizing your issue (Bug, Feature Request, Question) and Priority (Low, Normal, High, Urgent).</li>
                    <li>You will be able to track your ticket's progress (Open, In Progress, Resolved) directly from this page in real-time as admins work on it.</li>
                  </ul>
                  <div className="mt-6 p-4 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    [Screenshot: Support Ticketing Interface]
                  </div>
                </div>
              </div>

              {/* SECTION 6 */}
              <div id="section-6" className="space-y-4 pt-4 border-t border-[var(--border-color)] scroll-mt-20">
                <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-[var(--brand-primary)] text-[var(--brand-text)] flex items-center justify-center text-sm shadow-sm font-extrabold">6</span> Product Variant & Parameters Engine</h3>
                <div className="bg-[var(--bg-base)] border border-[var(--border-color)] rounded-xl p-6 shadow-sm">
                  <p className="text-sm leading-relaxed text-[var(--text-main)] mb-4">
                    The backbone of our jewelry catalog is the Dynamic Variant Engine. This allows for complex hierarchical generation of permutations like Gold Purity, Size, and Gemstone.
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-2 text-[var(--text-muted)] mt-2">
                    <li><strong>Global Parameters:</strong> Admins define raw elements (e.g., 14K Gold, SI Diamond) in the Options Master Grid.</li>
                    <li><strong>Option Sets:</strong> Combine these parameters into logic sets (e.g., "Diamond Ring Standards") which dictate how thousands of child variants are automatically built.</li>
                    <li><strong>The Variant Matrix:</strong> Within any specific product detail page, a master grid renders every possible combination with dedicated toggles to upload specific visual assets (like Rose Gold images) mapped directly to that variant string.</li>
                  </ul>
                  <div className="mt-6 p-4 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 text-xs">
                    [Screenshot: Variant Matrix Editing Workspace]
                  </div>
                </div>
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
                className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-[var(--brand-text)] font-bold uppercase tracking-widest text-xs rounded-full shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shimmer-hover overflow-hidden"
              >
                {isQC ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--brand-text)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
                <div className={`p-4 rounded-xl border flex items-center justify-between ${qcResults.systemStatus === 'HEALTHY' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
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
                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${res.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-500' :
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

                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${res.status === 'PASS' ? 'border-emerald-500/30 text-emerald-500' :
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