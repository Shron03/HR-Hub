import React, { useState } from 'react';
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
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import Avatar from '../components/Avatar';

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
        borderColor: '#2563eb', // Blue
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4
      },
      {
        label: 'Productivity Score (%)',
        data: trends.map(t => t.productivity),
        borderColor: '#ea580c', // Orange
        backgroundColor: 'rgba(234, 88, 12, 0.06)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#ea580c',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4
      },
      {
        label: 'Overall KPI Score (%)',
        data: trends.map(t => t.overallScore),
        borderColor: '#16a34a', // Green
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35,
        pointBackgroundColor: '#16a34a',
        pointBorderColor: '#ffffff',
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
          color: '#475569',
          font: { size: 11, family: 'Inter', weight: '600' },
          boxWidth: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: {
        min: 60,
        max: 100,
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
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
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: '#2563eb',
        borderWidth: 2,
        pointBackgroundColor: '#2563eb'
      },
      {
        label: 'Target KPI Score',
        data: depts.map(d => d.targetScore),
        backgroundColor: 'rgba(234, 88, 12, 0.15)',
        borderColor: '#ea580c',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointBackgroundColor: '#ea580c'
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#475569', font: { size: 11 }, boxWidth: 10 }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(226, 232, 240, 0.9)' },
        grid: { color: 'rgba(226, 232, 240, 0.9)' },
        pointLabels: { color: '#334155', font: { size: 11, weight: '600' } },
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
          categoryDist['Exceptional'] || 5,
          categoryDist['Strong Performer'] || 7,
          categoryDist['Meets Expectations'] || 2,
          categoryDist['Needs Improvement'] || 1,
          categoryDist['Critical Attention'] || 0
        ],
        backgroundColor: [
          '#16a34a', // Green
          '#2563eb', // Blue
          '#6366f1', // Indigo
          '#ea580c', // Orange
          '#dc2626'  // Red
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
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
        labels: { color: '#475569', font: { size: 10, weight: '500' }, boxWidth: 8, padding: 12 }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Workforce Cockpit
            </span>
            <span className="text-xs text-slate-500">Live Executive Metrics</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Executive Performance & Operations Cockpit
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Real-time multi-department productivity indexes, attendance compliance trajectory, KPI distributions, and leadership rankings.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigateTab('reports')}
            className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards (KPI Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Avg Performance Score"
          value={stats.avgPerformanceScore}
          unit="/ 100"
          change={3.8}
          isPositive={true}
          subtitle="Target Benchmark 85"
          icon={Award}
          variant="cyan"
          onClick={() => onNavigateTab('performance')}
        />
        <KpiCard
          title="Attendance Rate"
          value={`${stats.avgAttendanceRate}%`}
          change={1.4}
          isPositive={true}
          subtitle="Compliance Target >= 90%"
          icon={Clock}
          variant="emerald"
        />
        <KpiCard
          title="Task Completion Rate"
          value={`${stats.avgTaskCompletion}%`}
          change={2.1}
          isPositive={true}
          subtitle="Sprint Velocity"
          icon={CheckCircle}
          variant="violet"
        />
        <KpiCard
          title="Total Workforce"
          value={stats.totalHeadcount}
          subtitle={`${stats.topPerformersCount} Exceptional | ${stats.atRiskCount} At Risk`}
          icon={Users}
          variant="amber"
          onClick={() => onNavigateTab('employees')}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance & Productivity Trends (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Monthly Performance & Attendance Trajectory
              </h2>
              <p className="text-xs text-slate-500">
                6-month historical tracking of attendance compliance vs productivity output
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
              Trailing 6 Months
            </span>
          </div>

          <div className="h-64 w-full">
            <Line data={trendChartData} options={lineOptions} />
          </div>
        </div>

        {/* Category Distribution Doughnut (1 col) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-slate-900">
                Performance Tiers
              </h2>
              <span className="text-xs text-slate-400">Headcount</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Distribution of employees across evaluation bands
            </p>

            <div className="h-56 relative flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {stats.totalHeadcount}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                  Personnel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Department Comparison & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Comparison (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Departmental KPI Benchmarking</span>
              </h2>
              <p className="text-xs text-slate-500">
                Evaluating departmental score variance against target baseline
              </p>
            </div>

            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setChartMode('radar')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  chartMode === 'radar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Radar View
              </button>
              <button
                onClick={() => setChartMode('bar')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  chartMode === 'bar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            {chartMode === 'radar' ? (
              <Radar data={radarData} options={radarOptions} />
            ) : (
              <Bar
                data={{
                  labels: depts.map(d => d.name),
                  datasets: [
                    {
                      label: 'Actual Score',
                      data: depts.map(d => d.avgScore),
                      backgroundColor: '#2563eb',
                      borderRadius: 6
                    },
                    {
                      label: 'Target Score',
                      data: depts.map(d => d.targetScore),
                      backgroundColor: '#cbd5e1',
                      borderRadius: 6
                    }
                  ]
                }}
                options={lineOptions}
              />
            )}
          </div>
        </div>

        {/* Top Performers Leaderboard (1 col) */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span>Top Performers Leaderboard</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Highest aggregate KPI scores
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('employees')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {topPerformers.slice(0, 5).map((emp, index) => (
                <div
                  key={emp.employeeId}
                  onClick={() => onSelectEmployee(emp.employeeId)}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-5 text-center font-mono font-bold text-xs text-slate-400 group-hover:text-blue-600">
                      #{index + 1}
                    </div>
                    <Avatar
                      name={emp.name}
                      initials={emp.initials}
                      bg={emp.avatarBg}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {emp.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {emp.role} • {emp.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold font-mono text-emerald-600">
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
        </div>

      </div>

    </div>
  );
}
