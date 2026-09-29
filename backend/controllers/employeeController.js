import mongoose from 'mongoose';
import Employee from '../models/Employee.js';

const findEmployee = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const emp = await Employee.findById(id);
    if (emp) return emp;
  }
  return await Employee.findOne({ employeeId: id });
};

export const getEmployees = async (req, res) => {
  try {
    const { department, category, status, search, sort = 'score-desc', page = 1, limit = 50 } = req.query;

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

    // Dynamic smart recommendations for this specific employee
    const recommendations = [];
    const { metrics } = employee;

    if (metrics.attendanceRate < 80) {
      recommendations.push({
        type: 'warning',
        title: 'Attendance Risk Detected',
        text: `Attendance is at ${metrics.attendanceRate}%. Schedule a 1-on-1 check-in to assess work-life balance or health factors.`
      });
    }

    if (metrics.taskCompletionRate < 75) {
      recommendations.push({
        type: 'improvement',
        title: 'Task Throughput Bottleneck',
        text: `Task completion rate is ${metrics.taskCompletionRate}%. Review current workload and dependencies.`
      });
    }

    if (metrics.overallScore >= 92) {
      recommendations.push({
        type: 'recognition',
        title: 'Top Tier Performer',
        text: `Overall score of ${metrics.overallScore}% qualifies for leadership mentorship and quarterly bonus nomination.`
      });
    }

    if (metrics.workEfficiency >= 90 && metrics.productivityScore >= 90) {
      recommendations.push({
        type: 'positive',
        title: 'Peak Efficiency',
        text: 'Consistently exceeding delivery expectations. Consider assigning high-impact strategic initiatives.'
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

    // Auto-generate employeeId if not supplied
    if (!data.employeeId) {
      const count = await Employee.countDocuments();
      data.employeeId = `EMP-${1000 + count + 1}`;
    }

    // Default avatar if not supplied
    if (!data.avatar) {
      data.avatar = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;
    }

    // Default monthly history if missing
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

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
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

    // Update top-level and nested metric properties
    Object.keys(req.body).forEach(key => {
      if (key === 'metrics') {
        employee.metrics = { ...employee.metrics.toObject(), ...req.body.metrics };
      } else {
        employee[key] = req.body[key];
      }
    });

    await employee.save();

    res.json({
      success: true,
      message: 'Employee updated successfully',
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
