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
  Award,
  Clock,
  CheckCircle,
  Building2,
  Users,
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
        pointRadius: 3
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
        pointRadius: 3
      },
      {
        label: 'Overall Performance Index (%)',
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
          boxWidth: 10,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        padding: 8,
        cornerRadius: 6
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      },
      y: {
        min: 60,
        max: 100,
        grid: { color: 'rgba(226, 232, 240, 0.7)' },
        ticks: { color: '#64748b', font: { size: 10 } }
      }
    }
  };

  // 2. Department Radar / Bar Chart
  const radarData = {
    labels: depts.map(d => d.name),
    datasets: [
      {
        label: 'Actual Departmental Avg',
        data: depts.map(d => d.avgScore),
        backgroundColor: 'rgba(37, 99, 235, 0.18)',
        borderColor: '#2563eb',
        borderWidth: 2,
        pointBackgroundColor: '#2563eb'
      },
      {
        label: 'Target Baseline Index',
        data: depts.map(d => d.targetScore),
        backgroundColor: 'rgba(234, 88, 12, 0.12)',
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
        labels: { color: '#475569', font: { size: 10 }, boxWidth: 8 }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(226, 232, 240, 0.8)' },
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        pointLabels: { color: '#334155', font: { size: 10, weight: '600' } },
        ticks: { backdropColor: 'transparent', color: '#64748b', stepSize: 10, min: 70, max: 100 }
      }
    }
  };

  // 3. Category Distribution Doughnut Chart
  const doughnutData = {
    labels: ['Exceptional (Grade A+)', 'Strong Performer (Grade A)', 'Meets Expectations (Grade B)', 'Needs Improvement (Grade C)', 'Critical Attention (Grade D)'],
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
        hoverOffset: 4
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#475569', font: { size: 10, weight: '500' }, boxWidth: 8, padding: 8 }
      }
    },
    cutout: '72%'
  };

  return (
    <div className="space-y-4 animate-fade-in w-full">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Executive Workforce Operations
            </span>
            <span className="text-xs text-slate-500 font-medium">Real-Time Telemetry</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Workforce Performance & Operations Cockpit
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Real-time cross-departmental productivity metrics, attendance compliance trajectory, KPI distributions, and leadership rankings.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateTab('reports')}
            className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer py-2 px-4 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Executive Report</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards (KPI Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard
          title="Average Composite KPI Index"
          value={stats.avgPerformanceScore}
          unit="/ 100"
          change={3.8}
          isPositive={true}
          subtitle="Target Baseline Benchmark: 85.0"
          icon={Award}
          variant="cyan"
          onClick={() => onNavigateTab('performance')}
        />
        <KpiCard
          title="Attendance Compliance Ratio"
          value={`${stats.avgAttendanceRate}%`}
          change={1.4}
          isPositive={true}
          subtitle="Target Standard: >= 90.0%"
          icon={Clock}
          variant="emerald"
        />
        <KpiCard
          title="Sprint Deliverables Completion Index"
          value={`${stats.avgTaskCompletion}%`}
          change={2.1}
          isPositive={true}
          subtitle="Delivery Throughput Target"
          icon={CheckCircle}
          variant="violet"
        />
        <KpiCard
          title="Active Enterprise Headcount"
          value={stats.totalHeadcount}
          subtitle={`${stats.topPerformersCount} Exceptional | ${stats.atRiskCount} At Risk`}
          icon={Users}
          variant="amber"
          onClick={() => onNavigateTab('employees')}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance & Productivity Trends (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Attendance Compliance & Sprint Output Trajectory
              </h2>
              <p className="text-[11px] text-slate-500">
                6-month historical tracking of attendance compliance versus productivity deliverables
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
              Trailing 6 Months
            </span>
          </div>

          <div className="h-52 w-full">
            <Line data={trendChartData} options={lineOptions} />
          </div>
        </div>

        {/* Category Distribution Doughnut (1 col) */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">
                Performance Tier Distribution
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Headcount</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Talent distribution across formal evaluation tiers
            </p>

            <div className="h-48 relative flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {stats.totalHeadcount}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Personnel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Top Performers (LEFT - 1 col) & Department Comparison (RIGHT - 2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Top Performers Leaderboard (Shifted to LEFT - 1 col) */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span>Key Talent & Leadership Roster</span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Top composite KPI achievement rankings
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('employees')}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>Directory</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {topPerformers.slice(0, 5).map((emp, index) => (
                <div
                  key={emp.employeeId}
                  onClick={() => onSelectEmployee(emp.employeeId)}
                  className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-4 text-center font-mono font-bold text-xs text-slate-400 group-hover:text-blue-600">
                      #{index + 1}
                    </div>
                    <Avatar
                      name={emp.name}
                      initials={emp.initials}
                      bg={emp.avatarBg}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate leading-tight">
                        {emp.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {emp.role} • {emp.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-xs font-bold font-mono text-emerald-600">
                      {emp.metrics?.overallScore}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      KPI Index
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Comparison (Shifted to RIGHT - 2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Departmental KPI Benchmarking</span>
              </h2>
              <p className="text-[11px] text-slate-500">
                Evaluating departmental score variance against target baseline
              </p>
            </div>

            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setChartMode('radar')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  chartMode === 'radar' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Radar View
              </button>
              <button
                onClick={() => setChartMode('bar')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  chartMode === 'bar' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Bar Chart
              </button>
            </div>
          </div>

          <div className="h-52 w-full">
            {chartMode === 'radar' ? (
              <Radar data={radarData} options={radarOptions} />
            ) : (
              <Bar
                data={{
                  labels: depts.map(d => d.name),
                  datasets: [
                    {
                      label: 'Actual Departmental Avg',
                      data: depts.map(d => d.avgScore),
                      backgroundColor: '#2563eb',
                      borderRadius: 4
                    },
                    {
                      label: 'Target Baseline Index',
                      data: depts.map(d => d.targetScore),
                      backgroundColor: '#cbd5e1',
                      borderRadius: 4
                    }
                  ]
                }}
                options={lineOptions}
              />
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
