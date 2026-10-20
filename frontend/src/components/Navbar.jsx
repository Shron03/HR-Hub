import React, { useState } from 'react';
import {
  Activity,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Briefcase,
  User,
  ShieldAlert,
  Layers,
  Bell
} from 'lucide-react';

export default function Navbar({ currentUser, onSwitchRole, onResetData, isResetting }) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles = [
    { role: 'HR Director', label: 'HR Director (Executive)', icon: ShieldCheck, color: 'text-amber-400' },
    { role: 'Engineering Manager', label: 'Engineering Manager', icon: Briefcase, color: 'text-cyan-400' },
    { role: 'Employee', label: 'Employee (Individual Contributor)', icon: User, color: 'text-emerald-400' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl bg-slate-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                HR<span className="text-cyan-400">Hub</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                Capstone
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              SkillOrbit Employee Performance & Analytics
            </p>
          </div>
        </div>

        {/* Center / Quick Actions */}
        <div className="flex items-center space-x-3">
          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            disabled={isResetting}
            title="Reset database to initial 45-employee dataset"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden md:inline">{isResetting ? 'Resetting...' : 'Reset Demo Data'}</span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/40 text-xs text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium hidden sm:inline">Role:</span>
              <span className="font-semibold text-cyan-300">{currentUser?.role || 'HR Director'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl shadow-2xl border border-slate-700 py-1.5 z-50 bg-slate-900/95 backdrop-blur-2xl">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Active Role (RBAC)
                </div>
                {roles.map(r => {
                  const IconComponent = r.icon;
                  return (
                    <button
                      key={r.role}
                      onClick={() => {
                        onSwitchRole(r.role);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors cursor-pointer ${
                        currentUser?.role === r.role ? 'bg-cyan-950/40 text-cyan-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <IconComponent className={`w-3.5 h-3.5 ${r.color}`} />
                        <span>{r.label}</span>
                      </span>
                      {currentUser?.role === r.role && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover ring-2 ring-cyan-500/20"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser?.name || 'Victoria Chen'}
              </div>
              <div className="text-[10px] text-cyan-400 leading-tight">
                {currentUser?.department || 'Executive HR'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
