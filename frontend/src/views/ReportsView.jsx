import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
  Users,
  Award,
  CheckCircle,
  Sparkles,
  Printer,
  ChevronDown,
  Clock,
  Layers
} from 'lucide-react';
import Avatar from '../components/Avatar';

export default function ReportsView({ reportData, employees = [], onExportCsv }) {
  const [selectedMonth, setSelectedMonth] = useState('Dec');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const metadata = reportData?.reportMetadata || {
    reportPeriod: `${selectedMonth} 2026`,
    totalHeadcount: employees.length || 15,
    avgScore: 88.2,
    avgAttendance: 91.5,
    totalTasksCompleted: 142
  };

  const deptRankings = reportData?.departmentRankings || [
    { name: 'Engineering', headcount: 5, avgAttendance: 92.4, avgScore: 89.2 },
    { name: 'Product', headcount: 3, avgAttendance: 91.8, avgScore: 88.5 },
    { name: 'Human Resources', headcount: 3, avgAttendance: 93.0, avgScore: 87.8 },
    { name: 'Sales', headcount: 2, avgAttendance: 90.5, avgScore: 86.4 },
    { name: 'Marketing', headcount: 2, avgAttendance: 89.6, avgScore: 85.9 }
  ];

  const employeeRoster = reportData?.employeeRoster || [];

  const generatePdfReport = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Top Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235); // Blue 600
      doc.text('HR HUB ENTERPRISE - PERFORMANCE AUDIT', 40, 48);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text('Workforce Operations & Performance Evaluation Audit', 40, 68);
      doc.text(`Evaluation Period: ${metadata.reportPeriod}  |  Generated: ${new Date().toLocaleDateString('en-IN')}`, 40, 84);

      // Executive Summary Metrics Box
      doc.setFillColor(243, 246, 251);
      doc.roundedRect(40, 115, 515.28, 65, 6, 6, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('EXECUTIVE WORKFORCE SUMMARY', 52, 132);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Total Evaluated Workforce: ${metadata.totalHeadcount} Employees`, 52, 150);
      doc.text(`Average Performance Score: ${metadata.avgScore} / 100`, 52, 165);

      doc.text(`Average Attendance Rate: ${metadata.avgAttendance}%`, 300, 150);
      doc.text(`Tasks Completed in Period: ${metadata.totalTasksCompleted}`, 300, 165);

      // Section 1: Department Performance Rankings Table
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Department Performance Rankings', 40, 205);

      const deptTableData = deptRankings.map((dept, index) => [
        `#${index + 1}`,
        dept.name,
        `${dept.headcount} Staff`,
        `${dept.avgAttendance}%`,
        `${dept.avgScore}%`
      ]);

      autoTable(doc, {
        startY: 215,
        head: [['Rank', 'Department', 'Headcount', 'Avg Attendance', 'Avg Score']],
        body: deptTableData,
        theme: 'striped',
        styles: { fontSize: 8.5, cellPadding: 5 },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 40, halign: 'center' },
          1: { cellWidth: 160 },
          2: { cellWidth: 80, halign: 'center' },
          3: { cellWidth: 100, halign: 'center' },
          4: { cellWidth: 100, halign: 'center', fontStyle: 'bold' }
        }
      });

      // Section 2: Full Personnel Roster
      const finalY = (doc).lastAutoTable.finalY + 25;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Personnel Performance Audit Roster', 40, finalY);

      const rosterData = (employeeRoster.length > 0 ? employeeRoster : employees).map(emp => [
        emp.employeeId || emp.id,
        emp.name,
        emp.department,
        emp.role,
        `${emp.attendance || emp.metrics?.attendanceRate || 92}%`,
        `${emp.score || emp.metrics?.overallScore || 88}%`,
        emp.category || emp.performanceCategory || 'Strong Performer'
      ]);

      autoTable(doc, {
        startY: finalY + 10,
        head: [['ID', 'Name', 'Department', 'Role', 'Attendance', 'KPI Score', 'Rating Category']],
        body: rosterData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 4.5 },
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 55, fontStyle: 'bold' },
          1: { cellWidth: 105 },
          2: { cellWidth: 85 },
          3: { cellWidth: 110 },
          4: { cellWidth: 50, halign: 'center' },
          5: { cellWidth: 45, halign: 'center', fontStyle: 'bold' },
          6: { cellWidth: 65 }
        }
      });

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `HR Hub Enterprise Operations Audit  |  Page ${i} of ${totalPages}`,
          40,
          825
        );
      }

      doc.save(`HR_Hub_Executive_Report_${metadata.reportPeriod.replace(' ', '_')}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Executive Audits & Reports
            </span>
            <span className="text-xs text-slate-500">Official Workforce Documentation</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Automated Audit & Report Center
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Export presentation-ready PDF executive summaries, monthly performance snapshots, and downloadable CSV personnel datasets.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onExportCsv}
            className="btn-large bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={generatePdfReport}
            disabled={isGeneratingPdf}
            className="btn-large bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer disabled:opacity-60"
          >
            <Printer className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download Executive PDF'}</span>
          </button>
        </div>
      </div>

      {/* Month Selector Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-200/90 bg-white/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-600 font-semibold">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Select Reporting Period:</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedMonth === m
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m} 2026
            </button>
          ))}
        </div>
      </div>

      {/* Report Preview Document Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-200/90 bg-white/90 shadow-sm space-y-6">
        {/* Document Header Preview */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-600 font-bold">
              Official Executive Performance Brief
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Monthly Workforce Evaluation — {selectedMonth} 2026
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Compiled by HR Hub Automated Report Engine
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-500">
            <div>CONFIDENTIAL &amp; PROPRIETARY</div>
            <div className="text-[10px] text-slate-400">Org ID: HRHUB-ENT-2026</div>
          </div>
        </div>

        {/* Snapshot Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Evaluated Headcount
            </span>
            <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
              {metadata.totalHeadcount} Staff
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Composite Org Score
            </span>
            <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
              {metadata.avgScore} / 100
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Attendance Average
            </span>
            <span className="text-xl font-bold font-mono text-blue-600 mt-1 block">
              {metadata.avgAttendance}%
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Tasks Completed
            </span>
            <span className="text-xl font-bold font-mono text-purple-600 mt-1 block">
              {metadata.totalTasksCompleted}
            </span>
          </div>
        </div>

        {/* Department Rankings Table */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Department Performance Rankings</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Rank</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Headcount</th>
                  <th className="py-2.5 px-4">Avg Attendance</th>
                  <th className="py-2.5 px-4">Avg Performance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {deptRankings.map((dept, index) => (
                  <tr key={dept.name} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-mono font-bold text-blue-600">
                      #{index + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{dept.name}</td>
                    <td className="py-2.5 px-4 font-mono">{dept.headcount}</td>
                    <td className="py-2.5 px-4 font-mono">{dept.avgAttendance}%</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-600">
                      {dept.avgScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button CTA */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Click <strong className="text-blue-600">Download Executive PDF</strong> above to export this complete report.
          </span>
          <button
            onClick={generatePdfReport}
            className="btn-large bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
