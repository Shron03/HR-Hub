import express from 'express';
import {
  getTickets,
  createTicket,
  updateTicketStatus,
  addTicketReply
} from '../controllers/ticketController.js';

const router = express.Router();

router.get('/', getTickets);
router.post('/', createTicket);
router.patch('/:id/status', updateTicketStatus);
router.put('/:id/status', updateTicketStatus);
router.post('/:id/replies', addTicketReply);

export default router;
