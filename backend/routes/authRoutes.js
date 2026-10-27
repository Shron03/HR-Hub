import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  login,
  demoLogin,
  register,
  getMe,
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration
} from '../controllers/authController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict rate limiting for authentication endpoints to mitigate brute force & credential stuffing
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP address. Please try again after 15 minutes.'
  }
});

const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Registration rate limit exceeded from this IP address. Please try again later.'
  }
});

router.post('/login', authLimiter, login);
router.post('/demo-login', authLimiter, demoLogin);
router.post('/register', registrationLimiter, register);
router.get('/me', authenticateToken, getMe);

// Privileged HR Director administrative routes
router.get('/registrations/pending', authenticateToken, authorizeRoles('HR Director'), getPendingRegistrations);
router.put('/registrations/:id/approve', authenticateToken, authorizeRoles('HR Director'), approveRegistration);
router.post('/registrations/:id/approve', authenticateToken, authorizeRoles('HR Director'), approveRegistration);
router.put('/registrations/:id/reject', authenticateToken, authorizeRoles('HR Director'), rejectRegistration);
router.post('/registrations/:id/reject', authenticateToken, authorizeRoles('HR Director'), rejectRegistration);

export default router;
