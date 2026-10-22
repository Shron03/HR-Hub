import express from 'express';
import { getMonthlyReportData, resetAndSeedDatabase } from '../controllers/reportController.js';

const router = express.Router();

router.get('/monthly', getMonthlyReportData);
router.post('/seed/reset', resetAndSeedDatabase);

export default router;
