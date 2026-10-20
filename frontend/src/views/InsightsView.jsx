import React, { useState } from 'react';
import {
  Lightbulb,
  AlertTriangle,
  Award,
  Clock,
  ArrowUpRight,
  CheckCircle,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Scale,
  GraduationCap
} from 'lucide-react';
import Avatar from '../components/Avatar';

export default function InsightsView({ insightsData, onSelectEmployee }) {
  const [activeTab, setActiveTab] = useState('all'); // all, improvement, top, attendance, suggestions

  const needingImprovement = insightsData?.needingImprovement || [];
  const highPerformers = insightsData?.highPerformers || [];
  const attendanceWarnings = insightsData?.attendanceWarnings || [];
  const productivitySuggestions = insightsData?.productivitySuggestions || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              Workforce Intelligence
            </span>
            <span className="text-xs text-slate-500">Automated Strategic Diagnostics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Workforce Diagnostics & Strategic Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Proactive alerts for underperforming personnel, leadership candidate recognition, attendance threshold flags, and organizational throughput optimization.
          </p>
        </div>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-red-200 bg-red-50/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Need Improvement</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-700 mt-2">
            {needingImprovement.length} Staff
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Score &lt; 75% or PIP candidate</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-emerald-200 bg-emerald-50/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">High Performers</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-2">
            {highPerformers.length} Staff
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Score &ge; 92% Pinnacle Tier</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-orange-200 bg-orange-50/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Attendance Risks</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-orange-700 mt-2">
            {attendanceWarnings.length} Staff
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Below 80% compliance</div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-blue-200 bg-blue-50/60 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Action Items</span>
            <Lightbulb className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-2">
            {productivitySuggestions.length} Plans
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Organizational enhancements</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Diagnostics' },
          { id: 'improvement', label: `Needs Support (${needingImprovement.length})` },
          { id: 'top', label: `Leadership Candidates (${highPerformers.length})` },
          { id: 'attendance', label: `Attendance Compliance (${attendanceWarnings.length})` },
          { id: 'suggestions', label: `Action Plans (${productivitySuggestions.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'glass-panel text-slate-600 hover:text-slate-900 border border-slate-200 bg-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Actionable Cards */}
      <div className="space-y-6">
        
        {/* SECTION 1: NEED IMPROVEMENT */}
        {(activeTab === 'all' || activeTab === 'improvement') && needingImprovement.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-red-700 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Employees Requiring Structured Performance Improvement ({needingImprovement.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {needingImprovement.map(emp => (
                <div
                  key={emp.employeeId}
                  className="glass-panel rounded-2xl p-4 border border-red-200 bg-white/95 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          name={emp.name}
                          initials={emp.initials}
                          bg={emp.avatarBg || '#dc2626'}
                          size="md"
                        />
                        <div>
                          <div
                            onClick={() => onSelectEmployee(emp.employeeId)}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer text-xs"
                          >
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {emp.role} • {emp.department}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-red-600">
                          {emp.score}% KPI
                        </span>
                        <span className="block text-[9px] font-semibold text-slate-400">
                          Att: {emp.attendanceRate}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-red-50/70 border border-red-100 text-xs text-red-900">
                      <div className="font-semibold mb-0.5 text-[11px] text-red-800">
                        Recommended Action Plan:
                      </div>
                      {emp.suggestedAction}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => onSelectEmployee(emp.employeeId)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Review Employee Record</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: TOP PERFORMERS */}
        {(activeTab === 'all' || activeTab === 'top') && highPerformers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>High Performers & Fast-Track Leadership Candidates ({highPerformers.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highPerformers.map(emp => (
                <div
                  key={emp.employeeId}
                  className="glass-panel rounded-2xl p-4 border border-emerald-200 bg-white/95 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          name={emp.name}
                          initials={emp.initials}
                          bg={emp.avatarBg || '#16a34a'}
                          size="md"
                        />
                        <div>
                          <div
                            onClick={() => onSelectEmployee(emp.employeeId)}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer text-xs"
                          >
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {emp.role} • {emp.department}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold font-mono text-emerald-600">
                          {emp.score}% KPI
                        </span>
                        <span className="block text-[9px] font-semibold text-emerald-700 px-1.5 py-0.2 rounded-full bg-emerald-100">
                          {emp.recognitionTag}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900">
                      <div className="font-semibold mb-0.5 text-[11px] text-emerald-800">
                        Leadership Recommendation:
                      </div>
                      {emp.recommendation}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => onSelectEmployee(emp.employeeId)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>View Performance Portfolio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: PRODUCTIVITY SUGGESTIONS */}
        {(activeTab === 'all' || activeTab === 'suggestions') && productivitySuggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>Operational Efficiency & Strategic Action Plans ({productivitySuggestions.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productivitySuggestions.map(sug => (
                <div
                  key={sug.id}
                  className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {sug.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sug.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {sug.priority} Priority
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {sug.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {sug.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Organizational Impact: Moderate to High</span>
                    <span className="font-semibold text-blue-600">Active Guidance</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
