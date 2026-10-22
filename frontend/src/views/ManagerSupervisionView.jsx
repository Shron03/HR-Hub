import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Briefcase,
  Search,
  Filter,
  CheckSquare,
  Award,
  ArrowRight,
  MapPin,
  Laptop
} from 'lucide-react';
import Avatar from '../components/Avatar';
import { getWorkforcePresence } from '../utils/presenceUtils';

export default function ManagerSupervisionView({ employees = [], onSelectEmployee, onAddTask, showToast }) {
  const [search, setSearch] = useState('');
  const [workModeFilter, setWorkModeFilter] = useState('All');

  const engineeringStaff = employees.filter(e => e.department === 'Engineering');

  const filteredStaff = engineeringStaff.filter(e => {
    if (workModeFilter !== 'All' && e.workMode !== workModeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.employeeId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalMembers = engineeringStaff.length;
  const presenceStaff = engineeringStaff.map(e => ({ emp: e, presence: getWorkforcePresence(e) }));
  const activeToday = presenceStaff.filter(p => p.presence.status === 'Active' || p.presence.status === 'Probation').length;
  const onLeaveCount = presenceStaff.filter(p => p.presence.status === 'On Leave' || p.presence.status === 'Absent').length;

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Departmental Roster & Workload Oversight
            </span>
            <span className="text-xs text-slate-500 font-medium">Engineering Operations</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Engineering Team Supervision
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Monitor engineering headcount presence, work mode distribution, active sprint tasks, and individual productivity telemetry.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Engineering Headcount</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{totalMembers}</div>
            <span className="text-[11px] text-slate-400">Total assigned engineers</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Presence</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">{activeToday}</div>
            <span className="text-[11px] text-slate-400">Available on sprint</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">On Leave Today</span>
            <div className="text-2xl font-bold font-mono text-orange-600 mt-0.5">{onLeaveCount}</div>
            <span className="text-[11px] text-slate-400">Absence coverage applied</span>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
          {['All', 'On-site', 'Hybrid', 'Remote'].map(mode => (
            <button
              key={mode}
              onClick={() => setWorkModeFilter(mode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                workModeFilter === mode ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search engineering staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredStaff.map(emp => {
          const tasks = emp.tasks || [];
          const completedTasks = tasks.filter(t => t.status === 'Completed').length;
          const kpi = emp.kpiData || {};
          const presence = getWorkforcePresence(emp);

          return (
            <div
              key={emp.employeeId}
              onClick={() => onSelectEmployee(emp.employeeId)}
              className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar name={emp.name} initials={emp.initials} bg={emp.avatarBg} size="md" />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">{emp.name}</h3>
                      <span className="text-[11px] text-slate-500">{emp.role}</span>
                      <div className="text-[10px] font-mono text-slate-400">{emp.employeeId}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${presence.badgeClass}`}>
                    {presence.label}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold font-mono text-slate-800">{emp.metrics?.overallScore}%</div>
                    <span className="text-[10px] text-slate-400 font-medium">KPI Score</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold font-mono text-blue-600">{emp.metrics?.attendanceRate}%</div>
                    <span className="text-[10px] text-slate-400 font-medium">Attendance</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-xs font-bold font-mono text-emerald-600">{completedTasks}/{tasks.length}</div>
                    <span className="text-[10px] text-slate-400 font-medium">Tasks</span>
                  </div>
                </div>

                {tasks.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Active Sprint Deliverables ({tasks.length})
                    </span>
                    <div className="space-y-1">
                      {tasks.slice(0, 2).map((t, idx) => (
                        <div key={idx} className="text-[11px] text-slate-600 flex items-center justify-between p-1.5 rounded-lg bg-slate-50">
                          <span className="truncate pr-2">{t.title}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center space-x-1">
                  <Laptop className="w-3.5 h-3.5 text-slate-400" />
                  <span>{emp.workMode || 'Hybrid'}</span>
                </span>
                <span className="text-blue-600 font-semibold flex items-center space-x-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
