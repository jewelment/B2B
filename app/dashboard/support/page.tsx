"use client";

import React, { useState, useEffect } from 'react';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', type: 'BUG', priority: 'NORMAL' });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ title: '', description: '', type: 'BUG', priority: 'NORMAL' });
        fetchTickets(); // Refresh list
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-800';
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-500 mt-1">Submit tickets and track resolution progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submission Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-color)] p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Ticket</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                  placeholder="E.g., Missing catalog item"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="BUG">Report a Bug</option>
                  <option value="FEATURE">Feature Request</option>
                  <option value="QUESTION">General Question</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent (Blocks Business)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-[var(--brand-primary)] focus:border-[var(--brand-primary)]"
                  placeholder="Please describe the issue in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--brand-primary)] text-white py-2 rounded-md font-medium hover:bg-opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </form>
          </div>
        </div>

        {/* Ticket History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
            <div className="p-6 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold">Your Tickets</h2>
            </div>
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No tickets found. You're all caught up!</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center text-xs text-gray-400 space-x-4">
                      <span>ID: {ticket.id.substring(ticket.id.length - 6).toUpperCase()}</span>
                      <span>Type: {ticket.type}</span>
                      <span>Priority: {ticket.priority}</span>
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
