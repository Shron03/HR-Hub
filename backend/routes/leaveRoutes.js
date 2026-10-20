import express from 'express';
import {
  submitLeaveRequest,
  getAllLeaveRequests,
  updateLeaveStatus,
  getNotifications
} from '../controllers/leaveController.js';

const router = express.Router();

router.get('/notifications', getNotifications);
router.get('/', getAllLeaveRequests);
router.post('/', submitLeaveRequest);
router.put('/:leaveId/status', updateLeaveStatus);
router.put('/:leaveId', updateLeaveStatus);

export default router;
