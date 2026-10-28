import { verifyToken } from '../config/jwt.js';

/**
 * Middleware: Verify JWT Bearer token and populate req.user, req.workspaceId, and req.isDemo
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No authorization token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.trim() === '') {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Bearer token missing.'
    });
  }

  try {
    const decoded = verifyToken(token);
    const isDemo = decoded.type === 'demo';
    const workspaceId = decoded.workspaceId || (isDemo ? decoded.workspaceId : 'registered');

    req.user = {
      id: decoded.id || decoded.userId || decoded.employeeId || 'demo-user',
      type: decoded.type || 'registered',
      workspaceId,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
      department: decoded.department,
      employeeId: decoded.employeeId || null,
      isDemo
    };
    req.workspaceId = workspaceId;
    req.isDemo = isDemo;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Authentication session expired. Please log in again.',
        expired: true
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed authentication token.'
    });
  }
};

/**
 * Middleware: Enforce Role-Based Access Control
 * @param  {...string} allowedRoles Roles authorized to access this endpoint
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization check.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Operation requires one of the following roles: ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
};

/**
 * Middleware: Allow access if caller has one of allowedRoles OR matches target employee ID
 * @param {string} paramKey - URL parameter containing the employeeId or userId (default 'id' or 'employeeId')
 * @param  {...string} allowedRoles - Privileged roles permitted access regardless of identity
 */
export const requireSelfOrRoles = (paramKey, ...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization check.'
      });
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    const targetId = req.params[paramKey] || req.body[paramKey];
    const isSelf = (targetId && (targetId === req.user.employeeId || targetId === req.user.id));

    if (isSelf) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: You are only authorized to access your own employee records.'
    });
  };
};

/**
 * Middleware: Require registered user account; blocks demo sessions from sensitive real-user governance
 */
export const requireRegisteredUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.isDemo || req.user.type !== 'registered') {
    return res.status(403).json({
      success: false,
      message: 'Access restricted to registered accounts. Demo sessions cannot perform administrative user governance.'
    });
  }

  next();
};

/**
 * Middleware: Require active demo session; blocks registered users from tampering with demo session controls
 */
export const requireDemoSession = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (!req.user.isDemo || req.user.workspaceId === 'registered') {
    return res.status(403).json({
      success: false,
      message: 'This operation is reserved for demo sessions.'
    });
  }

  next();
};
