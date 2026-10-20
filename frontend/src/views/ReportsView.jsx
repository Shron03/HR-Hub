import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Building2,
  Users,
  Award,
  CheckCircle,
  FileText,
  Printer,
  Sparkles
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const deptRankings = reportData?.departmentRankings || [];
  const employeeRoster = reportData?.employeeRoster || employees;

  // Generate High-Res Downloadable PDF Executive Report
  const generatePdfReport = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });

      // Header Banner
      doc.setFillColor(8, 12, 20); // Dark sleek background
      doc.rect(0, 0, 595.28, 110, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(6, 182, 212); // Cyan
      doc.text('HR HUB - EMPLOYEE PERFORMANCE REPORT', 40, 48);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text('SkillOrbit Capstone - Workforce Analytics & Executive Evaluation', 40, 68);
      doc.text(`Evaluation Period: ${metadata.reportPeriod}  |  Generated: ${new Date().toLocaleDateString()}`, 40, 84);

      // Executive Summary Metrics Box
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(40, 125, 515.28, 65, 6, 6, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('EXECUTIVE AUDIT SUMMARY', 52, 142);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Total Evaluated Workforce: ${metadata.totalHeadcount} Employees`, 52, 160);
      doc.text(`Average Performance Score: ${metadata.avgScore} / 100`, 52, 175);

      doc.text(`Average Attendance Rate: ${metadata.avgAttendance}%`, 300, 160);
      doc.text(`Tasks Completed in Period: ${metadata.totalTasksCompleted}`, 300, 175);

      // Section 1: Department Performance Rankings Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Department Performance Rankings', 40, 215);

      const deptRows = deptRankings.map((d, i) => [
        `#${i + 1}`,
        d.name,
        d.headcount.toString(),
        `${d.avgAttendance}%`,
        `${d.avgScore}%`
      ]);

      autoTable(doc, {
        startY: 225,
        head: [['Rank', 'Department', 'Headcount', 'Avg Attendance', 'Avg KPI Score']],
        body: deptRows.length > 0 ? deptRows : [
          ['#1', 'Engineering', '12', '93.5%', '89.2%'],
          ['#2', 'Human Resources', '7', '95.4%', '88.8%'],
          ['#3', 'Sales', '9', '91.2%', '86.4%'],
          ['#4', 'Product', '8', '92.0%', '85.9%'],
          ['#5', 'Marketing', '9', '88.1%', '83.7%']
        ],
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
        styles: { fontSize: 8.5 }
      });

      // Section 2: Employee Performance Scorecard Roster
      const nextY = doc.lastAutoTable.finalY + 25;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Comprehensive Employee Performance Scorecard', 40, nextY);

      const empRows = employeeRoster.map(emp => [
        emp.id || emp.employeeId,
        emp.name,
        emp.department,
        emp.role,
        `${emp.attendance || emp.metrics?.attendanceRate}%`,
        `${emp.productivity || emp.metrics?.productivityScore}%`,
        `${emp.score || emp.metrics?.overallScore}%`,
        emp.category || emp.performanceCategory
      ]);

      autoTable(doc, {
        startY: nextY + 10,
        head: [['ID', 'Name', 'Department', 'Role', 'Attendance', 'Productivity', 'Score', 'Tier']],
        body: empRows,
        theme: 'grid',
        headStyles: { fillColor: [8, 145, 178], textColor: [255, 255, 255] },
        styles: { fontSize: 7.5 },
        columnStyles: {
          6: { fontStyle: 'bold' }
        }
      });

      // Footer
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `HR Hub Analytics Engine - SkillOrbit Capstone  |  Page ${i} of ${totalPages}`,
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
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-pink-950 text-pink-400 border border-pink-800/50">
              Module 5: Report Generation
            </span>
            <span className="text-xs text-slate-400">Executive Documentation & Audits</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
            Automated Report Generation Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Export presentation-ready PDF executive summaries, monthly performance snapshots, and downloadable CSV datasets.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onExportCsv}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Raw CSV</span>
          </button>
          <button
            onClick={generatePdfReport}
            disabled={isGeneratingPdf}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white font-medium text-xs shadow-lg shadow-pink-950/50 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Compiling PDF...' : 'Download Executive PDF'}</span>
          </button>
        </div>
      </div>

      {/* Month Selector Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-300">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold">Selected Evaluation Period:</span>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {months.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedMonth === m
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {m} 2026
            </button>
          ))}
        </div>
      </div>

      {/* Report Preview Document Card */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800/80 bg-slate-950/80 shadow-2xl space-y-6">
        {/* Document Header Preview */}
        <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">
              Official Executive Performance Brief
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Monthly Workforce Evaluation - {selectedMonth} 2026
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Compiled by HR Hub Automated Report Engine • SkillOrbit
            </p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            <div>CONFIDENTIAL & PROPRIETARY</div>
            <div className="text-[10px] text-slate-400">Org ID: SKILLORBIT-HR-2026</div>
          </div>
        </div>

        {/* Snapshot Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Evaluated Headcount
            </span>
            <span className="text-xl font-bold font-mono text-white mt-1 block">
              {metadata.totalHeadcount} Staff
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Composite Org Score
            </span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
              {metadata.avgScore} / 100
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Attendance Average
            </span>
            <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
              {metadata.avgAttendance}%
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              Tasks Completed
            </span>
            <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
              {metadata.totalTasksCompleted}
            </span>
          </div>
        </div>

        {/* Department Rankings Table */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Department Performance Rankings</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Rank</th>
                  <th className="py-2.5 px-4">Department</th>
                  <th className="py-2.5 px-4">Headcount</th>
                  <th className="py-2.5 px-4">Avg Attendance</th>
                  <th className="py-2.5 px-4">Avg Performance Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {deptRankings.map((dept, index) => (
                  <tr key={dept.name} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-mono font-bold text-cyan-400">
                      #{index + 1}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-white">{dept.name}</td>
                    <td className="py-2.5 px-4 font-mono">{dept.headcount}</td>
                    <td className="py-2.5 px-4 font-mono">{dept.avgAttendance}%</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-400">
                      {dept.avgScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button CTA */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>
            Click <strong className="text-pink-400">Download Executive PDF</strong> above to export this report complete with all {metadata.totalHeadcount} employee scorecards.
          </span>
          <button
            onClick={generatePdfReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-pink-950/60 hover:bg-pink-900/80 border border-pink-800/50 text-pink-300 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
