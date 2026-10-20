import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  unit = '',
  change = null,
  isPositive = true,
  subtitle,
  icon: Icon,
  variant = 'blue', // blue, emerald, violet, amber
  onClick
}) {
  const badgeVariants = {
    cyan: 'bg-blue-50 text-blue-700 border-blue-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    violet: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-300 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border ${badgeVariants[variant] || badgeVariants.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        {change !== null ? (
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <span className="flex items-center text-emerald-600 font-bold">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{change}%
              </span>
            ) : (
              <span className="flex items-center text-red-600 font-bold">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {change}%
              </span>
            )}
            <span className="text-slate-400">vs target</span>
          </div>
        ) : (
          <span className="text-slate-400">Live Metric</span>
        )}

        {subtitle && (
          <span className="text-[11px] text-slate-500 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
