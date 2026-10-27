import express from 'express';
import {
  updateEmployeeMetrics,
  addTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/performanceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.put('/:id/metrics', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), updateEmployeeMetrics);
router.post('/:id/tasks', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), addTask);
router.put('/:employeeId/tasks/:taskId', authenticateToken, updateTaskStatus);
router.delete('/:employeeId/tasks/:taskId', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), deleteTask);

export default router;
