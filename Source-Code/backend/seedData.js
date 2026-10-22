export const departmentsData = [
  {
    name: 'Engineering',
    code: 'ENG',
    headOfDepartment: 'Dr. Marcus Vance',
    budget: 8500000,
    color: '#2563eb', // Blue
    description: 'Software development, cloud systems, API architecture, and quality engineering.',
    targetPerformanceScore: 88
  },
  {
    name: 'Product',
    code: 'PROD',
    headOfDepartment: 'Ananya Iyer',
    budget: 4500000,
    color: '#7c3aed', // Purple
    description: 'Product lifecycle strategy, roadmapping, UX architecture, and market discovery.',
    targetPerformanceScore: 86
  },
  {
    name: 'Marketing',
    code: 'MKT',
    headOfDepartment: 'Pooja Deshmukh',
    budget: 3800000,
    color: '#ea580c', // Orange
    description: 'Brand awareness, digital growth campaigns, corporate PR, and inbound marketing.',
    targetPerformanceScore: 84
  },
  {
    name: 'Sales',
    code: 'SLS',
    headOfDepartment: 'Rajesh Verma',
    budget: 6200000,
    color: '#dc2626', // Red
    description: 'Enterprise B2B client acquisition, partnerships, and revenue generation.',
    targetPerformanceScore: 85
  },
  {
    name: 'Human Resources',
    code: 'HR',
    headOfDepartment: 'Priya Sharma',
    budget: 2900000,
    color: '#16a34a', // Green
    description: 'Workforce governance, talent acquisition, performance reviews, and people operations.',
    targetPerformanceScore: 87
  }
];

export const demoUsers = [
  {
    name: 'Priya Sharma',
    email: 'hr@hrhub.in',
    password: 'password123',
    role: 'HR Director',
    department: 'Human Resources',
    initials: 'PS',
    avatarBg: '#16a34a'
  },
  {
    name: 'Rajesh Verma',
    email: 'manager@hrhub.in',
    password: 'password123',
    role: 'Engineering Manager',
    department: 'Engineering',
    initials: 'RV',
    avatarBg: '#2563eb'
  },
  {
    name: 'Aarav Patel',
    email: 'aarav@hrhub.in',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering',
    initials: 'AP',
    avatarBg: '#ea580c'
  }
];

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateMonthlyHistory = (baseScore, baseAttendance, baseProd) => {
  return months.map((m, idx) => {
    const variance = (idx - 2.5) * 1.2;
    const att = Math.min(100, Math.max(65, Math.round(baseAttendance + (Math.sin(idx) * 3) + variance)));
    const prod = Math.min(100, Math.max(60, Math.round(baseProd + (Math.cos(idx) * 4) + variance)));
    const score = Math.round((att * 0.2) + (prod * 0.8));
    return {
      month: m,
      attendance: att,
      productivity: prod,
      tasksCompleted: Math.max(4, Math.round(10 + (score / 10))),
      overallScore: score
    };
  });
};

