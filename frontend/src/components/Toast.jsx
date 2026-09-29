import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const typeConfig = {
    success: {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/90',
      icon: CheckCircle,
      iconColor: 'text-emerald-400'
    },
    error: {
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/90',
      icon: AlertCircle,
      iconColor: 'text-rose-400'
    },
    info: {
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/90',
      icon: Info,
      iconColor: 'text-cyan-400'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-sm">
      <div
        className={`glass-panel flex items-center justify-between p-3.5 rounded-xl border ${config.border} ${config.bg} shadow-2xl backdrop-blur-xl`}
      >
        <div className="flex items-center space-x-2.5">
          <Icon className={`w-4 h-4 ${config.iconColor} shrink-0`} />
          <span className="text-xs font-medium text-slate-100">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
