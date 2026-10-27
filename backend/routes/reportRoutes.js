import express from 'express';
import { getMonthlyReportData, resetAndSeedDatabase } from '../controllers/reportController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/monthly', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), getMonthlyReportData);
router.post('/seed/reset', authenticateToken, authorizeRoles('HR Director'), resetAndSeedDatabase);

export default router;
