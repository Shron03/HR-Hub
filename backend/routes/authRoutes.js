import express from 'express';
import { login, demoLogin, register, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/register', register);
router.get('/me', getMe);

export default router;
