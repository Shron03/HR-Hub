import React, { useState, useEffect } from 'react';
import { X, Briefcase, Building, ShieldCheck, Calendar, ArrowRight, Check } from 'lucide-react';

export default function EditDesignationModal({
  isOpen,
  onClose,
  employee,
  onSave
}) {
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [reason, setReason] = useState('Merit Promotion');
  const [effectiveDate, setEffectiveDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (employee) {
      setDepartment(employee.department || 'Engineering');
      setRole(employee.role || '');
      setReason('Merit Promotion');
      setEffectiveDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const departments = ['Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources'];
  const reasons = [
    'Merit Promotion',
    'Departmental Transfer',
    'Role Reclassification',
    'Organizational Restructuring',
    'Probation Confirmation & Title Assignment'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim()) return;

    setSaving(true);
    try {
      await onSave({
        role: role.trim(),
        department,
        designationChange: {
          previousRole: employee.role,
          newRole: role.trim(),
          previousDepartment: employee.department,
          newDepartment: department,
          reason,
          effectiveDate
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Update Official Designation
              </h2>
              <p className="text-[11px] text-slate-500">
                {employee.name} ({employee.employeeId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current State Info */}
        <div className="my-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Current Position
          </span>
          <div className="font-semibold text-slate-900">{employee.role}</div>
          <div className="text-slate-500">{employee.department} Department</div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              New Department Assignment *
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              New Official Role Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Principal Systems Architect"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Effective Date
              </label>
              <input
                type="date"
                required
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Classification Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {reasons.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Internal Authorization Note (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Record approval reference or committee sign-off details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors font-semibold text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
            >
              {saving ? <span>Updating...</span> : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Designation Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
