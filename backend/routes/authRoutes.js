import express from 'express';
import {
  login,
  demoLogin,
  register,
  getMe,
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/register', register);
router.get('/me', getMe);

router.get('/registrations/pending', getPendingRegistrations);
router.put('/registrations/:id/approve', approveRegistration);
router.post('/registrations/:id/approve', approveRegistration);
router.put('/registrations/:id/reject', rejectRegistration);
router.post('/registrations/:id/reject', rejectRegistration);

export default router;
