import TimeLog from '../models/TimeLog.js';
import Notification from '../models/Notification.js';

export const getTimeLogs = async (req, res) => {
  try {
    const { employeeId, project, status } = req.query;
    const filter = {};

    if (employeeId) filter.employeeId = employeeId;
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
    const { employeeId, employeeName, department, project, taskName, hours, date, notes } = req.body;

    if (!project || !taskName || !hours || !date) {
      return res.status(400).json({ success: false, message: 'Project, task, hours, and date are required' });
    }

    const count = await TimeLog.countDocuments();
    const logId = `LOG-${1000 + count + 1}`;

    const timeLog = new TimeLog({
      logId,
      employeeId: employeeId || 'EMP-1001',
      employeeName: employeeName || 'Aarav Patel',
      department: department || 'Engineering',
      project,
      taskName: taskName.trim(),
      hours: Number(hours),
      date,
      status: 'Pending Approval',
      notes: notes || ''
    });

    await timeLog.save();

    // Notify Engineering Manager
    await Notification.create({
      title: 'Timesheet Entry Submitted',
      message: `${timeLog.employeeName} logged ${timeLog.hours} hrs for "${timeLog.taskName}" on ${timeLog.project}.`,
      category: 'kpi_update',
      recipientRole: 'Engineering Manager',
      actionLink: 'mgr-approvals'
    });

    res.status(201).json({
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
    const { status } = req.body;

    const log = await TimeLog.findById(id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Timesheet entry not found' });
    }

    if (status) log.status = status;
    await log.save();

    res.json({
      success: true,
      message: `Timesheet entry marked as ${log.status}`,
      timeLog: log
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
