import React from 'react';
import {
  LayoutDashboard,
  Users,
  Gauge,
  Lightbulb,
  FileSpreadsheet,
  GitBranch,
  Calendar,
  UserCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  counts = {}
}) {
  const isEmployee = currentUser?.role === 'Employee';
  const isManager = currentUser?.role === 'Engineering Manager';
  const isHR = currentUser?.role === 'HR Director' || !currentUser?.role;

  // Build nav items tailored to active role
  let navItems = [];

  if (isEmployee) {
    navItems = [
      {
        id: 'portal',
        label: 'My Employee Portal',
        sublabel: 'Scorecard & tasks',
        icon: UserCheck
      },
      {
        id: 'organization',
        label: 'Organization Structure',
        sublabel: 'Hierarchy & directory',
        icon: GitBranch
      },
      {
        id: 'leaves',
        label: 'Apply & Track Leaves',
        sublabel: 'Absence requests',
        icon: Calendar,
        badge: counts.pendingLeaves > 0 ? `${counts.pendingLeaves} Pending` : null
      }
    ];
  } else if (isManager) {
    navItems = [
      {
        id: 'dashboard',
        label: 'Engineering Cockpit',
        sublabel: 'Team delivery analytics',
        icon: LayoutDashboard
      },
      {
        id: 'organization',
        label: 'Organization Structure',
        sublabel: 'Reporting tree',
        icon: GitBranch
      },
      {
        id: 'employees',
        label: 'Team Directory',
        sublabel: 'Personnel records',
        icon: Users,
        badge: counts.totalEmployees || null
      },
      {
        id: 'performance',
        label: 'KPI Calibrator',
        sublabel: 'Review evaluation',
        icon: Gauge
      },
      {
        id: 'leaves',
        label: 'Leave Approvals',
        sublabel: 'Team presence sync',
        icon: Calendar,
        badge: counts.pendingLeaves > 0 ? `${counts.pendingLeaves} Pending` : null
      }
    ];
  } else {
    // HR Director
    navItems = [
      {
        id: 'dashboard',
        label: 'Workforce Cockpit',
        sublabel: 'Executive KPI tracking',
        icon: LayoutDashboard
      },
      {
        id: 'employees',
        label: 'Employee Directory',
        sublabel: 'Personnel & records',
        icon: Users,
        badge: counts.totalEmployees || null
      },
      {
        id: 'organization',
        label: 'Organization Tree',
        sublabel: '3-in-1 structure panel',
        icon: GitBranch
      },
      {
        id: 'performance',
        label: 'Real-Time KPI Simulator',
        sublabel: 'Tasks & decimal reviews',
        icon: Gauge
      },
      {
        id: 'leaves',
        label: 'Leave Management',
        sublabel: 'Requests & auto-status',
        icon: Calendar,
        badge: counts.pendingLeaves > 0 ? `${counts.pendingLeaves} Action` : null
      },
      {
        id: 'insights',
        label: 'Strategic Insights',
        sublabel: 'Diagnostics & actions',
        icon: Lightbulb,
        badge: counts.totalInsights || null
      },
      {
        id: 'reports',
        label: 'Executive Reports',
        sublabel: 'PDF & CSV generation',
        icon: FileSpreadsheet
      }
    ];
  }

  return (
    <aside className="w-full md:w-64 flex-shrink-0 mb-6 md:mb-0">
      <div className="glass-panel rounded-2xl p-4 sticky top-20 border border-slate-200/90 shadow-sm bg-white/90">
        
        {/* Section Title */}
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-3 flex items-center justify-between">
          <span>Navigation Menu</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
            {currentUser?.role || 'HR Director'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className={`truncate leading-tight ${isActive ? 'text-white font-bold' : 'text-slate-800'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-2 flex-shrink-0 ${
                      isActive
                        ? 'bg-white text-blue-600'
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Zoho-style Info Card */}
        <div className="mt-6 pt-4 border-t border-slate-100 px-3">
          <div className="text-[11px] font-bold text-slate-800">
            HR Hub Enterprise
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Synchronized Workforce System
          </div>
        </div>

      </div>
    </aside>
  );
}
