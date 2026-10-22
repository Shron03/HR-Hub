import React, { useState } from 'react';
import {
  GitBranch,
  Building2,
  FolderTree,
  Users,
  ChevronRight,
  ChevronDown,
  Mail,
  MapPin,
  Award,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import Avatar from '../components/Avatar';

export default function OrganizationView({ employees = [], onSelectEmployee }) {
  const [activeSubTab, setActiveSubTab] = useState('employee-tree'); // 'employee-tree', 'dept-tree', 'dept-directory'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState({
    'exec': true,
    'Engineering': true,
    'Product': true,
    'Marketing': true,
    'Sales': true,
    'Human Resources': true
  });

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const departments = [
    {
      name: 'Engineering',
      lead: 'Rajesh Verma',
      leadRole: 'Engineering Manager',
      location: 'Bengaluru, India',
      budget: '₹ 1.85 Cr',
      description: 'Core platform development, cloud infrastructure, architecture, and security.'
    },
    {
      name: 'Product',
      lead: 'Sneha Rao',
      leadRole: 'Lead Product Manager',
      location: 'Bengaluru, India',
      budget: '₹ 1.10 Cr',
      description: 'Product strategy, roadmap delivery, UX research, and customer workflow design.'
    },
    {
      name: 'Marketing',
      lead: 'Rohan Gupta',
      leadRole: 'Marketing Director',
      location: 'Mumbai, India',
      budget: '₹ 85 Lakhs',
      description: 'Growth marketing, brand positioning, campaigns, and content operations.'
    },
    {
      name: 'Sales',
      lead: 'Arjun Kapoor',
      leadRole: 'Enterprise Sales Lead',
      location: 'Delhi NCR, India',
      budget: '₹ 95 Lakhs',
      description: 'Enterprise client acquisition, partnerships, and revenue generation.'
    },
    {
      name: 'Human Resources',
      lead: 'Priya Sharma',
      leadRole: 'HR Director',
      location: 'Bengaluru, India',
      budget: '₹ 75 Lakhs',
      description: 'Talent development, people operations, appraisals, and employee success.'
    }
  ];

  const filteredEmployees = employees.filter(emp => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(q) ||
      emp.role?.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.employeeId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Sub-tab Switcher Panel */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Organization Structure
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Interactive organization charts, departmental reporting trees, and personnel directory
            </p>
          </div>

          {/* Google/Zoho style Switcher Controls */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveSubTab('employee-tree')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'employee-tree'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Employee Tree</span>
            </button>

            <button
              onClick={() => setActiveSubTab('dept-tree')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'dept-tree'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Department Tree</span>
            </button>

            <button
              onClick={() => setActiveSubTab('dept-directory')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
                activeSubTab === 'dept-directory'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Department Directory</span>
            </button>
          </div>
        </div>

        {/* Search Bar for Filtering Tree & Directory */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search personnel by name, role or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Total Workforce: <span className="font-bold text-slate-800">{employees.length}</span> members
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: EMPLOYEE HIERARCHY TREE */}
      {activeSubTab === 'employee-tree' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm animate-fade-in">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Reporting Hierarchy & Line Management
          </div>

          {/* Root Executive Card */}
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-2xl border-2 border-blue-500 bg-blue-50/50 shadow-md max-w-md w-full text-center">
              <div className="inline-flex items-center justify-center p-2 rounded-xl bg-blue-600 text-white mb-2">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                Executive Leadership Council
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Priya Sharma (HR Director) & Rajesh Verma (Engineering Manager)
              </div>
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-8 bg-blue-300" />
            <div className="w-3/4 h-0.5 bg-blue-200" />

            {/* Department Branch Heads */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6 w-full">
              {departments.map((dept) => {
                const deptMembers = filteredEmployees.filter(e => e.department === dept.name);
                const isExpanded = expandedNodes[dept.name];

                return (
                  <div key={dept.name} className="flex flex-col items-center">
                    {/* Department Head Node */}
                    <div
                      onClick={() => toggleNode(dept.name)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer text-center"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {dept.name}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {dept.lead}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {dept.leadRole}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-semibold flex items-center justify-center space-x-1">
                        <Users className="w-3 h-3 text-blue-600" />
                        <span>{deptMembers.length} Direct Members</span>
                      </div>
                    </div>

                    {/* Department Direct Reports */}
                    {isExpanded && deptMembers.length > 0 && (
                      <div className="w-full mt-3 space-y-2 pl-2 border-l-2 border-blue-200">
                        {deptMembers.map(member => (
                          <div
                            key={member.employeeId}
                            onClick={() => onSelectEmployee(member.employeeId)}
                            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2 min-w-0">
                              <Avatar
                                name={member.name}
                                initials={member.initials}
                                bg={member.avatarBg}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  {member.name}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {member.role}
                                </div>
                              </div>
                            </div>

                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                              member.status === 'On Leave'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {member.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DEPARTMENT TREE */}
      {activeSubTab === 'dept-tree' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm animate-fade-in space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Corporate Organizational Tree & Functional Units
          </div>

          <div className="space-y-3">
            {departments.map(dept => {
              const deptEmployees = filteredEmployees.filter(e => e.department === dept.name);
              const isExpanded = expandedNodes[dept.name];

              return (
                <div key={dept.name} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => toggleNode(dept.name)}
                    className="w-full p-4 flex items-center justify-between bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                          <span>{dept.name}</span>
                          <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {deptEmployees.length} personnel
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Department Head: <span className="font-semibold text-slate-700">{dept.lead}</span> • Budget: {dept.budget}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-200 bg-white">
                      <p className="text-xs text-slate-600 mb-4">
                        {dept.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {deptEmployees.map(emp => (
                          <div
                            key={emp.employeeId}
                            onClick={() => onSelectEmployee(emp.employeeId)}
                            className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer flex items-center space-x-3 bg-slate-50/50"
                          >
                            <Avatar
                              name={emp.name}
                              initials={emp.initials}
                              bg={emp.avatarBg}
                              size="md"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {emp.name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {emp.role}
                              </div>
                              <div className="text-[10px] text-blue-600 font-mono mt-0.5">
                                {emp.employeeId}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-emerald-600">
                                {emp.metrics?.overallScore || 85}%
                              </div>
                              <div className="text-[10px] text-slate-400">
                                KPI
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: DEPARTMENT DIRECTORY */}
      {activeSubTab === 'dept-directory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {departments.map(dept => {
            const deptStaff = filteredEmployees.filter(e => e.department === dept.name);
            const avgScore = deptStaff.length > 0
              ? Math.round(deptStaff.reduce((acc, cur) => acc + (cur.metrics?.overallScore || 0), 0) / deptStaff.length)
              : 85;

            return (
              <div
                key={dept.name}
                className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Business Unit
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {dept.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-blue-600">
                        {avgScore}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Avg KPI
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                    {dept.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Department Lead:</span>
                      <span className="font-semibold text-slate-800">{dept.lead}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Base Location:</span>
                      <span className="font-semibold text-slate-800">{dept.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Operating Budget:</span>
                      <span className="font-semibold text-slate-800">{dept.budget}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Active Staff:</span>
                      <span className="font-bold text-blue-700">{deptStaff.length} Employees</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Team Members
                  </div>
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                    {deptStaff.slice(0, 5).map(m => (
                      <div
                        key={m.employeeId}
                        onClick={() => onSelectEmployee(m.employeeId)}
                        className="cursor-pointer"
                        title={`${m.name} (${m.role})`}
                      >
                        <Avatar
                          name={m.name}
                          initials={m.initials}
                          bg={m.avatarBg}
                          size="sm"
                        />
                      </div>
                    ))}
                    {deptStaff.length > 5 && (
                      <span className="text-xs text-slate-400 pl-1 font-semibold">
                        +{deptStaff.length - 5}
                      </span>
                    )}
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
