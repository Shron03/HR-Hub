import React, { useState, useEffect } from 'react';
import { UserCheck, X, Check, Trash2, Mail, Building, Briefcase, ShieldAlert } from 'lucide-react';
import { api } from '../api/api';

export default function RegistrationApprovalsModal({ isOpen, onClose, onRefresh, showToast }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [operatingId, setOperatingId] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.getPendingRegistrations();
      if (res.success) {
        setRegistrations(res.registrations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRegistrations();
    }
  }, [isOpen]);

  const handleApprove = async (id, name) => {
    try {
      setOperatingId(id);
      const res = await api.approveRegistration(id);
      if (res.success) {
        if (showToast) showToast(`Authorized ${name}. Profile enrolled into Directory.`, 'success');
        await fetchRegistrations();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      if (showToast) showToast('Approval failed: ' + err.message, 'error');
    } finally {
      setOperatingId(null);
    }
  };

  const handleReject = async (id, name) => {
    if (!window.confirm(`Decline access registration for ${name}?`)) return;
    try {
      setOperatingId(id);
      const res = await api.rejectRegistration(id);
      if (res.success) {
        if (showToast) showToast(`Declined registration for ${name}.`, 'info');
        await fetchRegistrations();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      if (showToast) showToast('Rejection failed: ' + err.message, 'error');
    } finally {
      setOperatingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in text-slate-800">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/95 shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pending Registration Approvals
              </h2>
              <p className="text-xs text-slate-500">
                Review and authorize new user account access requests to enroll them into workforce records.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading pending requests...</div>
          ) : registrations.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No account registration requests pending administrative approval.
            </div>
          ) : (
            registrations.map(u => (
              <div
                key={u._id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{u.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {u.role}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {u.department}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.email}</span>
                    </span>
                    <span>•</span>
                    <span>Requested: {new Date(u.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApprove(u._id, u.name)}
                    disabled={operatingId === u._id}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center space-x-1 cursor-pointer disabled:opacity-60"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorize</span>
                  </button>
                  <button
                    onClick={() => handleReject(u._id, u.name)}
                    disabled={operatingId === u._id}
                    className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
