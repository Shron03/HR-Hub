import express from 'express';
import {
  getTimeLogs,
  createTimeLog,
  updateTimeLogStatus
} from '../controllers/timeLogController.js';

const router = express.Router();

router.get('/', getTimeLogs);
router.post('/', createTimeLog);
router.patch('/:id/status', updateTimeLogStatus);
router.put('/:id/status', updateTimeLogStatus);

export default router;
