import React, { useState } from 'react';
import {
  User,
  IndianRupee,
  FileText,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building,
  ShieldCheck,
  CheckCircle2,
  Printer
} from 'lucide-react';
import Avatar from '../components/Avatar';

export default function EmployeeProfilePayrollView({ currentUser, employees = [], showToast }) {
  const empId = currentUser?.employeeId || 'EMP-1001';
  const employee = employees.find(e => e.employeeId === empId) || employees[0] || {};

  const annualCtc = employee.salary || 850000;
  const monthlyGross = Math.round(annualCtc / 12);
  const basicSalary = Math.round(monthlyGross * 0.50);
  const hra = Math.round(monthlyGross * 0.20);
  const specialAllowance = Math.round(monthlyGross * 0.30);
  const pfDeduction = Math.round(basicSalary * 0.12);
  const professionalTax = 200;
  const totalDeductions = pfDeduction + professionalTax;
  const netMonthlyPay = monthlyGross - totalDeductions;

  const [selectedMonth, setSelectedMonth] = useState('October 2026');

  const handleDownloadPayslip = (month) => {
    showToast(`Generated and downloaded Salary Slip for ${month} (Net: ₹ ${netMonthlyPay.toLocaleString('en-IN')})`, 'success');
  };

  return (
    <div className="space-y-4 animate-fade-in w-full text-slate-800">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Personnel Records & Compensation
            </span>
            <span className="text-xs text-slate-500 font-medium">Digital Employee Profile</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Profile & Payroll Documents
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Official employee identification details, confidential compensation CTC breakdown, and monthly salary slips.
          </p>
        </div>

        <button
          onClick={() => handleDownloadPayslip(selectedMonth)}
          className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer py-2 px-4 text-xs font-semibold flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Latest Salary Slip</span>
        </button>
      </div>

      {/* Main Grid: Profile Card & Compensation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left 1 Col: Employee Digital Identity Card */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-200/90 bg-white/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3.5 pb-4 border-b border-slate-100">
              <Avatar
                name={employee.name || currentUser?.name || 'Aarav Patel'}
                initials={employee.initials || 'AP'}
                bg={employee.avatarBg || '#2563eb'}
                size="xl"
              />
              <div>
                <h2 className="text-sm font-bold text-slate-900">{employee.name || currentUser?.name}</h2>
                <span className="text-xs text-slate-600 font-medium">{employee.role}</span>
                <div className="text-[11px] font-mono text-blue-600 font-bold mt-0.5">{employee.employeeId}</div>
              </div>
            </div>

            <div className="py-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Department</span>
                </span>
                <span className="font-semibold text-slate-800">{employee.department}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Email</span>
                </span>
                <span className="font-semibold text-slate-800">{employee.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone</span>
                </span>
                <span className="font-semibold text-slate-800">{employee.phone || '+91 98765 43210'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Location</span>
                </span>
                <span className="font-semibold text-slate-800">{employee.location || 'Bengaluru, India'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Manager</span>
                </span>
                <span className="font-semibold text-slate-800">{employee.managerName || 'Rajesh Verma'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Work Mode</span>
                </span>
                <span className="font-semibold text-slate-800">{employee.workMode || 'Hybrid'}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Employment Status:</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              {employee.status || 'Active'}
            </span>
          </div>
        </div>

        {/* Right 2 Cols: Compensation Breakdown & Salary Slip Viewer */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Annual CTC Structure */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  Annual Compensation Structure (CTC)
                </h3>
                <span className="text-[11px] text-slate-400">
                  Direct payroll deposit into corporate account
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-emerald-600">
                  ₹ {annualCtc.toLocaleString('en-IN')} / yr
                </div>
                <span className="text-[10px] text-slate-400">Fixed Gross CTC</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Monthly Gross</span>
                <span className="font-mono font-bold text-slate-800">₹ {monthlyGross.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Basic Salary (50%)</span>
                <span className="font-mono font-bold text-slate-800">₹ {basicSalary.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">HRA (20%)</span>
                <span className="font-mono font-bold text-slate-800">₹ {hra.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] text-emerald-700 font-bold block">Net In-Hand</span>
                <span className="font-mono font-bold text-emerald-700">₹ {netMonthlyPay.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Monthly Salary Slip Viewer */}
          <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">Corporate Pay Slip Generator</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">Pay Period:</span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 font-semibold cursor-pointer"
                >
                  <option value="October 2026">October 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="August 2026">August 2026</option>
                  <option value="July 2026">July 2026</option>
                </select>
              </div>
            </div>

            {/* Formal Simulated Slip View */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-200">
                <div>
                  <strong className="text-slate-900">HR Hub Enterprise Private Limited</strong>
                  <div className="text-slate-400 text-[10px]">Bengaluru, Karnataka, India • PAN: AAACE1234F</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-slate-600">Period: {selectedMonth}</span>
                  <div className="text-[10px] text-slate-400">Payment Mode: Direct Bank Transfer</div>
                </div>
              </div>

              {/* Earnings & Deductions Split */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Earnings (₹ INR)
                  </span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary:</span>
                      <span className="font-mono text-slate-800">₹ {basicSalary.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">House Rent Allowance (HRA):</span>
                      <span className="font-mono text-slate-800">₹ {hra.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Special Allowance:</span>
                      <span className="font-mono text-slate-800">₹ {specialAllowance.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                      <span>Gross Earnings:</span>
                      <span className="font-mono">₹ {monthlyGross.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Statutory Deductions (₹ INR)
                  </span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Provident Fund (EPF 12%):</span>
                      <span className="font-mono text-slate-800">₹ {pfDeduction.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Professional Tax (PT):</span>
                      <span className="font-mono text-slate-800">₹ {professionalTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Income Tax (TDS):</span>
                      <span className="font-mono text-slate-800">₹ 0</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-red-700">
                      <span>Total Deductions:</span>
                      <span className="font-mono">₹ {totalDeductions.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Payable Bar */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Net Pay in Words:</span>
                  <div className="text-[10px] italic text-slate-600">Directly disbursed into salary account.</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Net Disbursed Amount</span>
                  <div className="text-base font-bold font-mono text-emerald-700">
                    ₹ {netMonthlyPay.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-end space-x-2">
              <button
                onClick={() => handleDownloadPayslip(selectedMonth)}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Payslip as PDF</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
