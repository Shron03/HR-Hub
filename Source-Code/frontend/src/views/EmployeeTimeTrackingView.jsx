import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Send,
  Plus,
  Layers,
  FolderKanban,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/api';

export default function EmployeeTimeTrackingView({ currentUser, employees = [], onToggleTaskStatus, showToast }) {
  const empId = currentUser?.employeeId || 'EMP-1001';
  const employee = employees.find(e => e.employeeId === empId) || employees[0] || {};
  const tasks = employee.tasks || [];

  const [timeLogs, setTimeLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const [logForm, setLogForm] = useState({
    project: 'Real-Time KPI Engine',
    taskName: '',
    hours: 7.5,
    date: todayStr,
    notes: ''
  });

  const fetchMyLogs = async () => {
    try {
      setLoading(true);
      const res = await api.getTimeLogs({ employeeId: empId });
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
    fetchMyLogs();
  }, [empId]);

  const handleLogHours = async (e) => {
    e.preventDefault();
    if (!logForm.taskName.trim() || !logForm.hours) {
      showToast('Task name and hours are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.createTimeLog({
        ...logForm,
        employeeId: empId,
        employeeName: currentUser?.name || employee.name || 'Aarav Patel',
        department: employee.department || 'Engineering'
      });

      if (res.success) {
        showToast('Timesheet entry submitted to Engineering Manager for sign-off', 'success');
        setLogForm({
          project: 'Real-Time KPI Engine',
          taskName: '',
          hours: 7.5,
          date: todayStr,
          notes: ''
        });
        await fetchMyLogs();
      }
    } catch (err) {
      showToast('Failed to log time: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalLogged = timeLogs.reduce((acc, curr) => acc + (curr.hours || 0), 0);
  const completedTasksCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Timesheet & Deliverables Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">Sprint Time Tracking</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            My Time Tracking & Deliverables
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Log sprint project hours for manager approval and update execution progress on assigned deliverables.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Logged Hours</span>
            <div className="text-2xl font-bold font-mono text-blue-600 mt-0.5">{totalLogged} hrs</div>
            <span className="text-[11px] text-slate-400">Current sprint cycle</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Assigned Deliverables</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{tasks.length}</div>
            <span className="text-[11px] text-slate-400">{completedTasksCount} completed</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Deliverable Completion</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">
              {tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 100}%
            </div>
            <span className="text-[11px] text-slate-400">Sprint throughput velocity</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Log Form + Log History & Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 1 Col: Log Timesheet Form */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Log Daily Project Hours</span>
          </div>

          <form onSubmit={handleLogHours} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Project Name</label>
              <select
                value={logForm.project}
                onChange={(e) => setLogForm({ ...logForm, project: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold cursor-pointer"
              >
                <option value="Real-Time KPI Engine">Real-Time KPI Engine</option>
                <option value="Cloud Infrastructure & In-Memory DB">Cloud Infrastructure & In-Memory DB</option>
                <option value="Security & Auth RBAC Guard">Security & Auth RBAC Guard</option>
                <option value="API Gateway & Latency Optimization">API Gateway & Latency Optimization</option>
                <option value="Internal Tooling">Internal Tooling</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Task Deliverable *</label>
              <input
                type="text"
                required
                placeholder="e.g. Unit tests for mathematical bounds"
                value={logForm.taskName}
                onChange={(e) => setLogForm({ ...logForm, taskName: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hours Logged</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="16"
                  required
                  value={logForm.hours}
                  onChange={(e) => setLogForm({ ...logForm, hours: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={logForm.date}
                  onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Notes / Blockers</label>
              <textarea
                rows="2"
                placeholder="Summary of commit or deliverable..."
                value={logForm.notes}
                onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-large bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Logging...' : 'Submit to Manager'}</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Deliverables Status + Time Log History */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Active Sprint Deliverables */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
            <div className="text-xs font-bold text-slate-900 mb-2.5 flex items-center justify-between">
              <span>My Active Sprint Deliverables ({tasks.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Click status pill to mark complete</span>
            </div>

            {tasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No deliverables currently assigned.
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{task.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Project: {task.project} • Priority: {task.priority}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleTaskStatus(empId, task._id, task.status === 'Completed' ? 'In Progress' : 'Completed')}
                      className={`px-3 py-1 text-[11px] font-bold rounded-full transition-all cursor-pointer ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}
                    >
                      {task.status}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Timesheet History */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
            <div className="text-xs font-bold text-slate-900 mb-2.5 flex items-center justify-between">
              <span>My Timesheet History ({timeLogs.length})</span>
              <span className="text-[10px] text-slate-400 font-normal">Logged hours logbook</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading timesheet records...</div>
            ) : timeLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No timesheet hours logged yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto pr-1">
                {timeLogs.map(log => (
                  <div key={log._id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{log.taskName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {log.project} • {log.date}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-bold text-slate-800">{log.hours} hrs</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        log.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {log.status}
                      </span>
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
