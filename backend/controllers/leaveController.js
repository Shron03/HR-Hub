import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

const findEmployee = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const emp = await Employee.findById(id);
    if (emp) return emp;
  }
  return await Employee.findOne({ employeeId: id });
};

export const submitLeaveRequest = async (req, res) => {
  try {
    const { employeeId, type, reason, startDate, endDate, days } = req.body;
    const employee = await findEmployee(employeeId);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const leave = {
      type: type || 'Casual Leave',
      reason: reason || 'Personal reasons',
      startDate,
      endDate,
      days: Number(days) || 1,
      status: 'Pending',
      appliedAt: new Date()
    };

    employee.leaveRequests.unshift(leave);
    await employee.save();

    res.status(201).json({
      success: true,
      message: 'Leave application submitted to HR successfully',
      leaveRequest: employee.leaveRequests[0],
      employeeId: employee.employeeId
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    const employees = await Employee.find({}, 'employeeId name department role leaveRequests status initials avatarBg');

    const allLeaves = [];
    employees.forEach(emp => {
      if (emp.leaveRequests && emp.leaveRequests.length > 0) {
        emp.leaveRequests.forEach(lr => {
          allLeaves.push({
            id: lr._id,
            employeeId: emp.employeeId,
            employeeName: emp.name,
            department: emp.department,
            role: emp.role,
            initials: emp.initials,
            avatarBg: emp.avatarBg,
            currentEmployeeStatus: emp.status,
            type: lr.type,
            reason: lr.reason,
            startDate: lr.startDate,
            endDate: lr.endDate,
            days: lr.days,
            status: lr.status,
            appliedAt: lr.appliedAt,
            decisionNote: lr.decisionNote
          });
        });
      }
    });

    allLeaves.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json({
      success: true,
      count: allLeaves.length,
      leaveRequests: allLeaves
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { status, decisionNote } = req.body; // 'Approved' or 'Rejected'

    // Find employee who owns this leave request
    const employee = await Employee.findOne({ 'leaveRequests._id': leaveId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    const leave = employee.leaveRequests.id(leaveId);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = status;
    if (decisionNote) leave.decisionNote = decisionNote;

    // Automatic status update if Approved
    if (status === 'Approved') {
      employee.status = 'On Leave';
    } else if (status === 'Rejected' && employee.status === 'On Leave') {
      employee.status = 'Active';
    }

    await employee.save();

    res.json({
      success: true,
      message: `Leave request marked as ${status}. Employee status updated to ${employee.status}.`,
      leave,
      employeeStatus: employee.status
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const employees = await Employee.find({}, 'employeeId name department status leaveRequests updatedAt');
    const notifications = [];

    employees.forEach(emp => {
      // Pending leaves generate notifications for HR
      emp.leaveRequests?.forEach(lr => {
        if (lr.status === 'Pending') {
          notifications.push({
            id: `notif-leave-${lr._id}`,
            type: 'leave_request',
            title: 'New Leave Request',
            message: `${emp.name} (${emp.department}) requested ${lr.days} day(s) ${lr.type}: "${lr.reason}"`,
            timestamp: lr.appliedAt,
            actionRequired: true,
            employeeId: emp.employeeId
          });
        }
      });

      // On Leave status alert
      if (emp.status === 'On Leave') {
        notifications.push({
          id: `notif-status-${emp.employeeId}`,
          type: 'status_change',
          title: 'Employee On Leave',
          message: `${emp.name} is currently On Leave (${emp.department})`,
          timestamp: emp.updatedAt,
          actionRequired: false,
          employeeId: emp.employeeId
        });
      }
    });

    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      count: notifications.length,
      notifications: notifications.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
