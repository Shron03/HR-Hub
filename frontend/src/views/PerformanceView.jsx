import React, { useState } from 'react';
import {
  Gauge,
  Sliders,
  CheckSquare,
  Clock,
  Zap,
  Briefcase,
  TrendingUp,
  Search,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PerformanceView({ employees = [], onUpdateEmployeeMetrics, onSelectEmployee }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Quick Metric Tuner state
  const [tunerAttendance, setTunerAttendance] = useState(90);
  const [tunerTasks, setTunerTasks] = useState(85);
  const [tunerProd, setTunerProd] = useState(88);
  const [tunerContrib, setTunerContrib] = useState(85);
  const [tunerEfficiency, setTunerEfficiency] = useState(86);

  // Simulated score
  const simulatedScore = Math.round(
    (tunerAttendance * 0.20) +
    (tunerTasks * 0.25) +
    (tunerProd * 0.25) +
    (tunerContrib * 0.15) +
    (tunerEfficiency * 0.15)
  );

  const getSimulatedTier = (score) => {
    if (score >= 92) return { name: 'Exceptional', color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800' };
    if (score >= 82) return { name: 'Strong Performer', color: 'text-cyan-400 bg-cyan-950/80 border-cyan-800' };
    if (score >= 70) return { name: 'Meets Expectations', color: 'text-blue-400 bg-blue-950/80 border-blue-800' };
    if (score >= 60) return { name: 'Needs Improvement', color: 'text-amber-400 bg-amber-950/80 border-amber-800' };
    return { name: 'Critical Attention', color: 'text-rose-400 bg-rose-950/80 border-rose-800' };
  };

  const handleApplyToSelected = async () => {
    if (!editingEmployee) return;

    await onUpdateEmployeeMetrics(editingEmployee._id || editingEmployee.employeeId, {
      attendanceRate: tunerAttendance,
      taskCompletionRate: tunerTasks,
      productivityScore: tunerProd,
      projectContribution: tunerContrib,
      workEfficiency: tunerEfficiency
    });

    if (simulatedScore >= 92) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setEditingEmployee(null);
  };

  const loadEmployeeIntoTuner = (emp) => {
    setEditingEmployee(emp);
    setTunerAttendance(emp.metrics.attendanceRate);
    setTunerTasks(emp.metrics.taskCompletionRate);
    setTunerProd(emp.metrics.productivityScore);
    setTunerContrib(emp.metrics.projectContribution);
    setTunerEfficiency(emp.metrics.workEfficiency);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
              Module 2: Performance Tracking System
            </span>
            <span className="text-xs text-slate-400">KPI Evaluation Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
            KPI Tracking & Evaluation Logic
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live calibration of Attendance %, Task Completion, Productivity, Contribution, and Work Efficiency scores.
          </p>
        </div>
      </div>

      {/* KPI Formula & Interactive Simulator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formula Explainer (1 col) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>Weighted Scoring Logic</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Standardized weighted KPI composite algorithm:
            </p>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-300">Attendance Percentage</span>
                <span className="text-xs font-mono font-bold text-cyan-400">20%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-300">Task Completion Rate</span>
                <span className="text-xs font-mono font-bold text-indigo-400">25%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-300">Productivity Score</span>
                <span className="text-xs font-mono font-bold text-purple-400">25%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-300">Project Contribution</span>
                <span className="text-xs font-mono font-bold text-emerald-400">15%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-300">Work Efficiency</span>
                <span className="text-xs font-mono font-bold text-amber-400">15%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-[11px] text-cyan-300 leading-relaxed">
            Composite scores &gt;= 92 trigger Exceptional status; scores &lt; 70 flag immediate PIP guidance.
          </div>
        </div>

        {/* Live KPI Calibration Tuner (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Real-time KPI Simulator & Tuner</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingEmployee
                    ? `Calibrating metrics for ${editingEmployee.name} (${editingEmployee.employeeId})`
                    : 'Select any employee to calibrate or adjust sliders for testing'}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={editingEmployee?._id || editingEmployee?.employeeId || ''}
                  onChange={(e) => {
                    const selected = employees.find(emp => emp._id === e.target.value || emp.employeeId === e.target.value);
                    if (selected) loadEmployeeIntoTuner(selected);
                    else setEditingEmployee(null);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[220px]"
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map(emp => (
                    <option key={emp._id || emp.employeeId} value={emp._id || emp.employeeId}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
                {editingEmployee && (
                  <button
                    onClick={() => setEditingEmployee(null)}
                    className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attendance Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Attendance Rate</span>
                  <span className="font-mono text-cyan-400 font-bold">{tunerAttendance}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={tunerAttendance}
                  onChange={(e) => setTunerAttendance(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Task Completion Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Task Completion Rate</span>
                  <span className="font-mono text-indigo-400 font-bold">{tunerTasks}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={tunerTasks}
                  onChange={(e) => setTunerTasks(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              {/* Productivity Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Productivity Score</span>
                  <span className="font-mono text-purple-400 font-bold">{tunerProd}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={tunerProd}
                  onChange={(e) => setTunerProd(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              {/* Project Contribution Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Project Contribution</span>
                  <span className="font-mono text-emerald-400 font-bold">{tunerContrib}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={tunerContrib}
                  onChange={(e) => setTunerContrib(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Work Efficiency Slider */}
              <div className="space-y-1 md:col-span-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Work Efficiency Rating</span>
                  <span className="font-mono text-amber-400 font-bold">{tunerEfficiency}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={tunerEfficiency}
                  onChange={(e) => setTunerEfficiency(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Outcome & Action Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  Simulated Composite
                </span>
                <span className="text-3xl font-bold font-mono text-white">
                  {simulatedScore}%
                </span>
              </div>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                  getSimulatedTier(simulatedScore).color
                }`}
              >
                {getSimulatedTier(simulatedScore).name}
              </span>
            </div>

            {editingEmployee ? (
              <button
                onClick={handleApplyToSelected}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium text-xs shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to {editingEmployee.name}</span>
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic">
                Select an employee from table below to tune their metrics directly.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Employee KPI Tracking Table */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee metrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="text-xs text-slate-400">
            Click <span className="text-cyan-400 font-semibold">"Tune"</span> to load any profile into the KPI Simulator.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Attendance (20%)</th>
                <th className="py-3 px-4">Tasks (25%)</th>
                <th className="py-3 px-4">Productivity (25%)</th>
                <th className="py-3 px-4">Contribution (15%)</th>
                <th className="py-3 px-4">Efficiency (15%)</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredEmployees.slice(0, 15).map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-white">{emp.name}</div>
                        <div className="text-[10px] text-slate-400">{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono">{emp.metrics.attendanceRate}%</td>
                  <td className="py-3 px-4 font-mono">{emp.metrics.taskCompletionRate}%</td>
                  <td className="py-3 px-4 font-mono">{emp.metrics.productivityScore}%</td>
                  <td className="py-3 px-4 font-mono">{emp.metrics.projectContribution}%</td>
                  <td className="py-3 px-4 font-mono">{emp.metrics.workEfficiency}%</td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-400">
                      {emp.metrics.overallScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => loadEmployeeIntoTuner(emp)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/50 text-cyan-300 font-medium cursor-pointer transition-colors"
                    >
                      Tune KPIs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
