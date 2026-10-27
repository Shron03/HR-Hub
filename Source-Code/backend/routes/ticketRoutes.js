import express from 'express';
import {
  getTickets,
  createTicket,
  updateTicketStatus,
  addTicketReply
} from '../controllers/ticketController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getTickets);
router.post('/', authenticateToken, createTicket);
router.patch('/:id/status', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), updateTicketStatus);
router.put('/:id/status', authenticateToken, authorizeRoles('HR Director', 'Engineering Manager'), updateTicketStatus);
router.post('/:id/replies', authenticateToken, addTicketReply);

export default router;
