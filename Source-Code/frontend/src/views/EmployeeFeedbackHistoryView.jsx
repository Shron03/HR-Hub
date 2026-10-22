import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Award, User, Tag, Clock } from 'lucide-react';
import Avatar from '../components/Avatar';
import { api } from '../api/api';

export default function EmployeeFeedbackHistoryView({ currentUser, employeeRecord }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const empId = currentUser?.employeeId || employeeRecord?.employeeId || 'EMP-1001';

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const res = await api.getEmployeeFeedbacks(empId);
        if (res.success) {
          setFeedbacks(res.feedbacks || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [empId]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Appraisal Archive
            </span>
            <span className="text-xs text-slate-500">
              {feedbacks.length} Official Feedback Records
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Past Appraisals & Performance Feedback
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Historical repository of official performance appraisals, excellence recognitions, and targeted developmental feedback notes from HR Director.
          </p>
        </div>
      </div>

      {/* Feedbacks Timeline */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading appraisal history...</div>
        ) : feedbacks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <div className="font-semibold text-slate-600">No appraisal feedback recorded yet</div>
            <div className="text-[11px] mt-0.5">Formal reviews and commendations from HR leadership will appear here.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((fb, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {fb.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      From: {fb.from}
                    </span>
                  </div>

                  <span className="text-xs text-slate-500 flex items-center space-x-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(fb.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed font-normal italic">
                  "{fb.message}"
                </p>

                <div className="mt-3 pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Official Performance Registry</span>
                  <span className="font-semibold text-emerald-600">Verified by HR Administration</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
