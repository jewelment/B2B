import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function WebPagesManager() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');
  
  const tenantId = (session.user as any).tenantId;

  // Fetch all web pages for this tenant
  const pages = await prisma.sduiPage.findMany({
    where: { tenantId, platform: 'WEB' },
    orderBy: { createdAt: 'desc' }
  });

  // Automatically create a homepage if none exists for demo purposes
  if (pages.length === 0) {
    const home = await prisma.sduiPage.create({
      data: {
        tenantId,
        platform: 'WEB',
        title: 'Homepage',
        path: '/',
        environment: 'PRODUCTION',
      }
    });
    pages.push(home);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-[var(--text-main)]">Web Pages</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">Manage and edit your B2B storefront layouts.</p>
          </div>
          <button className="bg-[var(--brand-primary)] text-white px-6 py-2.5 rounded-lg text-sm font-bold tracking-wide shadow hover:bg-opacity-90 transition-all">
            + Add Page
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Title</div>
            <div className="col-span-3">URL Path</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3 text-right">Last Updated</div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {pages.map((page) => (
              <Link 
                href={`/admin/pages/${page.id}/builder`} 
                key={page.id}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors group cursor-pointer"
              >
                <div className="col-span-4 font-bold text-slate-800 group-hover:text-[var(--brand-primary)] transition-colors">
                  {page.title}
                </div>
                <div className="col-span-3">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono">
                    {page.path}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${page.environment === 'PRODUCTION' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : page.environment === 'STAGING' ? 'bg-blue-50 text-blue-600 border-blue-100' : page.environment === 'DEVELOPMENT' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${page.environment === 'PRODUCTION' ? 'bg-emerald-500' : page.environment === 'STAGING' ? 'bg-blue-500' : page.environment === 'DEVELOPMENT' ? 'bg-purple-500' : 'bg-amber-500'}`}></span>
                    {page.environment}
                  </span>
                </div>
                <div className="col-span-3 text-right text-sm text-slate-500 flex items-center justify-end gap-4">
                  {new Date(page.updatedAt).toLocaleDateString()}
                  <svg className="w-5 h-5 text-slate-300 group-hover:text-[var(--brand-primary)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
