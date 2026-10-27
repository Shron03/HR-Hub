import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticateToken, getDashboardAnalytics);

export default router;
