// Utility to evaluate real-time workforce presence dynamically
// Automatically updates status based on today's calendar date and approved leaves or absences

export const getWorkforcePresence = (employee) => {
  if (!employee) {
    return {
      status: 'Active',
      presenceStatus: 'Active',
      label: 'Active',
      badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dotClass: 'bg-emerald-500',
      isAbsence: false,
      activeLeave: null
    };
  }

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Check approved leaves that cover today's date
  if (Array.isArray(employee.leaveRequests) && employee.leaveRequests.length > 0) {
    const activeLeave = employee.leaveRequests.find(lr => {
      if (lr.status !== 'Approved') return false;
      const start = lr.startDate ? lr.startDate.substring(0, 10) : '';
      const end = lr.endDate ? lr.endDate.substring(0, 10) : '';
      return start && end && start <= todayStr && todayStr <= end;
    });

    if (activeLeave) {
      if (activeLeave.type === 'Work From Home') {
        return {
          status: 'Active',
          presenceStatus: 'Work From Home',
          label: 'Work From Home (Remote)',
          badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
          dotClass: 'bg-blue-500',
          isAbsence: false,
          activeLeave
        };
      }
      return {
        status: 'On Leave',
        presenceStatus: 'On Leave',
        label: `On Leave (${activeLeave.type})`,
        badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
        dotClass: 'bg-orange-500',
        isAbsence: true,
        activeLeave
      };
    }
  }

  // 2. Explicit or computed absence (e.g. 0% attendance or marked absent)
  if (employee.status === 'Absent' || employee.metrics?.attendanceRate === 0) {
    return {
      status: 'Absent',
      presenceStatus: 'Absent',
      label: 'Absent',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
      dotClass: 'bg-red-500',
      isAbsence: true,
      activeLeave: null
    };
  }

  // 3. Other corporate statuses
  if (employee.status === 'Probation') {
    return {
      status: 'Probation',
      presenceStatus: 'Probation',
      label: `Probation (${employee.workMode || 'Hybrid'})`,
      badgeClass: 'bg-purple-100 text-purple-700 border-purple-200',
      dotClass: 'bg-purple-500',
      isAbsence: false,
      activeLeave: null
    };
  }

  if (employee.status === 'Notice Period') {
    return {
      status: 'Notice Period',
      presenceStatus: 'Notice Period',
      label: `Notice Period (${employee.workMode || 'Hybrid'})`,
      badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
      isAbsence: false,
      activeLeave: null
    };
  }

  // 4. Default active workforce presence based on assigned work mode
  const mode = employee.workMode || 'Hybrid';
  return {
    status: 'Active',
    presenceStatus: `Active (${mode})`,
    label: `Active (${mode})`,
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    isAbsence: false,
    activeLeave: null
  };
};
