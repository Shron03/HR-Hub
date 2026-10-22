import express from 'express';
import {
  submitLeaveRequest,
  getAllLeaveRequests,
  updateLeaveStatus,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../controllers/leaveController.js';

const router = express.Router();

router.get('/notifications', getNotifications);
router.post('/notifications/read-all', markAllNotificationsRead);
router.post('/notifications/:id/read', markNotificationRead);

router.get('/', getAllLeaveRequests);
router.post('/', submitLeaveRequest);
router.put('/:leaveId/status', updateLeaveStatus);
router.patch('/:leaveId/status', updateLeaveStatus);
router.put('/:leaveId', updateLeaveStatus);
router.patch('/:leaveId', updateLeaveStatus);

export default router;
