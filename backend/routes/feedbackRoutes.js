import express from 'express';
import { sendFeedback, getEmployeeFeedbacks } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', sendFeedback);
router.get('/:employeeId', getEmployeeFeedbacks);

export default router;
