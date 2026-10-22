import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  UserMinus,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Search,
  Plus,
  Check,
  Building,
  Briefcase,
  FileText,
  Laptop,
  ShieldCheck,
  X
} from 'lucide-react';
import { api } from '../api/api';

export default function OnboardingOffboardingView({ showToast }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Onboarding', 'Offboarding'
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newCaseData, setNewCaseData] = useState({
    type: 'Onboarding',
    candidateName: '',
    employeeId: '',
    role: '',
    department: 'Engineering',
    managerName: 'Rajesh Verma',
    targetDate: '2026-11-01',
    notes: ''
  });

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await api.getOnboardingCases();
      if (res.success) {
        setCases(res.cases || []);
        if (selectedCase) {
          const updated = (res.cases || []).find(c => c._id === selectedCase._id);
          if (updated) setSelectedCase(updated);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleToggleTask = async (caseId, taskId) => {
    try {
      const res = await api.toggleChecklistTask(caseId, taskId);
      if (res.success) {
        setCases(prev => prev.map(c => c._id === caseId ? res.case : c));
        if (selectedCase && selectedCase._id === caseId) {
          setSelectedCase(res.case);
        }
        showToast(res.message, 'success');
      }
    } catch (err) {
      showToast('Failed to update task: ' + err.message, 'error');
    }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!newCaseData.candidateName || !newCaseData.role) {
      showToast('Candidate name and role title are required', 'error');
      return;
    }
    try {
      const res = await api.createOnboardingCase(newCaseData);
      if (res.success) {
        showToast(res.message, 'success');
        setIsNewModalOpen(false);
        setNewCaseData({
          type: 'Onboarding',
          candidateName: '',
          employeeId: '',
          role: '',
          department: 'Engineering',
          managerName: 'Rajesh Verma',
          targetDate: '2026-11-01',
          notes: ''
        });
        await fetchCases();
      }
    } catch (err) {
      showToast('Failed to create case: ' + err.message, 'error');
    }
  };

  const filteredCases = cases.filter(c => {
    if (activeTab !== 'All' && c.type !== activeTab) return false;
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.candidateName.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.caseId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const onboardingCount = cases.filter(c => c.type === 'Onboarding' && c.status !== 'Completed').length;
  const offboardingCount = cases.filter(c => c.type === 'Offboarding' && c.status !== 'Completed').length;
  const completedCount = cases.filter(c => c.status === 'Completed').length;

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Talent Lifecycle Governance
            </span>
            <span className="text-xs text-slate-500 font-medium">Enterprise Workflow</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Onboarding & Offboarding Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Structured induction verification, IT asset provisioning, peer buddy assignment, exit clearance, and settlement workflows.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer py-2 px-4 text-xs font-semibold flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate Lifecycle Case</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Onboardings</span>
            <div className="text-2xl font-bold font-mono text-blue-600 mt-0.5">{onboardingCount}</div>
            <span className="text-[11px] text-slate-400">Incoming talent induction</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Offboardings</span>
            <div className="text-2xl font-bold font-mono text-orange-600 mt-0.5">{offboardingCount}</div>
            <span className="text-[11px] text-slate-400">Exit & asset clearance in progress</span>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
            <UserMinus className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Completed Transitions</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">{completedCount}</div>
            <span className="text-[11px] text-slate-400">Fully signed-off cases</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            {['All', 'Onboarding', 'Offboarding'].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeTab === t ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Initiated">Initiated</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate, role, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Content Grid: Cases List & Selected Checklist Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 2 Columns: Cases List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span>Active Cases ({filteredCases.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Select a case to inspect checklist</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading lifecycle workflows...</div>
          ) : filteredCases.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No lifecycle cases found matching the criteria.
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredCases.map(c => {
                const isSelected = selectedCase?._id === c._id;
                const isOnboarding = c.type === 'Onboarding';

                return (
                  <div
                    key={c._id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOnboarding
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {c.type}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400 font-semibold">{c.caseId}</span>
                          <span className="font-bold text-slate-900 text-xs">{c.candidateName}</span>
                          {c.employeeId && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-mono">
                              {c.employeeId}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center gap-x-2.5">
                          <span>{c.role}</span>
                          <span>•</span>
                          <span>{c.department}</span>
                          <span>•</span>
                          <span>Lead: {c.managerName}</span>
                          <span>•</span>
                          <span>Target: {c.targetDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-xs font-bold font-mono text-slate-800">{c.progressPercent}%</div>
                          <span className={`text-[10px] font-semibold ${
                            c.status === 'Completed' ? 'text-emerald-600' : 'text-blue-600'
                          }`}>
                            {c.status}
                          </span>
                        </div>

                        <div className="w-16 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${c.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Column: Checklist Inspector & Action Panel */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col justify-between">
          {selectedCase ? (
            <div>
              <div className="pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedCase.type === 'Onboarding' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {selectedCase.type} Process
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-800">{selectedCase.progressPercent}% Complete</span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-1.5">{selectedCase.candidateName}</h2>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {selectedCase.role} • {selectedCase.department}
                </div>
                {selectedCase.notes && (
                  <div className="text-[11px] text-slate-600 italic mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{selectedCase.notes}"
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Checklist Milestones ({selectedCase.checklist?.filter(i => i.isCompleted).length} / {selectedCase.checklist?.length})
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {(selectedCase.checklist || []).map(task => (
                    <div
                      key={task._id}
                      onClick={() => handleToggleTask(selectedCase._id, task._id)}
                      className={`p-2.5 rounded-xl border text-xs flex items-start space-x-2.5 transition-all cursor-pointer ${
                        task.isCompleted
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-700'
                          : 'bg-white border-slate-200 text-slate-900 hover:border-blue-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center flex-shrink-0 ${
                        task.isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 bg-white'
                      }`}>
                        {task.isCompleted && <Check className="w-3 h-3" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className={`font-medium ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.taskName}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Category: {task.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-full">
              <ShieldCheck className="w-8 h-8 text-slate-300 mb-2" />
              <span>Select an onboarding or offboarding case from the roster to view and toggle its compliance checklist.</span>
            </div>
          )}
        </div>

      </div>

      {/* Initiate Lifecycle Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-200 bg-white/95 shadow-2xl p-6 flex flex-col text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Initiate Lifecycle Case</h2>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Process Type</label>
                  <select
                    value={newCaseData.type}
                    onChange={(e) => setNewCaseData({ ...newCaseData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold cursor-pointer"
                  >
                    <option value="Onboarding">Onboarding (New Joiner)</option>
                    <option value="Offboarding">Offboarding (Exit Clearance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Milestone Date</label>
                  <input
                    type="date"
                    required
                    value={newCaseData.targetDate}
                    onChange={(e) => setNewCaseData({ ...newCaseData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Candidate / Employee Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Deshmukh"
                  value={newCaseData.candidateName}
                  onChange={(e) => setNewCaseData({ ...newCaseData, candidateName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={newCaseData.department}
                    onChange={(e) => setNewCaseData({ ...newCaseData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Engineer"
                    value={newCaseData.role}
                    onChange={(e) => setNewCaseData({ ...newCaseData, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Manager / Lead</label>
                  <input
                    type="text"
                    placeholder="Rajesh Verma"
                    value={newCaseData.managerName}
                    onChange={(e) => setNewCaseData({ ...newCaseData, managerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Employee ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. EMP-1018"
                    value={newCaseData.employeeId}
                    onChange={(e) => setNewCaseData({ ...newCaseData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Administrative Remarks</label>
                <textarea
                  rows="2"
                  placeholder="Additional background notes or asset specifications..."
                  value={newCaseData.notes}
                  onChange={(e) => setNewCaseData({ ...newCaseData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-large bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 shadow-xs cursor-pointer"
                >
                  Initialize Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
