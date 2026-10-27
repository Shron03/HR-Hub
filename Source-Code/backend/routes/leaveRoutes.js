import express from 'express';
import {
  submitLeaveRequest,
  getAllLeaveRequests,
  updateLeaveStatus,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../controllers/leaveController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Notifications
router.get('/notifications', authenticateToken, getNotifications);
router.post('/notifications/read-all', authenticateToken, markAllNotificationsRead);
router.post('/notifications/:id/read', authenticateToken, markNotificationRead);

// Leave Requests
router.get('/', authenticateToken, getAllLeaveRequests);
router.post('/', authenticateToken, submitLeaveRequest);

// Leave Decisions: Strictly HR Director
router.put('/:leaveId/status', authenticateToken, authorizeRoles('HR Director'), updateLeaveStatus);
router.patch('/:leaveId/status', authenticateToken, authorizeRoles('HR Director'), updateLeaveStatus);
router.put('/:leaveId', authenticateToken, authorizeRoles('HR Director'), updateLeaveStatus);
router.patch('/:leaveId', authenticateToken, authorizeRoles('HR Director'), updateLeaveStatus);

export default router;
