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

export const submitLeaveRequest = async (req, res) => {
  try {
    const { type, reason, startDate, endDate, days } = req.body;
    let targetEmployeeId = req.body.employeeId;

    // Defensive IDOR Prevention: If caller is a regular Employee, force target to their own employeeId
    if (req.user?.role === 'Employee') {
      targetEmployeeId = req.user.employeeId;
    }

    if (!targetEmployeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID is required.' });
    }

    const employee = await findEmployee(targetEmployeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const leave = {
      type: type || 'Casual Leave',
      reason: reason || 'Personal absence',
      startDate,
      endDate,
      days: Number(days) || 1,
      status: 'Pending',
      appliedAt: new Date()
    };

    employee.leaveRequests.unshift(leave);
    await employee.save();

    // Create Notification for HR Director
    await Notification.create({
      title: 'New Time Off Application Submitted',
      message: `${employee.name} (${employee.department}) requested ${leave.days} day(s) of ${leave.type} (${startDate} to ${endDate}): "${reason}"`,
      category: 'leave_request',
      recipientRole: 'HR Director',
      actionLink: 'leaves'
    });

    res.status(201).json({
      success: true,
      message: 'Time off application successfully routed to HR Director for review',
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
    const isEmployee = req.user?.role === 'Employee';

    employees.forEach(emp => {
      // Defensive IDOR Prevention: Employees can only see their own leave requests
      if (isEmployee && emp.employeeId !== req.user.employeeId) {
        return;
      }

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
    const { status, decisionNote } = req.body;

    // Server-Side Role Enforcement: Only HR Director is authorized to decide leave requests
    if (req.user?.role !== 'HR Director') {
      return res.status(403).json({
        success: false,
        message: 'Leave authorization is restricted exclusively to Human Resources leadership.'
      });
    }

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid leave status supplied.' });
    }

    const employee = await Employee.findOne({ 'leaveRequests._id': leaveId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Time off record not found' });
    }

    const leave = employee.leaveRequests.id(leaveId);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Time off record not found' });
    }

    leave.status = status;
    if (decisionNote) leave.decisionNote = String(decisionNote).trim();

    // Automatic status update if Approved
    if (status === 'Approved') {
      employee.status = 'On Leave';
    } else if (status === 'Rejected' && employee.status === 'On Leave') {
      employee.status = 'Active';
    }

    await employee.save();

    // Create Notification specifically for the Employee
    await Notification.create({
      title: `Time Off Request ${status}`,
      message: `Your ${leave.days}-day ${leave.type} (${leave.startDate} to ${leave.endDate}) has been ${status.toLowerCase()} by HR Director.${decisionNote ? ` Note: "${decisionNote}"` : ''}`,
      category: 'leave_decision',
      recipientRole: 'Employee',
      recipientEmployeeId: employee.employeeId,
      actionLink: 'leaves'
    });

    res.json({
      success: true,
      message: `Time off request marked as ${status}. Employee presence updated to "${employee.status}".`,
      leave,
      employeeStatus: employee.status
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    // Derive role and employee identity strictly from verified token
    const role = req.user?.role || 'Employee';
    const employeeId = req.user?.employeeId || null;
    const userEmail = req.user?.email || '';

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    // Auto-prune notifications older than 3 days
    await Notification.deleteMany({ createdAt: { $lt: threeDaysAgo } });

    // Build role and employee-specific query
    const queryConditions = [
      { recipientRole: 'ALL' }
    ];

    if (role) {
      queryConditions.push({ recipientRole: role, recipientEmployeeId: null });
    }

    if (employeeId) {
      queryConditions.push({ recipientEmployeeId: employeeId });
    }

    const query = {
      createdAt: { $gte: threeDaysAgo },
      $or: queryConditions
    };

    const notifs = await Notification.find(query).sort({ createdAt: -1 });

    const identifier = userEmail || employeeId || role;
    const formatted = notifs.map(n => ({
      id: n._id,
      title: n.title,
      message: n.message,
      category: n.category,
      recipientRole: n.recipientRole,
      recipientEmployeeId: n.recipientEmployeeId,
      actionLink: n.actionLink,
      createdAt: n.createdAt,
      read: n.readBy?.includes(identifier) || false
    }));

    const unreadCount = formatted.filter(n => !n.read).length;

    res.json({
      success: true,
      count: formatted.length,
      unreadCount,
      notifications: formatted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userIdentifier = req.user?.email || req.user?.employeeId || req.user?.role;

    const notif = await Notification.findById(id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (userIdentifier && !notif.readBy.includes(userIdentifier)) {
      notif.readBy.push(userIdentifier);
      await notif.save();
    }

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const userIdentifier = req.user?.email || req.user?.employeeId || req.user?.role;
    const role = req.user?.role || 'ALL';
    const employeeId = req.user?.employeeId || null;

    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const query = {
      createdAt: { $gte: threeDaysAgo },
      $or: [
        { recipientRole: 'ALL' },
        { recipientRole: role },
        { recipientEmployeeId: employeeId }
      ]
    };

    await Notification.updateMany(query, {
      $addToSet: { readBy: userIdentifier }
    });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
