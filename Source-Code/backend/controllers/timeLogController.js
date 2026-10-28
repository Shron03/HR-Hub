import TimeLog from '../models/TimeLog.js';
import Notification from '../models/Notification.js';

export const getTimeLogs = async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const { project, status } = req.query;
    const filter = { workspaceId };

    // IDOR Protection: Regular Employees can only view their own time logs
    if (req.user?.role === 'Employee') {
      filter.employeeId = req.user.employeeId;
    } else if (req.query.employeeId) {
      filter.employeeId = req.query.employeeId;
    }

    if (project && project !== 'All') filter.project = project;
    if (status && status !== 'All') filter.status = status;

    const timeLogs = await TimeLog.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: timeLogs.length,
      timeLogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTimeLog = async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const { employeeName, department, project, taskName, hours, date, notes } = req.body;
    let employeeId = req.body.employeeId;

    if (!project || !taskName || !hours || !date) {
      return res.status(400).json({ success: false, message: 'Project, task, hours, and date are required' });
    }

    // Force employeeId if regular employee
    if (req.user?.role === 'Employee') {
      employeeId = req.user.employeeId;
    }

    const count = await TimeLog.countDocuments({ workspaceId });
    const logId = `LOG-${1000 + count + 1}`;

    const timeLog = new TimeLog({
      workspaceId,
      logId,
      employeeId: employeeId || 'EMP-1001',
      employeeName: employeeName || 'Employee',
      department: department || 'Engineering',
      project,
      taskName: taskName.trim(),
      hours: Math.min(24, Math.max(0.5, Number(hours) || 1)),
      date,
      status: 'Pending Approval',
      notes: notes || ''
    });

    await timeLog.save();

    // Notify Engineering Manager in this workspace
    await Notification.create({
      workspaceId,
      title: 'Timesheet Entry Submitted',
      message: `${timeLog.employeeName} logged ${timeLog.hours} hrs for "${timeLog.taskName}" on ${timeLog.project}.`,
      category: 'kpi_update',
      recipientRole: 'Engineering Manager',
      actionLink: 'mgr-approvals'
    });

    res.json({
      success: true,
      message: 'Timesheet entry logged successfully',
      timeLog
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTimeLogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.workspaceId;
    const { status } = req.body;

    if (!['Approved', 'Rejected', 'Pending Approval'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid timesheet status supplied.' });
    }

    const log = await TimeLog.findOne({ _id: id, workspaceId });
    if (!log) {
      return res.status(404).json({ success: false, message: 'Timesheet entry not found' });
    }

    log.status = status;
    await log.save();

    res.json({
      success: true,
      message: `Timesheet entry marked as ${status}`,
      timeLog: log
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
