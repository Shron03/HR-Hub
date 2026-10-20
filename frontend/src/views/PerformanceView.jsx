import React, { useState } from 'react';
import {
  Gauge,
  CheckSquare,
  Clock,
  Award,
  Search,
  Save,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Send,
  IndianRupee,
  Layers,
  Building,
  Briefcase
} from 'lucide-react';
import Avatar from '../components/Avatar';
import { api } from '../api/api';

export default function PerformanceView({
  employees = [],
  onUpdateEmployeeMetrics,
  onSelectEmployee,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0] || null);

  // Calibration Inputs
  const [tasksGiven, setTasksGiven] = useState(selectedEmployee?.kpiData?.tasksGiven || 20);
  const [tasksCompleted, setTasksCompleted] = useState(selectedEmployee?.kpiData?.tasksCompleted || 18);
  const [reviewScore, setReviewScore] = useState(selectedEmployee?.kpiData?.reviewScore !== undefined ? selectedEmployee.kpiData.reviewScore : 8.5);
  const [attendanceRate, setAttendanceRate] = useState(selectedEmployee?.kpiData?.attendanceRate !== undefined ? selectedEmployee.kpiData.attendanceRate : 92);
  const [salary, setSalary] = useState(selectedEmployee?.salary || 850000);
  const [status, setStatus] = useState(selectedEmployee?.status || 'Active');
  const [roleTitle, setRoleTitle] = useState(selectedEmployee?.role || '');
  const [department, setDepartment] = useState(selectedEmployee?.department || 'Engineering');

  // Feedback Modal state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Appraisal');
  const [sendingFeedback, setSendingFeedback] = useState(false);

  // Load employee into calibrator
  const handleSelectEmployeeForTuning = (emp) => {
    setSelectedEmployee(emp);
    const kpi = emp.kpiData || {};
    setTasksGiven(kpi.tasksGiven || 20);
    setTasksCompleted(kpi.tasksCompleted !== undefined ? kpi.tasksCompleted : 18);
    setReviewScore(kpi.reviewScore !== undefined ? kpi.reviewScore : 8.5);
    setAttendanceRate(kpi.attendanceRate !== undefined ? kpi.attendanceRate : (emp.metrics?.attendanceRate !== undefined ? emp.metrics.attendanceRate : 92));
    setSalary(emp.salary || 850000);
    setStatus(emp.status || 'Active');
    setRoleTitle(emp.role || '');
    setDepartment(emp.department || 'Engineering');
  };

  // Synchronized inputs
  const handleGivenChange = (val) => {
    const givenNum = Math.max(1, Number(val) || 1);
    setTasksGiven(givenNum);
    if (tasksCompleted > givenNum) {
      setTasksCompleted(givenNum);
    }
  };

  const handleCompletedChange = (val) => {
    const compNum = Math.max(0, Number(val) || 0);
    setTasksCompleted(Math.min(compNum, tasksGiven));
  };

  const safeGiven = Math.max(1, Number(tasksGiven) || 1);
  const safeCompleted = Math.min(safeGiven, Math.max(0, Number(tasksCompleted) || 0));
  const safeReview = Math.min(10, Math.max(0, Number(reviewScore) || 0));
  const safeAttendance = Math.min(100, Math.max(0, Number(attendanceRate) || 0));

  const taskCompletionRate = Math.min(100, Math.round((safeCompleted / safeGiven) * 100));
  const reviewPercent = Math.min(100, Math.round(safeReview * 10));

  // Auto-calculated overall performance percentage
  const autoCalculatedOverall = Math.round(
    (safeAttendance * 0.20) +
    (taskCompletionRate * 0.40) +
    (reviewPercent * 0.40)
  );

  const getTier = (score) => {
    if (score >= 92) return { label: 'Exceptional (Grade A+)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 82) return { label: 'Strong Performer (Grade A)', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (score >= 70) return { label: 'Meets Expectations (Grade B)', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
    if (score >= 60) return { label: 'Needs Improvement (Grade C)', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    return { label: 'Critical Attention (Grade D)', color: 'bg-red-100 text-red-800 border-red-300' };
  };

  const currentTier = getTier(autoCalculatedOverall);

  const handleSaveKpi = async () => {
    if (!selectedEmployee) return;

    await onUpdateEmployeeMetrics(selectedEmployee._id || selectedEmployee.employeeId, {
      tasksGiven: safeGiven,
      tasksCompleted: safeCompleted,
      reviewScore: safeReview,
      attendanceRate: safeAttendance,
      salary: Number(salary),
      status: status,
      role: roleTitle.trim(),
      department: department
    });
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim() || !selectedEmployee) return;

    try {
      setSendingFeedback(true);
      const res = await api.sendFeedback({
        employeeId: selectedEmployee.employeeId,
        message: feedbackMessage.trim(),
        category: feedbackCategory,
        from: 'Priya Sharma (HR Director)'
      });

      if (res.success) {
        if (showToast) {
          showToast(`Official appraisal note delivered to ${selectedEmployee.name}`, 'success');
        }
        setFeedbackMessage('');
        setIsFeedbackModalOpen(false);
      }
    } catch (err) {
      if (showToast) showToast('Delivery failed: ' + err.message, 'error');
    } finally {
      setSendingFeedback(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Talent Performance & Merit Calibration
            </span>
            <span className="text-xs text-slate-500">Live Executive Calibration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Performance Appraisal & Merit Calibration
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Calibrate deliverable velocity, managerial review ratings, presence compliance, and organizational compensation packages to derive verified workforce ratings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Authorization: HR Leadership Only
          </span>
        </div>
      </div>

      {/* Main Grid: Employee Selection Roster on Left (4 cols), Calibration Matrix on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Employee Roster */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col h-[700px]">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Select Employee ({filteredEmployees.length})
          </div>

          <div className="space-y-2 mb-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, role or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-700"
            >
              <option value="All">All Business Units</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredEmployees.map(emp => {
              const isSelected = selectedEmployee?.employeeId === emp.employeeId;
              return (
                <div
                  key={emp.employeeId}
                  onClick={() => handleSelectEmployeeForTuning(emp)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Avatar
                      name={emp.name}
                      initials={emp.initials}
                      bg={emp.avatarBg}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {emp.role}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold font-mono text-blue-600">
                      {emp.metrics?.overallScore || 85}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {emp.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Calibration Engine & Controls */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col justify-between">
          {selectedEmployee ? (
            <div className="space-y-6">
              
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
                <div className="flex items-center space-x-3.5">
                  <Avatar
                    name={selectedEmployee.name}
                    initials={selectedEmployee.initials}
                    bg={selectedEmployee.avatarBg}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg font-bold text-slate-900">
                        {selectedEmployee.name}
                      </h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {selectedEmployee.employeeId}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {selectedEmployee.role} • {selectedEmployee.department} • {selectedEmployee.location || 'India'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Dispatch Appraisal Note</span>
                  </button>
                </div>
              </div>

              {/* OVERALL PERFORMANCE RATING DISPLAY */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Calculated Overall Performance Rating
                  </div>
                  <div className="flex items-baseline space-x-3 mt-1">
                    <span className="text-4xl font-extrabold font-mono text-blue-700">
                      {autoCalculatedOverall}%
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${currentTier.color}`}>
                      {currentTier.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Throughput Achievement: {taskCompletionRate}% | Review Benchmark: {reviewPercent}% | Attendance Compliance: {safeAttendance}%
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={handleSaveKpi}
                    className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Synchronize & Save</span>
                  </button>
                </div>
              </div>

              {/* CALIBRATION INPUTS MATRIX */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* 1. Assigned Deliverables */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      Assigned Deliverables
                    </label>
                    <span className="text-sm font-bold font-mono text-blue-600">
                      {safeGiven} items
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    value={tasksGiven}
                    onChange={(e) => handleGivenChange(e.target.value)}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 items-center">
                    <span>1</span>
                    <div className="flex items-center space-x-1">
                      <span>Value:</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={tasksGiven}
                        onChange={(e) => handleGivenChange(e.target.value)}
                        className="w-14 px-1 py-0.5 text-xs text-right border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Completed Deliverables (Synchronized) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      Completed Deliverables
                    </label>
                    <span className="text-sm font-bold font-mono text-emerald-600">
                      {safeCompleted} / {safeGiven} ({taskCompletionRate}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={safeGiven}
                    step="1"
                    value={tasksCompleted}
                    onChange={(e) => handleCompletedChange(e.target.value)}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 items-center">
                    <span>0</span>
                    <div className="flex items-center space-x-1">
                      <span>Value:</span>
                      <input
                        type="number"
                        min="0"
                        max={safeGiven}
                        value={tasksCompleted}
                        onChange={(e) => handleCompletedChange(e.target.value)}
                        className="w-14 px-1 py-0.5 text-xs text-right border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Managerial Review Rating (0.0 to 10.0 scale with 0.1 step) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      Managerial Review Rating
                    </label>
                    <span className="text-sm font-bold font-mono text-orange-600">
                      {safeReview.toFixed(1)} / 10.0 ({reviewPercent}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="10.0"
                    step="0.1"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(parseFloat(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 items-center">
                    <span>0.0</span>
                    <div className="flex items-center space-x-1">
                      <span>Decimal:</span>
                      <input
                        type="number"
                        min="0.0"
                        max="10.0"
                        step="0.1"
                        value={reviewScore}
                        onChange={(e) => setReviewScore(parseFloat(e.target.value))}
                        className="w-16 px-1 py-0.5 text-xs text-right border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Attendance Compliance Rate (0% to 100%) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-800">
                      Attendance Compliance Rate
                    </label>
                    <span className="text-sm font-bold font-mono text-blue-600">
                      {safeAttendance}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={attendanceRate}
                    onChange={(e) => setAttendanceRate(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 items-center">
                    <span>0%</span>
                    <div className="flex items-center space-x-1">
                      <span>Value:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={attendanceRate}
                        onChange={(e) => setAttendanceRate(Number(e.target.value))}
                        className="w-14 px-1 py-0.5 text-xs text-right border border-slate-300 rounded bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Role Title (HR Authorized Edit) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Designation / Role Title
                  </label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                  <div className="text-[10px] text-slate-400 mt-1">
                    Updated across organizational charts and payroll rosters.
                  </div>
                </div>

                {/* 6. Department Assignment (HR Authorized Edit) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Business Unit / Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Syncs departmental hierarchy and team reporting lines.
                  </div>
                </div>

                {/* 7. Annual CTC Salary (INR) - HR Authorized */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Annual Compensation Package (CTC in ₹ INR)
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      step="25000"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold font-mono"
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Monthly Gross Equivalent: ₹ {Math.round(salary / 12).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* 8. Employment Status - HR Authorized */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Workforce Presence Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Active">Active (On Duty)</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Probation">Probationary Period</option>
                    <option value="Notice Period">Notice Period</option>
                    <option value="Terminated">Separated</option>
                  </select>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Automatically reflects across directories and time-off tracking.
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select an employee from the roster on the left to initiate performance calibration.
            </div>
          )}
        </div>

      </div>

      {/* APPRAISAL FEEDBACK MODAL */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="relative w-full max-w-lg glass-panel rounded-2xl shadow-2xl border border-slate-200 bg-white p-6 animate-fade-in text-slate-900">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Dispatch Appraisal Feedback to {selectedEmployee.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              This message will be archived in the employee's personal appraisal history and delivered to their self-service inbox.
            </p>

            <form onSubmit={handleSendFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Feedback Classification
                </label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Appraisal">Performance Appraisal</option>
                  <option value="Recognition">Excellence Recognition</option>
                  <option value="Improvement Plan">Developmental Support Plan</option>
                  <option value="General Notice">General Corporate Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Appraisal Remarks
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Articulate constructive observations, merit recognitions, or deliverable targets..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingFeedback}
                  className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingFeedback ? 'Delivering...' : 'Dispatch Appraisal Note'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
