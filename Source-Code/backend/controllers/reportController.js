import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import { seedWorkspaceData, resetWorkspaceData } from '../services/workspaceService.js';

export const getMonthlyReportData = async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const { month = 'Dec' } = req.query;

    const employees = await Employee.find({ workspaceId });
    const departments = await Department.find({ workspaceId });

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
        attendance: emp.metrics?.attendanceRate || 90,
        productivity: emp.metrics?.productivityScore || 85,
        tasksCompleted: 8,
        overallScore: emp.metrics?.overallScore || 85
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
        initials: emp.initials,
        avatarBg: emp.avatarBg,
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
        organization: 'HR Hub Enterprise',
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
    const workspaceId = req.workspaceId || 'registered';

    if (workspaceId === 'registered') {
      if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DESTRUCTIVE_OPERATIONS !== 'true') {
        return res.status(403).json({
          success: false,
          message: 'Database reset operation is disabled in production environment.'
        });
      }
      const result = await seedWorkspaceData('registered');
      return res.json({
        success: true,
        message: 'Registered workspace dataset successfully re-seeded',
        result
      });
    }

    const result = await resetWorkspaceData(workspaceId);
    res.json({
      success: true,
      message: 'Demo workspace successfully re-seeded with baseline dataset',
      result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
