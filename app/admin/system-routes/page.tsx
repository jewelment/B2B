'use client';

import React from 'react';
import Link from 'next/link';

export default function SystemRoutesAuditor() {
  type Route = { path: string; label: string; type: string; status: string; lastModified?: string };
  const routes: Route[] = [
    // --- Public / Gateway ---
    { path: '/', label: 'B2B Front Door (Gateway)', type: 'Public', status: 'Active' },
    { path: '/login', label: 'B2B Login & PIN Lock', type: 'Public', status: 'Active' },
    { path: '/register', label: 'Partner Onboarding', type: 'Public', status: 'Active' },
    { path: '/reset-password', label: 'Password Reset Gateway', type: 'Public', status: 'Active' },
    
    // --- Business Owner / Client (Protected) ---
    { path: '/dashboard', label: 'Wholesale Catalog & Matrix', type: 'Protected', status: 'Active' },
    { path: '/dashboard/cart', label: 'PO Matrix Checkout', type: 'Protected', status: 'Active' },
    { path: '/dashboard/history', label: 'Order History & Ledger', type: 'Protected', status: 'Active' },
    { path: '/dashboard/product/[handle]', label: 'Product Details', type: 'Protected', status: 'Active' },
    { path: '/dashboard/settings', label: 'Client Profile Hub', type: 'Protected', status: 'Active' },
    { path: '/dashboard/support', label: 'Client Support Ticketing', type: 'Protected', status: 'Active' },
    { path: '/inventory', label: 'Global Inventory Explorer', type: 'Protected', status: 'Active' },
    { path: '/catalog/view/[id]', label: 'Dynamic Catalog View', type: 'Protected', status: 'Active' },
    { path: '/catalog/flipbook/[id]', label: 'Dynamic Flipbook View', type: 'Protected', status: 'Active' },
    
    // --- Admin / Salesman ---
    { path: '/admin', label: 'Executive E-Commerce Dashboard', type: 'Admin', status: 'Active' },
    { path: '/admin/ai-moms', label: 'AI Moms (Minutes of Meeting)', type: 'Admin', status: 'Active' },
    { path: '/admin/analytics', label: 'Ticket Analytics Dashboard', type: 'Admin', status: 'Active' },
    { path: '/admin/app-screens', label: 'App Screens Management', type: 'Admin', status: 'Active' },
    { path: '/admin/app-screens/[id]/builder', label: 'App Screen Builder', type: 'Admin', status: 'Active' },
    { path: '/admin/assets', label: 'Asset Library / CDN', type: 'Admin', status: 'Active' },
    { path: '/admin/catalog', label: 'Master Catalog (PIM)', type: 'Admin', status: 'Active' },
    { path: '/admin/clients', label: 'Partner Network (CRM)', type: 'Admin', status: 'Active' },
    { path: '/admin/customers', label: 'All Customers', type: 'Admin', status: 'Active' },
    { path: '/admin/customers/enquiries', label: 'Customer Enquiries', type: 'Admin', status: 'Active' },
    { path: '/admin/customers/user-groups', label: 'Customer User Groups / Policies', type: 'Admin', status: 'Active' },
    { path: '/admin/discounts', label: 'Discount CRM', type: 'Admin', status: 'Active' },
    { path: '/admin/divkit-test', label: 'DivKit Testing UI', type: 'Admin', status: 'Active' },
    { path: '/admin/events-logs', label: 'System Events & Logs', type: 'Admin', status: 'Active' },
    { path: '/admin/inventory', label: 'Global Inventory Management', type: 'Admin', status: 'Active' },
    { path: '/admin/inventory/add', label: 'Add New Inventory', type: 'Admin', status: 'Active' },
    { path: '/admin/inventory/fields', label: 'Inventory Metafields', type: 'Admin', status: 'Active' },
    { path: '/admin/inventory/grid', label: 'Global Inventory Engine', type: 'Admin', status: 'Active' },
    { path: '/admin/inventory/import', label: 'Data Import Engine', type: 'Admin', status: 'Active' },
    { path: '/admin/inventory/master-grid', label: 'Master Inventory Grid (Data-Dense)', type: 'Admin', status: 'Active' },
    { path: '/admin/inventory/[id]', label: 'Inventory Item Details', type: 'Admin', status: 'Active' },
    { path: '/admin/layout-builder', label: 'SDUI Layout Builder', type: 'Admin', status: 'Active' },
    { path: '/admin/orders', label: 'PO Inbox & Kanban', type: 'Admin', status: 'Active' },
    { path: '/admin/pages', label: 'Pages Management', type: 'Admin', status: 'Active' },
    { path: '/admin/pages/[id]/builder', label: 'Page Builder', type: 'Admin', status: 'Active' },
    { path: '/admin/parameters/categories', label: 'Product Categories', type: 'Admin', status: 'Active' },
    { path: '/admin/parameters/collections', label: 'Product Collections', type: 'Admin', status: 'Active' },
    { path: '/admin/parameters/collections/[id]', label: 'Collection Details', type: 'Admin', status: 'Active' },
    { path: '/admin/parameters/options', label: 'Product Options', type: 'Admin', status: 'Active' },
    { path: '/admin/parameters/options/sets/[id]', label: 'Option Sets', type: 'Admin', status: 'Active' },
    { path: '/admin/parameters/options/[id]', label: 'Option Details', type: 'Admin', status: 'Active' },
    { path: '/admin/pricing', label: 'Master Pricing & Bullion', type: 'Admin', status: 'Active' },
    { path: '/admin/pricing/live-rates', label: 'Omnichannel Live Rates Engine', type: 'Admin', status: 'Active' },
    { path: '/admin/products', label: 'Master Products List', type: 'Admin', status: 'Active' },
    { path: '/admin/products/edit/[id]', label: 'Single Product Editor', type: 'Admin', status: 'Active' },
    { path: '/admin/products/[id]', label: 'Single Product Details', type: 'Admin', status: 'Active' },
    { path: '/admin/reviews', label: 'Product Reviews Workflow', type: 'Admin', status: 'Active' },
    { path: '/admin/settings/theme', label: 'Theme Settings', type: 'Admin', status: 'Active' },
    { path: '/admin/tickets', label: 'Master Kanban Board', type: 'Admin', status: 'Active' },
    
    // --- Core API & Engine Subsystems ---
    { path: '/api/admin/ai-moms', label: 'AI Moms API', type: 'API', status: 'Active' },
    { path: '/api/admin/clients', label: 'Clients Management API', type: 'API', status: 'Active' },
    { path: '/api/admin/git-sync', label: 'Git Sync API', type: 'API', status: 'Active' },
    { path: '/api/admin/impersonate', label: 'Admin Impersonation API', type: 'API', status: 'Active' },
    { path: '/api/admin/orders', label: 'Orders API', type: 'API', status: 'Active' },
    { path: '/api/admin/parameters/collections', label: 'Collections API', type: 'API', status: 'Active' },
    { path: '/api/admin/products', label: 'Products Management API', type: 'API', status: 'Active' },
    { path: '/api/admin/products/bulk-sync', label: 'Products Bulk Sync API', type: 'API', status: 'Active' },
    { path: '/api/admin/products/fields', label: 'Product Fields API', type: 'API', status: 'Active' },
    { path: '/api/admin/products/fields/[id]', label: 'Single Field API', type: 'API', status: 'Active' },
    { path: '/api/admin/products/import/execute', label: 'Products Import Execution API', type: 'API', status: 'Active' },
    { path: '/api/admin/products/templates', label: 'Product Templates API', type: 'API', status: 'Active' },
    { path: '/api/admin/products/[id]/options', label: 'Product Options API', type: 'API', status: 'Active' },
    { path: '/api/admin/products/[id]/variants', label: 'Product Variants API', type: 'API', status: 'Active' },
    { path: '/api/admin/qc-runner', label: 'QC Runner API', type: 'API', status: 'Active' },
    { path: '/api/admin/sdui/save', label: 'SDUI Save API', type: 'API', status: 'Active' },
    { path: '/api/admin/theme', label: 'Theme Configuration API', type: 'API', status: 'Active' },
    { path: '/api/admin/theme-builder', label: 'Theme Builder API', type: 'API', status: 'Active' },
    { path: '/api/analytics/track', label: 'Analytics Tracking API', type: 'API', status: 'Active' },
    { path: '/api/auth/[...nextauth]', label: 'NextAuth Security Gateway', type: 'API', status: 'Active' },
    { path: '/api/brand/assets', label: 'Brand Assets API', type: 'API', status: 'Active' },
    { path: '/api/catalog/generate', label: 'Catalog Generation API', type: 'API', status: 'Active' },
    { path: '/api/catalog/mirror-cdn', label: 'CDN Image Mirroring', type: 'API', status: 'Active' },
    { path: '/api/catalog/sync-media', label: 'Catalog Media Sync API', type: 'API', status: 'Active' },
    { path: '/api/catalog/[id]/pdf', label: 'PDF Generation Engine', type: 'API', status: 'Active' },
    { path: '/api/checkout/execute', label: 'Headless PO Checkout API', type: 'API', status: 'Active' },
    { path: '/api/history', label: 'History Logs API', type: 'API', status: 'Active' },
    { path: '/api/inventory/import/data', label: 'Inventory Data Import API', type: 'API', status: 'Active' },
    { path: '/api/inventory/import/media', label: 'Inventory Media Import API', type: 'API', status: 'Active' },
    { path: '/api/inventory/sync', label: 'Inventory Sync Webhook', type: 'API', status: 'Active' },
    { path: '/api/media/[...id]', label: 'Media Serving API', type: 'API', status: 'Active' },
    { path: '/api/mobile/auth', label: 'Native Mobile Auth (Expo)', type: 'API', status: 'Active' },
    { path: '/api/orders/[id]', label: 'Order Details API', type: 'API', status: 'Active' },
    { path: '/api/sdui/page', label: 'SDUI Page API', type: 'API', status: 'Active' },
    { path: '/api/storefront/products', label: 'Storefront Products API', type: 'API', status: 'Active' },
    { path: '/api/tickets/[id]', label: 'Tickets API', type: 'API', status: 'Active' },
    { path: '/api/upload', label: 'File Upload API', type: 'API', status: 'Active' },
    
    // --- Dev & Tracking ---
    { path: '/admin/system-routes', label: 'System Route Auditor', type: 'Dev Only', status: 'Active' },
    { path: '/admin/roadmap', label: 'Dev Roadmap', type: 'Dev Only', status: 'Active' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Public': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Protected': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Admin': return 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20';
      case 'API': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:text-blue-400';
      case 'Dev Only': return 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400';
      default: return 'bg-slate-500/10 text-[var(--text-muted)] border-[var(--border-color)]';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] font-sans p-6 md:p-12 pb-24">
      <div className="max-w-[1200px] mx-auto animate-in fade-in duration-700">
        
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-wide text-[var(--text-main)] mb-2">
            System Route <span className="font-bold text-[var(--brand-primary)]">Auditor</span>
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            A real-time map of the B2B portal's frontend and API topology.
          </p>
        </div>
        
        <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm">
          <div className="w-full overflow-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-[var(--bg-base)] border-b border-[var(--border-color)]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] w-16">S.No.</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Path</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Component / API Engine</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Access Tier</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Last Modified</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {routes.map((route, i) => (
                  <tr key={i} className="hover:bg-[var(--bg-base)] transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-[var(--text-muted)]">{i + 1}</td>
                    <td className="px-6 py-4 font-mono text-sm text-[var(--text-main)] group-hover:text-[var(--brand-primary)] transition-colors">
                      {route.path}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {route.label}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-md border ${getTypeColor(route.type)}`}>
                        {route.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--text-muted)] whitespace-nowrap">
                      {route.lastModified || '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {route.path.includes('[') ? (
                        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest cursor-not-allowed opacity-50">
                          Dynamic ID Required
                        </span>
                      ) : (
                        <Link href={route.path} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors uppercase tracking-widest inline-flex items-center gap-1">
                          Test Route
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}