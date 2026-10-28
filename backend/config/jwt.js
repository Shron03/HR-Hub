import 'dotenv/config';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

let secret = process.env.JWT_SECRET;

if (!secret || secret.trim() === '') {
  // Generate a cryptographically secure random 256-bit secret per process
  secret = crypto.randomBytes(32).toString('hex');
  console.warn('[SECURITY NOTICE] JWT_SECRET environment variable is not set. Generated a cryptographically secure 256-bit process secret for this instance. Configure JWT_SECRET in your dashboard to persist sessions across redeploys.');
}

export const JWT_SECRET = secret;

export const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const signDemoToken = ({ workspaceId, role, employeeId, name, email, department }) => {
  const roleNameMap = {
    'HR Director': 'Priya Sharma (Demo)',
    'Engineering Manager': 'Rajesh Verma (Demo)',
    'Employee': 'Aarav Patel (Demo)'
  };
  const roleDeptMap = {
    'HR Director': 'Human Resources',
    'Engineering Manager': 'Engineering',
    'Employee': 'Engineering'
  };
  const roleEmpIdMap = {
    'HR Director': null,
    'Engineering Manager': 'EMP-1005',
    'Employee': 'EMP-1001'
  };

  const resolvedRole = ['HR Director', 'Engineering Manager', 'Employee'].includes(role) ? role : 'HR Director';
  const resolvedName = name || roleNameMap[resolvedRole];
  const resolvedDept = department || roleDeptMap[resolvedRole];
  const resolvedEmpId = employeeId !== undefined ? employeeId : roleEmpIdMap[resolvedRole];
  const resolvedEmail = email || `demo-${resolvedRole.toLowerCase().replace(/\s+/g, '-')}@hrhub.internal`;

  return generateToken({
    type: 'demo',
    workspaceId,
    role: resolvedRole,
    employeeId: resolvedEmpId,
    name: resolvedName,
    email: resolvedEmail,
    department: resolvedDept
  });
};

export const signRegisteredToken = ({ id, role, employeeId, name, email, department }) => {
  return generateToken({
    type: 'registered',
    workspaceId: 'registered',
    id,
    role,
    employeeId: employeeId || null,
    name,
    email,
    department
  });
};
