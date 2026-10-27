import express from 'express';
import { getInsights } from '../controllers/insightController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getInsights);

export default router;
