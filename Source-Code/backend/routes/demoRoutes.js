import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  startDemoSession,
  switchDemoRole,
  resetDemoWorkspace
} from '../controllers/demoController.js';
import { authenticateToken, requireDemoSession } from '../middleware/authMiddleware.js';

const router = express.Router();

const demoSessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // 60 session requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many demo session requests. Please try again in a few minutes.'
  }
});

const demoResetLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15, // max 15 resets per 5 minutes per client
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demo reset rate limit exceeded. Please wait a moment before resetting again.'
  }
});

router.post('/session', demoSessionLimiter, startDemoSession);
router.post('/switch-role', authenticateToken, requireDemoSession, switchDemoRole);
router.post('/reset', authenticateToken, requireDemoSession, demoResetLimiter, resetDemoWorkspace);

export default router;
