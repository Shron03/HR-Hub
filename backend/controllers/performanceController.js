import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

const findEmployee = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const emp = await Employee.findById(id);
    if (emp) return emp;
  }
  return await Employee.findOne({ employeeId: id });
};

export const updateEmployeeMetrics = async (req, res) => {
  try {
    const { id } = req.params;
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

    const employee = await findEmployee(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // HR can update salary and status
    if (salary !== undefined) employee.salary = Number(salary);
    if (status !== undefined) employee.status = status;

    // Update kpiData
    if (!employee.kpiData) {
      employee.kpiData = {};
    }

    if (tasksGiven !== undefined) employee.kpiData.tasksGiven = Math.max(1, Number(tasksGiven));
    if (tasksCompleted !== undefined) employee.kpiData.tasksCompleted = Math.max(0, Number(tasksCompleted));
    if (reviewScore !== undefined) employee.kpiData.reviewScore = Math.min(10, Math.max(0, Number(reviewScore)));
    if (attendanceRate !== undefined) employee.kpiData.attendanceRate = Math.min(100, Math.max(0, Number(attendanceRate)));
    if (projectContribution !== undefined) employee.kpiData.projectContribution = Number(projectContribution);
    if (workEfficiency !== undefined) employee.kpiData.workEfficiency = Number(workEfficiency);

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
    const { title, project, deadline, priority, status, efficiencyRating } = req.body;

    const employee = await findEmployee(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    employee.tasks.push({
      title,
      project: project || 'Internal Project',
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: priority || 'Medium',
      status: status || 'In Progress',
      efficiencyRating: efficiencyRating !== undefined ? Number(efficiencyRating) : 85
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
    const { status, efficiencyRating } = req.body;

    const employee = await findEmployee(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const task = employee.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (status) task.status = status;
    if (efficiencyRating !== undefined) task.efficiencyRating = Number(efficiencyRating);

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

    const employee = await findEmployee(employeeId);
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
