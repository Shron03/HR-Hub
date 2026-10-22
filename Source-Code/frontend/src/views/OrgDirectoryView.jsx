import React, { useState } from 'react';
import {
  Users,
  GitBranch,
  Building2,
  Search,
  Filter,
  Plus,
  Download,
  ShieldCheck,
  Grid,
  List
} from 'lucide-react';
import EmployeesView from './EmployeesView';
import OrganizationView from './OrganizationView';

export default function OrgDirectoryView({
  employees = [],
  loading = false,
  onSelectEmployee,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteEmployee,
  onExportCsv,
  onSeedDemoData,
  onClearAllData,
  isOperatingData
}) {
  const [subTab, setSubTab] = useState('directory'); // 'directory' or 'hierarchy'

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Sub Navigation Bar */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setSubTab('directory')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'directory' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Personnel Directory</span>
            </button>
            <button
              onClick={() => setSubTab('hierarchy')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
                subTab === 'hierarchy' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Organization Tree (3-in-1 Structure)</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong className="text-slate-900">{employees.length}</strong> active employee profiles
        </div>
      </div>

      {/* Dynamic Sub-View */}
      {subTab === 'directory' ? (
        <EmployeesView
          employees={employees}
          loading={loading}
          onSelectEmployee={onSelectEmployee}
          onOpenAddModal={onOpenAddModal}
          onOpenEditModal={onOpenEditModal}
          onDeleteEmployee={onDeleteEmployee}
          onExportCsv={onExportCsv}
          onSeedDemoData={onSeedDemoData}
          onClearAllData={onClearAllData}
          isOperatingData={isOperatingData}
        />
      ) : (
        <OrganizationView
          employees={employees}
          onSelectEmployee={onSelectEmployee}
        />
      )}

    </div>
  );
}
