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
      const searchRegex = new RegExp(search.trim(), 'i');
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

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

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

    res.json({
      success: true,
      employee,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.employeeId) {
      const count = await Employee.countDocuments();
      data.employeeId = `EMP-${1000 + count + 1}`;
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
    if (req.body.role !== undefined && req.body.role.trim() !== '') {
      employee.role = req.body.role.trim();
    }
    if (req.body.department !== undefined && req.body.department.trim() !== '') {
      employee.department = req.body.department.trim();
    }
    if (req.body.salary !== undefined) {
      employee.salary = Number(req.body.salary);
    }
    if (req.body.status !== undefined) {
      employee.status = req.body.status;
    }
    if (req.body.location !== undefined) {
      employee.location = req.body.location.trim();
    }
    if (req.body.managerName !== undefined) {
      employee.managerName = req.body.managerName.trim();
    }
    if (req.body.workMode !== undefined) {
      employee.workMode = req.body.workMode;
    }
    if (req.body.phone !== undefined) {
      employee.phone = req.body.phone.trim();
    }
    if (req.body.experienceYears !== undefined) {
      employee.experienceYears = Number(req.body.experienceYears);
    }
    if (req.body.notes !== undefined) {
      employee.notes = req.body.notes;
    }
    if (req.body.tags !== undefined) {
      employee.tags = req.body.tags;
    }
    if (req.body.kpiData) {
      employee.kpiData = {
        ...employee.kpiData.toObject(),
        ...req.body.kpiData
      };
    }
    if (req.body.metrics) {
      employee.metrics = {
        ...employee.metrics.toObject(),
        ...req.body.metrics
      };
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
