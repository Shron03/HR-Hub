import React, { useState, useEffect } from 'react';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  X
} from 'lucide-react';
import { api } from '../api/api';

export default function EmployeeTicketsView({ currentUser, employees = [], showToast }) {
  const empId = currentUser?.employeeId || 'EMP-1001';
  const employee = employees.find(e => e.employeeId === empId) || employees[0] || {};

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [newTicket, setNewTicket] = useState({
    category: 'Payroll & Compensation',
    priority: 'Medium',
    subject: '',
    description: ''
  });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.getTickets({ role: 'Employee', employeeId: empId });
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
  }, [empId]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      showToast('Subject and description are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createTicket({
        ...newTicket,
        employeeId: empId,
        employeeName: currentUser?.name || employee.name || 'Aarav Patel',
        department: employee.department || 'Engineering'
      });

      if (res.success) {
        showToast('Ticket submitted to HR Director', 'success');
        setIsNewModalOpen(false);
        setNewTicket({
          category: 'Payroll & Compensation',
          priority: 'Medium',
          subject: '',
          description: ''
        });
        await fetchTickets();
      }
    } catch (err) {
      showToast('Failed to submit ticket: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Employee Support & Inquiries
            </span>
            <span className="text-xs text-slate-500 font-medium">HR Help Desk</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            My HR Help Desk Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Submit confidential inquiries regarding provident fund, tax declarations, hardware assets, or policy clarifications to the HR team.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer py-2 px-4 text-xs font-semibold flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Ticket</span>
        </button>
      </div>

      {/* Main Grid: Tickets List & Ticket Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Cols: Tickets History */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>My Submitted Inquiries ({tickets.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Click a ticket to read resolution notes</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading your support tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No tickets submitted yet. Click "Raise New Ticket" if you need assistance from HR.
            </div>
          ) : (
            <div className="space-y-2.5">
              {tickets.map(t => {
                const isSelected = selectedTicket?._id === t._id;
                const isResolved = t.status === 'Resolved' || t.status === 'Closed';

                return (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1 pr-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                            {t.ticketId}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {t.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Priority: <strong className="text-slate-700">{t.priority}</strong>
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-900 mt-1.5">{t.subject}</div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>

                        <div className="text-[10px] text-slate-400 mt-2">
                          Filed on: {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-700'
                          : t.status === 'In Progress'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Ticket Inspector & HR Responses */}
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
                  Category: <strong>{selectedTicket.category}</strong>
                </div>
              </div>

              {/* Inquiry Description */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  My Inquiry Summary
                </span>
                "{selectedTicket.description}"
              </div>

              {/* HR Resolution Note if provided */}
              {selectedTicket.resolutionNote && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  <div className="flex items-center space-x-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official HR Resolution Note</span>
                  </div>
                  <p className="leading-relaxed">{selectedTicket.resolutionNote}</p>
                </div>
              )}

              {/* Reply Thread */}
              {(selectedTicket.replies || []).length > 0 && (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Replies from HR
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
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-full">
              <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
              <span>Select any submitted ticket from the left column to view its status and HR resolution message.</span>
            </div>
          )}
        </div>

      </div>

      {/* New Ticket Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-200 bg-white/95 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Raise HR Support Ticket</h2>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Payroll & Compensation">Payroll & Compensation</option>
                    <option value="Leave & Attendance">Leave & Attendance</option>
                    <option value="Hardware & IT Assets">Hardware & IT Assets</option>
                    <option value="Policies & HR Governance">Policies & HR Governance</option>
                    <option value="General Administrative">General Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UAN PF Transfer inquiry for previous employer"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Description *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Describe your inquiry, error, or clarification request..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-large bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 shadow-xs cursor-pointer flex items-center space-x-1.5 disabled:opacity-60"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Submitting...' : 'Submit Support Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
