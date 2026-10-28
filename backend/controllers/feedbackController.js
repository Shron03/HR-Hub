import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';

const findEmployee = async (id, workspaceId) => {
  if (!workspaceId) return null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const emp = await Employee.findOne({ _id: id, workspaceId });
    if (emp) return emp;
  }
  return await Employee.findOne({ employeeId: id, workspaceId });
};

export const sendFeedback = async (req, res) => {
  try {
    const workspaceId = req.workspaceId;
    const { employeeId, message, category, from } = req.body;
    const employee = await findEmployee(employeeId, workspaceId);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Feedback message cannot be blank' });
    }

    const feedback = {
      from: from || (req.user?.role === 'HR Director' ? 'Priya Sharma (HR Director)' : 'Rajesh Verma (Engineering Manager)'),
      message: message.trim(),
      category: ['Recognition', 'Coaching', 'Milestone', 'Critical'].includes(category) ? category : 'Recognition',
      date: new Date()
    };

    if (!employee.feedbacks) employee.feedbacks = [];
    employee.feedbacks.unshift(feedback);
    await employee.save();

    // Create Notification specifically for the Employee in this workspace
    await Notification.create({
      workspaceId,
      title: 'New Performance Feedback Note',
      message: `${feedback.from} shared an official ${feedback.category} note: "${feedback.message}"`,
      category: 'appraisal_feedback',
      recipientRole: 'Employee',
      recipientEmployeeId: employee.employeeId,
      actionLink: 'feedbacks'
    });

    res.status(201).json({
      success: true,
      message: `Performance feedback delivered to ${employee.name}`,
      feedback: employee.feedbacks[0]
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getEmployeeFeedbacks = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const workspaceId = req.workspaceId;
    const employee = await findEmployee(employeeId, workspaceId);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // IDOR Protection: Regular Employees can only view their own feedback history
    if (req.user?.role === 'Employee' && employee.employeeId !== req.user.employeeId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own appraisal feedback notes.'
      });
    }

    res.json({
      success: true,
      employeeId: employee.employeeId,
      employeeName: employee.name,
      feedbacks: employee.feedbacks || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
