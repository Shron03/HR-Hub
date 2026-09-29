import React, { useState } from 'react';
import {
  Lightbulb,
  AlertTriangle,
  Award,
  Clock,
  ArrowUpRight,
  TrendingDown,
  CheckCircle,
  Sparkles,
  Zap,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export default function InsightsView({ insightsData, onSelectEmployee }) {
  const [activeTab, setActiveTab] = useState('all'); // all, improvement, top, attendance, suggestions

  const needingImprovement = insightsData?.needingImprovement || [];
  const highPerformers = insightsData?.highPerformers || [];
  const attendanceWarnings = insightsData?.attendanceWarnings || [];
  const productivitySuggestions = insightsData?.productivitySuggestions || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-950 text-amber-400 border border-amber-800/50">
              Module 4: Performance Insights & Recommendations
            </span>
            <span className="text-xs text-slate-400">Automated Strategic Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
            Smart HR Diagnostics & Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Proactive alerts for underperforming personnel, leadership candidate recognition, attendance threshold flags, and organizational throughput optimization.
          </p>
        </div>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-rose-900/40 bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Need Improvement</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-2">
            {needingImprovement.length} Staff
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Score &lt; 75% or PIP candidate</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-emerald-900/40 bg-emerald-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">High Performers</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">
            {highPerformers.length} Leaders
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Score &gt;= 92% Pinnacle Tier</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-amber-900/40 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Attendance Warnings</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">
            {attendanceWarnings.length} Alerts
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Below 80% corporate minimum</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-cyan-900/40 bg-cyan-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Strategic Actions</span>
            <Lightbulb className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">
            {productivitySuggestions.length} Strategies
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Department throughput proposals</div>
        </div>
      </div>

      {/* Main Insights Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Employees Needing Improvement */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Employees Needing Improvement</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Targeted diagnostics & action plans for at-risk team members
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {needingImprovement.map((emp) => (
                <div
                  key={emp.employeeId}
                  onClick={() => onSelectEmployee(emp.employeeId)}
                  className="p-3 rounded-xl bg-slate-900/70 border border-rose-900/30 hover:border-rose-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-9 h-9 rounded-full object-cover border border-rose-500/30"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-rose-300">
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {emp.department} • {emp.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-rose-400">
                        {emp.score}%
                      </div>
                      <div className="text-[10px] text-rose-400/80">
                        {emp.category}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-start space-x-2 text-[11px] text-slate-300">
                    <span className="text-rose-400 font-bold shrink-0">Action:</span>
                    <span>{emp.suggestedAction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: High Performers & Leadership Candidates */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>High-Performing Talent Recognition</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Fast-track leadership nominations & merit retention plans
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {highPerformers.slice(0, 4).map((emp) => (
                <div
                  key={emp.employeeId}
                  onClick={() => onSelectEmployee(emp.employeeId)}
                  className="p-3 rounded-xl bg-slate-900/70 border border-emerald-900/30 hover:border-emerald-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-9 h-9 rounded-full object-cover border border-emerald-500/30"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {emp.department} • {emp.role}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {emp.score}%
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                        {emp.recognitionTag}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-start space-x-2 text-[11px] text-slate-300">
                    <span className="text-emerald-400 font-bold shrink-0">Strategy:</span>
                    <span>{emp.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Productivity Suggestions & Attendance Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Warnings (1 col) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Attendance Warnings</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Personnel below the 80% organizational attendance policy threshold
          </p>

          <div className="space-y-2.5">
            {attendanceWarnings.map((warn) => (
              <div
                key={warn.employeeId}
                onClick={() => onSelectEmployee(warn.employeeId)}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-amber-900/30 hover:border-amber-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{warn.name}</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {warn.attendanceRate}%
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {warn.department} • {warn.warningLevel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Productivity Suggestions (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Productivity Optimization Initiatives</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              AI Engine Diagnostics
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Data-backed operational recommendations calculated across team velocity and workload distribution.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {productivitySuggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
                    {sug.category}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 text-[9px] rounded font-semibold ${
                      sug.priority === 'High'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                    }`}
                  >
                    {sug.priority} Priority
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-white leading-snug">
                  {sug.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {sug.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
