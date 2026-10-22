import React, { useState, useEffect } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Send,
  CalendarCheck,
  ShieldCheck,
  Award
} from 'lucide-react';
import { api } from '../api/api';

export default function EmployeeAttendanceLeaveView({ currentUser, employees = [], onRefreshData, showToast }) {
  const empId = currentUser?.employeeId || 'EMP-1001';
  const employee = employees.find(e => e.employeeId === empId) || employees[0] || {};

  // Clock In / Clock Out State
  const [isClockedIn, setIsClockedIn] = useState(() => {
    return localStorage.getItem(`hrhub_clocked_${empId}`) === 'true';
  });
  const [clockInTime, setClockInTime] = useState(() => {
    return localStorage.getItem(`hrhub_clock_time_${empId}`) || '09:05 AM IST';
  });

  // Leave Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const fetchMyLeaves = async () => {
    try {
      setLoadingLeaves(true);
      const res = await api.getLeaves();
      if (res.success) {
        setMyLeaves((res.leaveRequests || []).filter(l => l.employeeId === empId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [empId]);

  const handleToggleClock = () => {
    const nextState = !isClockedIn;
    setIsClockedIn(nextState);
    localStorage.setItem(`hrhub_clocked_${empId}`, nextState);
    if (nextState) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
      setClockInTime(now);
      localStorage.setItem(`hrhub_clock_time_${empId}`, now);
      showToast(`Clocked in successfully at ${now}`, 'success');
    } else {
      showToast('Clocked out. Daily shift duration recorded.', 'info');
    }
  };

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

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast('Please provide an official reason for absence', 'error');
      return;
    }
    try {
      setSubmitting(true);
      const res = await api.submitLeave({
        employeeId: empId,
        type: leaveType,
        reason: reason.trim(),
        startDate,
        endDate,
        days: Number(days) || 1
      });
      if (res.success) {
        showToast('Leave application submitted to HR Director for authorization', 'success');
        setReason('');
        await fetchMyLeaves();
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      showToast('Failed to submit: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const attendanceCompliance = employee.metrics?.attendanceRate !== undefined ? employee.metrics.attendanceRate : 92;

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Employee Self-Service Presence
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentUser?.name || 'Aarav Patel'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Self Attendance & Leave Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Daily shift punch tracking, annual leave balances, and formal absence application workflow with real-time duration derivation.
          </p>
        </div>

        {/* Live Punch Clock Button */}
        <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">
              {isClockedIn ? 'Clocked In' : 'Clocked Out'}
            </div>
            <span className="text-[10px] text-slate-400">
              {isClockedIn ? `Since ${clockInTime}` : 'Shift inactive'}
            </span>
          </div>

          <button
            onClick={handleToggleClock}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 ${
              isClockedIn
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isClockedIn ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Clock Out</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Clock In</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Attendance Compliance & Leave Balances Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Attendance Compliance</span>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-0.5">{attendanceCompliance}%</div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${attendanceCompliance}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Monthly target: &gt;= 90%</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Casual Leave (CL)</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">8 / 12</div>
          <span className="text-[10px] text-slate-400 mt-1 block">4 days consumed this year</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Sick Leave (SL)</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-0.5">7 / 10</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Medical certificate applicable &gt; 2 days</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Privilege Leave (PL)</span>
          <div className="text-2xl font-bold font-mono text-orange-600 mt-0.5">14 / 18</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Encashable on year-end</span>
        </div>
      </div>

      {/* Main Grid: Leave Form & Leave History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 1 Col: Apply for Leave Form */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Apply for Time Off</span>
          </div>

          <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Leave Category</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold cursor-pointer"
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Privilege Leave">Privilege Leave</option>
                <option value="Work From Home">Work From Home</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <span className="text-slate-600 font-medium">Calculated Duration:</span>
              <span className="font-bold font-mono text-blue-700 text-sm">{days} Day(s)</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Official Justification *</label>
              <textarea
                rows="3"
                required
                placeholder="Specify reason for absence request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-large bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Dispatch Application to HR'}</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: My Leave Applications History */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>My Time Off Records & Status History ({myLeaves.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Authorized by HR Director</span>
          </div>

          {loadingLeaves ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading leave records...</div>
          ) : myLeaves.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No leave applications submitted yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {myLeaves.map(leave => (
                <div key={leave.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900">{leave.type}</span>
                        <span className="font-mono font-bold text-blue-600 text-xs">• {leave.days} Day(s)</span>
                        <span className="text-[10px] text-slate-400">({leave.startDate} to {leave.endDate})</span>
                      </div>
                      <div className="text-[11px] text-slate-600 italic mt-1 bg-white p-2 rounded-lg border border-slate-100">
                        "{leave.reason}"
                      </div>
                      {leave.decisionNote && (
                        <div className="text-[10px] text-emerald-700 font-medium mt-1">
                          HR Administrative Note: {leave.decisionNote}
                        </div>
                      )}
                    </div>

                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full self-start sm:self-center ${
                      leave.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : leave.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
