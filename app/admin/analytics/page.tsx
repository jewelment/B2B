import React from 'react';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as any).role === 'CLIENT') {
    redirect('/dashboard');
  }

  let tenantId = (session.user as any).tenantId;
  if (!tenantId && session.user?.email) {
    const dbUser = await prisma.user.findFirst({ where: { email: session.user.email } });
    if (dbUser) tenantId = dbUser.tenantId;
  }

  if (!tenantId) {
    return <div className="p-8">Error: Missing tenant context.</div>;
  }

  // Aggregate ticket stats
  const tickets = await prisma.ticket.findMany({
    where: { tenantId },
    include: { client: true }
  });

  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'OPEN').length;
  const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  // Client load (Tickets per client)
  const clientLoadMap: Record<string, number> = {};
  const clientNames: Record<string, string> = {};

  tickets.forEach(t => {
    if (t.client) {
      const name = t.client.companyName || t.client.name || t.client.email;
      clientNames[t.clientId] = name;
      clientLoadMap[t.clientId] = (clientLoadMap[t.clientId] || 0) + 1;
    }
  });

  const topClients = Object.entries(clientLoadMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([clientId, count]) => ({
      name: clientNames[clientId],
      count
    }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Ticket Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Tickets</p>
          <p className="text-3xl font-bold text-gray-900">{totalTickets}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm">
          <p className="text-sm font-medium text-blue-600 mb-1">Open</p>
          <p className="text-3xl font-bold text-blue-900">{openTickets}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-amber-200 bg-amber-50/50 shadow-sm">
          <p className="text-sm font-medium text-amber-600 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-amber-900">{inProgressTickets}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-emerald-200 bg-emerald-50/50 shadow-sm">
          <p className="text-sm font-medium text-emerald-600 mb-1">Resolved</p>
          <p className="text-3xl font-bold text-emerald-900">{resolvedTickets}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Load Widget */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Client Ticket Load</h2>
            <p className="text-sm text-gray-500">Clients submitting the most support requests</p>
          </div>
          <div className="divide-y divide-gray-100">
            {topClients.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No ticket data available.</div>
            ) : (
              topClients.map((client, idx) => (
                <div key={idx} className="p-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mr-3">
                      {idx + 1}
                    </div>
                    <span className="font-medium text-gray-800">{client.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">{client.count}</span>
                    <span className="text-sm text-gray-500">tickets</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* System Health / SLA */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
                <span className="text-sm font-medium text-gray-900">
                  {totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full" 
                  style={{ width: `${totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
               <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Backlog (Open + In Progress)</span>
                <span className="text-sm font-medium text-gray-900">
                  {totalTickets > 0 ? Math.round(((openTickets + inProgressTickets) / totalTickets) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full" 
                  style={{ width: `${totalTickets > 0 ? Math.round(((openTickets + inProgressTickets) / totalTickets) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">SLA Tracking Active</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    The Kanban board is automatically tracking the time spent in each column. Resolution metrics will populate automatically.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
