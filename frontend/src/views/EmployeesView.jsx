import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';

export default function EmployeesView({
  employees = [],
  loading,
  onSelectEmployee,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteEmployee,
  onExportCsv
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
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'Strong Performer':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60';
      case 'Meets Expectations':
        return 'bg-blue-950/80 text-blue-400 border-blue-800/60';
      case 'Needs Improvement':
        return 'bg-amber-950/80 text-amber-400 border-amber-800/60';
      case 'Critical Attention':
        return 'bg-rose-950/80 text-rose-400 border-rose-800/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              Module 1: Employee Data Management
            </span>
            <span className="text-xs text-slate-400">Total: {employees.length} Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
            Workforce Directory & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Manage employee profiles, roles, departments, attendance, and perform full CRUD database operations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onExportCsv}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 bg-slate-950/60 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, role, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedDept === dept
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-slate-900 rounded-lg p-1 border border-slate-800">
          <button
            onClick={() => setViewMode('table')}
            title="Table View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            title="Card Grid View"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Employee List View */}
      {viewMode === 'table' ? (
        <div className="glass-panel rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4">Tasks</th>
                  <th className="py-3.5 px-4">Productivity</th>
                  <th className="py-3.5 px-4">Overall Score</th>
                  <th className="py-3.5 px-4">Performance Tier</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.employeeId}
                    className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectEmployee(emp.employeeId)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-cyan-500/50"
                        />
                        <div>
                          <div className="font-semibold text-white group-hover:text-cyan-300">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {emp.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{emp.department}</div>
                      <div className="text-[11px] text-slate-400">{emp.role}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              emp.metrics.attendanceRate >= 90
                                ? 'bg-emerald-400'
                                : emp.metrics.attendanceRate >= 80
                                ? 'bg-cyan-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${emp.metrics.attendanceRate}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-300">{emp.metrics.attendanceRate}%</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {emp.metrics.taskCompletionRate}%
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {emp.metrics.productivityScore}%
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-sm text-cyan-400">
                        {emp.metrics.overallScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${getCategoryBadge(
                          emp.performanceCategory
                        )}`}
                      >
                        {emp.performanceCategory}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectEmployee(emp.employeeId)}
                          title="View Details"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenEditModal(emp)}
                          title="Edit Employee"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee(emp._id || emp.employeeId, emp.name)}
                          title="Delete Employee"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.employeeId}
              onClick={() => onSelectEmployee(emp.employeeId)}
              className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-cyan-500/40 bg-slate-950/60 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover:border-cyan-500/50"
                    />
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-cyan-300 text-sm">
                        {emp.name}
                      </h3>
                      <div className="text-xs text-slate-400">{emp.role}</div>
                      <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">
                        {emp.employeeId} • {emp.department}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[9px] font-semibold rounded-full border ${getCategoryBadge(
                      emp.performanceCategory
                    )}`}
                  >
                    {emp.performanceCategory}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-center">
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Attendance</div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                      {emp.metrics.attendanceRate}%
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Tasks</div>
                    <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">
                      {emp.metrics.taskCompletionRate}%
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                    <div className="text-[10px] text-slate-400">Score</div>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      {emp.metrics.overallScore}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEditModal(emp);
                  }}
                  className="text-slate-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center">
                  View Profile &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
