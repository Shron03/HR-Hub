import Employee from '../models/Employee.js';

export const getInsights = async (req, res) => {
  try {
    const employees = await Employee.find({});

    // 1. Employees Needing Improvement (Overall score < 75 or category Needs Improvement / Critical Attention)
    const needingImprovement = employees
      .filter(emp => emp.metrics.overallScore < 75 || ['Needs Improvement', 'Critical Attention'].includes(emp.performanceCategory))
      .map(emp => {
        let suggestedAction = 'Schedule quarterly performance review and establish a 30-day Performance Improvement Plan (PIP).';
        if (emp.metrics.attendanceRate < 75) {
          suggestedAction = 'Critical attendance issue. Verify remote presence, schedule HR consultation, and audit check-ins.';
        } else if (emp.metrics.taskCompletionRate < 70) {
          suggestedAction = 'Task throughput lag. Reduce scope of concurrent projects and assign a senior team mentor.';
        }
        return {
          employeeId: emp.employeeId,
          name: emp.name,
          role: emp.role,
          department: emp.department,
          avatar: emp.avatar,
          score: emp.metrics.overallScore,
          attendanceRate: emp.metrics.attendanceRate,
          taskCompletionRate: emp.metrics.taskCompletionRate,
          category: emp.performanceCategory,
          suggestedAction
        };
      })
      .sort((a, b) => a.score - b.score);

    // 2. High-Performing Employees (Overall score >= 92)
    const highPerformers = employees
      .filter(emp => emp.metrics.overallScore >= 92)
      .map(emp => ({
        employeeId: emp.employeeId,
        name: emp.name,
        role: emp.role,
        department: emp.department,
        avatar: emp.avatar,
        score: emp.metrics.overallScore,
        efficiency: emp.metrics.workEfficiency,
        category: emp.performanceCategory,
        recognitionTag: emp.metrics.overallScore >= 96 ? 'Pinnacle Performer' : 'Leadership Candidate',
        recommendation: 'Nominate for fast-track leadership program, merit bonus, or high-visibility project ownership.'
      }))
      .sort((a, b) => b.score - a.score);

    // 3. Attendance Warnings (Attendance < 80%)
    const attendanceWarnings = employees
      .filter(emp => emp.metrics.attendanceRate < 80)
      .map(emp => ({
        employeeId: emp.employeeId,
        name: emp.name,
        role: emp.role,
        department: emp.department,
        attendanceRate: emp.metrics.attendanceRate,
        warningLevel: emp.metrics.attendanceRate < 70 ? 'High Alert' : 'Moderate Notice',
        message: `Attendance is currently at ${emp.metrics.attendanceRate}%, falling below the 80% organizational compliance threshold.`
      }))
      .sort((a, b) => a.attendanceRate - b.attendanceRate);

    // 4. Productivity Suggestions
    const productivitySuggestions = [
      {
        id: 'sug-1',
        category: 'Workload Balancing',
        icon: 'Scale',
        priority: 'High',
        title: 'Rebalance Engineering Sprint Allocations',
        description: 'Analysis reveals a 15% disparity in task distribution among Junior and Senior developers in Engineering. Reallocating code review workloads can boost overall team throughput by an estimated 12%.'
      },
      {
        id: 'sug-2',
        category: 'Focus Time Optimization',
        icon: 'Clock',
        priority: 'Medium',
        title: 'Meeting-Free Focus Blocks in Marketing & Product',
        description: 'Mid-week task completion rates drop by 8% due to inter-departmental status check meetings. Instituting "No-Meeting Thursdays" will enhance deep work efficiency.'
      },
      {
        id: 'sug-3',
        category: 'Skill Enhancement',
        icon: 'GraduationCap',
        priority: 'Medium',
        title: 'Targeted Upskilling for At-Risk Staff',
        description: `Currently ${needingImprovement.length} employee(s) show skill lag in core delivery KPIs. Enrolling them in the SkillOrbit Advanced Accelerator will arrest performance dips before next quarter.`
      },
      {
        id: 'sug-4',
        category: 'Retention Safeguard',
        icon: 'Award',
        priority: 'High',
        title: 'Retention Safeguards for Top 10% Talent',
        description: `${highPerformers.length} employees have maintained exceptional performance for over 6 consecutive months. Proactive compensation adjustment and equity refresh are advised.`
      }
    ];

    res.json({
      success: true,
      summary: {
        totalUnderperforming: needingImprovement.length,
        totalHighPerformers: highPerformers.length,
        totalAttendanceWarnings: attendanceWarnings.length
      },
      needingImprovement,
      highPerformers,
      attendanceWarnings,
      productivitySuggestions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
