import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  bulkImportEmployees,
  seedDemoEmployees,
  clearAllEmployeesData
} from '../controllers/employeeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Destructive and Database Maintenance Routes (Strictly HR Director)
router.post('/seed-demo', authenticateToken, authorizeRoles('HR Director'), seedDemoEmployees);
router.post('/clear-all', authenticateToken, authorizeRoles('HR Director'), clearAllEmployeesData);

// Employee CRUD and Directory
router.route('/')
  .get(authenticateToken, getEmployees)
  .post(authenticateToken, authorizeRoles('HR Director'), createEmployee);

router.post('/bulk-import', authenticateToken, authorizeRoles('HR Director'), bulkImportEmployees);

router.route('/:id')
  .get(authenticateToken, getEmployeeById)
  .put(authenticateToken, authorizeRoles('HR Director'), updateEmployee)
  .delete(authenticateToken, authorizeRoles('HR Director'), deleteEmployee);

export default router;
