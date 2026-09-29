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
    const { attendanceRate, taskCompletionRate, productivityScore, projectContribution, workEfficiency } = req.body;

    const employee = await findEmployee(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (attendanceRate !== undefined) employee.metrics.attendanceRate = Number(attendanceRate);
    if (taskCompletionRate !== undefined) employee.metrics.taskCompletionRate = Number(taskCompletionRate);
    if (productivityScore !== undefined) employee.metrics.productivityScore = Number(productivityScore);
    if (projectContribution !== undefined) employee.metrics.projectContribution = Number(projectContribution);
    if (workEfficiency !== undefined) employee.metrics.workEfficiency = Number(workEfficiency);

    await employee.save();

    res.json({
      success: true,
      message: 'Performance metrics updated and recalculated',
      metrics: employee.metrics,
      performanceCategory: employee.performanceCategory
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
      project: project || 'General',
      deadline: deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: priority || 'Medium',
      status: status || 'In Progress',
      efficiencyRating: efficiencyRating !== undefined ? Number(efficiencyRating) : 85
    });

    // Re-evaluate task completion rate
    const totalTasks = employee.tasks.length;
    const completedTasks = employee.tasks.filter(t => t.status === 'Completed').length;
    if (totalTasks > 0) {
      employee.metrics.taskCompletionRate = Math.round((completedTasks / totalTasks) * 100);
    }

    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Task added successfully',
      tasks: employee.tasks,
      metrics: employee.metrics
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

    // Re-evaluate task completion rate
    const totalTasks = employee.tasks.length;
    const completedTasks = employee.tasks.filter(t => t.status === 'Completed').length;
    if (totalTasks > 0) {
      employee.metrics.taskCompletionRate = Math.round((completedTasks / totalTasks) * 100);
    }

    await employee.save();

    res.json({
      success: true,
      message: 'Task updated',
      task,
      metrics: employee.metrics
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

    // Re-evaluate task completion rate
    const totalTasks = employee.tasks.length;
    const completedTasks = employee.tasks.filter(t => t.status === 'Completed').length;
    employee.metrics.taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    await employee.save();

    res.json({
      success: true,
      message: 'Task removed',
      tasks: employee.tasks,
      metrics: employee.metrics
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
