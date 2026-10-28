import 'dotenv/config';
import mongoose from 'mongoose';
import Employee from './models/Employee.js';
import Department from './models/Department.js';
import User from './models/User.js';
import Notification from './models/Notification.js';
import Ticket from './models/Ticket.js';
import OnboardingCase from './models/OnboardingCase.js';
import Document from './models/Document.js';
import TimeLog from './models/TimeLog.js';
import DemoWorkspace from './models/DemoWorkspace.js';
import { demoUsers } from './seedData.js';
import { seedWorkspaceData } from './services/workspaceService.js';

export const seedDatabase = async () => {
  try {
    console.log('[SEED] Starting HR Hub database initialization...');

    // Clear existing collections
    await Employee.deleteMany({});
    await Department.deleteMany({});
    await User.deleteMany({});
    await Notification.deleteMany({});
    await Ticket.deleteMany({});
    await OnboardingCase.deleteMany({});
    await Document.deleteMany({});
    await TimeLog.deleteMany({});
    await DemoWorkspace.deleteMany({});

    console.log('[SEED] Purged existing collections.');

    // Seed Registered User baseline workspace
    await seedWorkspaceData('registered');
    console.log('[SEED] Seeded registered workspace dataset.');

    // Seed Demo Users (Save one by one so pre-save password hook hashes correctly)
    for (const userData of demoUsers) {
      const user = new User({
        ...userData,
        workspaceId: 'registered',
        isApproved: true,
        approvalStatus: 'Approved'
      });
      await user.save();
    }
    console.log(`[SEED] Inserted ${demoUsers.length} authentication user accounts.`);

    const employeeCount = await Employee.countDocuments({ workspaceId: 'registered' });
    const deptCount = await Department.countDocuments({ workspaceId: 'registered' });

    return {
      success: true,
      departmentsCount: deptCount,
      employeesCount: employeeCount,
      usersCount: demoUsers.length
    };
  } catch (error) {
    console.error('[SEED ERROR]', error);
    throw error;
  }
};

export const clearEmployeesOnly = async () => {
  await Employee.deleteMany({ workspaceId: 'registered' });
  await Notification.deleteMany({ workspaceId: 'registered' });
  await Ticket.deleteMany({ workspaceId: 'registered' });
  await OnboardingCase.deleteMany({ workspaceId: 'registered' });
  await TimeLog.deleteMany({ workspaceId: 'registered' });
  return { success: true, message: 'All dynamic operational records cleared in registered scope' };
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
