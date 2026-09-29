import React, { useState } from 'react';
import { X, UserPlus, Check, Sliders } from 'lucide-react';

export default function AddEmployeeModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: '',
    location: 'Headquarters',
    salary: 85000,
    attendanceRate: 92,
    taskCompletionRate: 88,
    productivityScore: 89,
    projectContribution: 85,
    workEfficiency: 87
  });

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources'];

  // Calculated overall score preview
  const previewScore = Math.round(
    (formData.attendanceRate * 0.20) +
    (formData.taskCompletionRate * 0.25) +
    (formData.productivityScore * 0.25) +
    (formData.projectContribution * 0.15) +
    (formData.workEfficiency * 0.15)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        role: formData.role,
        location: formData.location,
        salary: Number(formData.salary),
        metrics: {
          attendanceRate: Number(formData.attendanceRate),
          taskCompletionRate: Number(formData.taskCompletionRate),
          productivityScore: Number(formData.productivityScore),
          projectContribution: Number(formData.projectContribution),
          workEfficiency: Number(formData.workEfficiency)
        }
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Employee</h2>
              <p className="text-xs text-slate-400">Module 1: Create Employee Record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 text-xs pr-1">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Liam Sterling"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="liam.s@hrhub.io"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Role Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Software Architect"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Office Location</label>
              <input
                type="text"
                placeholder="San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Annual Salary ($)</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Performance Sliders */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Initial Performance KPI Calibration</span>
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                Preview Score: {previewScore}%
              </span>
            </div>

            <div className="space-y-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Attendance Rate (20%)</span>
                  <span className="font-mono text-white">{formData.attendanceRate}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.attendanceRate}
                  onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Task Completion Rate (25%)</span>
                  <span className="font-mono text-white">{formData.taskCompletionRate}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.taskCompletionRate}
                  onChange={(e) => setFormData({ ...formData, taskCompletionRate: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Productivity Score (25%)</span>
                  <span className="font-mono text-white">{formData.productivityScore}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={formData.productivityScore}
                  onChange={(e) => setFormData({ ...formData, productivityScore: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-cyan-900/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
