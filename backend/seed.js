import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';
import Department from './models/Department.js';
import User from './models/User.js';
import Notification from './models/Notification.js';
import { departmentsData, employeesData, demoUsers } from './seedData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[SEED] Starting HR Hub database initialization...');

    // Clear existing collections
    await Employee.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});
    await Notification.deleteMany({});

    console.log('[SEED] Purged existing collections.');

    // Seed Departments
    const insertedDepts = await Department.insertMany(departmentsData);
    console.log(`[SEED] Inserted ${insertedDepts.length} departments.`);

    // Seed Employees
    const insertedEmployees = await Employee.insertMany(employeesData);
    console.log(`[SEED] Inserted ${insertedEmployees.length} employee records with metrics.`);

    // Seed Demo Users (Save one by one so pre-save password hook hashes correctly)
    for (const userData of demoUsers) {
      const user = new User({
        ...userData,
        isApproved: true,
        approvalStatus: 'Approved'
      });
      await user.save();
    }
    console.log(`[SEED] Inserted ${demoUsers.length} authentication user accounts.`);

    // Seed realistic active notifications within last 3 days
    const now = Date.now();
    const oneDayAgo = new Date(now - 22 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now - 46 * 60 * 60 * 1000);

    const initialNotifications = [
      {
        title: 'New Time Off Application Submitted',
        message: 'Aarav Patel (Engineering) requested 2 day(s) of Casual Leave for family event.',
        category: 'leave_request',
        recipientRole: 'HR Director',
        actionLink: 'leaves',
        createdAt: oneDayAgo
      },
      {
        title: 'Workforce Attendance Warning',
        message: 'Devika Nair (Product) attendance compliance dipped to 78% this cycle.',
        category: 'system',
        recipientRole: 'HR Director',
        actionLink: 'insights',
        createdAt: twoDaysAgo
      },
      {
        title: 'Deliverable Velocity Milestone',
        message: 'Engineering sprint achieved 94% task throughput completion on time.',
        category: 'kpi_update',
        recipientRole: 'Engineering Manager',
        actionLink: 'dashboard',
        createdAt: oneDayAgo
      },
      {
        title: 'Performance Appraisal Completed',
        message: 'Priya Sharma (HR Director) registered an Excellence Recognition appraisal note for your Q3 deliverables.',
        category: 'appraisal_feedback',
        recipientRole: 'Employee',
        recipientEmployeeId: 'EMP-1001',
        actionLink: 'feedbacks',
        createdAt: oneDayAgo
      }
    ];

    await Notification.insertMany(initialNotifications);
    console.log(`[SEED] Inserted ${initialNotifications.length} active notifications within 3-day window.`);

    return {
      success: true,
      departmentsCount: insertedDepts.length,
      employeesCount: insertedEmployees.length,
      usersCount: demoUsers.length,
      notificationsCount: initialNotifications.length
    };
  } catch (error) {
    console.error('[SEED ERROR]', error);
    throw error;
  }
};

export const clearEmployeesOnly = async () => {
  await Employee.deleteMany({});
  await Notification.deleteMany({});
  return { success: true, message: 'All employee records and notifications cleared' };
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
