import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  TrendingUp,
  Users,
  Award,
  AlertTriangle,
  Clock,
  CheckCircle,
  Building2,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import KpiCard from '../components/KpiCard';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardView({ analyticsData, onSelectEmployee, onNavigateTab }) {
  const [chartMode, setChartMode] = useState('radar'); // 'radar' or 'bar'

  const stats = analyticsData?.stats || {
    totalHeadcount: 15,
    avgPerformanceScore: 88.2,
    avgAttendanceRate: 91.5,
    avgTaskCompletion: 87.8,
    topPerformersCount: 5,
    atRiskCount: 3
  };

  const depts = analyticsData?.departmentAnalytics || [];
  const trends = analyticsData?.attendanceTrends || [];
  const topPerformers = analyticsData?.topPerformers || [];
  const categoryDist = analyticsData?.categoryDistribution || {};

  // 1. Line Chart: 6-Month Attendance & Productivity Trends
  const trendChartData = {
    labels: trends.map(t => t.month),
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: trends.map(t => t.attendance),
        borderColor: '#06b6d4', // Cyan
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#080c14',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Productivity Score (%)',
        data: trends.map(t => t.productivity),
        borderColor: '#a855f7', // Violet
        backgroundColor: 'rgba(168, 85, 247, 0.12)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#080c14',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      },
      {
        label: 'Overall KPI Score',
        data: trends.map(t => t.overallScore),
        borderColor: '#10b981', // Emerald
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#080c14',
        pointBorderWidth: 2,
        pointRadius: 3
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' },
          boxWidth: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: {
        min: 60,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  };

  // 2. Department Radar / Bar Chart
  const radarData = {
    labels: depts.map(d => d.name),
    datasets: [
      {
        label: 'Actual Avg Score',
        data: depts.map(d => d.avgScore),
        backgroundColor: 'rgba(6, 182, 212, 0.25)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        pointBackgroundColor: '#06b6d4'
      },
      {
        label: 'Target KPI Score',
        data: depts.map(d => d.targetScore),
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderColor: '#a855f7',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: '#a855f7'
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { size: 11 }, boxWidth: 10 }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: { color: '#cbd5e1', font: { size: 11 } },
        ticks: { backdropColor: 'transparent', color: '#64748b', stepSize: 10, min: 70, max: 100 }
      }
    }
  };

  // 3. Category Distribution Doughnut Chart
  const doughnutData = {
    labels: ['Exceptional (>=92)', 'Strong (82-91)', 'Meets (70-81)', 'Needs Imp (60-69)', 'Critical (<60)'],
    datasets: [
      {
        data: [
          categoryDist['Exceptional'] || 16,
          categoryDist['Strong Performer'] || 23,
          categoryDist['Meets Expectations'] || 3,
          categoryDist['Needs Improvement'] || 2,
          categoryDist['Critical Attention'] || 1
        ],
        backgroundColor: [
          '#10b981', // Emerald
          '#06b6d4', // Cyan
          '#3b82f6', // Blue
          '#f59e0b', // Amber
          '#ef4444'  // Rose
        ],
        borderColor: '#080c14',
        borderWidth: 3,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 8, padding: 12 }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      }
    },
    cutout: '70%'
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/50">
              Module 3: HR Analytics Dashboard
            </span>
            <span className="text-xs text-slate-400">Quarterly Workforce Evaluation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
            Enterprise Performance Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live multi-department metrics, KPI tracking distributions, predictive insights, and automated leadership ratings.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Export Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards (KPI Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Avg Performance Score"
          value={stats.avgPerformanceScore}
          unit="/ 100"
          change={4.2}
          isPositive={true}
          subtitle="Org Benchmark 85"
          icon={Award}
          variant="cyan"
          onClick={() => onNavigateTab('performance')}
        />
        <KpiCard
          title="Attendance Rate"
          value={`${stats.avgAttendanceRate}%`}
          change={1.8}
          isPositive={true}
          subtitle="Target >= 90%"
          icon={Clock}
          variant="emerald"
        />
        <KpiCard
          title="Task Completion Rate"
          value={`${stats.avgTaskCompletion}%`}
          change={-0.6}
          isPositive={false}
          subtitle="Sprint Throughput"
          icon={CheckCircle}
          variant="violet"
        />
        <KpiCard
          title="Active Headcount"
          value={stats.totalHeadcount}
          subtitle={`${stats.topPerformersCount} Pinnacle | ${stats.atRiskCount} At Risk`}
          icon={Users}
          variant="amber"
          onClick={() => onNavigateTab('employees')}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance & Productivity Trends (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                Monthly Performance & Attendance Trajectory
              </h2>
              <p className="text-xs text-slate-400">
                6-month historical progression across all business units
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Live Telemetry</span>
            </div>
          </div>
          <div className="w-full h-72">
            <Line data={trendChartData} options={lineOptions} />
          </div>
        </div>

        {/* Category Distribution (1 col) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-semibold text-white">
                Performance Rating Spread
              </h2>
              <p className="text-xs text-slate-400">
                Workforce tier distribution
              </p>
            </div>
          </div>
          <div className="w-full h-64 relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
              <span className="text-2xl font-bold font-mono text-white">
                {stats.totalHeadcount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Employees
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Department Radar & Top Performers Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Radar / Comparison */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                Department Performance vs Target
              </h2>
              <p className="text-xs text-slate-400">
                Multi-axis alignment against organizational quarterly goals
              </p>
            </div>
            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setChartMode('radar')}
                className={`px-2 py-0.5 text-xs rounded-md transition-colors cursor-pointer ${
                  chartMode === 'radar' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
                }`}
              >
                Radar
              </button>
              <button
                onClick={() => setChartMode('bar')}
                className={`px-2 py-0.5 text-xs rounded-md transition-colors cursor-pointer ${
                  chartMode === 'bar' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'
                }`}
              >
                Bar
              </button>
            </div>
          </div>

          <div className="w-full h-72">
            {chartMode === 'radar' ? (
              <Radar data={radarData} options={radarOptions} />
            ) : (
              <Bar
                data={{
                  labels: depts.map(d => d.name),
                  datasets: [
                    {
                      label: 'Avg Score',
                      data: depts.map(d => d.avgScore),
                      backgroundColor: '#06b6d4',
                      borderRadius: 6
                    },
                    {
                      label: 'Target Score',
                      data: depts.map(d => d.targetScore),
                      backgroundColor: '#a855f7',
                      borderRadius: 6
                    }
                  ]
                }}
                options={lineOptions}
              />
            )}
          </div>
        </div>

        {/* Top Performers Leaderboard */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 bg-slate-950/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Top Performers Leaderboard</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Highest aggregate KPI composite scores
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('employees')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {topPerformers.map((emp, index) => (
                <div
                  key={emp.employeeId}
                  onClick={() => onSelectEmployee(emp.employeeId)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 text-center font-mono font-bold text-xs text-slate-400 group-hover:text-cyan-400">
                      #{index + 1}
                    </div>
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-9 h-9 rounded-full object-cover border border-cyan-500/30"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 flex items-center space-x-1.5">
                        <span>{emp.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {emp.department}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {emp.role}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-emerald-400">
                      {emp.metrics?.overallScore}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Score
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Formula: 20% Attendance + 25% Tasks + 25% Productivity + 15% Contribution + 15% Efficiency</span>
          </div>
        </div>
      </div>
    </div>
  );
}
