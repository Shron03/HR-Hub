import express from 'express';
import {
  getDocuments,
  createDocument,
  deleteDocument,
  recordDownload
} from '../controllers/documentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getDocuments);
router.post('/', authenticateToken, authorizeRoles('HR Director'), createDocument);
router.delete('/:id', authenticateToken, authorizeRoles('HR Director'), deleteDocument);
router.post('/:id/download', authenticateToken, recordDownload);

export default router;
