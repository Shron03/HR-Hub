import React, { useState, useEffect } from 'react';
import { X, UserPlus, Edit3, Lock, ShieldCheck, IndianRupee, Building, Briefcase } from 'lucide-react';

export default function AddEmployeeModal({ isOpen, onClose, onSave, employeeToEdit = null }) {
  const isEditing = Boolean(employeeToEdit);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    role: '',
    location: 'Bengaluru, India',
    salary: 850000,
    status: 'Active',
    workMode: 'Hybrid',
    managerName: 'Executive Committee',
    phone: '+91 98765 43210',
    notes: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        department: employeeToEdit.department || 'Engineering',
        role: employeeToEdit.role || '',
        location: employeeToEdit.location || 'Bengaluru, India',
        salary: employeeToEdit.salary || 850000,
        status: employeeToEdit.status || 'Active',
        workMode: employeeToEdit.workMode || 'Hybrid',
        managerName: employeeToEdit.managerName || 'Executive Committee',
        phone: employeeToEdit.phone || '+91 98765 43210',
        notes: employeeToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        role: '',
        location: 'Bengaluru, India',
        salary: 850000,
        status: 'Active',
        workMode: 'Hybrid',
        managerName: 'Executive Committee',
        phone: '+91 98765 43210',
        notes: ''
      });
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources'];
  const statuses = ['Active', 'On Leave', 'Probation', 'Notice Period', 'Terminated'];
  const workModes = ['On-site', 'Hybrid', 'Remote'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        // HR is authorized to update role, department, salary, status, location, managerName, workMode, phone, and notes
        await onSave({
          role: formData.role.trim(),
          department: formData.department,
          salary: Number(formData.salary),
          status: formData.status,
          location: formData.location.trim(),
          managerName: formData.managerName?.trim(),
          workMode: formData.workMode,
          phone: formData.phone?.trim(),
          notes: formData.notes
        }, employeeToEdit._id || employeeToEdit.employeeId);
      } else {
        // Creating new employee record
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          department: formData.department,
          role: formData.role.trim(),
          location: formData.location.trim(),
          salary: Number(formData.salary),
          status: formData.status,
          workMode: formData.workMode,
          managerName: formData.managerName?.trim(),
          phone: formData.phone?.trim(),
          notes: formData.notes
        };
        await onSave(payload, null);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/95 shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditing ? `Calibrate Employee Profile: ${employeeToEdit.name}` : 'Add New Employee Record'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Role title, department assignment, compensation CTC, work mode, and operational status are editable by HR.'
                  : 'Enroll a new employee record into the corporate directory.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 text-xs pr-1">
          
          {isEditing && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                <strong>HR Governance Rule:</strong> Full Name and Corporate Email remain locked for audit integrity. Role title, department, compensation, status, and reporting lines can be updated below.
              </span>
            </div>
          )}

          {/* Personal Identity (Locked when editing) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
                <span>Full Name</span>
                {isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </label>
              <input
                type="text"
                required
                disabled={isEditing}
                placeholder="e.g. Sneha Rao"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isEditing
                    ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1">
                <span>Corporate Email</span>
                {isEditing && <Lock className="w-3 h-3 text-slate-400" />}
              </label>
              <input
                type="email"
                required
                disabled={isEditing}
                placeholder="name@hrhub.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-xs ${
                  isEditing
                    ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-white border-slate-300 text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Organization & Role (Editable by HR) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-blue-700">
                Department Assignment *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-blue-700">
                Official Role Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Product Manager"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location, Work Mode & Reporting Manager */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Base Location
              </label>
              <input
                type="text"
                placeholder="Bengaluru, India"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Work Mode
              </label>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {workModes.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Reporting Manager
              </label>
              <input
                type="text"
                placeholder="e.g. Rajesh Verma"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Salary, Status & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-blue-700">
                Annual CTC (₹ INR) *
              </label>
              <input
                type="number"
                step="25000"
                required
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-blue-700">
                Employment Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Internal HR Notes & Appraisal Remarks
            </label>
            <textarea
              rows="3"
              placeholder="Add confidential notes, quarterly review remarks, or retention actions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer disabled:opacity-60"
            >
              <span>{saving ? 'Saving...' : isEditing ? 'Save Employee Profile' : 'Create Employee Record'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
