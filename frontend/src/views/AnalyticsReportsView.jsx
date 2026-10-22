import React, { useState } from 'react';
import {
  LayoutDashboard,
  Lightbulb,
  FileSpreadsheet,
  BarChart2,
  Download
} from 'lucide-react';
import DashboardView from './DashboardView';
import InsightsView from './InsightsView';
import ReportsView from './ReportsView';

export default function AnalyticsReportsView({
  analyticsData,
  insightsData,
  reportData,
  employees = [],
  onSelectEmployee,
  onExportCsv
}) {
  const [subTab, setSubTab] = useState('cockpit'); // 'cockpit', 'insights', 'reports'

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Sub Navigation Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
          <button
            onClick={() => setSubTab('cockpit')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'cockpit' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Operations Cockpit</span>
          </button>

          <button
            onClick={() => setSubTab('insights')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'insights' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Strategic Insights & Diagnostics</span>
          </button>

          <button
            onClick={() => setSubTab('reports')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
              subTab === 'reports' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Executive Monthly Reports</span>
          </button>
        </div>

        <button
          onClick={onExportCsv}
          className="btn-large bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-1.5 px-3 rounded-xl border border-slate-200 shadow-xs cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Full Workforce CSV</span>
        </button>
      </div>

      {/* Sub Views */}
      {subTab === 'cockpit' && (
        <DashboardView
          analyticsData={analyticsData}
          onSelectEmployee={onSelectEmployee}
          onNavigateTab={(tab) => {
            if (tab === 'reports') setSubTab('reports');
          }}
        />
      )}

      {subTab === 'insights' && (
        <InsightsView
          insightsData={insightsData}
          onSelectEmployee={onSelectEmployee}
        />
      )}

      {subTab === 'reports' && (
        <ReportsView
          reportData={reportData}
          employees={employees}
          onExportCsv={onExportCsv}
        />
      )}

    </div>
  );
}
