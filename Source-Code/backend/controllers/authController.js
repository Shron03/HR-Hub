import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Notification from '../models/Notification.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hr_hub_super_secret_jwt_key_2026';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

const getInitials = (name) => {
  if (!name) return 'HR';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid corporate email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid corporate email or password' });
    }

    // Check approval status
    if (user.approvalStatus === 'Pending') {
      return res.status(403).json({
        success: false,
        isPending: true,
        message: 'Account registration is pending authorization by the HR Director. You will be granted system access once approved.'
      });
    }

    if (user.approvalStatus === 'Rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your registration request was declined by the administrator.'
      });
    }

    const token = generateToken(user._id, user.role);

    // Look up associated employee profile
    const emp = await Employee.findOne({ email: user.email.toLowerCase() });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        initials: getInitials(user.name),
        employeeId: emp ? emp.employeeId : (user.role === 'Employee' ? 'EMP-1001' : null),
        status: emp?.status || 'Active'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const demoLogin = async (req, res) => {
  try {
    const { role } = req.body;
    const targetRole = role || 'HR Director';

    let user = await User.findOne({ role: targetRole });
    if (!user) {
      user = await User.findOne();
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No demo users found. Please seed the database.' });
    }

    const token = generateToken(user._id, user.role);
    const emp = await Employee.findOne({ email: user.email.toLowerCase() }) ||
      (user.role === 'Employee' ? await Employee.findOne({ employeeId: 'EMP-1001' }) : null);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        initials: getInitials(user.name),
        employeeId: emp ? emp.employeeId : (user.role === 'Employee' ? 'EMP-1001' : null),
        status: emp?.status || 'Active'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account already exists with this email address' });
    }

    // New registration defaults to Pending HR Approval
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'Employee',
      department: department || 'Engineering',
      isApproved: false,
      approvalStatus: 'Pending'
    });

    // Create Notification for HR Director
    await Notification.create({
      title: 'New Account Registration Pending Approval',
      message: `${name} (${role || 'Employee'}, ${department || 'Engineering'}) has registered and is awaiting authorization.`,
      category: 'registration',
      recipientRole: 'HR Director',
      actionLink: 'employees'
    });

    res.status(201).json({
      success: true,
      pendingApproval: true,
      isPendingApproval: true,
      message: 'Account registration submitted successfully. Your profile is queued for HR Director authorization.',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        approvalStatus: 'Pending'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingRegistrations = async (req, res) => {
  try {
    const pendingUsers = await User.find({ approvalStatus: 'Pending' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingUsers.length,
      registrations: pendingUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    user.isApproved = true;
    user.approvalStatus = 'Approved';
    await user.save();

    // Check if an Employee record already exists for this email
    let emp = await Employee.findOne({ email: user.email.toLowerCase() });
    if (!emp) {
      const count = await Employee.countDocuments();
      const employeeId = `EMP-${1000 + count + 1}`;

      emp = new Employee({
        employeeId,
        name: user.name,
        email: user.email.toLowerCase(),
        department: user.department,
        role: user.role === 'Employee' ? 'Associate Engineer' : user.role,
        salary: 850000,
        status: 'Active',
        location: 'Bengaluru, India',
        workMode: 'Hybrid',
        kpiData: {
          tasksGiven: 20,
          tasksCompleted: 18,
          reviewScore: 8.5,
          attendanceRate: 95
        }
      });
      await emp.save();
    }

    // Create Notification
    await Notification.create({
      title: 'Registration Approved',
      message: `${user.name} has been approved and enrolled as ${emp.role} (${emp.employeeId}).`,
      category: 'registration',
      recipientRole: 'HR Director'
    });

    res.json({
      success: true,
      message: `Registration for ${user.name} approved. Employee profile ${emp.employeeId} created.`,
      employee: emp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    user.isApproved = false;
    user.approvalStatus = 'Rejected';
    await user.save();

    res.json({
      success: true,
      message: `Registration for ${user.name} was rejected.`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const emp = await Employee.findOne({ email: user.email.toLowerCase() });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        initials: getInitials(user.name),
        employeeId: emp ? emp.employeeId : (user.role === 'Employee' ? 'EMP-1001' : null),
        status: emp?.status || 'Active'
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
