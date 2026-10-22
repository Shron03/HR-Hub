import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  Check,
  X,
  Calendar,
  AlertCircle,
  FileText,
  User,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import Avatar from '../components/Avatar';
import { api } from '../api/api';

export default function ManagerApprovalsView({ currentUser, showToast }) {
  const [leaves, setLeaves] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timesheets'); // 'timesheets' or 'leaves'

  const loadData = async () => {
    try {
      setLoading(true);
      const [leavesRes, logsRes] = await Promise.all([
        api.getLeaves(),
        api.getTimeLogs({ status: 'Pending Approval' })
      ]);
      if (leavesRes?.success) {
        // Engineering team leaves
        setLeaves((leavesRes.leaveRequests || []).filter(l => l.department === 'Engineering'));
      }
      if (logsRes?.success) {
        setTimeLogs(logsRes.timeLogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateTimeLogStatus = async (id, status) => {
    try {
      const res = await api.updateTimeLogStatus(id, status);
      if (res.success) {
        showToast(res.message, 'success');
        setTimeLogs(prev => prev.filter(l => l._id !== id));
      }
    } catch (err) {
      showToast('Action failed: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Managerial Sign-Off Hub
            </span>
            <span className="text-xs text-slate-500 font-medium">Engineering Governance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Engineering Manager Approval Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Review timesheet hour allocations, verify sprint progress, and monitor team leave applications awaiting HR Director authorization.
          </p>
        </div>
      </div>

      {/* Switcher Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
        <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
          <button
            onClick={() => setActiveTab('timesheets')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'timesheets' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timesheets Sign-Off ({timeLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'leaves' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Team Time Off Review ({leaves.filter(l => l.status === 'Pending').length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Role: <strong className="text-slate-800">Engineering Manager</strong>
        </div>
      </div>

      {/* 1. Timesheets Approvals */}
      {activeTab === 'timesheets' && (
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>Pending Sprint Time Log Submissions</span>
            <span className="text-[11px] text-slate-400 font-normal">Approve or dispute weekly engineering hours</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading timesheet records...</div>
          ) : timeLogs.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              All team timesheet submissions have been authorized.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {timeLogs.map(log => (
                <div key={log._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{log.employeeName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                        {log.employeeId}
                      </span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        {log.project}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 mt-1 font-medium">
                      Task: {log.taskName}
                    </div>
                    {log.notes && (
                      <div className="text-[11px] text-slate-500 italic mt-0.5">
                        "{log.notes}"
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 mt-1">
                      Logged Date: {log.date} • Hours: <strong className="text-slate-800 font-mono">{log.hours} hrs</strong>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateTimeLogStatus(log._id, 'Approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center space-x-1 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleUpdateTimeLogStatus(log._id, 'Rejected')}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Team Leaves (View-only with notice that HR Director holds final authorization) */}
      {activeTab === 'leaves' && (
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs space-y-3">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              <strong>Corporate Governance Policy:</strong> Leave authorization is restricted strictly to the HR Director. Engineering Managers have view privileges to monitor sprint team availability.
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {leaves.map(leave => (
              <div key={leave.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <Avatar name={leave.employeeName} initials={leave.initials} bg={leave.avatarBg} size="md" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{leave.employeeName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                        {leave.employeeId}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {leave.type}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1">
                      {leave.startDate} to {leave.endDate} • <strong className="text-blue-600 font-mono">{leave.days} Day(s)</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 italic mt-0.5">
                      "{leave.reason}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                    leave.status === 'Pending'
                      ? 'bg-orange-100 text-orange-700'
                      : leave.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {leave.status}
                  </span>
                  {leave.status === 'Pending' && (
                    <span className="text-[10px] text-slate-400 italic">
                      Awaiting HR decision
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
