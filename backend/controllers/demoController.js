import crypto from 'crypto';
import { signDemoToken } from '../config/jwt.js';
import { ensureWorkspaceExists, resetWorkspaceData, touchWorkspace } from '../services/workspaceService.js';
import Employee from '../models/Employee.js';

const VALID_ROLES = ['HR Director', 'Engineering Manager', 'Employee'];

const ROLE_PROFILE_MAP = {
  'HR Director': {
    name: 'Priya Sharma (HR Director)',
    department: 'Human Resources',
    initials: 'PS',
    email: 'demo-hr@hrhub.internal',
    defaultEmpId: null
  },
  'Engineering Manager': {
    name: 'Rajesh Verma (Engineering Manager)',
    department: 'Engineering',
    initials: 'RV',
    email: 'demo-mgr@hrhub.internal',
    defaultEmpId: 'EMP-1005'
  },
  'Employee': {
    name: 'Aarav Patel (Employee)',
    department: 'Engineering',
    initials: 'AP',
    email: 'demo-emp@hrhub.internal',
    defaultEmpId: 'EMP-1001'
  }
};

const isValidWorkspaceId = (id) => {
  if (typeof id !== 'string') return false;
  if (id === 'registered') return false; // Never treat registered as a demo workspace ID
  return /^demo-[a-zA-Z0-9_-]{8,64}$/.test(id);
};

export const startDemoSession = async (req, res) => {
  try {
    const requestedRole = req.body?.role;
    const role = VALID_ROLES.includes(requestedRole) ? requestedRole : 'HR Director';

    let workspaceId = req.body?.workspaceId || req.headers['x-demo-workspace-id'];
    if (!isValidWorkspaceId(workspaceId)) {
      workspaceId = `demo-${crypto.randomBytes(12).toString('hex')}`;
    }

    // Ensure baseline synthetic data exists for this visitor's workspace
    await ensureWorkspaceExists(workspaceId);

    const profile = ROLE_PROFILE_MAP[role];
    let employeeId = profile.defaultEmpId;

    if (employeeId) {
      const empExists = await Employee.findOne({ workspaceId, employeeId });
      if (!empExists) {
        // Fallback to first employee in this workspace if standard EMP-1001 was deleted
        const firstEmp = await Employee.findOne({ workspaceId });
        employeeId = firstEmp ? firstEmp.employeeId : null;
      }
    }

    const token = signDemoToken({
      workspaceId,
      role,
      employeeId,
      name: profile.name,
      email: profile.email,
      department: profile.department
    });

    res.json({
      success: true,
      token,
      workspaceId,
      user: {
        id: `demo-${role.toLowerCase().replace(/\s+/g, '-')}`,
        name: profile.name,
        email: profile.email,
        role,
        department: profile.department,
        initials: profile.initials,
        employeeId,
        workspaceId,
        isDemo: true,
        status: 'Active'
      }
    });
  } catch (error) {
    console.error('[DEMO SESSION ERROR]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const switchDemoRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid demo role. Allowed roles are: ${VALID_ROLES.join(', ')}`
      });
    }

    const workspaceId = req.workspaceId;
    await touchWorkspace(workspaceId);

    const profile = ROLE_PROFILE_MAP[role];
    let employeeId = profile.defaultEmpId;

    if (employeeId) {
      const empExists = await Employee.findOne({ workspaceId, employeeId });
      if (!empExists) {
        const firstEmp = await Employee.findOne({ workspaceId });
        employeeId = firstEmp ? firstEmp.employeeId : null;
      }
    }

    const token = signDemoToken({
      workspaceId,
      role,
      employeeId,
      name: profile.name,
      email: profile.email,
      department: profile.department
    });

    res.json({
      success: true,
      message: `Demo session switched to ${role}`,
      token,
      workspaceId,
      user: {
        id: `demo-${role.toLowerCase().replace(/\s+/g, '-')}`,
        name: profile.name,
        email: profile.email,
        role,
        department: profile.department,
        initials: profile.initials,
        employeeId,
        workspaceId,
        isDemo: true,
        status: 'Active'
      }
    });
  } catch (error) {
    console.error('[DEMO ROLE SWITCH ERROR]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetDemoWorkspace = async (req, res) => {
  try {
    const workspaceId = req.workspaceId;

    if (!workspaceId || workspaceId === 'registered') {
      return res.status(403).json({
        success: false,
        message: 'Cannot reset registered workspace'
      });
    }

    await resetWorkspaceData(workspaceId);

    const currentRole = req.user.role;
    const profile = ROLE_PROFILE_MAP[currentRole] || ROLE_PROFILE_MAP['HR Director'];

    const token = signDemoToken({
      workspaceId,
      role: currentRole,
      employeeId: profile.defaultEmpId,
      name: profile.name,
      email: profile.email,
      department: profile.department
    });

    res.json({
      success: true,
      message: 'Demo workspace successfully reset to baseline synthetic data',
      token,
      workspaceId,
      user: {
        id: `demo-${currentRole.toLowerCase().replace(/\s+/g, '-')}`,
        name: profile.name,
        email: profile.email,
        role: currentRole,
        department: profile.department,
        initials: profile.initials,
        employeeId: profile.defaultEmpId,
        workspaceId,
        isDemo: true,
        status: 'Active'
      }
    });
  } catch (error) {
    console.error('[DEMO RESET ERROR]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
