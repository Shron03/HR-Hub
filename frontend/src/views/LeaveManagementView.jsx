import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Filter,
  Check,
  X,
  ShieldCheck,
  FileText
} from 'lucide-react';
import Avatar from '../components/Avatar';
import { api } from '../api/api';

export default function LeaveManagementView({
  currentUser,
  onRefreshData,
  showToast
}) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Pending', 'Approved', 'Rejected'
  
  // Apply Leave form state (for Employee)
  const todayStr = new Date().toISOString().split('T')[0];
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState({});

  // Real-time calculation of days and blocking previous dates
  const handleStartDateChange = (newStart) => {
    setStartDate(newStart);
    let nextEnd = endDate;
    if (new Date(endDate) < new Date(newStart)) {
      nextEnd = newStart;
      setEndDate(newStart);
    }
    calculateDays(newStart, nextEnd);
  };

  const handleEndDateChange = (newEnd) => {
    setEndDate(newEnd);
    calculateDays(startDate, newEnd);
  };

  const calculateDays = (startStr, endStr) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s) {
      const diffMs = e.getTime() - s.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
      setDays(Math.max(1, diffDays));
    }
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.getLeaves();
      if (res.success) {
        setLeaves(res.leaveRequests || []);
      }
    } catch (err) {
      console.error('Failed to load leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast('Please provide an official justification for the absence request', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.submitLeave({
        employeeId: currentUser.employeeId || 'EMP-1001',
        type: leaveType,
        reason: reason.trim(),
        startDate,
        endDate,
        days: Number(days) || 1
      });

      if (res.success) {
        showToast('Absence request successfully routed to HR Director for authorization', 'success');
        setReason('');
        await fetchLeaves();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      showToast('Failed to submit time off request: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const note = decisionNotes[leaveId] || '';
      const res = await api.updateLeaveStatus(leaveId, status, note, currentUser?.role);
      if (res.success) {
        showToast(
          status === 'Approved'
            ? 'Leave authorized. Employee presence synchronized to "On Leave".'
            : 'Leave request declined.',
          status === 'Approved' ? 'success' : 'info'
        );
        await fetchLeaves();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      showToast('Action failed: ' + err.message, 'error');
    }
  };

  const isHR = currentUser?.role === 'HR Director';
  const isManager = currentUser?.role === 'Engineering Manager';
  const isEmployee = currentUser?.role === 'Employee';

  // Filter leaves
  const displayedLeaves = leaves.filter(l => {
    if (isEmployee) {
      if (l.employeeId !== currentUser.employeeId && l.employeeId !== 'EMP-1001') {
        return false;
      }
    }
    if (filterStatus !== 'All' && l.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const pendingCount = leaves.filter(l => l.status === 'Pending').length;
  const approvedCount = leaves.filter(l => l.status === 'Approved').length;
  const onLeaveCount = leaves.filter(l => l.currentEmployeeStatus === 'On Leave' || l.status === 'Approved').length;

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Absence & Time Off Administration
            </span>
            <span className="text-xs text-slate-500">
              Workforce Presence Registry
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Leave Requests & Presence Management
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            {isEmployee
              ? 'Submit planned leave applications and track managerial authorization statuses in real-time.'
              : isHR
              ? 'Authoritative review queue to grant or decline workforce absence applications with automatic presence status synchronization.'
              : 'Departmental presence schedule view. (Formal authorization permissions restricted to Human Resources).'}
          </p>
        </div>

        {/* Overview Stats Badges */}
        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-center">
            <div className="text-xs font-bold text-orange-700">{pendingCount}</div>
            <div className="text-[10px] text-orange-600 font-medium">Pending Review</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <div className="text-xs font-bold text-blue-700">{onLeaveCount}</div>
            <div className="text-[10px] text-blue-600 font-medium">Currently On Leave</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-xs font-bold text-emerald-700">{approvedCount}</div>
            <div className="text-[10px] text-emerald-600 font-medium">Approved</div>
          </div>
        </div>
      </div>

      {/* EMPLOYEE VIEW: APPLY FOR LEAVE FORM */}
      {isEmployee && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Submit Time Off Application</span>
          </h2>

          <form onSubmit={handleApplyLeave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Leave Classification
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Privilege Leave">Privilege Leave (PL)</option>
                  <option value="Work From Home">Work From Home (WFH)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Calculated Duration
                </label>
                <div className="w-full px-3 py-2 text-xs rounded-xl border border-blue-200 bg-blue-50 font-bold font-mono text-blue-700 flex items-center justify-between">
                  <span>{days} Day(s)</span>
                  <span className="text-[10px] text-blue-500 font-normal">Auto-Computed</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Justification & Handover Arrangements
              </label>
              <textarea
                rows="2"
                required
                placeholder="State operational reason for absence and brief handover arrangements..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Dispatch Application to HR'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-800">{displayedLeaves.length}</span> records
        </div>
      </div>

      {/* LEAVES LIST */}
      <div className="glass-panel rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Loading time off records...
          </div>
        ) : displayedLeaves.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400">
            No time off records match the selected filter.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedLeaves.map((leave) => {
              const isPending = leave.status === 'Pending';
              const isApproved = leave.status === 'Approved';

              return (
                <div key={leave.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Employee & Type */}
                    <div className="flex items-start space-x-3">
                      <Avatar
                        name={leave.employeeName}
                        initials={leave.initials}
                        bg={leave.avatarBg}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">
                            {leave.employeeName}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                            {leave.employeeId}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                            {leave.department}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-slate-800">{leave.type}</span>
                          <span>•</span>
                          <span className="font-bold text-blue-600">{leave.days} Day(s)</span>
                          <span>•</span>
                          <span>{leave.startDate} to {leave.endDate}</span>
                        </div>

                        <div className="text-xs text-slate-500 mt-1.5 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          "{leave.reason}"
                        </div>

                        {leave.decisionNote && (
                          <div className="text-xs text-slate-600 mt-1 font-medium">
                            Administrative Note: <span className="italic">{leave.decisionNote}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status & Action Controls */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        isPending
                          ? 'bg-orange-100 text-orange-700 border border-orange-200'
                          : isApproved
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {leave.status}
                      </span>

                      {/* HR ONLY Authorization Controls */}
                      {isHR && isPending && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Decision note (optional)..."
                            value={decisionNotes[leave.id] || ''}
                            onChange={(e) => setDecisionNotes({
                              ...decisionNotes,
                              [leave.id]: e.target.value
                            })}
                            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
                          />
                          <button
                            onClick={() => handleUpdateStatus(leave.id, 'Approved')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1 shadow-sm cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Authorize</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(leave.id, 'Rejected')}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center space-x-1 shadow-sm cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}

                      {/* Engineering Manager informational notice */}
                      {isManager && isPending && (
                        <span className="text-[11px] text-slate-400 italic">
                          Awaiting HR Director authorization
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
