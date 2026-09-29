import express from 'express';
import {
  updateEmployeeMetrics,
  addTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/performanceController.js';

const router = express.Router();

router.put('/:id/metrics', updateEmployeeMetrics);
router.post('/:id/tasks', addTask);
router.put('/:employeeId/tasks/:taskId', updateTaskStatus);
router.delete('/:employeeId/tasks/:taskId', deleteTask);

export default router;
