import React, { useState } from 'react';
import {
  ShieldCheck,
  Briefcase,
  User,
  Lock,
  Mail,
  ArrowRight,
  UserPlus,
  LogIn,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Avatar from './Avatar';
import { api } from '../api/api';

export default function AuthModal({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [role, setRole] = useState('Employee');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const demoAccounts = [
    {
      name: 'Priya Sharma',
      role: 'HR Director',
      dept: 'Human Resources',
      email: 'hr@hrhub.in',
      bg: '#16a34a',
      initials: 'PS',
      description: 'Full administrative access: employee records, salary & KPI calibration, leave approvals, feedback dispatch'
    },
    {
      name: 'Rajesh Verma',
      role: 'Engineering Manager',
      dept: 'Engineering',
      email: 'manager@hrhub.in',
      bg: '#2563eb',
      initials: 'RV',
      description: 'Departmental management: engineering team oversight, sprint delivery reviews, organization tree'
    },
    {
      name: 'Aarav Patel',
      role: 'Employee',
      dept: 'Engineering',
      email: 'aarav@hrhub.in',
      bg: '#ea580c',
      initials: 'AP',
      description: 'Self-service portal: view personal performance scorecard, track assigned tasks, apply for leave, feedback inbox'
    }
  ];

  const handleDemoSelect = async (demoRole) => {
    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessNotice('');
      const res = await api.demoLogin(demoRole);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.message || 'Unable to authenticate with demo user');
      }
    } catch (err) {
      setErrorMessage('Server connection error. Please verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessNotice('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!email || !password) {
          setErrorMessage('Please provide both corporate email address and password');
          setLoading(false);
          return;
        }
        const res = await api.login(email, password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else {
          setErrorMessage(res.message || 'Invalid credentials or account awaiting authorization.');
        }
      } else {
        if (!name || !email || !password) {
          setErrorMessage('Please complete all required registration fields');
          setLoading(false);
          return;
        }
        const res = await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
          department,
          role
        });
        if (res.success) {
          setSuccessNotice(
            res.message || 'Registration request submitted. Account is awaiting authorization by the HR Director before first login.'
          );
          setActiveTab('login');
          setName('');
          setPassword('');
        } else {
          setErrorMessage(res.message || 'Registration request failed.');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 glass-panel rounded-2xl shadow-2xl border border-slate-200/90 bg-white/95 p-6 sm:p-8 animate-fade-in text-slate-900">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl shadow-md mb-3">
            HR
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            HR Hub Enterprise
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            People operations, performance tracking, organization directory & employee self-service
          </p>
        </div>

        {/* Tab Switcher: Login vs Sign Up */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-4">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessNotice(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessNotice(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3.5 mb-6">
          {activeTab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Corporate Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@hrhub.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Human Resources">Human Resources</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Employee">Employee</option>
                  <option value="Engineering Manager">Engineering Manager</option>
                  <option value="HR Director">HR Director</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Authenticating...' : activeTab === 'login' ? 'Enter Platform' : 'Submit Registration Request'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-medium">
              Or quick enter with a demo role
            </span>
          </div>
        </div>

        {/* 1-Click Quick Demo Access */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Select Demo Role to Enter</span>
            <span className="text-[11px] text-blue-600 font-medium">1-Click Sign In</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {demoAccounts.map(demo => (
              <button
                key={demo.role}
                type="button"
                disabled={loading}
                onClick={() => handleDemoSelect(demo.role)}
                className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-center space-x-2.5 mb-2">
                  <Avatar name={demo.name} initials={demo.initials} bg={demo.bg} size="sm" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 leading-tight">
                      {demo.name}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      {demo.role}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-2">
                  {demo.dept}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
