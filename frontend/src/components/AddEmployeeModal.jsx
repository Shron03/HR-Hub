import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit3, Sliders, Check, Shield } from 'lucide-react';

export default function AddEmployeeModal({ isOpen, onClose, onSave, employeeToEdit = null }) {
  const isEditing = Boolean(employeeToEdit);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: '',
    location: 'Headquarters',
    salary: 85000,
    status: 'Active',
    attendanceRate: 92,
    taskCompletionRate: 88,
    productivityScore: 89,
    projectContribution: 85,
    workEfficiency: 87
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        department: employeeToEdit.department || 'Engineering',
        role: employeeToEdit.role || '',
        location: employeeToEdit.location || 'Headquarters',
        salary: employeeToEdit.salary || 85000,
        status: employeeToEdit.status || 'Active',
        attendanceRate: employeeToEdit.metrics?.attendanceRate ?? 90,
        taskCompletionRate: employeeToEdit.metrics?.taskCompletionRate ?? 85,
        productivityScore: employeeToEdit.metrics?.productivityScore ?? 88,
        projectContribution: employeeToEdit.metrics?.projectContribution ?? 85,
        workEfficiency: employeeToEdit.metrics?.workEfficiency ?? 86
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        role: '',
        location: 'Headquarters',
        salary: 85000,
        status: 'Active',
        attendanceRate: 92,
        taskCompletionRate: 88,
        productivityScore: 89,
        projectContribution: 85,
        workEfficiency: 87
      });
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources'];
  const statuses = ['Active', 'On Leave', 'Probation', 'Terminated'];

  // Calculated overall score preview
  const previewScore = Math.round(
    (formData.attendanceRate * 0.20) +
    (formData.taskCompletionRate * 0.25) +
    (formData.productivityScore * 0.25) +
    (formData.projectContribution * 0.15) +
    (formData.workEfficiency * 0.15)
  );

  const getTierName = (score) => {
    if (score >= 92) return 'Exceptional';
    if (score >= 82) return 'Strong Performer';
    if (score >= 70) return 'Meets Expectations';
    if (score >= 60) return 'Needs Improvement';
    return 'Critical Attention';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        department: formData.department,
        role: formData.role.trim(),
        location: formData.location.trim(),
        salary: Number(formData.salary),
        status: formData.status,
        metrics: {
          attendanceRate: Number(formData.attendanceRate),
          taskCompletionRate: Number(formData.taskCompletionRate),
          productivityScore: Number(formData.productivityScore),
          projectContribution: Number(formData.projectContribution),
          workEfficiency: Number(formData.workEfficiency)
        }
      };
      await onSave(payload, employeeToEdit?._id || employeeToEdit?.employeeId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-400">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? `Edit Employee: ${employeeToEdit.name}` : 'Add New Employee'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? `Editing ID: ${employeeToEdit.employeeId}` : 'Create a new employee profile with KPI metrics'}
              </p>
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
                placeholder="e.g. Jordan Miller"
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
                placeholder="name@hrhub.io"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Location</label>
              <input
                type="text"
                placeholder="San Francisco, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Salary ($)</label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Performance Sliders */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Performance KPI Calibration</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-cyan-400 font-bold">
                  Score: {previewScore}%
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {getTierName(previewScore)}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Attendance Rate (20%)</span>
                  <span className="font-mono text-cyan-400 font-bold">{formData.attendanceRate}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={formData.attendanceRate}
                  onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Task Completion Rate (25%)</span>
                  <span className="font-mono text-indigo-400 font-bold">{formData.taskCompletionRate}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={formData.taskCompletionRate}
                  onChange={(e) => setFormData({ ...formData, taskCompletionRate: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Productivity Score (25%)</span>
                  <span className="font-mono text-purple-400 font-bold">{formData.productivityScore}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={formData.productivityScore}
                  onChange={(e) => setFormData({ ...formData, productivityScore: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Contribution (15%)</span>
                    <span className="font-mono text-emerald-400 font-bold">{formData.projectContribution}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={formData.projectContribution}
                    onChange={(e) => setFormData({ ...formData, projectContribution: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Work Efficiency (15%)</span>
                    <span className="font-mono text-amber-400 font-bold">{formData.workEfficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={formData.workEfficiency}
                    onChange={(e) => setFormData({ ...formData, workEfficiency: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                </div>
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
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-lg shadow-cyan-950/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
