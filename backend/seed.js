import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';
import Department from './models/Department.js';
import User from './models/User.js';
import { departmentsData, employeesData, demoUsers } from './seedData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[SEED] Starting HR Hub database initialization...');

    // Clear existing collections
    await Employee.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});

    console.log('[SEED] Purged existing collections.');

    // Seed Departments
    const insertedDepts = await Department.insertMany(departmentsData);
    console.log(`[SEED] Inserted ${insertedDepts.length} departments.`);

    // Seed Employees
    const insertedEmployees = await Employee.insertMany(employeesData);
    console.log(`[SEED] Inserted ${insertedEmployees.length} employee records with metrics.`);

    // Seed Demo Users (Save one by one so pre-save password hook hashes correctly)
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
    }
    console.log(`[SEED] Inserted ${demoUsers.length} authentication user accounts.`);

    return {
      success: true,
      departmentsCount: insertedDepts.length,
      employeesCount: insertedEmployees.length,
      usersCount: demoUsers.length
    };
  } catch (error) {
    console.error('[SEED ERROR]', error);
    throw error;
  }
};

export const clearEmployeesOnly = async () => {
  await Employee.deleteMany({});
  return { success: true, message: 'All employee records cleared' };
};

// If run directly from command line
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  import('./config/db.js').then(async ({ connectDB, closeDB }) => {
    try {
      await connectDB();
      await seedDatabase();
      console.log('[SEED] Complete.');
      await closeDB();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
