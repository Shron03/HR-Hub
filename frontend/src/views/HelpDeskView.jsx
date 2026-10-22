import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Send,
  User,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/api';

export default function HelpDeskView({ currentUser, showToast }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState('In Progress');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.getTickets();
      if (res.success) {
        setTickets(res.tickets || []);
        if (selectedTicket) {
          const updated = (res.tickets || []).find(t => t._id === selectedTicket._id);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatusAndReply = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    try {
      setSubmittingReply(true);
      const res = await api.updateTicketStatus(
        selectedTicket._id,
        resolutionStatus,
        replyMessage,
        currentUser?.name || 'Priya Sharma (HR Director)'
      );
      if (res.success) {
        showToast('Ticket resolution updated and delivered to employee', 'success');
        setReplyMessage('');
        await fetchTickets();
      }
    } catch (err) {
      showToast('Failed to update ticket: ' + err.message, 'error');
    } finally {
      setSubmittingReply(false);
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.ticketId.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.employeeName.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Employee Relations & Grievance SLA
            </span>
            <span className="text-xs text-slate-500 font-medium">Internal Helpdesk</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            HR Help Desk & Employee Requests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Triage employee support tickets, provident fund inquiries, benefit claims, and administrative requests with tracked resolution notes.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Open Tickets</span>
            <div className="text-2xl font-bold font-mono text-red-600 mt-0.5">{openCount}</div>
            <span className="text-[11px] text-slate-400">Awaiting initial review</span>
          </div>
          <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">In Progress</span>
            <div className="text-2xl font-bold font-mono text-orange-600 mt-0.5">{inProgressCount}</div>
            <span className="text-[11px] text-slate-400">Under investigation / action</span>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Resolved Cases</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">{resolvedCount}</div>
            <span className="text-[11px] text-slate-400">Closed with resolution note</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            {['All', 'Open', 'In Progress', 'Resolved'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  statusFilter === st ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Payroll & Compensation">Payroll & Compensation</option>
            <option value="Leave & Attendance">Leave & Attendance</option>
            <option value="Hardware & IT Assets">Hardware & IT Assets</option>
            <option value="Policies & HR Governance">Policies & HR Governance</option>
            <option value="General Administrative">General Administrative</option>
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tickets, employee, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Two Column Grid: Tickets List & Active Ticket Resolution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Tickets List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>Ticket Queue ({filteredTickets.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Click a ticket to review and respond</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading help desk requests...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No tickets found matching the active filter.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTickets.map(t => {
                const isSelected = selectedTicket?._id === t._id;
                const isHigh = t.priority === 'High';

                return (
                  <div
                    key={t._id}
                    onClick={() => {
                      setSelectedTicket(t);
                      setResolutionStatus(t.status === 'Open' ? 'In Progress' : t.status);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                            {t.ticketId}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isHigh
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : t.priority === 'Medium'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.priority} Priority
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">{t.category}</span>
                        </div>

                        <div className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                          {t.subject}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>

                        <div className="text-[10px] text-slate-400 mt-2 flex items-center space-x-2">
                          <span className="font-semibold text-slate-700">{t.employeeName}</span>
                          <span>•</span>
                          <span>{t.department}</span>
                          <span>•</span>
                          <span className="font-mono">{new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'Open'
                            ? 'bg-red-100 text-red-700'
                            : t.status === 'In Progress'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {t.status}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          {(t.replies || []).length} Reply(s)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Ticket Inspector & Official HR Response Panel */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col justify-between">
          {selectedTicket ? (
            <div className="space-y-3">
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500">{selectedTicket.ticketId}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedTicket.status === 'Open' ? 'bg-red-100 text-red-700' : selectedTicket.status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedTicket.status}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-1.5">{selectedTicket.subject}</h2>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Raised by: <strong className="text-slate-800">{selectedTicket.employeeName}</strong> ({selectedTicket.department})
                </div>
              </div>

              {/* Original Query */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Employee Inquiry Description
                </span>
                "{selectedTicket.description}"
              </div>

              {/* Discussion Thread */}
              {(selectedTicket.replies || []).length > 0 && (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Communication History
                  </span>
                  {selectedTicket.replies.map((r, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span className="font-bold text-blue-800">{r.sender}</span>
                        <span>{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{r.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Response & Status Update Form */}
              <form onSubmit={handleUpdateStatusAndReply} className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Update Status</label>
                  <select
                    value={resolutionStatus}
                    onChange={(e) => setResolutionStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Official Resolution / HR Reply</label>
                  <textarea
                    rows="3"
                    placeholder="Write official resolution notes, policy clarification, or action taken..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReply}
                  className="w-full btn-large bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingReply ? 'Saving...' : 'Dispatch HR Resolution'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
              <span>Select any employee help desk ticket from the queue to view full details and submit an official HR response.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
