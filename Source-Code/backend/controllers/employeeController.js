import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { seedDatabase, clearEmployeesOnly } from '../seed.js';

const findEmployee = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const emp = await Employee.findById(id);
    if (emp) return emp;
  }
  return await Employee.findOne({ employeeId: id });
};

export const evaluatePresence = (emp) => {
  const todayStr = new Date().toISOString().split('T')[0];
  let presenceStatus = `Active (${emp.workMode || 'Hybrid'})`;
  let isAbsence = false;
  let activeLeave = null;

  if (Array.isArray(emp.leaveRequests)) {
    activeLeave = emp.leaveRequests.find(lr => {
      if (lr.status !== 'Approved') return false;
      const start = lr.startDate ? lr.startDate.substring(0, 10) : '';
      const end = lr.endDate ? lr.endDate.substring(0, 10) : '';
      return start && end && start <= todayStr && todayStr <= end;
    });

    if (activeLeave) {
      if (activeLeave.type === 'Work From Home') {
        presenceStatus = 'Work From Home (Remote)';
        isAbsence = false;
      } else {
        presenceStatus = `On Leave (${activeLeave.type})`;
        isAbsence = true;
      }
    }
  }

  if (!activeLeave && (emp.status === 'Absent' || emp.metrics?.attendanceRate === 0)) {
    presenceStatus = 'Absent';
    isAbsence = true;
  }

  return { presenceStatus, isAbsence, activeLeave };
};

