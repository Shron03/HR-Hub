import React, { useEffect, useState } from 'react';
import { Bell, X, Calendar, AlertCircle, ArrowRight } from 'lucide-react';

export default function NotificationToast({ notifications = [], onViewLeaves, onClose }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onClose]);

  if (!notifications || notifications.length === 0) return null;

  const topNotification = notifications[0];
  const pendingCount = notifications.filter(n => n.type === 'leave_request').length;

  return (
    <div className="fixed top-20 right-6 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-4 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              {topNotification.title || 'Workforce Notification'}
            </div>
            <div className="text-[11px] text-slate-500">
              {pendingCount > 0 ? `${pendingCount} action(s) requiring attention` : 'Live system update'}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Message Body */}
      <div className="mt-2 text-xs text-slate-600 line-clamp-2">
        {topNotification.message}
      </div>

      {/* Action CTA */}
      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-[10px] text-slate-400 font-medium">
          Auto-closing in 5s
        </span>
        <button
          onClick={() => {
            onClose();
            if (onViewLeaves) onViewLeaves();
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
        >
          <span>Review Request</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress countdown bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 rounded-b-2xl overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-75 linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
