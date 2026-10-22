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

const router = express.Router();

router.post('/seed-demo', seedDemoEmployees);
router.post('/clear-all', clearAllEmployeesData);

router.route('/')
  .get(getEmployees)
  .post(createEmployee);

router.post('/bulk-import', bulkImportEmployees);

router.route('/:id')
  .get(getEmployeeById)
  .put(updateEmployee)
  .delete(deleteEmployee);

export default router;
