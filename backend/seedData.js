export const departmentsData = [
  {
    name: 'Engineering',
    code: 'ENG',
    headOfDepartment: 'Dr. Marcus Vance',
    budget: 850000,
    color: '#06b6d4', // Cyan
    description: 'Core software development, cloud infrastructure, AI models, and QA engineering.',
    targetPerformanceScore: 88
  },
  {
    name: 'Product',
    code: 'PROD',
    headOfDepartment: 'Elena Rostova',
    budget: 450000,
    color: '#8b5cf6', // Violet
    description: 'Product lifecycle strategy, roadmapping, UI/UX design, and user research.',
    targetPerformanceScore: 86
  },
  {
    name: 'Marketing',
    code: 'MKT',
    headOfDepartment: 'Sophia Sterling',
    budget: 380000,
    color: '#ec4899', // Pink
    description: 'Brand awareness, digital growth campaigns, public relations, and content marketing.',
    targetPerformanceScore: 84
  },
  {
    name: 'Sales',
    code: 'SLS',
    headOfDepartment: 'Alexander Hayes',
    budget: 620000,
    color: '#f59e0b', // Amber
    description: 'B2B enterprise pipeline, client acquisition, customer partnerships, and revenue generation.',
    targetPerformanceScore: 85
  },
  {
    name: 'Human Resources',
    code: 'HR',
    headOfDepartment: 'Victoria Chen',
    budget: 290000,
    color: '#10b981', // Emerald
    description: 'Workforce analytics, talent acquisition, employee engagement, and organizational development.',
    targetPerformanceScore: 87
  }
];