export const seedDemoEmployees = async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json({
      success: true,
      message: 'Demo dataset of 15 employees loaded successfully',
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearAllEmployeesData = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DESTRUCTIVE_OPERATIONS !== 'true') {
      return res.status(403).json({
        success: false,
        message: 'Destructive database purge operations are disabled in production environment.'
      });
    }

    const result = await clearEmployeesOnly();
    res.json({
      success: true,
      message: 'All employee records removed. System is in empty state.',
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const { department, category, status, search, sort = 'score-desc', page = 1, limit = 100 } = req.query;

    const query = {};

    if (department && department !== 'All') {
      query.department = department;
    }

    if (category && category !== 'All') {
      query.performanceCategory = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      // Escape special regex characters to prevent ReDoS
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(safeSearch, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { role: searchRegex },
        { employeeId: searchRegex }
      ];
    }

    let sortOptions = {};
    if (sort === 'score-desc') sortOptions = { 'metrics.overallScore': -1 };
    else if (sort === 'score-asc') sortOptions = { 'metrics.overallScore': 1 };
    else if (sort === 'name-asc') sortOptions = { name: 1 };
    else if (sort === 'attendance-desc') sortOptions = { 'metrics.attendanceRate': -1 };
    else if (sort === 'tasks-desc') sortOptions = { 'metrics.taskCompletionRate': -1 };
    else sortOptions = { createdAt: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 100));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Employee.countDocuments(query);
    const rawEmployees = await Employee.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const isRegularEmployee = req.user?.role === 'Employee';

    const employees = rawEmployees.map(emp => {
      const obj = emp.toObject();
      const presence = evaluatePresence(emp);
      obj.presenceStatus = presence.presenceStatus;
      if (presence.isAbsence && presence.activeLeave) {
        obj.status = 'On Leave';
      } else if (presence.isAbsence && presence.presenceStatus === 'Absent') {
        obj.status = 'Absent';
      }

      // Privacy: Redact sensitive compensation details of other colleagues for regular employees
      if (isRegularEmployee && obj.employeeId !== req.user.employeeId) {
        delete obj.salary;
        delete obj.compensation;
      }

      return obj;
    });

    res.json({
      success: true,
      count: employees.length,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      employees
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await findEmployee(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const recommendations = [];
    const { metrics } = employee;

    if (metrics?.attendanceRate < 80) {
      recommendations.push({
        type: 'warning',
        title: 'Attendance Risk Detected',
        text: `Attendance is at ${metrics.attendanceRate}%. Schedule a consultation to review presence compliance.`
      });
    }

    if (metrics?.taskCompletionRate < 75) {
      recommendations.push({
        type: 'improvement',
        title: 'Deliverable Throughput Delay',
        text: `Task completion rate is ${metrics.taskCompletionRate}%. Review sprint scope and dependency blockers.`
      });
    }

    if (metrics?.overallScore >= 92) {
      recommendations.push({
        type: 'recognition',
        title: 'Top Tier Performer',
        text: `Composite score of ${metrics.overallScore}% qualifies for leadership succession nomination and merit appraisal.`
      });
    }

    if (metrics?.workEfficiency >= 90 && metrics?.productivityScore >= 90) {
      recommendations.push({
        type: 'positive',
        title: 'High Velocity Contributor',
        text: 'Consistently exceeding delivery expectations. Recommended for strategic project ownership.'
      });
    }

    const empObj = employee.toObject();
    // Privacy: Redact sensitive compensation if viewing peer profile as regular employee
    if (req.user?.role === 'Employee' && empObj.employeeId !== req.user.employeeId) {
      delete empObj.salary;
      delete empObj.compensation;
    }

    res.json({
      success: true,
      employee: empObj,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.name || !data.email) {
      return res.status(400).json({ success: false, message: 'Name and email are required fields.' });
    }

    if (!data.employeeId) {
      const count = await Employee.countDocuments();
      data.employeeId = `EMP-${1000 + count + 1}`;
    }

    if (data.salary !== undefined) {
      data.salary = Math.max(0, Number(data.salary) || 0);
    }

    if (!data.monthlyHistory || data.monthlyHistory.length === 0) {
      const score = data.metrics?.overallScore || 85;
      data.monthlyHistory = [
        { month: 'Jul', attendance: 90, productivity: 85, tasksCompleted: 8, overallScore: score - 2 },
        { month: 'Aug', attendance: 92, productivity: 86, tasksCompleted: 9, overallScore: score - 1 },
        { month: 'Sep', attendance: 88, productivity: 87, tasksCompleted: 8, overallScore: score },
        { month: 'Oct', attendance: 94, productivity: 88, tasksCompleted: 10, overallScore: score + 1 },
        { month: 'Nov', attendance: 91, productivity: 89, tasksCompleted: 9, overallScore: score },
        { month: 'Dec', attendance: 93, productivity: 90, tasksCompleted: 11, overallScore: score + 1 }
      ];
    }

    const employee = new Employee(data);
    await employee.save();

    // Create user account if not existing
    const existingUser = await User.findOne({ email: employee.email.toLowerCase() });
    if (!existingUser) {
      await User.create({
        name: employee.name,
        email: employee.email.toLowerCase(),
        password: 'password123',
        role: employee.role.includes('Director') ? 'HR Director' : employee.role.includes('Manager') ? 'Engineering Manager' : 'Employee',
        department: employee.department,
        isApproved: true,
        approvalStatus: 'Approved'
      });
    }

    // Create Notification
    await Notification.create({
      title: 'New Employee Profile Created',
      message: `${employee.name} (${employee.role}, ${employee.department}) was added to the organization roster (${employee.employeeId}).`,
      category: 'system',
      recipientRole: 'HR Director'
    });

    res.status(201).json({
      success: true,
      message: 'Employee record created successfully',
      employee
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await findEmployee(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Authorized HR edits: Role, Department, Salary, Status, Location, Manager, WorkMode, Phone, Notes, KPI
    if (req.body.role !== undefined && typeof req.body.role === 'string' && req.body.role.trim() !== '') {
      employee.role = req.body.role.trim();
    }
    if (req.body.department !== undefined && typeof req.body.department === 'string' && req.body.department.trim() !== '') {
      employee.department = req.body.department.trim();
    }
    if (req.body.salary !== undefined) {
      employee.salary = Math.max(0, Number(req.body.salary) || 0);
    }
    if (req.body.status !== undefined && ['Active', 'On Leave', 'Absent', 'Probation'].includes(req.body.status)) {
      employee.status = req.body.status;
    }
    if (req.body.location !== undefined) {
      employee.location = String(req.body.location).trim();
    }
    if (req.body.managerName !== undefined) {
      employee.managerName = String(req.body.managerName).trim();
    }
    if (req.body.workMode !== undefined && ['Hybrid', 'Remote', 'On-Site'].includes(req.body.workMode)) {
      employee.workMode = req.body.workMode;
    }
    if (req.body.phone !== undefined) {
      employee.phone = String(req.body.phone).trim();
    }
    if (req.body.experienceYears !== undefined) {
      employee.experienceYears = Math.max(0, Number(req.body.experienceYears) || 0);
    }
    if (req.body.notes !== undefined) {
      employee.notes = String(req.body.notes);
    }
    if (req.body.tags !== undefined && Array.isArray(req.body.tags)) {
      employee.tags = req.body.tags.map(t => String(t).trim());
    }
    if (req.body.kpiData && typeof req.body.kpiData === 'object') {
      employee.kpiData = {
        ...employee.kpiData.toObject(),
        ...req.body.kpiData
      };
    }
    if (req.body.metrics && typeof req.body.metrics === 'object') {
      employee.metrics = {
        ...employee.metrics.toObject(),
        ...req.body.metrics
      };
    }
    if (req.body.compensation && typeof req.body.compensation === 'object') {
      employee.compensation = {
        ...(employee.compensation ? employee.compensation.toObject() : {}),
        ...req.body.compensation
      };
    }
    if (req.body.designationChange && typeof req.body.designationChange === 'object') {
      if (!Array.isArray(employee.designationHistory)) {
        employee.designationHistory = [];
      }
      employee.designationHistory.unshift(req.body.designationChange);
    }

    await employee.save();

    res.json({
      success: true,
      message: `Employee ${employee.name} updated successfully`,
      employee
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await findEmployee(id);

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    await Employee.findByIdAndDelete(employee._id);

    res.json({
      success: true,
      message: 'Employee deleted successfully',
      employeeId: employee.employeeId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkImportEmployees = async (req, res) => {
  try {
    const { employees } = req.body;
    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide an array of employee objects' });
    }

    const inserted = await Employee.insertMany(employees);
    res.status(201).json({
      success: true,
      message: `Successfully imported ${inserted.length} employees`,
      count: inserted.length
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
