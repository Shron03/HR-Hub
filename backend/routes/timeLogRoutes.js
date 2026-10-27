import express from 'express';
import {
  getTimeLogs,
  createTimeLog,
  updateTimeLogStatus
} from '../controllers/timeLogController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getTimeLogs);
router.post('/', authenticateToken, createTimeLog);
router.patch('/:id/status', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), updateTimeLogStatus);
router.put('/:id/status', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), updateTimeLogStatus);

export default router;
