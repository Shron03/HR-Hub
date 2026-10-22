import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Users,
  Check,
  X,
  Search,
  Filter,
  ShieldCheck
} from 'lucide-react';
import LeaveManagementView from './LeaveManagementView';
import { getWorkforcePresence } from '../utils/presenceUtils';

export default function TimeAttendanceAdminView({
  currentUser,
  employees = [],
  onRefreshData,
  showToast
}) {
  const [subTab, setSubTab] = useState('leaves'); // 'leaves' or 'presence'

  const totalEmployees = employees.length;
  const presenceList = employees.map(e => ({ emp: e, presence: getWorkforcePresence(e) }));
  const onLeaveCount = presenceList.filter(p => p.presence.status === 'On Leave' || p.presence.status === 'Absent').length;
  const activeCount = presenceList.filter(p => p.presence.status === 'Active' || p.presence.status === 'Probation').length;
  const avgAttendance = employees.length > 0
    ? Math.round(employees.reduce((acc, curr) => acc + (curr.metrics?.attendanceRate || 90), 0) / employees.length)
    : 92;

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Attendance Compliance</span>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-0.5">{avgAttendance}%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Workforce average ratio</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Presence Today</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">{activeCount}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Available on operational shift</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">On Leave / Absent</span>
          <div className="text-2xl font-bold font-mono text-orange-600 mt-0.5">{onLeaveCount}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Scheduled absence</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Workforce Roster</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{totalEmployees}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Enrolled personnel</span>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
        <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
          <button
            onClick={() => setSubTab('leaves')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'leaves' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Time Off & Leave Approvals Queue</span>
          </button>
          <button
            onClick={() => setSubTab('presence')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'presence' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Workforce Presence & Compliance Roster</span>
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Role: <strong className="text-slate-900">HR Director (Authorization Authority)</strong>
        </div>
      </div>

      {/* Sub Views */}
      {subTab === 'leaves' ? (
        <LeaveManagementView
          currentUser={currentUser}
          onRefreshData={onRefreshData}
          showToast={showToast}
        />
      ) : (
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>Live Presence Roster ({employees.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Real-time status synchronization</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Work Mode</th>
                  <th className="py-2.5 px-3">Attendance Rate</th>
                  <th className="py-2.5 px-3">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => {
                  const presence = getWorkforcePresence(emp);
                  return (
                    <tr key={emp.employeeId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{emp.employeeId}</div>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">{emp.department}</td>
                      <td className="py-2.5 px-3 text-slate-600">{emp.role}</td>
                      <td className="py-2.5 px-3 text-slate-600">{emp.workMode || 'Hybrid'}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-blue-600">{emp.metrics?.attendanceRate}%</span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{ width: `${emp.metrics?.attendanceRate || 90}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${presence.badgeClass}`}>
                          {presence.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
