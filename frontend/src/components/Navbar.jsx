import React, { useState } from 'react';
import {
  ShieldCheck,
  Briefcase,
  User,
  ChevronDown,
  RotateCcw,
  LogOut,
  Bell,
  Trash2,
  Users
} from 'lucide-react';
import Avatar from './Avatar';

export default function Navbar({
  currentUser,
  onSwitchRole,
  onLogout,
  onOpenNotifications,
  notificationsCount = 0,
  onSeedDemoData,
  onClearAllData,
  isOperatingData
}) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles = [
    { role: 'HR Director', label: 'HR Director (Priya Sharma)', icon: ShieldCheck, color: 'text-emerald-600' },
    { role: 'Engineering Manager', label: 'Engineering Manager (Rajesh Verma)', icon: Briefcase, color: 'text-blue-600' },
    { role: 'Employee', label: 'Employee Self-Service (Aarav Patel)', icon: User, color: 'text-orange-600' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/90 backdrop-blur-xl bg-white/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
            HR
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                HR<span className="text-blue-600">Hub</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Workforce Operations & Performance Platform
            </p>
          </div>
        </div>

        {/* Center / Quick Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Workforce Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs text-slate-800 transition-all cursor-pointer font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline text-slate-500">Active Role:</span>
              <span className="font-bold text-slate-900">{currentUser?.role || 'HR Director'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 glass-panel rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 bg-white animate-fade-in">
                <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Active Role (RBAC)
                </div>
                {roles.map(r => {
                  const IconComponent = r.icon;
                  const isCurrent = currentUser?.role === r.role;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        onSwitchRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                        isCurrent ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center space-x-2.5">
                        <IconComponent className={`w-4 h-4 ${r.color}`} />
                        <span>{r.label}</span>
                      </span>
                      {isCurrent && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile Avatar & Sign Out */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <Avatar
              name={currentUser?.name || 'Priya Sharma'}
              initials={currentUser?.initials || 'PS'}
              bg={currentUser?.avatarBg || '#16a34a'}
              size="md"
            />
            <div className="hidden lg:block text-left">
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
              title="Sign Out / Switch User"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