export const demoUsers = [
  {
    name: 'Victoria Chen',
    email: 'admin@hrhub.io',
    password: 'password123',
    role: 'HR Director',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@hrhub.io',
    password: 'password123',
    role: 'Engineering Manager',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    name: 'Jordan Miller',
    email: 'jordan.miller@hrhub.io',
    password: 'password123',
    role: 'Employee',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateMonthlyHistory = (baseScore, baseAttendance, baseProd) => {
  return months.map((m, idx) => {
    const variance = (idx - 2.5) * 1.5;
    const att = Math.min(100, Math.max(65, Math.round(baseAttendance + (Math.sin(idx) * 4) + variance)));
    const prod = Math.min(100, Math.max(60, Math.round(baseProd + (Math.cos(idx) * 5) + variance)));
    const score = Math.round((att * 0.3) + (prod * 0.7));
    return {
      month: m,
      attendance: att,
      productivity: prod,
      tasksCompleted: Math.max(3, Math.round(8 + (score / 10))),
      overallScore: score
    };
  });
};

export const employeesData = [
  // --- ENGINEERING (12) ---
  {
    employeeId: 'EMP-1001',
    name: 'Jordan Miller',
    email: 'jordan.miller@hrhub.io',
    phone: '+1 (555) 201-4411',
    department: 'Engineering',
    role: 'Senior Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-03-15'),
    salary: 135000,
    experienceYears: 6,
    location: 'San Francisco, CA',
    managerName: 'Dr. Marcus Vance',
    metrics: { attendanceRate: 98, taskCompletionRate: 96, productivityScore: 95, projectContribution: 94, workEfficiency: 96, overallScore: 96 },
    performanceCategory: 'Exceptional',
    tags: ['Core Architect', 'Mentorship', 'React Specialist'],
    tasks: [
      { title: 'Migrate Core API to Microservices', project: 'Platform 3.0', status: 'Completed', priority: 'High', efficiencyRating: 98 },
      { title: 'Design Real-time WebSocket Protocol', project: 'SyncEngine', status: 'In Progress', priority: 'High', efficiencyRating: 95 },
      { title: 'Optimize Bundle Size by 35%', project: 'Frontend Core', status: 'Completed', priority: 'Medium', efficiencyRating: 96 }
    ],
    monthlyHistory: generateMonthlyHistory(96, 98, 95)
  },
  {
    employeeId: 'EMP-1002',
    name: 'Aisha Al-Mansoor',
    email: 'aisha.mansoor@hrhub.io',
    phone: '+1 (555) 201-4412',
    department: 'Engineering',
    role: 'Lead Cloud Infrastructure Architect',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2020-07-01'),
    salary: 155000,
    experienceYears: 8,
    location: 'Austin, TX',
    managerName: 'Dr. Marcus Vance',
    metrics: { attendanceRate: 99, taskCompletionRate: 95, productivityScore: 96, projectContribution: 98, workEfficiency: 95, overallScore: 97 },
    performanceCategory: 'Exceptional',
    tags: ['Kubernetes', 'Multi-Cloud', 'Security Champ'],
    tasks: [
      { title: 'Deploy Multi-Region Kubernetes Cluster', project: 'InfraScale', status: 'Completed', priority: 'High', efficiencyRating: 99 },
      { title: 'SOC-2 Compliance Automation Pipeline', project: 'InfraSec', status: 'Completed', priority: 'High', efficiencyRating: 97 },
      { title: 'Terraform IaC Refactoring', project: 'DevOps', status: 'In Progress', priority: 'Medium', efficiencyRating: 93 }
    ],
    monthlyHistory: generateMonthlyHistory(97, 99, 96)
  },
  {
    employeeId: 'EMP-1003',
    name: 'Devon Takahashi',
    email: 'devon.t@hrhub.io',
    phone: '+1 (555) 201-4413',
    department: 'Engineering',
    role: 'AI / Machine Learning Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-01-10'),
    salary: 140000,
    experienceYears: 5,
    location: 'Seattle, WA',
    managerName: 'Dr. Marcus Vance',
    metrics: { attendanceRate: 92, taskCompletionRate: 90, productivityScore: 91, projectContribution: 88, workEfficiency: 90, overallScore: 90 },
    performanceCategory: 'Strong Performer',
    tags: ['LLMs', 'PyTorch', 'Vector Embeddings'],
    tasks: [
      { title: 'Fine-tune HR Analytics Recommendation Model', project: 'SmartHR AI', status: 'Completed', priority: 'High', efficiencyRating: 92 },
      { title: 'RAG Pipeline Latency Reduction', project: 'Knowledge AI', status: 'In Progress', priority: 'Medium', efficiencyRating: 89 }
    ],
    monthlyHistory: generateMonthlyHistory(90, 92, 91)
  },
  {
    employeeId: 'EMP-1004',
    name: 'Lucas Dupont',
    email: 'lucas.dupont@hrhub.io',
    phone: '+1 (555) 201-4414',
    department: 'Engineering',
    role: 'Junior Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-08-01'),
    salary: 78000,
    experienceYears: 1,
    location: 'New York, NY',
    managerName: 'Jordan Miller',
    metrics: { attendanceRate: 95, taskCompletionRate: 84, productivityScore: 82, projectContribution: 80, workEfficiency: 82, overallScore: 83 },
    performanceCategory: 'Strong Performer',
    tags: ['Tailwind', 'React', 'Fast Learner'],
    tasks: [
      { title: 'Build Glassmorphism Theme Component Kit', project: 'Design System', status: 'Completed', priority: 'Medium', efficiencyRating: 88 },
      { title: 'Fix Dashboard Chart Rendering Glitches', project: 'UI Polish', status: 'In Progress', priority: 'Medium', efficiencyRating: 80 }
    ],
    monthlyHistory: generateMonthlyHistory(83, 95, 82)
  },
  {
    employeeId: 'EMP-1005',
    name: 'Siddharth Rao',
    email: 'sid.rao@hrhub.io',
    phone: '+1 (555) 201-4415',
    department: 'Engineering',
    role: 'QA Automation Engineer',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-05-18'),
    salary: 92000,
    experienceYears: 4,
    location: 'Chicago, IL',
    managerName: 'Dr. Marcus Vance',
    metrics: { attendanceRate: 96, taskCompletionRate: 88, productivityScore: 86, projectContribution: 85, workEfficiency: 88, overallScore: 88 },
    performanceCategory: 'Strong Performer',
    tags: ['Playwright', 'Jest', 'CI/CD'],
    tasks: [
      { title: 'E2E Testing Suite for Employee Portal', project: 'Quality First', status: 'Completed', priority: 'High', efficiencyRating: 90 },
      { title: 'Automated Load Testing for 10k Users', project: 'Stress Test', status: 'In Progress', priority: 'Medium', efficiencyRating: 86 }
    ],
    monthlyHistory: generateMonthlyHistory(88, 96, 86)
  },
  {
    employeeId: 'EMP-1006',
    name: 'Chloe Bennett',
    email: 'chloe.b@hrhub.io',
    phone: '+1 (555) 201-4416',
    department: 'Engineering',
    role: 'DevOps & Site Reliability Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-11-05'),
    salary: 128000,
    experienceYears: 5,
    location: 'Denver, CO',
    managerName: 'Aisha Al-Mansoor',
    metrics: { attendanceRate: 97, taskCompletionRate: 94, productivityScore: 92, projectContribution: 91, workEfficiency: 93, overallScore: 93 },
    performanceCategory: 'Exceptional',
    tags: ['Prometheus', 'Grafana', 'Zero Downtime'],
    tasks: [
      { title: 'Alerting & Incident Response Runbook', project: 'SRE Ops', status: 'Completed', priority: 'High', efficiencyRating: 95 },
      { title: 'Grafana Performance Dashboards Setup', project: 'Telemetry', status: 'Completed', priority: 'Medium', efficiencyRating: 92 }
    ],
    monthlyHistory: generateMonthlyHistory(93, 97, 92)
  },
  {
    employeeId: 'EMP-1007',
    name: 'Ethan Cole',
    email: 'ethan.cole@hrhub.io',
    phone: '+1 (555) 201-4417',
    department: 'Engineering',
    role: 'Backend API Developer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-02-14'),
    salary: 95000,
    experienceYears: 3,
    location: 'San Francisco, CA',
    managerName: 'Jordan Miller',
    metrics: { attendanceRate: 72, taskCompletionRate: 64, productivityScore: 65, projectContribution: 62, workEfficiency: 68, overallScore: 66 },
    performanceCategory: 'Needs Improvement',
    tags: ['Node.js', 'PostgreSQL', 'Needs Support'],
    tasks: [
      { title: 'Refactor Auth Token Refresh Service', project: 'Security Patch', status: 'Overdue', priority: 'High', efficiencyRating: 62 },
      { title: 'Document REST Endpoints with OpenAPI', project: 'Docs', status: 'In Progress', priority: 'Low', efficiencyRating: 70 }
    ],
    monthlyHistory: generateMonthlyHistory(66, 72, 65)
  },
  {
    employeeId: 'EMP-1008',
    name: 'Zoe Washington',
    email: 'zoe.w@hrhub.io',
    phone: '+1 (555) 201-4418',
    department: 'Engineering',
    role: 'Database Administrator',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-09-20'),
    salary: 120000,
    experienceYears: 7,
    location: 'Atlanta, GA',
    managerName: 'Aisha Al-Mansoor',
    metrics: { attendanceRate: 94, taskCompletionRate: 89, productivityScore: 88, projectContribution: 87, workEfficiency: 89, overallScore: 89 },
    performanceCategory: 'Strong Performer',
    tags: ['MongoDB Atlas', 'Postgres Tuning', 'Sharding'],
    tasks: [
      { title: 'DB Query Index Optimization & Caching', project: 'DB Perf', status: 'Completed', priority: 'High', efficiencyRating: 91 },
      { title: 'Disaster Recovery Warm Standby Drill', project: 'Compliance', status: 'Completed', priority: 'High', efficiencyRating: 88 }
    ],
    monthlyHistory: generateMonthlyHistory(89, 94, 88)
  },
  {
    employeeId: 'EMP-1009',
    name: 'Mateo Rossi',
    email: 'mateo.rossi@hrhub.io',
    phone: '+1 (555) 201-4419',
    department: 'Engineering',
    role: 'Mobile Apps Engineer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-08-11'),
    salary: 110000,
    experienceYears: 4,
    location: 'Miami, FL',
    managerName: 'Jordan Miller',
    metrics: { attendanceRate: 88, taskCompletionRate: 82, productivityScore: 84, projectContribution: 81, workEfficiency: 83, overallScore: 83 },
    performanceCategory: 'Strong Performer',
    tags: ['React Native', 'iOS', 'Android'],
    tasks: [
      { title: 'Employee Attendance Geofencing Module', project: 'HR Hub Mobile', status: 'Completed', priority: 'Medium', efficiencyRating: 85 },
      { title: 'Biometric Push Authentication Support', project: 'HR Hub Mobile', status: 'In Progress', priority: 'Medium', efficiencyRating: 82 }
    ],
    monthlyHistory: generateMonthlyHistory(83, 88, 84)
  },
  {
    employeeId: 'EMP-1010',
    name: 'Kavita Patel',
    email: 'kavita.patel@hrhub.io',
    phone: '+1 (555) 201-4420',
    department: 'Engineering',
    role: 'Cybersecurity Analyst',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2020-04-12'),
    salary: 130000,
    experienceYears: 6,
    location: 'Boston, MA',
    managerName: 'Dr. Marcus Vance',
    metrics: { attendanceRate: 98, taskCompletionRate: 93, productivityScore: 94, projectContribution: 93, workEfficiency: 95, overallScore: 94 },
    performanceCategory: 'Exceptional',
    tags: ['Threat Intel', 'Zero Trust', 'PenTesting'],
    tasks: [
      { title: 'Penetration Testing on Reporting Engine', project: 'Audit', status: 'Completed', priority: 'High', efficiencyRating: 97 },
      { title: 'Employee 2FA Enforcement Rollout', project: 'Security', status: 'Completed', priority: 'High', efficiencyRating: 94 }
    ],
    monthlyHistory: generateMonthlyHistory(94, 98, 94)
  },
  {
    employeeId: 'EMP-1011',
    name: 'Liam O’Connor',
    email: 'liam.oc@hrhub.io',
    phone: '+1 (555) 201-4421',
    department: 'Engineering',
    role: 'Junior Full Stack Engineer',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-10-01'),
    salary: 76000,
    experienceYears: 1,
    location: 'Austin, TX',
    managerName: 'Jordan Miller',
    metrics: { attendanceRate: 65, taskCompletionRate: 58, productivityScore: 55, projectContribution: 56, workEfficiency: 60, overallScore: 58 },
    performanceCategory: 'Critical Attention',
    tags: ['Under Review', 'PIP Active', 'Needs Attendance Check'],
    tasks: [
      { title: 'Update CSV Export Format Helpers', project: 'Reporting', status: 'Overdue', priority: 'High', efficiencyRating: 54 },
      { title: 'Fix Notification Dropdown Alignment', project: 'Frontend', status: 'Pending', priority: 'Low', efficiencyRating: 60 }
    ],
    monthlyHistory: generateMonthlyHistory(58, 65, 55)
  },
  {
    employeeId: 'EMP-1012',
    name: 'Nadia Solis',
    email: 'nadia.solis@hrhub.io',
    phone: '+1 (555) 201-4422',
    department: 'Engineering',
    role: 'Senior Systems Engineer',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-06-25'),
    salary: 125000,
    experienceYears: 5,
    location: 'San Jose, CA',
    managerName: 'Aisha Al-Mansoor',
    metrics: { attendanceRate: 93, taskCompletionRate: 87, productivityScore: 89, projectContribution: 86, workEfficiency: 88, overallScore: 88 },
    performanceCategory: 'Strong Performer',
    tags: ['Linux Kernel', 'Networking', 'Containers'],
    tasks: [
      { title: 'Network Latency Tuning for Microservices', project: 'InfraScale', status: 'Completed', priority: 'Medium', efficiencyRating: 90 }
    ],
    monthlyHistory: generateMonthlyHistory(88, 93, 89)
  },

  // --- PRODUCT (8) ---
  {
    employeeId: 'EMP-1013',
    name: 'Elena Rostova',
    email: 'elena.rostova@hrhub.io',
    phone: '+1 (555) 301-5511',
    department: 'Product',
    role: 'VP of Product Strategy',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2019-11-10'),
    salary: 165000,
    experienceYears: 10,
    location: 'New York, NY',
    managerName: 'CEO Board',
    metrics: { attendanceRate: 99, taskCompletionRate: 98, productivityScore: 97, projectContribution: 98, workEfficiency: 96, overallScore: 98 },
    performanceCategory: 'Exceptional',
    tags: ['Executive Leadership', 'Roadmap', 'Strategy'],
    tasks: [
      { title: 'FY2027 Enterprise Product Roadmap Definition', project: 'Vision 2027', status: 'Completed', priority: 'High', efficiencyRating: 99 },
      { title: 'Stakeholder Quarterly Business Review', project: 'Executive Sync', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    monthlyHistory: generateMonthlyHistory(98, 99, 97)
  },
  {
    employeeId: 'EMP-1014',
    name: 'Tariq Sterling',
    email: 'tariq.s@hrhub.io',
    phone: '+1 (555) 301-5512',
    department: 'Product',
    role: 'Principal UX / UI Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-04-18'),
    salary: 130000,
    experienceYears: 7,
    location: 'San Francisco, CA',
    managerName: 'Elena Rostova',
    metrics: { attendanceRate: 96, taskCompletionRate: 94, productivityScore: 95, projectContribution: 96, workEfficiency: 94, overallScore: 95 },
    performanceCategory: 'Exceptional',
    tags: ['Design System', 'Figma Legend', 'Glassmorphism Design'],
    tasks: [
      { title: 'Design Glassmorphism Dashboard Master Specs', project: 'HR Hub Redesign', status: 'Completed', priority: 'High', efficiencyRating: 98 },
      { title: 'Accessibility (WCAG 2.1 AA) Compliance Audit', project: 'Inclusion UX', status: 'Completed', priority: 'High', efficiencyRating: 94 }
    ],
    monthlyHistory: generateMonthlyHistory(95, 96, 95)
  },
  {
    employeeId: 'EMP-1015',
    name: 'Camila Rodriguez',
    email: 'camila.r@hrhub.io',
    phone: '+1 (555) 301-5513',
    department: 'Product',
    role: 'Senior Product Manager - Analytics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-08-30'),
    salary: 125000,
    experienceYears: 6,
    location: 'Austin, TX',
    managerName: 'Elena Rostova',
    metrics: { attendanceRate: 94, taskCompletionRate: 91, productivityScore: 92, projectContribution: 90, workEfficiency: 91, overallScore: 91 },
    performanceCategory: 'Strong Performer',
    tags: ['Analytics PM', 'Data Driven', 'Scrum Master'],
    tasks: [
      { title: 'Launch Predictive HR Insights Feature', project: 'SmartHR AI', status: 'Completed', priority: 'High', efficiencyRating: 93 },
      { title: 'Define KPI Weighting Calibration Engine', project: 'Scoring Logic', status: 'In Progress', priority: 'High', efficiencyRating: 90 }
    ],
    monthlyHistory: generateMonthlyHistory(91, 94, 92)
  },
  {
    employeeId: 'EMP-1016',
    name: 'Arthur Pendelton',
    email: 'arthur.p@hrhub.io',
    phone: '+1 (555) 301-5514',
    department: 'Product',
    role: 'Product Operations Analyst',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-01-15'),
    salary: 82000,
    experienceYears: 2,
    location: 'Chicago, IL',
    managerName: 'Camila Rodriguez',
    metrics: { attendanceRate: 89, taskCompletionRate: 85, productivityScore: 84, projectContribution: 82, workEfficiency: 84, overallScore: 85 },
    performanceCategory: 'Strong Performer',
    tags: ['ProdOps', 'Jira Pro', 'Metrics'],
    tasks: [
      { title: 'Monthly Feature Usage Telemetry Report', project: 'Reporting', status: 'Completed', priority: 'Medium', efficiencyRating: 86 }
    ],
    monthlyHistory: generateMonthlyHistory(85, 89, 84)
  },
  {
    employeeId: 'EMP-1017',
    name: 'Maya Lin',
    email: 'maya.lin@hrhub.io',
    phone: '+1 (555) 301-5515',
    department: 'Product',
    role: 'UI Designer & Design Token Lead',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-09-12'),
    salary: 98000,
    experienceYears: 4,
    location: 'Seattle, WA',
    managerName: 'Tariq Sterling',
    metrics: { attendanceRate: 95, taskCompletionRate: 88, productivityScore: 87, projectContribution: 89, workEfficiency: 88, overallScore: 89 },
    performanceCategory: 'Strong Performer',
    tags: ['Design Tokens', 'Tailwind', 'Micro-interactions'],
    tasks: [
      { title: 'Create Dark Theme Color Harmony Palette', project: 'Design System', status: 'Completed', priority: 'Medium', efficiencyRating: 92 }
    ],
    monthlyHistory: generateMonthlyHistory(89, 95, 87)
  },
  {
    employeeId: 'EMP-1018',
    name: 'Derek Schultz',
    email: 'derek.s@hrhub.io',
    phone: '+1 (555) 301-5516',
    department: 'Product',
    role: 'User Researcher',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-03-01'),
    salary: 90000,
    experienceYears: 3,
    location: 'Denver, CO',
    managerName: 'Elena Rostova',
    metrics: { attendanceRate: 75, taskCompletionRate: 68, productivityScore: 70, projectContribution: 66, workEfficiency: 69, overallScore: 70 },
    performanceCategory: 'Meets Expectations',
    tags: ['User Interviews', 'Survey Logic', 'Needs Focus'],
    tasks: [
      { title: 'HR Manager Usability Interview Synthesis', project: 'UX Research', status: 'In Progress', priority: 'High', efficiencyRating: 72 }
    ],
    monthlyHistory: generateMonthlyHistory(70, 75, 70)
  },
  {
    employeeId: 'EMP-1019',
    name: 'Hana Takahashi',
    email: 'hana.t@hrhub.io',
    phone: '+1 (555) 301-5517',
    department: 'Product',
    role: 'Associate Product Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-09-01'),
    salary: 80000,
    experienceYears: 2,
    location: 'San Francisco, CA',
    managerName: 'Camila Rodriguez',
    metrics: { attendanceRate: 96, taskCompletionRate: 90, productivityScore: 91, projectContribution: 88, workEfficiency: 90, overallScore: 91 },
    performanceCategory: 'Strong Performer',
    tags: ['Agile', 'Sprint Planning', 'Energetic'],
    tasks: [
      { title: 'Document Quarterly Release Notes v2.4', project: 'Release', status: 'Completed', priority: 'Medium', efficiencyRating: 92 }
    ],
    monthlyHistory: generateMonthlyHistory(91, 96, 91)
  },
  {
    employeeId: 'EMP-1020',
    name: 'Felix Vance',
    email: 'felix.v@hrhub.io',
    phone: '+1 (555) 301-5518',
    department: 'Product',
    role: 'Technical Writer & Documentation PM',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-11-20'),
    salary: 85000,
    experienceYears: 4,
    location: 'Boston, MA',
    managerName: 'Elena Rostova',
    metrics: { attendanceRate: 92, taskCompletionRate: 86, productivityScore: 85, projectContribution: 84, workEfficiency: 86, overallScore: 86 },
    performanceCategory: 'Strong Performer',
    tags: ['Documentation', 'API Guides', 'Tutorials'],
    tasks: [
      { title: 'Comprehensive HR Hub User Onboarding Guide', project: 'Docs', status: 'Completed', priority: 'Medium', efficiencyRating: 88 }
    ],
    monthlyHistory: generateMonthlyHistory(86, 92, 85)
  },

  // --- MARKETING (9) ---
  {
    employeeId: 'EMP-1021',
    name: 'Sophia Sterling',
    email: 'sophia.s@hrhub.io',
    phone: '+1 (555) 401-6611',
    department: 'Marketing',
    role: 'Chief Marketing Officer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2020-02-15'),
    salary: 160000,
    experienceYears: 11,
    location: 'New York, NY',
    managerName: 'CEO Board',
    metrics: { attendanceRate: 98, taskCompletionRate: 96, productivityScore: 97, projectContribution: 95, workEfficiency: 96, overallScore: 96 },
    performanceCategory: 'Exceptional',
    tags: ['Brand Builder', 'Growth Vision', 'Public Speaker'],
    tasks: [
      { title: 'Global Brand Refresh & Tech Summit Keynote', project: 'Rebrand 2026', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    monthlyHistory: generateMonthlyHistory(96, 98, 97)
  },
  {
    employeeId: 'EMP-1022',
    name: 'Lucas Morel',
    email: 'lucas.m@hrhub.io',
    phone: '+1 (555) 401-6612',
    department: 'Marketing',
    role: 'Performance Marketing Lead',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-05-10'),
    salary: 115000,
    experienceYears: 5,
    location: 'Austin, TX',
    managerName: 'Sophia Sterling',
    metrics: { attendanceRate: 95, taskCompletionRate: 92, productivityScore: 94, projectContribution: 91, workEfficiency: 93, overallScore: 93 },
    performanceCategory: 'Exceptional',
    tags: ['Paid Media', 'ROAS Optimization', 'Funnel Analytics'],
    tasks: [
      { title: 'Scale Q3 Inbound Paid Ads to 4.2x ROAS', project: 'Acquisition', status: 'Completed', priority: 'High', efficiencyRating: 95 }
    ],
    monthlyHistory: generateMonthlyHistory(93, 95, 94)
  },
  {
    employeeId: 'EMP-1023',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@hrhub.io',
    phone: '+1 (555) 401-6613',
    department: 'Marketing',
    role: 'Content Strategist & Copywriter',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-07-15'),
    salary: 85000,
    experienceYears: 4,
    location: 'Chicago, IL',
    managerName: 'Sophia Sterling',
    metrics: { attendanceRate: 92, taskCompletionRate: 88, productivityScore: 89, projectContribution: 86, workEfficiency: 88, overallScore: 89 },
    performanceCategory: 'Strong Performer',
    tags: ['SEO', 'Thought Leadership', 'Case Studies'],
    tasks: [
      { title: 'Publish 10 Enterprise HR Case Studies', project: 'Content Engine', status: 'Completed', priority: 'Medium', efficiencyRating: 90 }
    ],
    monthlyHistory: generateMonthlyHistory(89, 92, 89)
  },
  {
    employeeId: 'EMP-1024',
    name: 'Devin Harper',
    email: 'devin.h@hrhub.io',
    phone: '+1 (555) 401-6614',
    department: 'Marketing',
    role: 'Social Media & Community Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-04-01'),
    salary: 72000,
    experienceYears: 2,
    location: 'San Francisco, CA',
    managerName: 'Sophia Sterling',
    metrics: { attendanceRate: 78, taskCompletionRate: 69, productivityScore: 68, projectContribution: 65, workEfficiency: 70, overallScore: 70 },
    performanceCategory: 'Meets Expectations',
    tags: ['Social', 'Community', 'Needs Consistency'],
    tasks: [
      { title: 'Grow LinkedIn Followers by 50%', project: 'Social Growth', status: 'In Progress', priority: 'Medium', efficiencyRating: 70 }
    ],
    monthlyHistory: generateMonthlyHistory(70, 78, 68)
  },
  {
    employeeId: 'EMP-1025',
    name: 'Isabella Garcia',
    email: 'isabella.g@hrhub.io',
    phone: '+1 (555) 401-6615',
    department: 'Marketing',
    role: 'Event & Conference Coordinator',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-01-20'),
    salary: 80000,
    experienceYears: 3,
    location: 'Miami, FL',
    managerName: 'Sophia Sterling',
    metrics: { attendanceRate: 96, taskCompletionRate: 91, productivityScore: 90, projectContribution: 92, workEfficiency: 89, overallScore: 91 },
    performanceCategory: 'Strong Performer',
    tags: ['Events', 'Webinars', 'Logistics Pro'],
    tasks: [
      { title: 'Coordinate Annual HR Tech Expo Booth', project: 'Events', status: 'Completed', priority: 'High', efficiencyRating: 93 }
    ],
    monthlyHistory: generateMonthlyHistory(91, 96, 90)
  },
  {
    employeeId: 'EMP-1026',
    name: 'Oliver Thorne',
    email: 'oliver.t@hrhub.io',
    phone: '+1 (555) 401-6616',
    department: 'Marketing',
    role: 'SEO & Organic Growth Specialist',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-10-15'),
    salary: 95000,
    experienceYears: 5,
    location: 'Seattle, WA',
    managerName: 'Lucas Morel',
    metrics: { attendanceRate: 91, taskCompletionRate: 87, productivityScore: 86, projectContribution: 84, workEfficiency: 88, overallScore: 87 },
    performanceCategory: 'Strong Performer',
    tags: ['Technical SEO', 'Keyword Strategy', 'Backlinks'],
    tasks: [
      { title: 'Target 50 High-Volume HR Keywords', project: 'Organic SEO', status: 'Completed', priority: 'Medium', efficiencyRating: 88 }
    ],
    monthlyHistory: generateMonthlyHistory(87, 91, 86)
  },
  {
    employeeId: 'EMP-1027',
    name: 'Grace Kim',
    email: 'grace.kim@hrhub.io',
    phone: '+1 (555) 401-6617',
    department: 'Marketing',
    role: 'Graphic & Brand Asset Designer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-04-10'),
    salary: 86000,
    experienceYears: 4,
    location: 'Los Angeles, CA',
    managerName: 'Sophia Sterling',
    metrics: { attendanceRate: 94, taskCompletionRate: 92, productivityScore: 93, projectContribution: 90, workEfficiency: 92, overallScore: 92 },
    performanceCategory: 'Exceptional',
    tags: ['Illustration', 'Marketing Creatives', 'Motion Graphics'],
    tasks: [
      { title: 'Produce 12 Video Ad Motion Graphics', project: 'Ad Creatives', status: 'Completed', priority: 'High', efficiencyRating: 94 }
    ],
    monthlyHistory: generateMonthlyHistory(92, 94, 93)
  },
  {
    employeeId: 'EMP-1028',
    name: 'Samuel Okoye',
    email: 'samuel.o@hrhub.io',
    phone: '+1 (555) 401-6618',
    department: 'Marketing',
    role: 'Email Marketing & CRM Automation Lead',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-03-05'),
    salary: 88000,
    experienceYears: 3,
    location: 'Atlanta, GA',
    managerName: 'Lucas Morel',
    metrics: { attendanceRate: 85, taskCompletionRate: 78, productivityScore: 79, projectContribution: 76, workEfficiency: 80, overallScore: 80 },
    performanceCategory: 'Meets Expectations',
    tags: ['HubSpot', 'Customer Journeys', 'Drip Campaigns'],
    tasks: [
      { title: 'Customer Re-engagement Automated Drip Sequence', project: 'CRM', status: 'In Progress', priority: 'Medium', efficiencyRating: 81 }
    ],
    monthlyHistory: generateMonthlyHistory(80, 85, 79)
  },
  {
    employeeId: 'EMP-1029',
    name: 'Hannah Abbott',
    email: 'hannah.a@hrhub.io',
    phone: '+1 (555) 401-6619',
    department: 'Marketing',
    role: 'PR & Corporate Communications Associate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-08-15'),
    salary: 74000,
    experienceYears: 2,
    location: 'New York, NY',
    managerName: 'Sophia Sterling',
    metrics: { attendanceRate: 68, taskCompletionRate: 60, productivityScore: 62, projectContribution: 58, workEfficiency: 63, overallScore: 62 },
    performanceCategory: 'Needs Improvement',
    tags: ['Media Relations', 'Press Releases', 'Attendance Alert'],
    tasks: [
      { title: 'Quarterly Industry Press Release Pitching', project: 'PR', status: 'Overdue', priority: 'High', efficiencyRating: 60 }
    ],
    monthlyHistory: generateMonthlyHistory(62, 68, 62)
  },

  // --- SALES (9) ---
  {
    employeeId: 'EMP-1030',
    name: 'Alexander Hayes',
    email: 'alexander.h@hrhub.io',
    phone: '+1 (555) 501-7711',
    department: 'Sales',
    role: 'Head of Global Enterprise Sales',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2019-09-01'),
    salary: 175000,
    experienceYears: 12,
    location: 'Chicago, IL',
    managerName: 'CEO Board',
    metrics: { attendanceRate: 98, taskCompletionRate: 97, productivityScore: 98, projectContribution: 99, workEfficiency: 96, overallScore: 98 },
    performanceCategory: 'Exceptional',
    tags: ['Sales Rainmaker', 'Deal Closer', 'Enterprise B2B'],
    tasks: [
      { title: 'Close Fortune 500 Global HR Enterprise Contract', project: 'Enterprise Pipeline', status: 'Completed', priority: 'High', efficiencyRating: 99 }
    ],
    monthlyHistory: generateMonthlyHistory(98, 98, 98)
  },
  {
    employeeId: 'EMP-1031',
    name: 'Rachel Zimmer',
    email: 'rachel.z@hrhub.io',
    phone: '+1 (555) 501-7712',
    department: 'Sales',
    role: 'Senior Strategic Account Executive',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-02-10'),
    salary: 140000,
    experienceYears: 7,
    location: 'New York, NY',
    managerName: 'Alexander Hayes',
    metrics: { attendanceRate: 96, taskCompletionRate: 95, productivityScore: 94, projectContribution: 96, workEfficiency: 93, overallScore: 95 },
    performanceCategory: 'Exceptional',
    tags: ['Quota Crusher', 'B2B SaaS', 'Contract Negotiations'],
    tasks: [
      { title: 'Achieve 135% of Q3 Strategic Quota', project: 'Sales Quota', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    monthlyHistory: generateMonthlyHistory(95, 96, 94)
  },
  {
    employeeId: 'EMP-1032',
    name: 'Julian Mercer',
    email: 'julian.m@hrhub.io',
    phone: '+1 (555) 501-7713',
    department: 'Sales',
    role: 'Enterprise Account Executive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-04-15'),
    salary: 120000,
    experienceYears: 5,
    location: 'San Francisco, CA',
    managerName: 'Alexander Hayes',
    metrics: { attendanceRate: 92, taskCompletionRate: 88, productivityScore: 89, projectContribution: 87, workEfficiency: 89, overallScore: 89 },
    performanceCategory: 'Strong Performer',
    tags: ['Tech Sales', 'Solution Selling', 'Client Relations'],
    tasks: [
      { title: 'Onboard 4 New Enterprise Multi-Year Accounts', project: 'Accounts', status: 'Completed', priority: 'High', efficiencyRating: 91 }
    ],
    monthlyHistory: generateMonthlyHistory(89, 92, 89)
  },
  {
    employeeId: 'EMP-1033',
    name: 'Leila Farouk',
    email: 'leila.f@hrhub.io',
    phone: '+1 (555) 501-7714',
    department: 'Sales',
    role: 'Sales Development Representative Lead',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-09-01'),
    salary: 85000,
    experienceYears: 3,
    location: 'Austin, TX',
    managerName: 'Alexander Hayes',
    metrics: { attendanceRate: 95, taskCompletionRate: 90, productivityScore: 92, projectContribution: 89, workEfficiency: 91, overallScore: 91 },
    performanceCategory: 'Strong Performer',
    tags: ['Outbound Pipeline', 'Cold Calling Pro', 'Salesforce'],
    tasks: [
      { title: 'Book 85 Enterprise Qualified Demos in Q3', project: 'SDR Campaign', status: 'Completed', priority: 'High', efficiencyRating: 94 }
    ],
    monthlyHistory: generateMonthlyHistory(91, 95, 92)
  },
  {
    employeeId: 'EMP-1034',
    name: 'Mason Brooks',
    email: 'mason.b@hrhub.io',
    phone: '+1 (555) 501-7715',
    department: 'Sales',
    role: 'Customer Success & Retention Manager',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-12-05'),
    salary: 98000,
    experienceYears: 4,
    location: 'Denver, CO',
    managerName: 'Alexander Hayes',
    metrics: { attendanceRate: 94, taskCompletionRate: 89, productivityScore: 88, projectContribution: 91, workEfficiency: 87, overallScore: 90 },
    performanceCategory: 'Strong Performer',
    tags: ['Net Retention 118%', 'Client Happiness', 'Renewal Expert'],
    tasks: [
      { title: 'Execute Annual Contract Renewals with 0% Churn', project: 'CS Retention', status: 'Completed', priority: 'High', efficiencyRating: 92 }
    ],
    monthlyHistory: generateMonthlyHistory(90, 94, 88)
  },
  {
    employeeId: 'EMP-1035',
    name: 'Jessica Vance',
    email: 'jessica.v@hrhub.io',
    phone: '+1 (555) 501-7716',
    department: 'Sales',
    role: 'Sales Operations & Enablement Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-02-15'),
    salary: 82000,
    experienceYears: 3,
    location: 'Boston, MA',
    managerName: 'Alexander Hayes',
    metrics: { attendanceRate: 91, taskCompletionRate: 85, productivityScore: 86, projectContribution: 83, workEfficiency: 86, overallScore: 86 },
    performanceCategory: 'Strong Performer',
    tags: ['Sales Enablement', 'Salesforce Admin', 'Playbooks'],
    tasks: [
      { title: 'Update Enterprise Sales Playbook & Pitch Deck', project: 'Enablement', status: 'Completed', priority: 'Medium', efficiencyRating: 87 }
    ],
    monthlyHistory: generateMonthlyHistory(86, 91, 86)
  },
  {
    employeeId: 'EMP-1036',
    name: 'Tyler Reed',
    email: 'tyler.r@hrhub.io',
    phone: '+1 (555) 501-7717',
    department: 'Sales',
    role: 'Junior Sales Representative',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-11-01'),
    salary: 68000,
    experienceYears: 1,
    location: 'Chicago, IL',
    managerName: 'Leila Farouk',
    metrics: { attendanceRate: 70, taskCompletionRate: 62, productivityScore: 61, projectContribution: 60, workEfficiency: 65, overallScore: 64 },
    performanceCategory: 'Needs Improvement',
    tags: ['Onboarding', 'Needs Pipeline Training', 'Missed Targets'],
    tasks: [
      { title: 'Outbound Prospecting Cold Call Quota (500)', project: 'Pipeline', status: 'In Progress', priority: 'High', efficiencyRating: 62 }
    ],
    monthlyHistory: generateMonthlyHistory(64, 70, 61)
  },
  {
    employeeId: 'EMP-1037',
    name: 'Ananya Sharma',
    email: 'ananya.s@hrhub.io',
    phone: '+1 (555) 501-7718',
    department: 'Sales',
    role: 'Solutions Engineer / Pre-Sales Tech Architect',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-08-20'),
    salary: 135000,
    experienceYears: 6,
    location: 'San Jose, CA',
    managerName: 'Alexander Hayes',
    metrics: { attendanceRate: 97, taskCompletionRate: 95, productivityScore: 96, projectContribution: 94, workEfficiency: 95, overallScore: 95 },
    performanceCategory: 'Exceptional',
    tags: ['Pre-Sales', 'API Integrations', 'Technical RFPs'],
    tasks: [
      { title: 'Deliver Custom Live PoC Demo for Tech Conglomerate', project: 'High-Value Deals', status: 'Completed', priority: 'High', efficiencyRating: 98 }
    ],
    monthlyHistory: generateMonthlyHistory(95, 97, 96)
  },
  {
    employeeId: 'EMP-1038',
    name: 'Brandon Walsh',
    email: 'brandon.w@hrhub.io',
    phone: '+1 (555) 501-7719',
    department: 'Sales',
    role: 'Commercial Account Executive',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-06-10'),
    salary: 105000,
    experienceYears: 4,
    location: 'Austin, TX',
    managerName: 'Alexander Hayes',
    metrics: { attendanceRate: 89, taskCompletionRate: 84, productivityScore: 85, projectContribution: 82, workEfficiency: 86, overallScore: 85 },
    performanceCategory: 'Strong Performer',
    tags: ['Mid-Market', 'Demo Specialist', 'Pipeline Builder'],
    tasks: [
      { title: 'Expand Mid-Market Tier Accounts by 25%', project: 'Expansion', status: 'Completed', priority: 'Medium', efficiencyRating: 86 }
    ],
    monthlyHistory: generateMonthlyHistory(85, 89, 85)
  },

  // --- HUMAN RESOURCES (7) ---
  {
    employeeId: 'EMP-1039',
    name: 'Victoria Chen',
    email: 'victoria.chen@hrhub.io',
    phone: '+1 (555) 601-8811',
    department: 'Human Resources',
    role: 'Chief People Officer / HR Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2019-05-01'),
    salary: 170000,
    experienceYears: 13,
    location: 'San Francisco, CA',
    managerName: 'CEO Board',
    metrics: { attendanceRate: 99, taskCompletionRate: 98, productivityScore: 98, projectContribution: 99, workEfficiency: 97, overallScore: 98 },
    performanceCategory: 'Exceptional',
    tags: ['HR Strategy', 'Culture Architect', 'Talent Visionary'],
    tasks: [
      { title: 'Orchestrate Annual Workforce Performance Framework', project: 'HR Hub Initiative', status: 'Completed', priority: 'High', efficiencyRating: 99 },
      { title: 'Design Employee Retention and Wellbeing Program', project: 'Culture 2026', status: 'Completed', priority: 'High', efficiencyRating: 98 }
    ],
    monthlyHistory: generateMonthlyHistory(98, 99, 98)
  },
  {
    employeeId: 'EMP-1040',
    name: 'Kwame Mensah',
    email: 'kwame.m@hrhub.io',
    phone: '+1 (555) 601-8812',
    department: 'Human Resources',
    role: 'Senior Talent Acquisition Lead',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-03-20'),
    salary: 110000,
    experienceYears: 6,
    location: 'Austin, TX',
    managerName: 'Victoria Chen',
    metrics: { attendanceRate: 97, taskCompletionRate: 94, productivityScore: 95, projectContribution: 93, workEfficiency: 94, overallScore: 95 },
    performanceCategory: 'Exceptional',
    tags: ['Headhunting', 'Tech Recruiting', 'Diversity Hiring'],
    tasks: [
      { title: 'Close 15 Senior Engineering Hires within 45 Days', project: 'HyperGrowth', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    monthlyHistory: generateMonthlyHistory(95, 97, 95)
  },
  {
    employeeId: 'EMP-1041',
    name: 'Serena Sterling',
    email: 'serena.s@hrhub.io',
    phone: '+1 (555) 601-8813',
    department: 'Human Resources',
    role: 'HR Business Partner (HRBP)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2021-09-15'),
    salary: 115000,
    experienceYears: 5,
    location: 'New York, NY',
    managerName: 'Victoria Chen',
    metrics: { attendanceRate: 96, taskCompletionRate: 92, productivityScore: 93, projectContribution: 91, workEfficiency: 93, overallScore: 93 },
    performanceCategory: 'Exceptional',
    tags: ['Employee Relations', 'Org Health', 'Conflict Resolution'],
    tasks: [
      { title: 'Conduct Department Pulse Checks & Manager Calibration', project: 'People Ops', status: 'Completed', priority: 'High', efficiencyRating: 94 }
    ],
    monthlyHistory: generateMonthlyHistory(93, 96, 93)
  },
  {
    employeeId: 'EMP-1042',
    name: 'Liam Gallagher',
    email: 'liam.g@hrhub.io',
    phone: '+1 (555) 601-8814',
    department: 'Human Resources',
    role: 'Compensation & Benefits Specialist',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-02-01'),
    salary: 95000,
    experienceYears: 4,
    location: 'Chicago, IL',
    managerName: 'Victoria Chen',
    metrics: { attendanceRate: 93, taskCompletionRate: 88, productivityScore: 89, projectContribution: 87, workEfficiency: 89, overallScore: 89 },
    performanceCategory: 'Strong Performer',
    tags: ['Salary Benchmarking', 'Equity Grants', '401k & Healthcare'],
    tasks: [
      { title: 'Annual Industry Compensation Benchmarking Audit', project: 'Total Rewards', status: 'Completed', priority: 'High', efficiencyRating: 91 }
    ],
    monthlyHistory: generateMonthlyHistory(89, 93, 89)
  },
  {
    employeeId: 'EMP-1043',
    name: 'Maya Henderson',
    email: 'maya.h@hrhub.io',
    phone: '+1 (555) 601-8815',
    department: 'Human Resources',
    role: 'Learning & Organizational Development Specialist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2022-08-15'),
    salary: 90000,
    experienceYears: 4,
    location: 'Seattle, WA',
    managerName: 'Victoria Chen',
    metrics: { attendanceRate: 95, taskCompletionRate: 90, productivityScore: 91, projectContribution: 88, workEfficiency: 92, overallScore: 91 },
    performanceCategory: 'Strong Performer',
    tags: ['Leadership Academy', 'Skills Training', 'Workshops'],
    tasks: [
      { title: 'Rollout Engineering Manager Leadership Masterclass', project: 'Upskill Hub', status: 'Completed', priority: 'Medium', efficiencyRating: 92 }
    ],
    monthlyHistory: generateMonthlyHistory(91, 95, 91)
  },
  {
    employeeId: 'EMP-1044',
    name: 'Noah Sinclair',
    email: 'noah.s@hrhub.io',
    phone: '+1 (555) 601-8816',
    department: 'Human Resources',
    role: 'People Operations Coordinator',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2023-05-10'),
    salary: 70000,
    experienceYears: 2,
    location: 'Denver, CO',
    managerName: 'Serena Sterling',
    metrics: { attendanceRate: 88, taskCompletionRate: 83, productivityScore: 84, projectContribution: 81, workEfficiency: 85, overallScore: 84 },
    performanceCategory: 'Strong Performer',
    tags: ['Onboarding', 'HR Records', 'Compliance'],
    tasks: [
      { title: 'Streamline Digital Onboarding Checklist Automation', project: 'Onboarding Flow', status: 'Completed', priority: 'Medium', efficiencyRating: 86 }
    ],
    monthlyHistory: generateMonthlyHistory(84, 88, 84)
  },
  {
    employeeId: 'EMP-1045',
    name: 'Kendra Adams',
    email: 'kendra.adams@hrhub.io',
    phone: '+1 (555) 601-8817',
    department: 'Human Resources',
    role: 'HR Analytics Intern',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    joinDate: new Date('2024-01-08'),
    salary: 52000,
    experienceYears: 1,
    location: 'San Francisco, CA',
    managerName: 'Victoria Chen',
    metrics: { attendanceRate: 98, taskCompletionRate: 92, productivityScore: 90, projectContribution: 89, workEfficiency: 91, overallScore: 92 },
    performanceCategory: 'Exceptional',
    tags: ['Analytics Intern', 'Data Visualization', 'High Potential'],
    tasks: [
      { title: 'Build HR Capstone Analytics Verification Datasets', project: 'HR Hub Initiative', status: 'Completed', priority: 'High', efficiencyRating: 95 }
    ],
    monthlyHistory: generateMonthlyHistory(92, 98, 90)
  }
];
