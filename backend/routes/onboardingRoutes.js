import express from 'express';
import {
  getOnboardingCases,
  createOnboardingCase,
  toggleChecklistTask,
  updateCaseStatus
} from '../controllers/onboardingController.js';

const router = express.Router();

router.get('/', getOnboardingCases);
router.post('/', createOnboardingCase);
router.patch('/:id/tasks/:taskId/toggle', toggleChecklistTask);
router.put('/:id/tasks/:taskId/toggle', toggleChecklistTask);
router.patch('/:id/status', updateCaseStatus);
router.put('/:id/status', updateCaseStatus);

export default router;
