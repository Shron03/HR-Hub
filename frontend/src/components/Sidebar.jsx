import React from 'react';
import {
  LayoutDashboard,
  Users,
  Gauge,
  Lightbulb,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts = {} }) {
  const navItems = [
    {
      id: 'dashboard',
      module: 'Module 3',
      label: 'Analytics Dashboard',
      icon: LayoutDashboard,
      badge: null,
      glowColor: 'hover:border-cyan-500/40 hover:text-cyan-400'
    },
    {
      id: 'employees',
      module: 'Module 1',
      label: 'Employee Directory',
      icon: Users,
      badge: counts.totalEmployees || '45',
      glowColor: 'hover:border-indigo-500/40 hover:text-indigo-400'
    },
    {
      id: 'performance',
      module: 'Module 2',
      label: 'Performance Tracker',
      icon: Gauge,
      badge: null,
      glowColor: 'hover:border-emerald-500/40 hover:text-emerald-400'
    },
    {
      id: 'insights',
      module: 'Module 4',
      label: 'Insights & Actions',
      icon: Lightbulb,
      badge: counts.totalInsights || '4',
      glowColor: 'hover:border-amber-500/40 hover:text-amber-400'
    },
    {
      id: 'reports',
      module: 'Module 5',
      label: 'Report Generation',
      icon: FileSpreadsheet,
      badge: 'PDF',
      glowColor: 'hover:border-pink-500/40 hover:text-pink-400'
    }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
      <div className="glass-panel rounded-2xl p-4 sticky top-20 border border-slate-800/90 shadow-xl bg-slate-950/60">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3 flex items-center justify-between">
          <span>Capstone Modules</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            5 / 5 Complete
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950/70 to-indigo-950/60 text-white border border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-900 text-slate-400 group-hover:text-cyan-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-mono leading-none">
                      {item.module}
                    </div>
                    <div className={`mt-0.5 ${isActive ? 'font-semibold text-white' : ''}`}>
                      {item.label}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                        isActive
                          ? 'bg-cyan-400/20 text-cyan-300'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick System Badge */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 px-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800">
            <div className="flex items-center space-x-2 text-[11px] text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SkillOrbit HR Analytics</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Real-time KPI synchronization & automated performance evaluations active.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
