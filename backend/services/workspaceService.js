import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import Ticket from '../models/Ticket.js';
import TimeLog from '../models/TimeLog.js';
import Document from '../models/Document.js';
import OnboardingCase from '../models/OnboardingCase.js';
import Notification from '../models/Notification.js';
import DemoWorkspace from '../models/DemoWorkspace.js';
import { departmentsData, employeesData } from '../seedData.js';

const getInitialNotifications = (workspaceId) => {
  const now = Date.now();
  const oneDayAgo = new Date(now - 22 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now - 46 * 60 * 60 * 1000);

  return [
    {
      workspaceId,
      title: 'New Time Off Application Submitted',
      message: 'Aarav Patel (Engineering) requested 2 day(s) of Casual Leave for family event.',
      category: 'leave_request',
      recipientRole: 'HR Director',
      actionLink: 'time-attendance',
      createdAt: oneDayAgo
    },
    {
      workspaceId,
      title: 'Workforce Attendance Warning',
      message: 'Devika Nair (Product) attendance compliance dipped to 78% this cycle.',
      category: 'system',
      recipientRole: 'HR Director',
      actionLink: 'talent-management',
      createdAt: twoDaysAgo
    },
    {
      workspaceId,
      title: 'Deliverable Velocity Milestone',
      message: 'Engineering sprint achieved 94% task throughput completion on time.',
      category: 'kpi_update',
      recipientRole: 'Engineering Manager',
      actionLink: 'mgr-performance',
      createdAt: oneDayAgo
    },
    {
      workspaceId,
      title: 'Performance Appraisal Completed',
      message: 'Priya Sharma (HR Director) registered an Excellence Recognition appraisal note for your Q3 deliverables.',
      category: 'appraisal_feedback',
      recipientRole: 'Employee',
      recipientEmployeeId: 'EMP-1001',
      actionLink: 'emp-performance-appraisal',
      createdAt: oneDayAgo
    }
  ];
};

const getInitialTickets = (workspaceId) => {
  const oneDayAgo = new Date(Date.now() - 22 * 60 * 60 * 1000);

  return [
    {
      workspaceId,
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
      workspaceId,
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
      workspaceId,
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
};

const getInitialCases = (workspaceId) => [
  {
    workspaceId,
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
    workspaceId,
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
    workspaceId,
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

const getInitialDocuments = (workspaceId) => [
  {
    workspaceId,
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
    workspaceId,
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
    workspaceId,
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
    workspaceId,
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
    workspaceId,
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

const getInitialTimeLogs = (workspaceId) => [
  {
    workspaceId,
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
    workspaceId,
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
    workspaceId,
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
    workspaceId,
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

export const seedWorkspaceData = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required to seed workspace data');
  }

  // Clone departments
  const scopedDepts = departmentsData.map(d => ({
    ...JSON.parse(JSON.stringify(d)),
    workspaceId
  }));
  await Department.insertMany(scopedDepts);

  // Clone employees
  const scopedEmployees = employeesData.map(e => ({
    ...JSON.parse(JSON.stringify(e)),
    workspaceId
  }));
  await Employee.insertMany(scopedEmployees);

  // Clone notifications
  await Notification.insertMany(getInitialNotifications(workspaceId));

  // Clone tickets
  await Ticket.insertMany(getInitialTickets(workspaceId));

  // Clone onboarding cases
  await OnboardingCase.insertMany(getInitialCases(workspaceId));

  // Clone documents
  await Document.insertMany(getInitialDocuments(workspaceId));

  // Clone time logs
  await TimeLog.insertMany(getInitialTimeLogs(workspaceId));

  // Track workspace activity if demo
  if (workspaceId !== 'registered') {
    await DemoWorkspace.findOneAndUpdate(
      { workspaceId },
      { $set: { lastActiveAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  return {
    success: true,
    workspaceId,
    departmentsCount: scopedDepts.length,
    employeesCount: scopedEmployees.length
  };
};

export const resetWorkspaceData = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error('Workspace ID is required to reset workspace');
  }

  // Never allow resetting the registered user system via demo reset
  if (workspaceId === 'registered') {
    throw new Error('Cannot reset registered workspace via demo reset operation');
  }

  // Delete records for this workspace only
  await Promise.all([
    Employee.deleteMany({ workspaceId }),
    Department.deleteMany({ workspaceId }),
    Notification.deleteMany({ workspaceId }),
    Ticket.deleteMany({ workspaceId }),
    OnboardingCase.deleteMany({ workspaceId }),
    Document.deleteMany({ workspaceId }),
    TimeLog.deleteMany({ workspaceId })
  ]);

  // Re-seed fresh baseline dataset for this workspace
  await seedWorkspaceData(workspaceId);

  return {
    success: true,
    message: `Workspace ${workspaceId} has been reset to baseline synthetic data`
  };
};

export const ensureWorkspaceExists = async (workspaceId) => {
  if (!workspaceId) return false;

  const count = await Employee.countDocuments({ workspaceId });
  if (count === 0) {
    await seedWorkspaceData(workspaceId);
  } else if (workspaceId !== 'registered') {
    await DemoWorkspace.updateOne(
      { workspaceId },
      { $set: { lastActiveAt: new Date() } }
    );
  }
  return true;
};

export const touchWorkspace = async (workspaceId) => {
  if (!workspaceId || workspaceId === 'registered') return;
  await DemoWorkspace.updateOne(
    { workspaceId },
    { $set: { lastActiveAt: new Date() } }
  );
};
