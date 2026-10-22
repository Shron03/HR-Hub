import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Calculator,
  Plus,
  Minus,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Percent,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Award,
  RefreshCw,
  Printer,
  Calendar,
  Building,
  Briefcase
} from 'lucide-react';
import Avatar from '../components/Avatar';
import { getWorkforcePresence } from '../utils/presenceUtils';

export default function SalaryCompensationAdminView({
  currentUser,
  employees = [],
  onUpdateEmployee,
  onRefreshData,
  showToast
}) {
  const [selectedEmpId, setSelectedEmpId] = useState(() => {
    return employees.length > 0 ? employees[0].employeeId : 'EMP-1001';
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [saving, setSaving] = useState(false);

  // Active Selected Employee
  const selectedEmployee = employees.find(e => e.employeeId === selectedEmpId) || employees[0] || null;

  // Compensation Breakdown State for Selected Employee
  const [compForm, setCompForm] = useState({
    annualCtc: 850000,
    basicSalary: 35417,
    hra: 14167,
    specialAllowance: 21250,
    bonus: 0,
    bonusReason: 'Performance KPI Incentive',
    pfDeduction: 4250,
    professionalTax: 200,
    tdsDeduction: 2500,
    lopDeduction: 0,
    customDeductions: 0,
    customDeductionReason: '',
    paymentStatus: 'Processed'
  });

  // Sync state whenever selectedEmployee changes
  useEffect(() => {
    if (selectedEmployee) {
      const ctc = selectedEmployee.salary || 850000;
      const monthly = Math.round(ctc / 12);
      const basic = Math.round(monthly * 0.50);
      const hra = Math.round(monthly * 0.20);
      const special = monthly - basic - hra;
      const pf = Math.round(basic * 0.12);

      const existingComp = selectedEmployee.compensation || {};

      setCompForm({
        annualCtc: ctc,
        basicSalary: existingComp.basicSalary || basic,
        hra: existingComp.hra || hra,
        specialAllowance: existingComp.specialAllowance || special,
        bonus: existingComp.bonus || 0,
        bonusReason: existingComp.bonusReason || 'Performance KPI Incentive',
        pfDeduction: existingComp.pfDeduction || pf,
        professionalTax: existingComp.professionalTax || 200,
        tdsDeduction: existingComp.tdsDeduction || Math.round(monthly * 0.05),
        lopDeduction: existingComp.lopDeduction || 0,
        customDeductions: existingComp.customDeductions || 0,
        customDeductionReason: existingComp.customDeductionReason || '',
        paymentStatus: existingComp.paymentStatus || 'Processed'
      });
    }
  }, [selectedEmployee?.employeeId, selectedEmployee?.salary]);

  // Handle Annual CTC Change with auto-recalculation of base components
  const handleCtcChange = (newCtc) => {
    const ctcNum = Math.max(0, Number(newCtc) || 0);
    const monthly = Math.round(ctcNum / 12);
    const basic = Math.round(monthly * 0.50);
    const hra = Math.round(monthly * 0.20);
    const special = monthly - basic - hra;
    const pf = Math.round(basic * 0.12);

    setCompForm(prev => ({
      ...prev,
      annualCtc: ctcNum,
      basicSalary: basic,
      hra: hra,
      specialAllowance: special,
      pfDeduction: pf
    }));
  };

  // Auto-Suggest Bonus based on Employee's Real-time KPI Score
  const handleApplyKpiIncentive = () => {
    if (!selectedEmployee) return;
    const score = selectedEmployee.metrics?.overallScore || 85;
    const monthly = Math.round(compForm.annualCtc / 12);
    let bonusPct = 0;

    if (score >= 95) bonusPct = 0.15; // 15% bonus for exceptional
    else if (score >= 90) bonusPct = 0.10; // 10% bonus
    else if (score >= 80) bonusPct = 0.05; // 5% bonus
    else bonusPct = 0;

    const bonusAmount = Math.round(monthly * bonusPct);
    setCompForm(prev => ({
      ...prev,
      bonus: bonusAmount,
      bonusReason: `Q3 Performance Incentive (${score}% KPI Score)`
    }));

    showToast(`Calculated ₹ ${bonusAmount.toLocaleString('en-IN')} incentive based on ${score}% KPI Score`, 'info');
  };

  // Auto-Calculate LOP (Loss of Pay) based on unnotified absences or unpaid leaves
  const handleApplyLopDeduction = () => {
    if (!selectedEmployee) return;
    const presence = getWorkforcePresence(selectedEmployee);
    const monthlyGross = Number(compForm.basicSalary) + Number(compForm.hra) + Number(compForm.specialAllowance);
    const dailyRate = Math.round(monthlyGross / 30);

    let absentDays = 0;
    if (presence.status === 'On Leave' && presence.activeLeave) {
      absentDays = Number(presence.activeLeave.days) || 1;
    } else if (presence.status === 'Absent') {
      absentDays = 2; // Default unnotified absence penalty
    }

    const calculatedLop = dailyRate * absentDays;
    setCompForm(prev => ({
      ...prev,
      lopDeduction: calculatedLop
    }));

    showToast(`Calculated ₹ ${calculatedLop.toLocaleString('en-IN')} LOP deduction for ${absentDays} day(s) absence`, 'info');
  };

  // Computed Totals
  const totalGrossEarnings =
    Number(compForm.basicSalary) +
    Number(compForm.hra) +
    Number(compForm.specialAllowance) +
    Number(compForm.bonus);

  const totalDeductions =
    Number(compForm.pfDeduction) +
    Number(compForm.professionalTax) +
    Number(compForm.tdsDeduction) +
    Number(compForm.lopDeduction) +
    Number(compForm.customDeductions);

  const netMonthlySalary = Math.max(0, totalGrossEarnings - totalDeductions);
  const annualizedNet = netMonthlySalary * 12;

  // Save Compensation & CTC to Backend
  const handleSaveCompensation = async () => {
    if (!selectedEmployee) return;
    setSaving(true);
    try {
      const payload = {
        salary: Number(compForm.annualCtc),
        compensation: {
          baseSalary: Number(compForm.basicSalary),
          hra: Number(compForm.hra),
          specialAllowance: Number(compForm.specialAllowance),
          bonus: Number(compForm.bonus),
          bonusReason: compForm.bonusReason,
          pfDeduction: Number(compForm.pfDeduction),
          professionalTax: Number(compForm.professionalTax),
          tdsDeduction: Number(compForm.tdsDeduction),
          lopDeduction: Number(compForm.lopDeduction),
          customDeductions: Number(compForm.customDeductions),
          customDeductionReason: compForm.customDeductionReason,
          netMonthlySalary,
          paymentStatus: compForm.paymentStatus,
          lastRevisedDate: new Date()
        }
      };

      await onUpdateEmployee(payload, selectedEmployee._id || selectedEmployee.employeeId);
      showToast(`Compensation package updated for ${selectedEmployee.name}. Net: ₹ ${netMonthlySalary.toLocaleString('en-IN')}`, 'success');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      showToast(err.message || 'Error updating compensation', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Export Payroll Register CSV
  const handleExportPayrollCsv = () => {
    const headers = [
      'Employee ID',
      'Full Name',
      'Department',
      'Role',
      'Annual CTC (INR)',
      'Basic Pay',
      'HRA',
      'Special Allowance',
      'Performance Bonus',
      'PF Deduction',
      'Prof Tax',
      'TDS Withholding',
      'LOP Deductions',
      'Net Monthly Salary'
    ];

    const rows = employees.map(emp => {
      const ctc = emp.salary || 850000;
      const m = Math.round(ctc / 12);
      const b = Math.round(m * 0.50);
      const h = Math.round(m * 0.20);
      const s = m - b - h;
      const pf = Math.round(b * 0.12);
      const pt = 200;
      const tds = Math.round(m * 0.05);
      const net = (b + h + s) - (pf + pt + tds);

      return [
        emp.employeeId,
        `"${emp.name}"`,
        `"${emp.department}"`,
        `"${emp.role}"`,
        ctc,
        b,
        h,
        s,
        0,
        pf,
        pt,
        tds,
        0,
        net
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HR_Hub_Payroll_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported monthly payroll register CSV', 'success');
  };

  // Filtered employees for list
  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  // Aggregate Metrics across All Employees
  const totalAnnualPayroll = employees.reduce((acc, curr) => acc + (curr.salary || 850000), 0);
  const avgAnnualSalary = employees.length > 0 ? Math.round(totalAnnualPayroll / employees.length) : 0;
  const totalMonthlyGross = Math.round(totalAnnualPayroll / 12);

  const selectedPresence = getWorkforcePresence(selectedEmployee);

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Compensation & Payroll Governance
            </span>
            <span className="text-xs text-slate-500 font-medium">Fiscal Cycle: October 2026</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Compensation & Payroll Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Configure employee compensation structures, calibrate performance merit incentives, enforce statutory withholdings, and disburse payroll statements.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportPayrollCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Payroll Register (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Monthly Gross Payroll</span>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-0.5">
            ₹ {totalMonthlyGross.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Roster monthly allocation</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Annual CTC</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">
            ₹ {avgAnnualSalary.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Across 15 personnel</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Selected Net Monthly Pay</span>
          <div className="text-2xl font-bold font-mono text-purple-600 mt-0.5">
            ₹ {netMonthlySalary.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">{selectedEmployee?.name}</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Bonus Allocated</span>
          <div className="text-2xl font-bold font-mono text-orange-600 mt-0.5">
            ₹ {Number(compForm.bonus).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">{compForm.bonusReason || 'Incentive'}</span>
        </div>
      </div>

      {/* Main 2-Column Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (5 Cols): Employee Compensation Roster */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Personnel Roster ({filteredEmployees.length})</span>
              </span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, ID, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Employee List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredEmployees.map(emp => {
                const isSelected = emp.employeeId === selectedEmpId;
                const presence = getWorkforcePresence(emp);
                const grossMonth = Math.round((emp.salary || 850000) / 12);

                return (
                  <div
                    key={emp.employeeId}
                    onClick={() => setSelectedEmpId(emp.employeeId)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Avatar name={emp.name} initials={emp.initials} bg={emp.avatarBg} size="md" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                          <span>{emp.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${presence.badgeClass}`}>
                            {presence.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {emp.role} • <span className="font-medium text-slate-700">{emp.department}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {emp.employeeId}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-slate-900">
                        ₹ {(emp.salary || 850000).toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ₹ {grossMonth.toLocaleString('en-IN')}/mo
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Interactive Compensation Calibrator */}
        <div className="lg:col-span-7 space-y-4">
          
          {selectedEmployee ? (
            <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs space-y-5">
              
              {/* Selected Profile Summary Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-3.5">
                  <Avatar
                    name={selectedEmployee.name}
                    initials={selectedEmployee.initials}
                    bg={selectedEmployee.avatarBg}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-base font-bold text-slate-900">
                        {selectedEmployee.name}
                      </h2>
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {selectedEmployee.employeeId}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${selectedPresence.badgeClass}`}>
                        {selectedPresence.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      {selectedEmployee.role} • <strong className="text-blue-600">{selectedEmployee.department}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Composite KPI
                  </span>
                  <div className="text-xl font-bold font-mono text-blue-600">
                    {selectedEmployee.metrics?.overallScore || 85}%
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {selectedEmployee.performanceCategory}
                  </span>
                </div>
              </div>

              {/* 1. Base Earnings Structure */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                    <span>Annual CTC & Base Monthly Earnings</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">Standard Indian CTC Components</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Annual CTC (₹ INR) *
                    </label>
                    <input
                      type="number"
                      value={compForm.annualCtc}
                      onChange={(e) => handleCtcChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Basic Salary (50%)
                    </label>
                    <input
                      type="number"
                      value={compForm.basicSalary}
                      onChange={(e) => setCompForm({ ...compForm, basicSalary: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      HRA (20%)
                    </label>
                    <input
                      type="number"
                      value={compForm.hra}
                      onChange={(e) => setCompForm({ ...compForm, hra: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Special Allowance
                    </label>
                    <input
                      type="number"
                      value={compForm.specialAllowance}
                      onChange={(e) => setCompForm({ ...compForm, specialAllowance: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Additions & Performance Merit Bonuses */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bonuses & Performance Merit Additions</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleApplyKpiIncentive}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Percent className="w-3 h-3" />
                    <span>Auto-Calculate KPI Bonus ({selectedEmployee.metrics?.overallScore}%)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Merit / Performance Bonus Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={compForm.bonus}
                      onChange={(e) => setCompForm({ ...compForm, bonus: Number(e.target.value) })}
                      placeholder="e.g. 15000"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Bonus Description / Justification
                    </label>
                    <input
                      type="text"
                      value={compForm.bonusReason}
                      onChange={(e) => setCompForm({ ...compForm, bonusReason: e.target.value })}
                      placeholder="e.g. Q3 Merit Milestone Incentive"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Statutory & Policy Deductions */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Minus className="w-3.5 h-3.5 text-red-600" />
                    <span>Statutory & Absence Deductions</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleApplyLopDeduction}
                    className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-[11px] flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Calculator className="w-3 h-3" />
                    <span>Calculate LOP for Today's Absence</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Provident Fund (12%)
                    </label>
                    <input
                      type="number"
                      value={compForm.pfDeduction}
                      onChange={(e) => setCompForm({ ...compForm, pfDeduction: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Professional Tax (₹)
                    </label>
                    <input
                      type="number"
                      value={compForm.professionalTax}
                      onChange={(e) => setCompForm({ ...compForm, professionalTax: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      TDS Withholding (₹)
                    </label>
                    <input
                      type="number"
                      value={compForm.tdsDeduction}
                      onChange={(e) => setCompForm({ ...compForm, tdsDeduction: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1 text-red-600">
                      Loss of Pay (LOP) (₹)
                    </label>
                    <input
                      type="number"
                      value={compForm.lopDeduction}
                      onChange={(e) => setCompForm({ ...compForm, lopDeduction: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-red-300 font-mono text-red-700 font-bold focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Custom Deduction (Insurance / Advance) (₹)
                    </label>
                    <input
                      type="number"
                      value={compForm.customDeductions}
                      onChange={(e) => setCompForm({ ...compForm, customDeductions: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Deduction Reason
                    </label>
                    <input
                      type="text"
                      value={compForm.customDeductionReason}
                      onChange={(e) => setCompForm({ ...compForm, customDeductionReason: e.target.value })}
                      placeholder="e.g. Group Medical Insurance Copay"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Live Net Take-Home Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 text-white shadow-md space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-blue-800/80">
                  <div className="text-xs uppercase tracking-wider font-semibold text-blue-200">
                    Net Monthly Disbursement Summary
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Cycle: October 2026
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-blue-300 text-[10px] uppercase block font-medium">Total Gross Earnings</span>
                    <span className="text-sm font-bold font-mono text-white">
                      ₹ {totalGrossEarnings.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-blue-300 text-[10px] uppercase block font-medium">Total Withholdings</span>
                    <span className="text-sm font-bold font-mono text-red-300">
                      - ₹ {totalDeductions.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-2">
                    <span className="text-blue-200 text-[10px] uppercase block font-bold">Net Monthly Take-Home Pay</span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      ₹ {netMonthlySalary.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-blue-300 block">
                      Annualized: ₹ {annualizedNet.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Save & Actions Button */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleCtcChange(compForm.annualCtc)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset to Standard Indian CTC Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCompensation}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <span>Persisting...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save & Persist Employee Compensation</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 border border-slate-200/90 bg-white/90 shadow-xs text-center text-slate-400 text-xs">
              Select an employee from the roster to calibrate compensation.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
