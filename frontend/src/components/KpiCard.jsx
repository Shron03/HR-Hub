import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function KpiCard({
  title,
  value,
  unit = '',
  change = null,
  isPositive = true,
  subtitle,
  icon: Icon,
  variant = 'cyan', // cyan, emerald, violet, amber
  onClick
}) {
  const glowVariants = {
    cyan: 'border-cyan-500/20 hover:border-cyan-400/40 shadow-cyan-950/20 text-cyan-400 bg-cyan-950/20',
    emerald: 'border-emerald-500/20 hover:border-emerald-400/40 shadow-emerald-950/20 text-emerald-400 bg-emerald-950/20',
    violet: 'border-purple-500/20 hover:border-purple-400/40 shadow-purple-950/20 text-purple-400 bg-purple-950/20',
    amber: 'border-amber-500/20 hover:border-amber-400/40 shadow-amber-950/20 text-amber-400 bg-amber-950/20'
  };

  const badgeVariants = {
    cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    violet: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30'
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl backdrop-blur-xl ${
        glowVariants[variant] || glowVariants.cyan
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold text-slate-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-xl border ${badgeVariants[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
        {change !== null ? (
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <span className="flex items-center text-emerald-400 font-medium">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +{change}%
              </span>
            ) : (
              <span className="flex items-center text-rose-400 font-medium">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {change}%
              </span>
            )}
            <span className="text-slate-400">vs target</span>
          </div>
        ) : (
          <span className="text-slate-400">Live Aggregate</span>
        )}

        {subtitle && (
          <span className="text-[11px] text-slate-400 font-mono">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
