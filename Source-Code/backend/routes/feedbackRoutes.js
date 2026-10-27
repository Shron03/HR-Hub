import express from 'express';
import { sendFeedback, getEmployeeFeedbacks } from '../controllers/feedbackController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), sendFeedback);
router.get('/:employeeId', authenticateToken, getEmployeeFeedbacks);

export default router;