export const employeesData = [
  // --- ENGINEERING (3) ---
  {
    employeeId: 'EMP-1001',
    name: 'Aarav Patel',
    email: 'aarav.patel@hrhub.in',
    phone: '+91 98201 44101',
    department: 'Engineering',
    role: 'Lead Full Stack Architect',
    initials: 'AP',
    avatarBg: '#2563eb',
    joinDate: new Date('2021-03-15'),
    salary: 2200000,
    experienceYears: 6,
    location: 'Bengaluru, India',
    managerName: 'Rajesh Verma',
    status: 'Active',
    kpiData: {
      tasksGiven: 25,
      tasksCompleted: 24,
      reviewScore: 9.6, // 0.0 to 10.0 scale
      attendanceRate: 98,
      projectContribution: 95,
      workEfficiency: 96
    },
    metrics: { attendanceRate: 98, taskCompletionRate: 96, productivityScore: 96, projectContribution: 95, workEfficiency: 96, overallScore: 96 },
    performanceCategory: 'Exceptional',
    tags: ['Microservices', 'React Lead', 'Cloud Specialist'],
    tasks: [
      { title: 'Migrate Core Services to Container Cluster', project: 'Platform Scale', status: 'Completed', priority: 'High', efficiencyRating: 98 },
      { title: 'Implement Real-time WebSocket Protocol', project: 'SyncEngine', status: 'In Progress', priority: 'High', efficiencyRating: 95 },
      { title: 'Reduce Bundle Load Latency by 40%', project: 'Frontend Optimization', status: 'Completed', priority: 'Medium', efficiencyRating: 96 }
    ],
    feedbacks: [
      { from: 'Priya Sharma (HR Director)', message: 'Outstanding delivery on the Core Services migration. Nominated for Q3 Tech Excellence Award.', category: 'Recognition', date: new Date('2026-09-15') }
    ],
    leaveRequests: [
      { type: 'Casual Leave', reason: 'Family Function in Ahmedabad', startDate: '2026-11-05', endDate: '2026-11-07', days: 3, status: 'Approved', decisionNote: 'Approved by HR.' }
    ],
    monthlyHistory: generateMonthlyHistory(96, 98, 96)
  },
  {
    employeeId: 'EMP-1002',
    name: 'Sneha Rao',
    email: 'sneha.rao@hrhub.in',
    phone: '+91 98201 44102',
    department: 'Engineering',
    role: 'Senior Cloud Infrastructure Architect',
    initials: 'SR',
    avatarBg: '#0d9488',
    joinDate: new Date('2020-07-01'),
    salary: 2400000,
    experienceYears: 8,
    location: 'Hyderabad, India',
    managerName: 'Rajesh Verma',
    status: 'Active',
    kpiData: {
      tasksGiven: 20,
      tasksCompleted: 19,
      reviewScore: 9.5,
      attendanceRate: 99,
      projectContribution: 98,
      workEfficiency: 95
    },
    metrics: { attendanceRate: 99, taskCompletionRate: 95, productivityScore: 95, projectContribution: 98, workEfficiency: 95, overallScore: 96 },
    performanceCategory: 'Exceptional',
    tags: ['Kubernetes', 'Multi-Cloud', 'DevOps Lead'],
    tasks: [
      { title: 'Deploy Multi-Region Kubernetes Failover', project: 'InfraScale', status: 'Completed', priority: 'High', efficiencyRating: 99 },
      { title: 'Automated Security Audit Pipeline', project: 'InfraSec', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    feedbacks: [
      { from: 'Rajesh Verma (Manager)', message: 'Zero downtime achieved during the database upgrade drill. Exemplary work.', category: 'Recognition', date: new Date('2026-09-10') }
    ],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(96, 99, 95)
  },
  {
    employeeId: 'EMP-1003',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@hrhub.in',
    phone: '+91 98201 44103',
    department: 'Engineering',
    role: 'Backend API Developer',
    initials: 'RG',
    avatarBg: '#ea580c',
    joinDate: new Date('2023-02-14'),
    salary: 1100000,
    experienceYears: 3,
    location: 'Pune, India',
    managerName: 'Aarav Patel',
    status: 'Active',
    kpiData: {
      tasksGiven: 18,
      tasksCompleted: 12,
      reviewScore: 6.5,
      attendanceRate: 74,
      projectContribution: 65,
      workEfficiency: 68
    },
    metrics: { attendanceRate: 74, taskCompletionRate: 67, productivityScore: 65, projectContribution: 65, workEfficiency: 68, overallScore: 68 },
    performanceCategory: 'Needs Improvement',
    tags: ['Node.js', 'PostgreSQL', 'Needs Support'],
    tasks: [
      { title: 'Refactor Auth Token Refresh Service', project: 'Security Patch', status: 'Overdue', priority: 'High', efficiencyRating: 62 },
      { title: 'Document REST Endpoints with OpenAPI', project: 'API Docs', status: 'In Progress', priority: 'Low', efficiencyRating: 70 }
    ],
    feedbacks: [
      { from: 'Priya Sharma (HR Director)', message: 'Attendance dropped below 75% this month. Please schedule a consultation with HR.', category: 'Improvement Plan', date: new Date('2026-10-01') }
    ],
    leaveRequests: [
      { type: 'Sick Leave', reason: 'Viral fever recovery', startDate: '2026-10-22', endDate: '2026-10-24', days: 3, status: 'Pending', decisionNote: '' }
    ],
    monthlyHistory: generateMonthlyHistory(68, 74, 65)
  },

  // --- PRODUCT (3) ---
  {
    employeeId: 'EMP-1004',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@hrhub.in',
    phone: '+91 98301 55101',
    department: 'Product',
    role: 'VP of Product Strategy',
    initials: 'AI',
    avatarBg: '#7c3aed',
    joinDate: new Date('2019-11-10'),
    salary: 2600000,
    experienceYears: 10,
    location: 'Bengaluru, India',
    managerName: 'Executive Committee',
    status: 'Active',
    kpiData: {
      tasksGiven: 22,
      tasksCompleted: 22,
      reviewScore: 9.8,
      attendanceRate: 99,
      projectContribution: 98,
      workEfficiency: 97
    },
    metrics: { attendanceRate: 99, taskCompletionRate: 100, productivityScore: 98, projectContribution: 98, workEfficiency: 97, overallScore: 98 },
    performanceCategory: 'Exceptional',
    tags: ['Product Vision', 'Roadmap', 'Executive'],
    tasks: [
      { title: 'FY2027 Strategic Enterprise Roadmap', project: 'Vision 2027', status: 'Completed', priority: 'High', efficiencyRating: 99 },
      { title: 'Executive Stakeholder Quarterly Alignment', project: 'Business Review', status: 'Completed', priority: 'High', efficiencyRating: 98 }
    ],
    feedbacks: [
      { from: 'Priya Sharma (HR Director)', message: 'High customer satisfaction recorded across all enterprise product rollouts.', category: 'Appraisal', date: new Date('2026-09-01') }
    ],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(98, 99, 98)
  },
  {
    employeeId: 'EMP-1005',
    name: 'Vikram Malhotra',
    email: 'vikram.m@hrhub.in',
    phone: '+91 98301 55102',
    department: 'Product',
    role: 'Principal UX / UI Designer',
    initials: 'VM',
    avatarBg: '#0284c7',
    joinDate: new Date('2021-04-18'),
    salary: 1900000,
    experienceYears: 7,
    location: 'Mumbai, India',
    managerName: 'Ananya Iyer',
    status: 'Active',
    kpiData: {
      tasksGiven: 24,
      tasksCompleted: 23,
      reviewScore: 9.4,
      attendanceRate: 96,
      projectContribution: 96,
      workEfficiency: 94
    },
    metrics: { attendanceRate: 96, taskCompletionRate: 96, productivityScore: 94, projectContribution: 96, workEfficiency: 94, overallScore: 95 },
    performanceCategory: 'Exceptional',
    tags: ['Design System', 'Figma Specialist', 'UX Lead'],
    tasks: [
      { title: 'Enterprise Design System Modernization', project: 'HR Hub Redesign', status: 'Completed', priority: 'High', efficiencyRating: 98 },
      { title: 'Accessibility Compliance Validation', project: 'Inclusion UX', status: 'Completed', priority: 'High', efficiencyRating: 94 }
    ],
    feedbacks: [],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(95, 96, 94)
  },
  {
    employeeId: 'EMP-1006',
    name: 'Devika Nair',
    email: 'devika.nair@hrhub.in',
    phone: '+91 98301 55103',
    department: 'Product',
    role: 'Product Operations Analyst',
    initials: 'DN',
    avatarBg: '#d97706',
    joinDate: new Date('2022-03-01'),
    salary: 1200000,
    experienceYears: 3,
    location: 'Bengaluru, India',
    managerName: 'Ananya Iyer',
    status: 'Active',
    kpiData: {
      tasksGiven: 20,
      tasksCompleted: 15,
      reviewScore: 7.2,
      attendanceRate: 78,
      projectContribution: 75,
      workEfficiency: 76
    },
    metrics: { attendanceRate: 78, taskCompletionRate: 75, productivityScore: 72, projectContribution: 75, workEfficiency: 76, overallScore: 74 },
    performanceCategory: 'Meets Expectations',
    tags: ['Product Ops', 'Sprint Analysis', 'Metrics'],
    tasks: [
      { title: 'Synthesize Feature Adoption Telemetry', project: 'Adoption Research', status: 'In Progress', priority: 'Medium', efficiencyRating: 75 }
    ],
    feedbacks: [],
    leaveRequests: [
      { type: 'Work From Home', reason: 'Remote equipment installation', startDate: '2026-10-25', endDate: '2026-10-26', days: 2, status: 'Approved', decisionNote: 'Remote request verified.' }
    ],
    monthlyHistory: generateMonthlyHistory(74, 78, 72)
  },

  // --- MARKETING (3) ---
  {
    employeeId: 'EMP-1007',
    name: 'Pooja Deshmukh',
    email: 'pooja.deshmukh@hrhub.in',
    phone: '+91 98401 66101',
    department: 'Marketing',
    role: 'Chief Marketing Officer',
    initials: 'PD',
    avatarBg: '#ea580c',
    joinDate: new Date('2020-02-15'),
    salary: 2500000,
    experienceYears: 11,
    location: 'Mumbai, India',
    managerName: 'Executive Committee',
    status: 'Active',
    kpiData: {
      tasksGiven: 25,
      tasksCompleted: 24,
      reviewScore: 9.7,
      attendanceRate: 98,
      projectContribution: 96,
      workEfficiency: 97
    },
    metrics: { attendanceRate: 98, taskCompletionRate: 96, productivityScore: 97, projectContribution: 96, workEfficiency: 97, overallScore: 97 },
    performanceCategory: 'Exceptional',
    tags: ['Brand Builder', 'Growth Marketing', 'PR Leader'],
    tasks: [
      { title: 'Global Brand Campaign Refresh', project: 'Rebrand 2026', status: 'Completed', priority: 'High', efficiencyRating: 98 }
    ],
    feedbacks: [
      { from: 'Priya Sharma (HR Director)', message: 'Exceptional brand engagement metrics recorded in Q3.', category: 'Recognition', date: new Date('2026-09-20') }
    ],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(97, 98, 97)
  },
  {
    employeeId: 'EMP-1008',
    name: 'Siddharth Mehra',
    email: 'siddharth.m@hrhub.in',
    phone: '+91 98401 66102',
    department: 'Marketing',
    role: 'Performance Growth Lead',
    initials: 'SM',
    avatarBg: '#2563eb',
    joinDate: new Date('2021-05-10'),
    salary: 1700000,
    experienceYears: 5,
    location: 'Gurugram, India',
    managerName: 'Pooja Deshmukh',
    status: 'Active',
    kpiData: {
      tasksGiven: 22,
      tasksCompleted: 21,
      reviewScore: 9.3,
      attendanceRate: 95,
      projectContribution: 93,
      workEfficiency: 94
    },
    metrics: { attendanceRate: 95, taskCompletionRate: 95, productivityScore: 93, projectContribution: 93, workEfficiency: 94, overallScore: 94 },
    performanceCategory: 'Exceptional',
    tags: ['Paid Media', 'ROAS Lead', 'Funnel Analytics'],
    tasks: [
      { title: 'Inbound Paid Pipeline Scaling', project: 'Acquisition', status: 'Completed', priority: 'High', efficiencyRating: 95 }
    ],
    feedbacks: [],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(94, 95, 93)
  },
  {
    employeeId: 'EMP-1009',
    name: 'Tanvi Joshi',
    email: 'tanvi.joshi@hrhub.in',
    phone: '+91 98401 66103',
    department: 'Marketing',
    role: 'Communications & PR Associate',
    initials: 'TJ',
    avatarBg: '#dc2626',
    joinDate: new Date('2023-08-15'),
    salary: 950000,
    experienceYears: 2,
    location: 'Pune, India',
    managerName: 'Pooja Deshmukh',
    status: 'Active',
    kpiData: {
      tasksGiven: 16,
      tasksCompleted: 10,
      reviewScore: 6.2,
      attendanceRate: 68,
      projectContribution: 62,
      workEfficiency: 63
    },
    metrics: { attendanceRate: 68, taskCompletionRate: 63, productivityScore: 62, projectContribution: 62, workEfficiency: 63, overallScore: 64 },
    performanceCategory: 'Needs Improvement',
    tags: ['Media Relations', 'Press Releases', 'Attendance Alert'],
    tasks: [
      { title: 'Quarterly Press Distribution', project: 'PR', status: 'Overdue', priority: 'High', efficiencyRating: 60 }
    ],
    feedbacks: [
      { from: 'Priya Sharma (HR Director)', message: 'Attendance alert. Unnotified leaves observed. Please reach out to HR.', category: 'Improvement Plan', date: new Date('2026-10-05') }
    ],
    leaveRequests: [
      { type: 'Casual Leave', reason: 'Personal emergency', startDate: '2026-10-21', endDate: '2026-10-21', days: 1, status: 'Pending', decisionNote: '' }
    ],
    monthlyHistory: generateMonthlyHistory(64, 68, 62)
  },

  // --- SALES (3) ---
  {
    employeeId: 'EMP-1010',
    name: 'Rajesh Verma',
    email: 'manager@hrhub.in',
    phone: '+91 98501 77101',
    department: 'Sales',
    role: 'Head of Enterprise Sales',
    initials: 'RV',
    avatarBg: '#dc2626',
    joinDate: new Date('2019-09-01'),
    salary: 2800000,
    experienceYears: 12,
    location: 'Mumbai, India',
    managerName: 'Executive Committee',
    status: 'Active',
    kpiData: {
      tasksGiven: 26,
      tasksCompleted: 26,
      reviewScore: 9.8,
      attendanceRate: 98,
      projectContribution: 99,
      workEfficiency: 97
    },
    metrics: { attendanceRate: 98, taskCompletionRate: 100, productivityScore: 98, projectContribution: 99, workEfficiency: 97, overallScore: 98 },
    performanceCategory: 'Exceptional',
    tags: ['Deal Closer', 'Enterprise B2B', 'Revenue Strategy'],
    tasks: [
      { title: 'Close Major Enterprise Contract', project: 'Enterprise Pipeline', status: 'Completed', priority: 'High', efficiencyRating: 99 }
    ],
    feedbacks: [
      { from: 'Priya Sharma (HR Director)', message: 'Surpassed annual quota expectations by 130%.', category: 'Appraisal', date: new Date('2026-09-30') }
    ],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(98, 98, 98)
  },
  {
    employeeId: 'EMP-1011',
    name: 'Kavita Sundaram',
    email: 'kavita.s@hrhub.in',
    phone: '+91 98501 77102',
    department: 'Sales',
    role: 'Senior Strategic Account Executive',
    initials: 'KS',
    avatarBg: '#059669',
    joinDate: new Date('2021-02-10'),
    salary: 2100000,
    experienceYears: 7,
    location: 'Bengaluru, India',
    managerName: 'Rajesh Verma',
    status: 'Active',
    kpiData: {
      tasksGiven: 22,
      tasksCompleted: 21,
      reviewScore: 9.4,
      attendanceRate: 96,
      projectContribution: 96,
      workEfficiency: 94
    },
    metrics: { attendanceRate: 96, taskCompletionRate: 95, productivityScore: 94, projectContribution: 96, workEfficiency: 94, overallScore: 95 },
    performanceCategory: 'Exceptional',
    tags: ['Quota Crusher', 'SaaS Deals', 'Negotiations'],
    tasks: [
      { title: 'Secure Mid-Market Strategic Renewals', project: 'Sales Quota', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    feedbacks: [],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(95, 96, 94)
  },
  {
    employeeId: 'EMP-1012',
    name: 'Arjun Kapoor',
    email: 'arjun.kapoor@hrhub.in',
    phone: '+91 98501 77103',
    department: 'Sales',
    role: 'Corporate Sales Representative',
    initials: 'AK',
    avatarBg: '#ea580c',
    joinDate: new Date('2023-11-01'),
    salary: 900000,
    experienceYears: 1,
    location: 'Gurugram, India',
    managerName: 'Rajesh Verma',
    status: 'Active',
    kpiData: {
      tasksGiven: 20,
      tasksCompleted: 13,
      reviewScore: 6.4,
      attendanceRate: 70,
      projectContribution: 64,
      workEfficiency: 65
    },
    metrics: { attendanceRate: 70, taskCompletionRate: 65, productivityScore: 64, projectContribution: 64, workEfficiency: 65, overallScore: 66 },
    performanceCategory: 'Needs Improvement',
    tags: ['Onboarding', 'Pipeline Training', 'Review Active'],
    tasks: [
      { title: 'Outbound Prospecting Quota Target', project: 'Pipeline', status: 'In Progress', priority: 'High', efficiencyRating: 62 }
    ],
    feedbacks: [
      { from: 'Rajesh Verma (Manager)', message: 'Enrolled in B2B Negotiation Refresher Accelerator.', category: 'Improvement Plan', date: new Date('2026-10-08') }
    ],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(66, 70, 64)
  },

  // --- HUMAN RESOURCES (3) ---
  {
    employeeId: 'EMP-1013',
    name: 'Priya Sharma',
    email: 'hr@hrhub.in',
    phone: '+91 98601 88101',
    department: 'Human Resources',
    role: 'Chief People Officer / HR Director',
    initials: 'PS',
    avatarBg: '#16a34a',
    joinDate: new Date('2019-05-01'),
    salary: 2700000,
    experienceYears: 13,
    location: 'Bengaluru, India',
    managerName: 'Executive Committee',
    status: 'Active',
    kpiData: {
      tasksGiven: 28,
      tasksCompleted: 28,
      reviewScore: 9.9,
      attendanceRate: 99,
      projectContribution: 99,
      workEfficiency: 98
    },
    metrics: { attendanceRate: 99, taskCompletionRate: 100, productivityScore: 99, projectContribution: 99, workEfficiency: 98, overallScore: 99 },
    performanceCategory: 'Exceptional',
    tags: ['HR Strategy', 'People Leadership', 'Talent Ops'],
    tasks: [
      { title: 'Roll out Enterprise Performance Framework', project: 'HR Hub Framework', status: 'Completed', priority: 'High', efficiencyRating: 99 }
    ],
    feedbacks: [],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(99, 99, 99)
  },
  {
    employeeId: 'EMP-1014',
    name: 'Amit Banerjee',
    email: 'amit.banerjee@hrhub.in',
    phone: '+91 98601 88102',
    department: 'Human Resources',
    role: 'Senior Talent Acquisition Partner',
    initials: 'AB',
    avatarBg: '#2563eb',
    joinDate: new Date('2021-03-20'),
    salary: 1600000,
    experienceYears: 6,
    location: 'Kolkata, India',
    managerName: 'Priya Sharma',
    status: 'Active',
    kpiData: {
      tasksGiven: 24,
      tasksCompleted: 23,
      reviewScore: 9.4,
      attendanceRate: 97,
      projectContribution: 94,
      workEfficiency: 95
    },
    metrics: { attendanceRate: 97, taskCompletionRate: 96, productivityScore: 94, projectContribution: 94, workEfficiency: 95, overallScore: 95 },
    performanceCategory: 'Exceptional',
    tags: ['Talent Sourcing', 'Leadership Hiring', 'Retention'],
    tasks: [
      { title: 'Close Senior Technical Hires', project: 'Talent Acquisition', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    feedbacks: [
      { from: 'Priya Sharma (HR Director)', message: 'Time-to-hire decreased by 22% this quarter. Excellent coordination.', category: 'Recognition', date: new Date('2026-09-18') }
    ],
    leaveRequests: [],
    monthlyHistory: generateMonthlyHistory(95, 97, 94)
  },
  {
    employeeId: 'EMP-1015',
    name: 'Ritu Choudhury',
    email: 'ritu.c@hrhub.in',
    phone: '+91 98601 88103',
    department: 'Human Resources',
    role: 'HR Operations Coordinator',
    initials: 'RC',
    avatarBg: '#7c3aed',
    joinDate: new Date('2023-05-10'),
    salary: 1000000,
    experienceYears: 2,
    location: 'Bengaluru, India',
    managerName: 'Priya Sharma',
    status: 'Active',
    kpiData: {
      tasksGiven: 20,
      tasksCompleted: 18,
      reviewScore: 8.5,
      attendanceRate: 88,
      projectContribution: 84,
      workEfficiency: 85
    },
    metrics: { attendanceRate: 88, taskCompletionRate: 90, productivityScore: 85, projectContribution: 84, workEfficiency: 85, overallScore: 87 },
    performanceCategory: 'Strong Performer',
    tags: ['Onboarding', 'Compliance', 'Records Management'],
    tasks: [
      { title: 'Streamline Employee Onboarding Lifecycle', project: 'Onboarding Ops', status: 'Completed', priority: 'Medium', efficiencyRating: 88 }
    ],
    feedbacks: [],
    leaveRequests: [
      { type: 'Casual Leave', reason: 'Personal errands', startDate: '2026-11-12', endDate: '2026-11-12', days: 1, status: 'Pending', decisionNote: '' }
    ],
    monthlyHistory: generateMonthlyHistory(87, 88, 85)
  }
];
