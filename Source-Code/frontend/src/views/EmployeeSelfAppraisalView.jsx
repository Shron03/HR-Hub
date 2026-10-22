import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Star,
  FileCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import { api } from '../api/api';

export default function EmployeeSelfAppraisalView({ currentUser, employees = [], showToast }) {
  const empId = currentUser?.employeeId || 'EMP-1001';
  const employee = employees.find(e => e.employeeId === empId) || employees[0] || {};
  const metrics = employee.metrics || {
    overallScore: 88,
    attendanceRate: 92,
    taskCompletionRate: 90,
    productivityScore: 85
  };

  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  // Self Appraisal Form State
  const [selfRating, setSelfRating] = useState(8.5);
  const [accomplishments, setAccomplishments] = useState('');
  const [growthGoals, setGrowthGoals] = useState('');
  const [managerFeedback, setManagerFeedback] = useState('');
  const [submittingSelf, setSubmittingSelf] = useState(false);
  const [selfSubmitted, setSelfSubmitted] = useState(() => {
    return localStorage.getItem(`hrhub_self_appraisal_${empId}`) === 'true';
  });

  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedbacks(true);
      const res = await api.getEmployeeFeedbacks(empId);
      if (res.success) {
        setFeedbacks(res.feedbacks || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [empId]);

  const handleSubmitSelfAppraisal = (e) => {
    e.preventDefault();
    if (!accomplishments.trim()) {
      showToast('Please state your quarterly accomplishments', 'error');
      return;
    }

    setSubmittingSelf(true);
    setTimeout(() => {
      setSelfSubmitted(true);
      localStorage.setItem(`hrhub_self_appraisal_${empId}`, 'true');
      setSubmittingSelf(false);
      showToast('Self-Appraisal submitted to HR Director and Engineering Manager', 'success');
    }, 600);
  };

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Evaluation & Growth Scorecard
            </span>
            <span className="text-xs text-slate-500 font-medium">{currentUser?.name || 'Aarav Patel'}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Performance & Self-Appraisal Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Review live KPI composite derivations, submit your quarterly self-evaluation, and review official managerial feedback.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Tier: {employee.performanceCategory || 'Strong Performer'}
        </span>
      </div>

      {/* KPI Scorecard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Overall Composite Score</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">{metrics.overallScore}%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Synchronized real-time index</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Deliverable Completion</span>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-0.5">{metrics.taskCompletionRate}%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Assigned sprint deliverables</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Attendance Compliance</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-0.5">{metrics.attendanceRate}%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Presence & punctuality ratio</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Productivity Velocity</span>
          <div className="text-2xl font-bold font-mono text-orange-600 mt-0.5">{metrics.productivityScore}%</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Quarterly benchmark index</span>
        </div>
      </div>

      {/* Two Column Grid: Self-Appraisal Form & Official HR Feedbacks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column: Quarterly Self-Evaluation Submitter */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Q4 Self-Appraisal Submission</span>
            </span>
            {selfSubmitted && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Submitted & Filed
              </span>
            )}
          </div>

          {selfSubmitted ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
              <div className="font-bold text-slate-800 text-sm">Self-Appraisal Successfully Submitted</div>
              <p className="text-[11px] text-slate-600">
                Your quarterly self-evaluation has been filed for manager calibration and HR Director review.
              </p>
              <button
                onClick={() => {
                  setSelfSubmitted(false);
                  localStorage.removeItem(`hrhub_self_appraisal_${empId}`);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer underline pt-2"
              >
                Re-open and edit submission
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitSelfAppraisal} className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-semibold">Self-Evaluation Score (0.0 to 10.0)</label>
                  <span className="font-mono font-bold text-blue-600 text-sm">{selfRating} / 10.0</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={selfRating}
                  onChange={(e) => setSelfRating(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Key Deliverables & Accomplishments *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Outline sprint milestones achieved, system performance optimizations, or architectural deliveries..."
                  value={accomplishments}
                  onChange={(e) => setAccomplishments(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Developmental Goals for Next Quarter</label>
                <textarea
                  rows="2"
                  placeholder="Skills, certifications, or leadership responsibilities you plan to develop..."
                  value={growthGoals}
                  onChange={(e) => setGrowthGoals(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Feedback for Leadership & Tooling Support</label>
                <textarea
                  rows="2"
                  placeholder="Support or tooling that would help unblock your sprint velocity..."
                  value={managerFeedback}
                  onChange={(e) => setManagerFeedback(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submittingSelf}
                className="w-full btn-large bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingSelf ? 'Submitting...' : 'Submit Self-Appraisal'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: HR Appraisals & Feedback Received */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <div className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Official Appraisal & Feedback Archive ({feedbacks.length})</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">Dispatched by HR Director</span>
          </div>

          {loadingFeedbacks ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading appraisal history...</div>
          ) : feedbacks.length === 0 ? (
            <div className="p-10 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              No formal HR appraisals recorded for this cycle yet.
            </div>
          ) : (
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {feedbacks.map((fb, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {fb.category || 'Appraisal'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(fb.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{fb.message}"
                  </p>

                  <div className="text-[10px] text-slate-400 mt-2 font-medium">
                    Evaluator: <span className="text-slate-700 font-semibold">{fb.from || 'Priya Sharma (HR Director)'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
