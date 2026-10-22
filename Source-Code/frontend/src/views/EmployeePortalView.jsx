import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Layers,
  ArrowRight
} from 'lucide-react';
import Avatar from '../components/Avatar';
import { api } from '../api/api';

export default function EmployeePortalView({
  currentUser,
  employees = [],
  onNavigateTab
}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  // Find this employee record
  const empId = currentUser?.employeeId || 'EMP-1001';
  const employeeRecord = employees.find(e => e.employeeId === empId) || employees[0] || {};

  const kpi = employeeRecord.kpiData || {
    tasksGiven: 20,
    tasksCompleted: 18,
    reviewScore: 8.5,
    attendanceRate: 92
  };

  const metrics = employeeRecord.metrics || {
    overallScore: 88,
    taskCompletionRate: 90,
    attendanceRate: 92,
    productivityScore: 85
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoadingFeedbacks(true);
        const res = await api.getEmployeeFeedbacks(empId);
        if (res.success) {
          setFeedbacks(res.feedbacks || []);
        }
      } catch (err) {
        console.error('Failed to load employee feedbacks:', err);
      } finally {
        setLoadingFeedbacks(false);
      }
    };

    fetchFeedbacks();
  }, [empId]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Employee Profile Header Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Avatar
              name={employeeRecord.name || currentUser.name}
              initials={employeeRecord.initials || currentUser.initials}
              bg={employeeRecord.avatarBg || '#2563eb'}
              size="xl"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {employeeRecord.name || currentUser.name}
                </h1>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  employeeRecord.status === 'On Leave'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {employeeRecord.status || 'Active'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-semibold text-slate-700">{employeeRecord.role || 'Senior Software Engineer'}</span>
                <span>•</span>
                <span>{employeeRecord.department || 'Engineering'}</span>
                <span>•</span>
                <span className="font-mono">{employeeRecord.employeeId || 'EMP-1001'}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-x-4">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employeeRecord.email || currentUser.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{employeeRecord.location || 'Bengaluru, India'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateTab('leaves')}
              className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* READ-ONLY KPI SCORECARD */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>My Real-Time Performance & KPI Scorecard</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Read-only view. Performance scores are evaluated and synchronized by HR and management.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {employeeRecord.performanceCategory || 'Strong Performer'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              Overall Performance
            </div>
            <div className="text-2xl font-bold font-mono text-blue-600">
              {metrics.overallScore}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Weighted Composite Rating
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              Sprint Tasks Given vs Completed
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {kpi.tasksCompleted} / {kpi.tasksGiven}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              {metrics.taskCompletionRate}% Completion Rate
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              HR Review Score (0 - 10)
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {kpi.reviewScore?.toFixed(1) || '8.5'} <span className="text-xs text-slate-400">/ 10</span>
            </div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              {Math.round((kpi.reviewScore || 8.5) * 10)}% Quality Rating
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="text-xs font-semibold text-slate-500 mb-1">
              Monthly Attendance
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900">
              {kpi.attendanceRate || 92}%
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Compliance Threshold Met
            </div>
          </div>
        </div>
      </div>

      {/* FEEDBACK INBOX & MY TASKS (TWO COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* HR FEEDBACK & APPRAISALS INBOX */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>HR Feedback & Appraisals</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {feedbacks.length} Message(s)
              </span>
            </div>

            {loadingFeedbacks ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Loading messages...
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No feedback messages from HR yet.
              </div>
            ) : (
              <div className="space-y-3">
                {feedbacks.map((fb, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {fb.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(fb.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      "{fb.message}"
                    </p>
                    <div className="text-[11px] text-slate-400 mt-2 font-medium">
                      From: <span className="text-slate-600 font-semibold">{fb.from}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MY ASSIGNED TASKS */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>My Active Deliverables & Tasks</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {(employeeRecord.tasks || []).length} Total
              </span>
            </div>

            {(employeeRecord.tasks || []).length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No active tasks currently assigned.
              </div>
            ) : (
              <div className="space-y-2.5">
                {(employeeRecord.tasks || []).map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {t.title}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Project: {t.project} • Priority: {t.priority}
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
