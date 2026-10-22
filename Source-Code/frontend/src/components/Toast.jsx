import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const typeConfig = {
    success: {
      border: 'border-emerald-300',
      bg: 'bg-emerald-50 text-emerald-900',
      icon: CheckCircle,
      iconColor: 'text-emerald-600'
    },
    error: {
      border: 'border-red-300',
      bg: 'bg-red-50 text-red-900',
      icon: AlertCircle,
      iconColor: 'text-red-600'
    },
    info: {
      border: 'border-blue-300',
      bg: 'bg-blue-50 text-blue-900',
      icon: Info,
      iconColor: 'text-blue-600'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in shadow-xl">
      <div
        className={`flex items-center justify-between p-3.5 rounded-2xl border ${config.border} ${config.bg} shadow-md backdrop-blur-md`}
      >
        <div className="flex items-center space-x-2.5">
          <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
          <span className="text-xs font-semibold">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
