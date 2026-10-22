import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Layers,
  BarChart2,
  User,
  ArrowRight
} from 'lucide-react';
import { api } from '../api/api';

export default function ManagerProjectsView({ showToast }) {
  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('All');

  const projects = [
    {
      name: 'Real-Time KPI Engine',
      lead: 'Aarav Patel',
      sprintGoal: 'Sub-second recalculation of decimal review scores and task completion bounds',
      completion: 92,
      budgetHours: 120,
      loggedHours: 98.5
    },
    {
      name: 'Cloud Infrastructure & In-Memory DB',
      lead: 'Vikram Joshi',
      sprintGoal: 'In-memory MongoDB failover resilience and automated seeding scripts',
      completion: 85,
      budgetHours: 80,
      loggedHours: 64.0
    },
    {
      name: 'Security & Auth RBAC Guard',
      lead: 'Kavita Iyer',
      sprintGoal: 'Administrative approval queue for pending sign-ups and 403 access gates',
      completion: 100,
      budgetHours: 60,
      loggedHours: 58.0
    },
    {
      name: 'API Gateway & Latency Optimization',
      lead: 'Aarav Patel',
      sprintGoal: 'Endpoint response profiling and 3-day notification TTL index pruning',
      completion: 78,
      budgetHours: 100,
      loggedHours: 72.0
    }
  ];

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getTimeLogs();
      if (res.success) {
        setTimeLogs(res.timeLogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = timeLogs.filter(l => {
    if (selectedProject !== 'All' && l.project !== selectedProject) return false;
    return true;
  });

  const totalLoggedHours = timeLogs.reduce((acc, curr) => acc + (curr.hours || 0), 0);

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Sprint Velocity & Deliverables
            </span>
            <span className="text-xs text-slate-500 font-medium">Engineering Projects</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Time Logs & Sprint Projects
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Track active engineering project completion percentages, sprint budget burn-down, and engineer daily hour logs.
          </p>
        </div>
      </div>

      {/* Projects Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedProject(selectedProject === proj.name ? 'All' : proj.name)}
            className={`glass-panel rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
              selectedProject === proj.name
                ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                : 'border-slate-200/90 bg-white/90 shadow-xs hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  Sprint Q4
                </span>
                <span className="text-xs font-bold font-mono text-emerald-600">{proj.completion}%</span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 mt-2 leading-snug">{proj.name}</h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {proj.sprintGoal}
              </p>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Burn-down</span>
                  <span className="font-mono">{proj.loggedHours} / {proj.budgetHours} hrs</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${Math.min(100, Math.round((proj.loggedHours / proj.budgetHours) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Lead: {proj.lead}</span>
              <span className="text-blue-600 font-semibold">Filter Logs</span>
            </div>
          </div>
        ))}
      </div>

      {/* Time Logs Table */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Logged Timesheet Entries ({filteredLogs.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Total Recorded Hours: <strong className="text-slate-800 font-mono">{totalLoggedHours} hrs</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Project Filter:</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading logged hours...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No timesheet logs found for the selected project.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Engineer</th>
                  <th className="py-2.5 px-3">Project</th>
                  <th className="py-2.5 px-3">Task Deliverable</th>
                  <th className="py-2.5 px-3">Hours</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{log.logId}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{log.employeeName}</td>
                    <td className="py-2.5 px-3 font-medium text-blue-700">{log.project}</td>
                    <td className="py-2.5 px-3 text-slate-700">{log.taskName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{log.hours} hrs</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{log.date}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        log.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
