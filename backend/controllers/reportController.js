import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import { seedDatabase } from '../seed.js';

export const getMonthlyReportData = async (req, res) => {
  try {
    const { month = 'Dec' } = req.query;

    const employees = await Employee.find({});
    const departments = await Department.find({});

    const totalHeadcount = employees.length;
    let totalScore = 0;
    let totalAttendance = 0;
    let totalTasksCompleted = 0;

    const departmentStats = {};
    departments.forEach(d => {
      departmentStats[d.name] = {
        name: d.name,
        headcount: 0,
        totalScore: 0,
        totalAttendance: 0
      };
    });

    const employeeRoster = employees.map(emp => {
      const historyItem = emp.monthlyHistory?.find(h => h.month === month) || {
        attendance: emp.metrics.attendanceRate,
        productivity: emp.metrics.productivityScore,
        tasksCompleted: 8,
        overallScore: emp.metrics.overallScore
      };

      totalScore += historyItem.overallScore;
      totalAttendance += historyItem.attendance;
      totalTasksCompleted += (historyItem.tasksCompleted || 0);

      if (departmentStats[emp.department]) {
        departmentStats[emp.department].headcount++;
        departmentStats[emp.department].totalScore += historyItem.overallScore;
        departmentStats[emp.department].totalAttendance += historyItem.attendance;
      }

      return {
        id: emp.employeeId,
        name: emp.name,
        role: emp.role,
        department: emp.department,
        status: emp.status,
        attendance: historyItem.attendance,
        productivity: historyItem.productivity,
        tasksCompleted: historyItem.tasksCompleted,
        score: historyItem.overallScore,
        category: emp.performanceCategory
      };
    });

    const avgScore = totalHeadcount > 0 ? Number((totalScore / totalHeadcount).toFixed(1)) : 0;
    const avgAttendance = totalHeadcount > 0 ? Number((totalAttendance / totalHeadcount).toFixed(1)) : 0;

    const departmentRankings = Object.values(departmentStats)
      .map(d => ({
        name: d.name,
        headcount: d.headcount,
        avgScore: d.headcount > 0 ? Number((d.totalScore / d.headcount).toFixed(1)) : 0,
        avgAttendance: d.headcount > 0 ? Number((d.totalAttendance / d.headcount).toFixed(1)) : 0
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    res.json({
      success: true,
      reportMetadata: {
        reportPeriod: `${month} 2026`,
        generatedAt: new Date().toISOString(),
        organization: 'HR Hub / SkillOrbit',
        totalHeadcount,
        avgScore,
        avgAttendance,
        totalTasksCompleted
      },
      departmentRankings,
      employeeRoster
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetAndSeedDatabase = async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json({
      success: true,
      message: 'Database successfully re-seeded with demo dataset',
      result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
