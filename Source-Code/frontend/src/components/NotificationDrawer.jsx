import React, { useState } from 'react';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Calendar,
  MessageSquare,
  UserPlus,
  AlertTriangle,
  ArrowRight,
  Clock,
  Trash2
} from 'lucide-react';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
  onNavigateTab
}) {
  const [filter, setFilter] = useState('all'); // 'all' or 'unread'

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'leave_request':
      case 'leave_decision':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'appraisal_feedback':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'registration':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'kpi_update':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Recent';
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col text-slate-800">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <span>Notifications & Activity</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-600 text-white">
                    {unreadCount} Unread
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                Retention window: 3 days (older records auto-cleared)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Filters */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs bg-white">
          <div className="flex space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                filter === 'unread' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <div className="font-semibold text-slate-600">No active notifications</div>
              <div className="text-[11px] mt-0.5">All updates within the 3-day window have been addressed.</div>
            </div>
          ) : (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read && onMarkRead) onMarkRead(n.id);
                  if (n.actionLink && onNavigateTab) {
                    onNavigateTab(n.actionLink);
                    onClose();
                  }
                }}
                className={`p-4 transition-colors cursor-pointer ${
                  !n.read ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs flex-shrink-0 mt-0.5">
                    {getCategoryIcon(n.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-blue-600 font-semibold flex items-center space-x-1">
                        <span>View details</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" title="Unread message" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center text-[11px] text-slate-500">
          Showing personalized messages for your active role & identity
        </div>

      </div>
    </div>
  );
}
