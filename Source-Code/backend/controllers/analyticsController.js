import Employee from '../models/Employee.js';
import Department from '../models/Department.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    const employees = await Employee.find({});
    const departments = await Department.find({});

    const totalHeadcount = employees.length;
    if (totalHeadcount === 0) {
      return res.json({
        success: true,
        stats: {
          totalHeadcount: 0,
          avgPerformanceScore: 0,
          avgAttendanceRate: 0,
          avgTaskCompletion: 0,
          topPerformersCount: 0,
          atRiskCount: 0
        },
        departmentAnalytics: [],
        attendanceTrends: [],
        topPerformers: [],
        categoryDistribution: {}
      });
    }

    // 1. Calculate Organization-Wide Averages
    let sumScore = 0;
    let sumAttendance = 0;
    let sumTasks = 0;
    let sumProductivity = 0;
    let sumEfficiency = 0;
    let topPerformersCount = 0;
    let atRiskCount = 0;

    const categoryDistribution = {
      Exceptional: 0,
      'Strong Performer': 0,
      'Meets Expectations': 0,
      'Needs Improvement': 0,
      'Critical Attention': 0
    };

    employees.forEach(emp => {
      const score = emp.metrics?.overallScore || 0;
      const att = emp.metrics?.attendanceRate || 0;
      const task = emp.metrics?.taskCompletionRate || 0;
      const prod = emp.metrics?.productivityScore || 0;
      const eff = emp.metrics?.workEfficiency || 0;

      sumScore += score;
      sumAttendance += att;
      sumTasks += task;
      sumProductivity += prod;
      sumEfficiency += eff;

      if (score >= 92) topPerformersCount++;
      if (score < 70 || att < 75) atRiskCount++;

      if (categoryDistribution[emp.performanceCategory] !== undefined) {
        categoryDistribution[emp.performanceCategory]++;
      }
    });

    const avgPerformanceScore = Number((sumScore / totalHeadcount).toFixed(1));
    const avgAttendanceRate = Number((sumAttendance / totalHeadcount).toFixed(1));
    const avgTaskCompletion = Number((sumTasks / totalHeadcount).toFixed(1));
    const avgProductivity = Number((sumProductivity / totalHeadcount).toFixed(1));
    const avgEfficiency = Number((sumEfficiency / totalHeadcount).toFixed(1));

    // 2. Department-Wise Breakdown
    const deptMap = {};
    departments.forEach(d => {
      deptMap[d.name] = {
        name: d.name,
        code: d.code,
        head: d.headOfDepartment,
        budget: d.budget,
        color: d.color,
        targetScore: d.targetPerformanceScore,
        count: 0,
        totalScore: 0,
        totalAttendance: 0,
        totalTasks: 0,
        totalProductivity: 0,
        totalEfficiency: 0
      };
    });

    employees.forEach(emp => {
      if (!deptMap[emp.department]) {
        deptMap[emp.department] = {
          name: emp.department,
          code: emp.department.slice(0, 3).toUpperCase(),
          head: 'Department Lead',
          budget: 200000,
          color: '#3b82f6',
          targetScore: 85,
          count: 0,
          totalScore: 0,
          totalAttendance: 0,
          totalTasks: 0,
          totalProductivity: 0,
          totalEfficiency: 0
        };
      }
      const d = deptMap[emp.department];
      d.count++;
      d.totalScore += emp.metrics?.overallScore || 0;
      d.totalAttendance += emp.metrics?.attendanceRate || 0;
      d.totalTasks += emp.metrics?.taskCompletionRate || 0;
      d.totalProductivity += emp.metrics?.productivityScore || 0;
      d.totalEfficiency += emp.metrics?.workEfficiency || 0;
    });

    const departmentAnalytics = Object.values(deptMap).map(d => ({
      name: d.name,
      code: d.code,
      head: d.head,
      budget: d.budget,
      color: d.color,
      targetScore: d.targetScore,
      headcount: d.count,
      avgScore: d.count > 0 ? Number((d.totalScore / d.count).toFixed(1)) : 0,
      avgAttendance: d.count > 0 ? Number((d.totalAttendance / d.count).toFixed(1)) : 0,
      avgTasks: d.count > 0 ? Number((d.totalTasks / d.count).toFixed(1)) : 0,
      avgProductivity: d.count > 0 ? Number((d.totalProductivity / d.count).toFixed(1)) : 0,
      avgEfficiency: d.count > 0 ? Number((d.totalEfficiency / d.count).toFixed(1)) : 0
    }));

    // 3. Attendance & Performance Monthly Trends (6 Months Aggregate)
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyAggregates = months.map(month => {
      let mAtt = 0;
      let mProd = 0;
      let mScore = 0;
      let count = 0;

      employees.forEach(emp => {
        const historyItem = emp.monthlyHistory?.find(h => h.month === month);
        if (historyItem) {
          mAtt += historyItem.attendance;
          mProd += historyItem.productivity;
          mScore += historyItem.overallScore;
          count++;
        }
      });

      return {
        month,
        attendance: count > 0 ? Number((mAtt / count).toFixed(1)) : 90,
        productivity: count > 0 ? Number((mProd / count).toFixed(1)) : 85,
        overallScore: count > 0 ? Number((mScore / count).toFixed(1)) : 86
      };
    });

    // 4. Top Performers Leaderboard (Top 6)
    const topPerformers = await Employee.find({})
      .sort({ 'metrics.overallScore': -1 })
      .limit(6)
      .select('employeeId name role department avatar metrics performanceCategory');

    res.json({
      success: true,
      stats: {
        totalHeadcount,
        avgPerformanceScore,
        avgAttendanceRate,
        avgTaskCompletion,
        avgProductivity,
        avgEfficiency,
        topPerformersCount,
        atRiskCount
      },
      departmentAnalytics,
      attendanceTrends: monthlyAggregates,
      topPerformers,
      categoryDistribution
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
