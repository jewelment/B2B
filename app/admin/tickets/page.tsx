"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function AgileBoardPage() {
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role;
  const isAdmin = userRole === 'ADMIN' || userRole === 'MASTER_ADMIN' || userRole === 'SUPER_ADMIN';

  const [tickets, setTickets] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals State
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'IDLE' | 'SAVING' | 'SAVED'>('IDLE');
  
  // View State
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'trash'>('board');
  const [selectedClientFilter, setSelectedClientFilter] = useState('ALL');
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'NORMAL', type: 'BUG', status: 'OPEN' });

  // Cross-channel Activity State
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  
  // Attachments State
  const [ticketAttachments, setTicketAttachments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchAdmins();
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

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      if (data.success && data.admins) {
        setAdmins(data.admins);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openTicketView = async (ticket: any) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
    setTicketMessages([]);
    setTicketAttachments([]);
    
    // Fetch Messages
    fetch(`/api/tickets/${ticket.id}/messages`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setTicketMessages(data.messages);
      });
      
    // Fetch Attachments
    fetch(`/api/tickets/${ticket.id}/attachments`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setTicketAttachments(data.attachments);
      });
  };

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('ticketId', ticketId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); 
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    if (!ticketId) return;

    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));

    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) fetchTickets(); 
    } catch (err) {
      fetchTickets();
    }
  };

  const handleTicketUpdate = async (updatedData: any) => {
    if (!selectedTicket) return;
    setSaveStatus('SAVING');
    
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, ...updatedData } : t));
    setSelectedTicket({ ...selectedTicket, ...updatedData });

    try {
      await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      setSaveStatus('SAVED');
      setTimeout(() => setSaveStatus('IDLE'), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus('IDLE');
    }
  };

  const handlePermanentDelete = async (ticketId: string) => {
    if (!confirm('Are you sure you want to permanently delete this ticket? This action cannot be undone.')) return;
    
    setTickets(prev => prev.filter(t => t.id !== ticketId));
    try {
      await fetch(`/api/tickets/${ticketId}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
      fetchTickets();
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        setNewTicket({ title: '', description: '', priority: 'NORMAL', type: 'BUG', status: 'OPEN' });
        fetchTickets();
      } else {
        alert("Failed to create ticket");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessageContent.trim() || !selectedTicket) return;
    
    try {
      const res = await fetch(`/api/tickets/${selectedTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessageContent })
      });
      const data = await res.json();
      if (data.success) {
        setTicketMessages([...ticketMessages, data.message]);
        setNewMessageContent('');
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedTicket) return;
    
    const file = e.target.files[0];
    
    // 10MB file size limit validation
    if (file.size > 10 * 1024 * 1024) {
      alert("File exceeds the 10MB limit. Please select a smaller file.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload file to local server
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const uploadData = await uploadRes.json();
      
      if (uploadData.success) {
        // 2. Link file to the ticket
        const attachRes = await fetch(`/api/tickets/${selectedTicket.id}/attachments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: uploadData.url,
            filename: uploadData.filename,
            fileSize: uploadData.size
          })
        });
        const attachData = await attachRes.json();
        if (attachData.success) {
          setTicketAttachments([attachData.attachment, ...ticketAttachments]);
        }
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const columns = [
    { id: 'OPEN', label: 'Open' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'In Review' },
    { id: 'CLOSED', label: 'Closed' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'NORMAL': return 'bg-blue-500';
      case 'LOW': return 'bg-gray-400';
      default: return 'bg-blue-500';
    }
  };

  // Quill Toolbar Modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const uniqueClients = Array.from(new Map(tickets.filter(t => t.client).map(t => [t.client.id, t.client])).values());
  const filteredTickets = selectedClientFilter === 'ALL' 
    ? tickets.filter(t => t.status !== 'TRASH') 
    : tickets.filter(t => t.client?.id === selectedClientFilter && t.status !== 'TRASH');

  const trashedTickets = selectedClientFilter === 'ALL'
    ? tickets.filter(t => t.status === 'TRASH')
    : tickets.filter(t => t.client?.id === selectedClientFilter && t.status === 'TRASH');

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] w-full transition-colors">
      
      {/* Header */}
      <div className="flex-none flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Agile Ticketing Hub
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage project tasks and client issues.</p>
        </div>
        <div className="flex items-center gap-6">
          {/* Client Filter Dropdown */}
          {uniqueClients.length > 0 && (
            <select 
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-3 text-sm font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] shadow-sm cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value="ALL">All Clients</option>
              {uniqueClients.map((client: any) => (
                <option key={client.id} value={client.id}>
                  {client.companyName || client.name || client.email}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button onClick={() => setViewMode('board')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'board' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
              Board
            </button>
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              List
            </button>
            {isAdmin && (
              <>
                <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                <button onClick={() => setViewMode('trash')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'trash' ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Trash
                </button>
              </>
            )}
          </div>
          <div className="flex -space-x-2">
            {admins.slice(0, 5).map((admin, idx) => (
              <div key={idx} className="w-10 h-10 rounded-full bg-[var(--brand-primary)] border-2 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-sm shadow-sm" title={admin.name}>
                {admin.name.charAt(0)}
              </div>
            ))}
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-[var(--brand-primary)] hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Ticket
          </button>
        </div>
      </div>

      {viewMode === 'board' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar flex items-start gap-6 pb-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400 dark:text-gray-500 w-full">Loading Kanban canvas...</div>
          ) : (
            columns.map(column => {
              const columnTickets = filteredTickets.filter(t => t.status === column.id);
              
              // Inspiration-based column colors
              let colBg = "bg-slate-50 dark:bg-slate-800/30";
              let pillBg = "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
              let countBg = "bg-white text-slate-600 dark:bg-slate-600 dark:text-slate-300";
              let createHover = "hover:bg-slate-200/50 dark:hover:bg-slate-700/50";

              if (column.id === 'IN_PROGRESS') {
                colBg = "bg-amber-50/70 dark:bg-amber-900/10";
                pillBg = "bg-amber-400 text-amber-950 dark:bg-amber-600 dark:text-amber-50";
                countBg = "bg-white text-amber-700 dark:bg-amber-800 dark:text-amber-200";
                createHover = "hover:bg-amber-100 dark:hover:bg-amber-900/30";
              } else if (column.id === 'RESOLVED') {
                colBg = "bg-purple-50/70 dark:bg-purple-900/10";
                pillBg = "bg-purple-500 text-white dark:bg-purple-600 dark:text-white";
                countBg = "bg-white text-purple-700 dark:bg-purple-800 dark:text-purple-200";
                createHover = "hover:bg-purple-100 dark:hover:bg-purple-900/30";
              } else if (column.id === 'CLOSED') {
                colBg = "bg-emerald-50/70 dark:bg-emerald-900/10";
                pillBg = "bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white";
                countBg = "bg-white text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200";
                createHover = "hover:bg-emerald-100 dark:hover:bg-emerald-900/30";
              }

              return (
                <div 
                  key={column.id} 
                  className={`flex-none w-[320px] rounded-2xl p-3 flex flex-col max-h-full border border-transparent dark:border-slate-800/50 ${colBg}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, column.id)}
                >
                  <div className="flex justify-between items-center mb-4 px-1">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${pillBg}`}>
                      {column.id === 'IN_PROGRESS' ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      ) : column.id === 'RESOLVED' ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : column.id === 'CLOSED' ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                      )}
                      <h2 className="font-bold text-[11px] uppercase tracking-wider">{column.label}</h2>
                      <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shadow-sm ${countBg}`}>
                        {columnTickets.length}
                      </span>
                    </div>
                    
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar pb-2">
                    {columnTickets.map(ticket => {
                      const hasMessages = ticket._count?.messages > 0;
                      const labelsArray = ticket.labels ? JSON.parse(ticket.labels) : [];
                      
                      // Extract first image from description for thumbnail
                      const imgMatch = ticket.description?.match(/<img[^>]+src="([^">]+)"/);
                      const thumbnailUrl = imgMatch ? imgMatch[1] : null;
                      
                      // Inspiration-based Cards
                      let priorityColor = "text-slate-400";
                      let priorityLabel = "Low";
                      let PriorityIcon = () => <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" /></svg>;

                      if (ticket.priority === 'URGENT') { 
                        priorityColor = "text-rose-500"; 
                        priorityLabel = "Urgent"; 
                        PriorityIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
                      } else if (ticket.priority === 'HIGH') { 
                        priorityColor = "text-amber-500"; 
                        priorityLabel = "High"; 
                        PriorityIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
                      } else if (ticket.priority === 'NORMAL') { 
                        priorityColor = "text-blue-500"; 
                        priorityLabel = "Normal"; 
                        PriorityIcon = () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>;
                      }

                      return (
                        <div
                          key={ticket.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, ticket.id)}
                          onClick={() => openTicketView(ticket)}
                          className="p-4 bg-white dark:bg-slate-800/90 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/50 hover:shadow-md cursor-pointer transition-all group"
                        >
                          {/* Thumbnail */}
                          {thumbnailUrl && (
                            <div className="mb-3 w-full h-32 rounded-xl overflow-hidden relative shadow-sm border border-slate-100 dark:border-slate-700">
                              <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}

                          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-[14px] mb-3 leading-snug">{ticket.title}</h3>
                          
                          <div className="flex items-center justify-between mb-3">
                            {ticket.dueDate && (
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {new Date(ticket.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                            {ticket.client && (
                              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-600">
                                <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-[8px] font-bold text-slate-700 dark:text-slate-300">
                                  {ticket.client.name?.charAt(0) || ticket.client.email?.charAt(0) || '?'}
                                </div>
                                <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[80px]">
                                  {ticket.client.companyName || ticket.client.name || ticket.client.email.split('@')[0]}
                                </span>
                              </div>
                            )}
                            <div className="flex -space-x-1">
                              {ticket.assignee && (
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-blue-700 dark:text-blue-300 text-[10px] font-bold z-10" title={`Assigned to ${ticket.assignee.name}`}>
                                  {ticket.assignee.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>
                          </div>

                          {/* Labels */}
                          {labelsArray.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {labelsArray.map((label: string, i: number) => {
                                const colors = ['bg-orange-100 text-orange-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700'];
                                const colorClass = colors[label.length % colors.length];
                                return (
                                  <span key={i} className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${colorClass} dark:bg-opacity-20`}>{label}</span>
                                );
                              })}
                            </div>
                          )}

                          {/* Dashed Divider */}
                          <div className="w-full border-t border-dashed border-slate-200 dark:border-slate-700 my-3"></div>
                          
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                <span className="w-4 h-4 rounded-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Gmail_Icon_%282015-2020%29.svg')] bg-cover opacity-80"></span>
                                {ticket._count?.messages || 0}
                              </span>
                            </div>
                            
                            <div className={`flex items-center gap-1 ${priorityColor}`}>
                              <PriorityIcon />
                              {priorityLabel}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Add Card Footer */}
                  <div onClick={() => { setNewTicket({ ...newTicket, status: column.id }); setIsCreateModalOpen(true); }} className={`mt-2 px-3 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 text-sm transition-colors font-bold text-slate-500 dark:text-slate-400 ${createHover}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Task
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : viewMode === 'list' ? (
        <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
              <tr>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Task ID</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-full">Title</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Priority</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Assignee</th>
                <th className="py-4 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400">Loading list...</td></tr>
              ) : filteredTickets.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400">No tickets found.</td></tr>
              ) : (
                filteredTickets.map(ticket => {
                  let PriorityIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
                  if (ticket.priority === 'URGENT') PriorityIcon = () => <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
                  else if (ticket.priority === 'HIGH') PriorityIcon = () => <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;

                  return (
                    <tr key={ticket.id} onClick={() => openTicketView(ticket)} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors group">
                      <td className="py-4 px-6 text-sm font-mono text-slate-500 dark:text-slate-400 group-hover:text-blue-600 transition-colors whitespace-nowrap">AJ-{ticket.id.substring(ticket.id.length - 4)}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-900 dark:text-slate-100">{ticket.title}</td>
                      <td className="py-4 px-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm whitespace-nowrap">
                          {columns.find(c => c.id === ticket.status)?.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className={`flex items-center gap-1.5 text-xs font-bold whitespace-nowrap ${ticket.priority === 'URGENT' ? 'text-rose-500' : ticket.priority === 'HIGH' ? 'text-amber-500' : 'text-blue-500'}`}>
                          <PriorityIcon />
                          {ticket.priority}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {ticket.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center border border-blue-200">
                              {ticket.assignee.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{ticket.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic whitespace-nowrap">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Trash Bin
            </h2>
            {trashedTickets.length === 0 ? (
              <div className="text-center py-20 text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                <p>Trash is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trashedTickets.map(ticket => (
                  <div key={ticket.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-shadow">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{ticket.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <span>Reported by: {ticket.client?.name || ticket.client?.email}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'OPEN' } : t));
                          fetch(`/api/tickets/${ticket.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'OPEN' })
                          });
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                        Restore
                      </button>
                      <button 
                        onClick={() => handlePermanentDelete(ticket.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Ticket Modal (Jira Style Minimalist with Quill) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Create Task</h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-6 space-y-6 flex-1 overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Work type <span className="text-red-500">*</span></label>
                  <select value={newTicket.type} onChange={e => setNewTicket({...newTicket, type: e.target.value})} className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none">
                    <option value="BUG">Bug</option>
                    <option value="FEATURE">Task</option>
                    <option value="QUESTION">Story</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                  <div className="bg-gray-100 border border-gray-200 rounded-md p-2.5 text-sm text-gray-600 cursor-not-allowed">
                    {columns.find(c => c.id === newTicket.status)?.label || 'To Do'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Summary <span className="text-red-500">*</span></label>
                <input required value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} type="text" className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none" />
              </div>

              <div className="h-64 mb-12">
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <ReactQuill 
                  theme="snow" 
                  modules={modules}
                  value={newTicket.description} 
                  onChange={(val) => setNewTicket({...newTicket, description: val})} 
                  className="h-48"
                  placeholder="Type / to add tables, images, code blocks..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                <select value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})} className="w-full bg-white border border-gray-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[var(--brand-primary)] outline-none">
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Highest</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 font-bold text-white bg-[var(--brand-primary)] hover:opacity-90 rounded-md transition-opacity shadow-sm">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cross-Channel Task View Modal (Premium Linear/Notion Style) */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* Minimalist Top Bar */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono text-xs font-semibold bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">
                  AJ-{selectedTicket.id.substring(selectedTicket.id.length - 4)}
                </span>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <span className="hover:text-slate-800 transition-colors cursor-pointer">Projects</span>
                  <span className="text-slate-300">/</span>
                  <span className="hover:text-slate-800 transition-colors cursor-pointer">Ticketing Hub</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-800 font-semibold">{columns.find(c => c.id === selectedTicket.status)?.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/admin/tickets?id=${selectedTicket.id}`)
                      .then(() => alert('Link copied to clipboard!'));
                  }}
                  className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md p-1.5 transition-colors shadow-sm" title="Copy Link"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </button>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md p-1.5 transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Modal Body Grid */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-white">
              
              {/* Main Content Area (Left) */}
              <div className="flex-1 overflow-y-auto p-8 md:p-10 border-r border-slate-100">
                
                {/* Title & Auto-Save Indicator */}
                <div className="flex items-start justify-between mb-8 gap-4">
                  <input 
                    value={selectedTicket.title}
                    onChange={(e) => setSelectedTicket({...selectedTicket, title: e.target.value})}
                    onBlur={(e) => {
                      const originalTitle = tickets.find(t => t.id === selectedTicket.id)?.title;
                      if (e.target.value !== originalTitle) {
                        handleTicketUpdate({ title: e.target.value });
                      }
                    }}
                    className="flex-1 text-3xl font-bold text-slate-900 leading-tight tracking-tight bg-slate-100 hover:bg-slate-200 focus:bg-slate-200 focus:outline-none rounded-xl px-4 py-2.5 w-full transition-colors border-none"
                    placeholder="Enter ticket title..."
                  />
                  <div className="flex items-center justify-end h-10 px-4 min-w-[120px]">
                    {saveStatus === 'SAVING' && (
                      <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Saving...
                      </span>
                    )}
                    {saveStatus === 'SAVED' && (
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        Saved
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-10">
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden pb-12 focus-within:border-blue-500 transition-colors">
                    <ReactQuill 
                      theme="snow" 
                      modules={modules}
                      value={selectedTicket.description} 
                      onChange={(val) => setSelectedTicket({...selectedTicket, description: val})} 
                      onBlur={() => {
                        const originalDesc = tickets.find(t => t.id === selectedTicket.id)?.description;
                        if (selectedTicket.description !== originalDesc) {
                          handleTicketUpdate({ description: selectedTicket.description });
                        }
                      }}
                      className="h-32"
                      placeholder="Add a rich description with tables, images, and code..."
                    />
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="mb-10 pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      Attachments
                    </h3>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors">
                      {isUploading ? 'Uploading...' : 'Add Attachment'}
                    </button>
                  </div>
                  
                  {ticketAttachments.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {ticketAttachments.map((att: any) => (
                        <div key={att.id} className="group relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
                          {att.filename.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <div className="aspect-[4/3] w-full relative">
                              <img src={att.url} alt={att.filename} className="absolute inset-0 w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] w-full flex items-center justify-center bg-white border-b border-slate-100 text-slate-400">
                              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                            </div>
                          )}
                          <div className="p-3 bg-white">
                            <p className="text-xs font-semibold text-slate-700 truncate">{att.filename}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{att.fileSize ? Math.round(att.fileSize/1024) + ' KB' : 'Document'}</p>
                          </div>
                          <a href={att.url} target="_blank" className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold transition-opacity backdrop-blur-sm">
                            Open File
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group">
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </div>
                      <p className="text-sm text-slate-600 font-medium">Drop files to attach, or <span className="text-blue-600">browse</span></p>
                    </div>
                  )}
                </div>

                {/* Activity Log (Chat) */}
                <div className="pt-8 border-t border-slate-100">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    Activity
                  </h3>
                  
                  {/* Chat Input */}
                  <div className="flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                      ME
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all overflow-hidden">
                      <textarea 
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                        className="w-full p-4 text-sm text-slate-800 resize-none outline-none" 
                        placeholder="Write a comment..." 
                        rows={3}
                      ></textarea>
                      <div className="bg-slate-50 px-4 py-3 flex justify-between items-center border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">Pro tip: press <kbd className="font-sans px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Cmd</kbd> + <kbd className="font-sans px-1 py-0.5 bg-white border border-slate-200 rounded text-[10px]">Enter</kbd> to send</span>
                        <button onClick={handleSendMessage} disabled={!newMessageContent.trim()} className="bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-slate-800 transition-colors">
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages list */}
                  <div className="space-y-6">
                    {ticketMessages.map((msg: any) => (
                      <div key={msg.id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                          {msg.sender?.name?.charAt(0) || msg.sender?.email?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-900">{msg.sender?.name || msg.sender?.email}</span>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          <div className="text-sm text-slate-700 bg-slate-50 border border-slate-100 p-4 rounded-xl rounded-tl-none whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              {/* Sidebar (Properties) */}
              <div className="w-full md:w-72 bg-slate-50 p-6 overflow-y-auto">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Properties</h4>
                
                <div className="space-y-5">
                  {/* Status */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Status</label>
                    <select 
                      className="w-full bg-white border border-slate-200 text-sm text-slate-800 py-2.5 px-3 rounded-lg shadow-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                      value={selectedTicket.status}
                      onChange={(e) => handleTicketUpdate({ status: e.target.value })}
                    >
                      {columns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Priority</label>
                    <select 
                      className="w-full bg-white border border-slate-200 text-sm text-slate-800 py-2.5 px-3 rounded-lg shadow-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                      value={selectedTicket.priority}
                      onChange={(e) => handleTicketUpdate({ priority: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Assignee</label>
                    <select 
                      className="w-full bg-white border border-slate-200 text-sm text-slate-800 py-2.5 px-3 rounded-lg shadow-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                      value={selectedTicket.assigneeId || ''}
                      onChange={(e) => handleTicketUpdate({ assigneeId: e.target.value })}
                    >
                      <option value="">Unassigned</option>
                      {admins.map(admin => (
                        <option key={admin.id} value={admin.id}>{admin.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Due Date</label>
                    <input 
                      type="date"
                      className="w-full bg-white border border-slate-200 text-sm text-slate-800 py-2.5 px-3 rounded-lg shadow-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      value={selectedTicket.dueDate ? new Date(selectedTicket.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleTicketUpdate({ dueDate: new Date(e.target.value).toISOString() })}
                    />
                  </div>

                  {/* Labels */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Labels</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {selectedTicket.labels && JSON.parse(selectedTicket.labels).map((label: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold">{label}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const newLabel = prompt("Enter a new label:");
                        if (newLabel) {
                          const currentLabels = selectedTicket.labels ? JSON.parse(selectedTicket.labels) : [];
                          handleTicketUpdate({ labels: JSON.stringify([...currentLabels, newLabel]) });
                        }
                      }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 py-1.5 px-3 rounded-md transition-colors w-max"
                    >
                      + Add Label
                    </button>
                  </div>

                  {/* Delete Button */}
                  {isAdmin && (
                    <div className="pt-6 border-t border-slate-200 mt-6">
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to move this ticket to trash?')) {
                            handleTicketUpdate({ status: 'TRASH' });
                            setIsModalOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 py-2.5 rounded-lg text-sm font-bold transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Move to Trash
                      </button>
                    </div>
                  )}

                  <div className="pt-6 mt-6 border-t border-slate-200">
                    <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Reporter</label>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-[10px] font-bold">
                        {selectedTicket.client?.name?.charAt(0) || selectedTicket.client?.email?.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{selectedTicket.client?.name || selectedTicket.client?.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Created</label>
                    <span className="text-sm text-slate-800 font-medium">{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
