import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from './models/Employee.js';
import Department from './models/Department.js';
import User from './models/User.js';
import Notification from './models/Notification.js';
import Ticket from './models/Ticket.js';
import OnboardingCase from './models/OnboardingCase.js';
import Document from './models/Document.js';
import TimeLog from './models/TimeLog.js';
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
    await Ticket.deleteMany({});
    await OnboardingCase.deleteMany({});
    await Document.deleteMany({});
    await TimeLog.deleteMany({});

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
        actionLink: 'time-attendance',
        createdAt: oneDayAgo
      },
      {
        title: 'Workforce Attendance Warning',
        message: 'Devika Nair (Product) attendance compliance dipped to 78% this cycle.',
        category: 'system',
        recipientRole: 'HR Director',
        actionLink: 'talent-management',
        createdAt: twoDaysAgo
      },
      {
        title: 'Deliverable Velocity Milestone',
        message: 'Engineering sprint achieved 94% task throughput completion on time.',
        category: 'kpi_update',
        recipientRole: 'Engineering Manager',
        actionLink: 'mgr-performance',
        createdAt: oneDayAgo
      },
      {
        title: 'Performance Appraisal Completed',
        message: 'Priya Sharma (HR Director) registered an Excellence Recognition appraisal note for your Q3 deliverables.',
        category: 'appraisal_feedback',
        recipientRole: 'Employee',
        recipientEmployeeId: 'EMP-1001',
        actionLink: 'emp-performance-appraisal',
        createdAt: oneDayAgo
      }
    ];

    await Notification.insertMany(initialNotifications);
    console.log(`[SEED] Inserted ${initialNotifications.length} active notifications within 3-day window.`);

    // Seed Helpdesk Tickets
    const initialTickets = [
      {
        ticketId: 'TCK-1001',
        employeeId: 'EMP-1001',
        employeeName: 'Aarav Patel',
        department: 'Engineering',
        category: 'Payroll & Compensation',
        priority: 'High',
        subject: 'Provident Fund (UAN) Transfer Discrepancy',
        description: 'Previous employer PF transfer request filed on EPFO portal requires authorized HR digital signature verification.',
        status: 'In Progress',
        assignedTo: 'Priya Sharma (HR Director)',
        resolutionNote: 'Documents verified with EPFO nodal office. Digital verification submitted.',
        replies: [
          {
            sender: 'Priya Sharma (HR Director)',
            senderRole: 'HR Director',
            message: 'Attaching your authenticated Annexure K. The PF transfer should reflect within 5 working days.',
            createdAt: oneDayAgo
          }
        ]
      },
      {
        ticketId: 'TCK-1002',
        employeeId: 'EMP-1002',
        employeeName: 'Devika Nair',
        department: 'Product',
        category: 'Hardware & IT Assets',
        priority: 'Medium',
        subject: 'Dual 4K Monitor Requisition for UI Wireframing',
        description: 'Requesting second monitor stand and HDMI-C adapter for design prototype review sessions.',
        status: 'Open',
        assignedTo: 'Priya Sharma (HR Director)'
      },
      {
        ticketId: 'TCK-1003',
        employeeId: 'EMP-1003',
        employeeName: 'Rohan Gupta',
        department: 'Marketing',
        category: 'Policies & HR Governance',
        priority: 'Low',
        subject: 'Travel Expense Reimbursment Policy Clarification',
        description: 'Need guidelines regarding per-diem caps and domestic flight booking window for Delhi Enterprise Summit.',
        status: 'Resolved',
        assignedTo: 'Priya Sharma (HR Director)',
        resolutionNote: 'Shared Travel Policy 2026 Annexure 2. Direct corporate billing enabled.'
      }
    ];
    await Ticket.insertMany(initialTickets);
    console.log(`[SEED] Inserted ${initialTickets.length} helpdesk tickets.`);

    // Seed Onboarding & Offboarding Cases
    const initialCases = [
      {
        caseId: 'ONB-1001',
        type: 'Onboarding',
        candidateName: 'Ananya Sen',
        role: 'Full Stack Engineer',
        department: 'Engineering',
        managerName: 'Rajesh Verma',
        targetDate: '01 Nov 2026',
        status: 'In Progress',
        progressPercent: 67,
        checklist: [
          { taskName: 'Offer Letter Acceptance & Signed Contract', category: 'Documentation', isCompleted: true },
          { taskName: 'Identity & Address Proof Verification (Aadhaar/PAN)', category: 'Documentation', isCompleted: true },
          { taskName: 'Corporate MacBook M3 & Access Provisioning', category: 'IT Assets', isCompleted: true },
          { taskName: 'Company Culture & Values HR Induction', category: 'HR Induction', isCompleted: true },
          { taskName: 'Departmental Onboarding & Peer Buddy Assignment', category: 'Team KT', isCompleted: false },
          { taskName: 'Probation Milestone & 30-Day Check-in Scheduled', category: 'HR Induction', isCompleted: false }
        ],
        notes: 'Pre-boarding background checks verified by external agency.'
      },
      {
        caseId: 'ONB-1002',
        type: 'Onboarding',
        candidateName: 'Vikram Malhotra',
        role: 'Product Designer',
        department: 'Product',
        managerName: 'Sneha Rao',
        targetDate: '10 Nov 2026',
        status: 'Initiated',
        progressPercent: 33,
        checklist: [
          { taskName: 'Offer Letter Acceptance & Signed Contract', category: 'Documentation', isCompleted: true },
          { taskName: 'Identity & Address Proof Verification (Aadhaar/PAN)', category: 'Documentation', isCompleted: true },
          { taskName: 'Corporate Workstation & Access Provisioning', category: 'IT Assets', isCompleted: false },
          { taskName: 'Company Culture & Values HR Induction', category: 'HR Induction', isCompleted: false },
          { taskName: 'Departmental Onboarding & Peer Buddy Assignment', category: 'Team KT', isCompleted: false },
          { taskName: 'Probation Milestone & 30-Day Check-in Scheduled', category: 'HR Induction', isCompleted: false }
        ],
        notes: 'Workstation shipped to candidate residential address in Bengaluru.'
      },
      {
        caseId: 'OFF-1001',
        type: 'Offboarding',
        candidateName: 'Sameer Khan',
        employeeId: 'EMP-1008',
        role: 'Senior QA Engineer',
        department: 'Engineering',
        managerName: 'Rajesh Verma',
        targetDate: '31 Oct 2026',
        status: 'In Progress',
        progressPercent: 50,
        checklist: [
          { taskName: 'Resignation Notice & Transition Approval', category: 'Documentation', isCompleted: true },
          { taskName: 'Knowledge Transfer (KT) Sign-off with Lead', category: 'Team KT', isCompleted: true },
          { taskName: 'Asset Recovery (MacBook, Charger, Security ID)', category: 'IT Assets', isCompleted: true },
          { taskName: 'Access Revocation (GitHub, AWS, Jira, Slack)', category: 'IT Assets', isCompleted: false },
          { taskName: 'HR Exit Interview & Feedback Documentation', category: 'Exit Clearance', isCompleted: false },
          { taskName: 'Full & Final (FnF) Settlement Processing', category: 'Finance Settlement', isCompleted: false }
        ],
        notes: 'Knowledge transfer sessions recorded in engineering confluence space.'
      }
    ];
    await OnboardingCase.insertMany(initialCases);
    console.log(`[SEED] Inserted ${initialCases.length} onboarding/offboarding cases.`);

    // Seed Corporate Documents
    const initialDocuments = [
      {
        docId: 'DOC-1001',
        title: 'Enterprise Leave & Absence Policy 2026',
        category: 'Company Policies',
        fileName: 'HRHub_Enterprise_Leave_Policy_2026.pdf',
        fileSize: '1.4 MB',
        fileType: 'PDF',
        uploadDate: '15 Jan 2026',
        uploadedBy: 'Priya Sharma (HR Director)',
        accessLevel: 'All Employees',
        description: 'Annual leave accrual rates, maternity/paternity guidelines, and compensatory off standards.'
      },
      {
        docId: 'DOC-1002',
        title: 'Prevention of Sexual Harassment (POSH) Handbook',
        category: 'Legal & Compliance',
        fileName: 'POSH_Compliance_Governance_Manual.pdf',
        fileSize: '2.1 MB',
        fileType: 'PDF',
        uploadDate: '10 Feb 2026',
        uploadedBy: 'Priya Sharma (HR Director)',
        accessLevel: 'All Employees',
        description: 'Internal Complaints Committee (ICC) composition, reporting protocol, and investigation timelines.'
      },
      {
        docId: 'DOC-1003',
        title: 'Standard Employment Agreement & Confidentiality NDA',
        category: 'Templates & Forms',
        fileName: 'Standard_Employment_Agreement_Template.docx',
        fileSize: '850 KB',
        fileType: 'DOCX',
        uploadDate: '20 Mar 2026',
        uploadedBy: 'Priya Sharma (HR Director)',
        accessLevel: 'Management Only',
        description: 'Master template for full-time executive and engineering hires.'
      },
      {
        docId: 'DOC-1004',
        title: 'Hybrid Workplace & Remote Work Security Code',
        category: 'Company Policies',
        fileName: 'Hybrid_Workplace_Security_Protocol.pdf',
        fileSize: '1.1 MB',
        fileType: 'PDF',
        uploadDate: '05 Apr 2026',
        uploadedBy: 'Priya Sharma (HR Director)',
        accessLevel: 'All Employees',
        description: 'VPN usage, confidential data protection, and home office ergonomics allowance.'
      },
      {
        docId: 'DOC-1005',
        title: 'Form 16 Tax Declaration & Investment Proof Template',
        category: 'Payroll & Tax',
        fileName: 'IT_Declaration_Section80C_Standard_Template.xlsx',
        fileSize: '620 KB',
        fileType: 'XLSX',
        uploadDate: '01 Jun 2026',
        uploadedBy: 'Priya Sharma (HR Director)',
        accessLevel: 'All Employees',
        description: 'Standardized spreadsheet for annual income tax deductions and house rent allowance proof.'
      }
    ];
    await Document.insertMany(initialDocuments);
    console.log(`[SEED] Inserted ${initialDocuments.length} corporate documents.`);

    // Seed Time Logs
    const initialTimeLogs = [
      {
        logId: 'LOG-1001',
        employeeId: 'EMP-1001',
        employeeName: 'Aarav Patel',
        department: 'Engineering',
        project: 'Real-Time KPI Engine',
        taskName: 'Deliverable Slider Bidirectional Sync',
        hours: 7.5,
        date: '2026-10-21',
        status: 'Approved',
        notes: 'Implemented real-time mathematical clamp avoiding completion overflow.'
      },
      {
        logId: 'LOG-1002',
        employeeId: 'EMP-1001',
        employeeName: 'Aarav Patel',
        department: 'Engineering',
        project: 'Cloud Infrastructure',
        taskName: 'MongoDB TTL Index Setup',
        hours: 6.0,
        date: '2026-10-20',
        status: 'Approved',
        notes: 'Configured 259,200s TTL auto-expiry index for active notification hygiene.'
      },
      {
        logId: 'LOG-1003',
        employeeId: 'EMP-1005',
        employeeName: 'Vikram Joshi',
        department: 'Engineering',
        project: 'API Gateway',
        taskName: 'Latency Benchmarking & Query Optimization',
        hours: 8.0,
        date: '2026-10-21',
        status: 'Pending Approval',
        notes: 'Reduced payload transfer size by 35% on employee directory endpoint.'
      },
      {
        logId: 'LOG-1004',
        employeeId: 'EMP-1006',
        employeeName: 'Kavita Iyer',
        department: 'Engineering',
        project: 'Security & Auth',
        taskName: 'RBAC Authorization Guard Middleware',
        hours: 7.0,
        date: '2026-10-21',
        status: 'Pending Approval',
        notes: 'Hardened leave rejection status check against unauthorized caller roles.'
      }
    ];
    await TimeLog.insertMany(initialTimeLogs);
    console.log(`[SEED] Inserted ${initialTimeLogs.length} time logs.`);

    return {
      success: true,
      departmentsCount: insertedDepts.length,
      employeesCount: insertedEmployees.length,
      usersCount: demoUsers.length,
      notificationsCount: initialNotifications.length,
      ticketsCount: initialTickets.length,
      casesCount: initialCases.length,
      documentsCount: initialDocuments.length,
      timeLogsCount: initialTimeLogs.length
    };
  } catch (error) {
    console.error('[SEED ERROR]', error);
    throw error;
  }
};

export const clearEmployeesOnly = async () => {
  await Employee.deleteMany({});
  await Notification.deleteMany({});
  await Ticket.deleteMany({});
  await OnboardingCase.deleteMany({});
  await TimeLog.deleteMany({});
  return { success: true, message: 'All dynamic operational records cleared' };
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
