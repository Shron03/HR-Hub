import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

const findEmployee = async (id, workspaceId) => {
  if (!workspaceId) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const emp = await Employee.findOne({ _id: id, workspaceId });
    if (emp) return emp;
  }
  return await Employee.findOne({ employeeId: id, workspaceId });
};

export const updateEmployeeMetrics = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.workspaceId;
    const {
      tasksGiven,
      tasksCompleted,
      reviewScore,
      attendanceRate,
      projectContribution,
      workEfficiency,
      salary,
      status
    } = req.body;

    const employee = await findEmployee(id, workspaceId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // HR can update salary and status; Engineering Managers cannot modify salary
    if (salary !== undefined && req.user?.role === 'HR Director') {
      employee.salary = Math.max(0, Number(salary) || 0);
    }
    if (status !== undefined && req.user?.role === 'HR Director') {
      employee.status = status;
    }

    // Update kpiData with validated numbers
    if (!employee.kpiData) {
      employee.kpiData = {};
    }

    if (tasksGiven !== undefined) employee.kpiData.tasksGiven = Math.max(1, Number(tasksGiven) || 1);
    if (tasksCompleted !== undefined) employee.kpiData.tasksCompleted = Math.max(0, Number(tasksCompleted) || 0);
    if (reviewScore !== undefined) employee.kpiData.reviewScore = Math.min(10, Math.max(0, Number(reviewScore) || 0));
    if (attendanceRate !== undefined) employee.kpiData.attendanceRate = Math.min(100, Math.max(0, Number(attendanceRate) || 0));
    if (projectContribution !== undefined) employee.kpiData.projectContribution = Math.min(100, Math.max(0, Number(projectContribution) || 0));
    if (workEfficiency !== undefined) employee.kpiData.workEfficiency = Math.min(100, Math.max(0, Number(workEfficiency) || 0));

    // Save triggers pre-save hook which computes taskCompletionRate, productivityScore, overallScore, and performanceCategory
    await employee.save();

    res.json({
      success: true,
      message: 'Performance metrics and evaluation auto-calculated',
      kpiData: employee.kpiData,
      metrics: employee.metrics,
      performanceCategory: employee.performanceCategory,
      employee
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { id } = req.params;
    const workspaceId = req.workspaceId;
    const { title, project, deadline, priority, status, efficiencyRating } = req.body;

    if (!title || String(title).trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    const employee = await findEmployee(id, workspaceId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.tasks.push({
      title: String(title).trim(),
      project: project ? String(project).trim() : 'Internal Project',
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: ['Critical', 'High', 'Medium', 'Low'].includes(priority) ? priority : 'Medium',
      status: ['Pending', 'In Progress', 'Completed'].includes(status) ? status : 'In Progress',
      efficiencyRating: efficiencyRating !== undefined ? Math.min(100, Math.max(0, Number(efficiencyRating) || 85)) : 85
    });

    // Automatically update tasksGiven
    if (!employee.kpiData) employee.kpiData = {};
    employee.kpiData.tasksGiven = employee.tasks.length;
    employee.kpiData.tasksCompleted = employee.tasks.filter(t => t.status === 'Completed').length;

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Task added successfully',
      tasks: employee.tasks,
      metrics: employee.metrics,
      kpiData: employee.kpiData
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { employeeId, taskId } = req.params;
    const workspaceId = req.workspaceId;

    const employee = await findEmployee(employeeId, workspaceId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Role check: HR and Managers can update any task; regular Employees can only update their own tasks
    if (req.user?.role === 'Employee' && employee.employeeId !== req.user.employeeId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot modify tasks of other employees.'
      });
    }

    const task = employee.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      task.status = status;
    }
    if (efficiencyRating !== undefined && req.user?.role !== 'Employee') {
      task.efficiencyRating = Math.min(100, Math.max(0, Number(efficiencyRating) || 85));
    }

    // Update tasks completed count
    if (!employee.kpiData) employee.kpiData = {};
    employee.kpiData.tasksGiven = employee.tasks.length;
    employee.kpiData.tasksCompleted = employee.tasks.filter(t => t.status === 'Completed').length;

    await employee.save();

    res.json({
      success: true,
      message: 'Task updated',
      task,
      metrics: employee.metrics,
      kpiData: employee.kpiData
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { employeeId, taskId } = req.params;
    const workspaceId = req.workspaceId;

    const employee = await findEmployee(employeeId, workspaceId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.tasks.pull(taskId);

    if (!employee.kpiData) employee.kpiData = {};
    employee.kpiData.tasksGiven = employee.tasks.length;
    employee.kpiData.tasksCompleted = employee.tasks.filter(t => t.status === 'Completed').length;

    await employee.save();

    res.json({
      success: true,
      message: 'Task removed',
      tasks: employee.tasks,
      metrics: employee.metrics,
      kpiData: employee.kpiData
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
