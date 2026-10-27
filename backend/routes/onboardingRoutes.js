import express from 'express';
import {
  getOnboardingCases,
  createOnboardingCase,
  toggleChecklistTask,
  updateCaseStatus
} from '../controllers/onboardingController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), getOnboardingCases);
router.post('/', authenticateToken, authorizeRoles('HR Director'), createOnboardingCase);
router.patch('/:id/tasks/:taskId/toggle', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), toggleChecklistTask);
router.put('/:id/tasks/:taskId/toggle', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), toggleChecklistTask);
router.patch('/:id/status', authenticateToken, authorizeRoles('HR Director'), updateCaseStatus);
router.put('/:id/status', authenticateToken, authorizeRoles('HR Director'), updateCaseStatus);

export default router;
