import React from 'react';
import {
  Users,
  Gauge,
  Calendar,
  UserCheck,
  Building2,
  RotateCcw,
  LogOut,
  Bell,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  CheckCircle2,
  FileText,
  LifeBuoy,
  UserPlus,
  Clock,
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Award,
  IndianRupee
} from 'lucide-react';
import Avatar from './Avatar';

export default function Navbar({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  onResetDemo,
  onSwitchDemoRole,
  isOperatingData = false,
  pendingRegistrationsCount = 0,
  onOpenRegistrationsModal,
  counts = {}
}) {
  const isEmployee = currentUser?.role === 'Employee';
  const isManager = currentUser?.role === 'Engineering Manager';
  const isHR = currentUser?.role === 'HR Director' || !currentUser?.role;

  // Role-based top navigation tabs
  let navItems = [];

  if (isEmployee) {
    navItems = [
      {
        id: 'emp-attendance-leave',
        label: 'Self Attendance & Leave',
        icon: Calendar,
        badge: counts.pendingLeaves > 0 ? `${counts.pendingLeaves} Active` : null
      },
      {
        id: 'emp-time-tracking',
        label: 'Time Tracking',
        icon: Clock
      },
      {
        id: 'emp-performance-appraisal',
        label: 'Performance & Self-Appraisal',
        icon: Award
      },
      {
        id: 'emp-profile-payroll',
        label: 'Profile & Payroll Documents',
        icon: FileText
      },
      {
        id: 'emp-hr-tickets',
        label: 'HR Tickets',
        icon: LifeBuoy,
        badge: counts.openTickets > 0 ? `${counts.openTickets}` : null
      }
    ];
  } else if (isManager) {
    navItems = [
      {
        id: 'mgr-approvals',
        label: 'Approval Center',
        icon: CheckSquare,
        badge: counts.pendingTimesheets > 0 ? `${counts.pendingTimesheets} Action` : null
      },
      {
        id: 'mgr-supervision',
        label: 'Team Supervision',
        icon: Users,
        badge: counts.totalEmployees || null
      },
      {
        id: 'mgr-performance',
        label: 'Performance & Goal Tracking',
        icon: Gauge
      },
      {
        id: 'mgr-projects',
        label: 'Time Logs & Projects',
        icon: FolderKanban
      }
    ];
  } else {
    // HR Director
    navItems = [
      {
        id: 'org-directory',
        label: 'Organization & Employee Directory',
        icon: Users,
        badge: counts.totalEmployees || null
      },
      {
        id: 'salary-compensation',
        label: 'Compensation & Payroll Administration',
        icon: IndianRupee
      },
      {
        id: 'onboarding-offboarding',
        label: 'Onboarding & Offboarding (HR Process)',
        icon: UserPlus,
        badge: counts.activeCases > 0 ? `${counts.activeCases} Active` : null
      },
      {
        id: 'time-attendance',
        label: 'Time & Attendance Administration',
        icon: Clock,
        badge: counts.pendingLeaves > 0 ? `${counts.pendingLeaves} Action` : null
      },
      {
        id: 'talent-management',
        label: 'Talent Management & Appraisals',
        icon: Gauge
      },
      {
        id: 'helpdesk',
        label: 'HR Help Desk & Requests',
        icon: LifeBuoy,
        badge: counts.openTickets > 0 ? `${counts.openTickets} Open` : null
      },
      {
        id: 'documents',
        label: 'Files & Document Management',
        icon: FileText
      },
      {
        id: 'analytics-reports',
        label: 'Analytics & Reports',
        icon: LayoutDashboard
      }
    ];
  }

  const getRoleBadgeInfo = () => {
    if (isEmployee) {
      return {
        icon: UserIcon,
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        dot: 'bg-orange-500'
      };
    }
    if (isManager) {
      return {
        icon: Briefcase,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        dot: 'bg-blue-500'
      };
    }
    return {
      icon: ShieldCheck,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      dot: 'bg-emerald-500'
    };
  };

  const roleBadge = getRoleBadgeInfo();
  const RoleIcon = roleBadge.icon;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/90 backdrop-blur-xl bg-white/95 shadow-xs">
      
      {/* Upper Navigation Utility Bar */}
      <div className="w-full max-w-[98%] xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm tracking-tight">
            HR
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                HR<span className="text-blue-600">Hub</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                {currentUser?.isDemo ? 'Interactive Demo' : 'Enterprise'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Workforce Operations & Performance Platform
            </p>
          </div>
        </div>

        {/* Action Controls & User Identity */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          
          {/* HR Pending Registration Approvals Badge (Registered accounts only) */}
          {isHR && !currentUser?.isDemo && pendingRegistrationsCount > 0 && (
            <button
              onClick={onOpenRegistrationsModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Review pending employee registration access requests"
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>{pendingRegistrationsCount} Pending Approvals</span>
            </button>
          )}

          {/* Interactive Role Switcher for Demo Mode */}
          {currentUser?.isDemo ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl border border-blue-200 bg-blue-50 text-xs shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-semibold text-blue-900 hidden lg:inline">Demo Role:</span>
              <select
                value={currentUser.role}
                onChange={(e) => onSwitchDemoRole && onSwitchDemoRole(e.target.value)}
                disabled={isOperatingData}
                className="bg-transparent text-blue-950 font-bold text-xs py-0.5 px-1 rounded border-none focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer disabled:opacity-60"
                title="Switch demo role instantly within your isolated workspace"
              >
                <option value="HR Director">HR Director (Full Admin)</option>
                <option value="Engineering Manager">Engineering Manager</option>
                <option value="Employee">Employee (Self-Service)</option>
              </select>
            </div>
          ) : (
            <div
              className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${roleBadge.color}`}
              title="Active registered session"
            >
              <span className={`w-2 h-2 rounded-full ${roleBadge.dot}`} />
              <RoleIcon className="w-3.5 h-3.5" />
              <span className="font-bold text-slate-900">{currentUser?.role || 'HR Director'}</span>
              <span className="text-[11px] text-slate-500 font-normal">Active</span>
            </div>
          )}

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            disabled={isOperatingData}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-60"
            title="Reset dataset back to standard 15-employee Indian demo state"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-slate-600 ${isOperatingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          {/* Notification Bell (Displays unread messages up to 3-day retention) */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Workforce Notifications & Activity Log"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Current User Identity & Sign Out Button */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <Avatar
              name={currentUser?.name || 'Priya Sharma'}
              initials={currentUser?.initials || 'PS'}
              bg={currentUser?.avatarBg || '#16a34a'}
              size="md"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name || 'Priya Sharma'}
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {currentUser?.department || 'Human Resources'}
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer ml-1"
              title="Sign Out / Switch Active User"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Lower Horizontal Navigation Menu Bar (Sticky at top, does not scroll away) */}
      <nav className="border-t border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[98%] xl:max-w-[1720px] mx-auto flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1.5 ${
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
        </div>
      </nav>

    </header>
  );
}
