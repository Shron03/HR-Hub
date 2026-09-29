import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  bulkImportEmployees
} from '../controllers/employeeController.js';

const router = express.Router();

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.post('/bulk-import', bulkImportEmployees);

router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
