import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';

const findEmployee = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const emp = await Employee.findById(id);
    if (emp) return emp;
  }
  return await Employee.findOne({ employeeId: id });
};

export const sendFeedback = async (req, res) => {
  try {
    const { employeeId, message, category, from } = req.body;
    const employee = await findEmployee(employeeId);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Feedback message cannot be blank' });
    }

    const feedback = {
      from: from || 'Priya Sharma (HR Director)',
      message: message.trim(),
      category: category || 'Recognition',
      date: new Date()
    };

    if (!employee.feedbacks) employee.feedbacks = [];
    employee.feedbacks.unshift(feedback);
    await employee.save();

    // Create Notification specifically for the Employee
    await Notification.create({
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
    const employee = await findEmployee(employeeId);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
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
