import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Trash2,
  Edit,
  Eye,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  Sparkles,
  MapPin,
  Mail,
  IndianRupee
} from 'lucide-react';
import Avatar from '../components/Avatar';

export default function EmployeesView({
  employees = [],
  loading,
  onSelectEmployee,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteEmployee,
  onExportCsv,
  onSeedDemoData,
  onClearAllData,
  isOperatingData
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  const departments = ['All', 'Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources'];
  const categories = ['All', 'Exceptional', 'Strong Performer', 'Meets Expectations', 'Needs Improvement', 'Critical Attention'];

  // Filtering
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesCat = selectedCategory === 'All' || emp.performanceCategory === selectedCategory;

    return matchesSearch && matchesDept && matchesCat;
  });

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Exceptional':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Strong Performer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Meets Expectations':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Needs Improvement':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical Attention':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Workforce Directory
            </span>
            <span className="text-xs text-slate-500">
              {employees.length} Personnel Registered
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Employee Directory & Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Maintain employee records, calibrate compensation CTC, monitor attendance presence, and manage organizational assignments.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Load 15-Person Demo */}
          <button
            onClick={onSeedDemoData}
            disabled={isOperatingData}
            title="Generate standard 15-person enterprise dataset"
            className="btn-large bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs shadow-sm cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`w-4 h-4 text-blue-600 ${isOperatingData ? 'animate-spin' : ''}`} />
            <span>Load Demo Data (15)</span>
          </button>

          {/* Clear Data */}
          {employees.length > 0 && (
            <button
              onClick={onClearAllData}
              disabled={isOperatingData}
              title="Purge all employee records to test clean state"
              className="btn-large bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-300 text-xs shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Clear Records</span>
            </button>
          )}

          <button
            onClick={onExportCsv}
            className="btn-large bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, role, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-900"
          />
        </div>

        {/* Filters and View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
            ))}
          </select>

          {/* Performance Tier Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All KPI Tiers' : c}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* EMPTY STATE */}
      {employees.length === 0 && !loading && (
        <div className="glass-panel rounded-2xl p-12 border border-dashed border-slate-300 bg-white/80 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Zero Records in Employee Directory
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            The database is currently operating without any demo data. You can add new personnel manually or generate the standard 15-employee Indian enterprise dataset.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={onSeedDemoData}
              disabled={isOperatingData}
              className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${isOperatingData ? 'animate-spin' : ''}`} />
              <span>Load 15 Demo Employees</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="btn-large bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee Manually</span>
            </button>
          </div>
        </div>
      )}

      {/* TABLE VIEW */}
      {employees.length > 0 && viewMode === 'table' && (
        <div className="glass-panel rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Employee Details</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Salary CTC</th>
                  <th className="py-3 px-4 text-center">KPI Score</th>
                  <th className="py-3 px-4 text-center">Tasks Done</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEmployees.map((emp) => {
                  const kpi = emp.kpiData || {};
                  return (
                    <tr
                      key={emp.employeeId}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Name & Initials Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            name={emp.name}
                            initials={emp.initials}
                            bg={emp.avatarBg}
                            size="md"
                          />
                          <div>
                            <div
                              onClick={() => onSelectEmployee(emp.employeeId)}
                              className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              {emp.name}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {emp.employeeId} • {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Dept & Role */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {emp.role}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {emp.department} • {emp.location || 'Bengaluru, India'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${
                          emp.status === 'On Leave'
                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {emp.status}
                        </span>
                      </td>

                      {/* Salary CTC */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                        ₹ {(emp.salary || 850000).toLocaleString('en-IN')}
                      </td>

                      {/* KPI Score */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="font-mono font-bold text-blue-600 text-sm">
                          {emp.metrics?.overallScore}%
                        </div>
                        <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded-full border mt-0.5 ${getCategoryBadge(emp.performanceCategory)}`}>
                          {emp.performanceCategory}
                        </span>
                      </td>

                      {/* Tasks */}
                      <td className="py-3.5 px-4 text-center font-mono font-medium text-slate-700">
                        {kpi.tasksCompleted || 18} / {kpi.tasksGiven || 20}
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-700">
                        {emp.metrics?.attendanceRate}%
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => onSelectEmployee(emp.employeeId)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenEditModal(emp)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Calibrate Compensation & Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteEmployee(emp._id || emp.employeeId, emp.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CARD GRID VIEW */}
      {employees.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => {
            const kpi = emp.kpiData || {};
            return (
              <div
                key={emp.employeeId}
                className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        name={emp.name}
                        initials={emp.initials}
                        bg={emp.avatarBg}
                        size="lg"
                      />
                      <div>
                        <div
                          onClick={() => onSelectEmployee(emp.employeeId)}
                          className="font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer"
                        >
                          {emp.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {emp.role}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {emp.employeeId}
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      emp.status === 'On Leave'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {emp.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-semibold text-slate-800">{emp.department}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Annual CTC:</span>
                      <span className="font-semibold font-mono text-slate-800">₹ {(emp.salary || 850000).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Tasks Completed:</span>
                      <span className="font-semibold font-mono text-slate-800">{kpi.tasksCompleted || 18} / {kpi.tasksGiven || 20}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">Performance KPI:</span>
                      <div className="text-right">
                        <span className="font-bold font-mono text-blue-600 text-sm">{emp.metrics?.overallScore}%</span>
                        <span className={`block text-[9px] font-bold px-1.5 py-0.2 rounded border ${getCategoryBadge(emp.performanceCategory)}`}>
                          {emp.performanceCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{emp.location || 'India'}</span>
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onSelectEmployee(emp.employeeId)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onOpenEditModal(emp)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
