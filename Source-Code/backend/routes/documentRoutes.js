import express from 'express';
import {
  getDocuments,
  createDocument,
  deleteDocument,
  recordDownload
} from '../controllers/documentController.js';

const router = express.Router();

router.get('/', getDocuments);
router.post('/', createDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/download', recordDownload);

export default router;
