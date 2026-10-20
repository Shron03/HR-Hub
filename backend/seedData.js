export const departmentsData = [
  {
    name: 'Engineering',
    code: 'ENG',
    headOfDepartment: 'Dr. Marcus Vance',
    budget: 850000,
    color: '#06b6d4',
    description: 'Core software development, cloud infrastructure, AI models, and QA engineering.',
    targetPerformanceScore: 88
  },
  {
    name: 'Product',
    code: 'PROD',
    headOfDepartment: 'Elena Rostova',
    budget: 450000,
    color: '#8b5cf6',
    description: 'Product lifecycle strategy, roadmapping, UI/UX design, and user research.',
    targetPerformanceScore: 86
  },
  {
    name: 'Marketing',
    code: 'MKT',
    headOfDepartment: 'Sophia Sterling',
    budget: 380000,
    color: '#ec4899',
    description: 'Brand awareness, digital growth campaigns, public relations, and content marketing.',
    targetPerformanceScore: 84
  },
  {
    name: 'Sales',
    code: 'SLS',
    headOfDepartment: 'Alexander Hayes',
    budget: 620000,
    color: '#f59e0b',
    description: 'B2B enterprise pipeline, client acquisition, customer partnerships, and revenue generation.',
    targetPerformanceScore: 85
  },
  {
    name: 'Human Resources',
    code: 'HR',
    headOfDepartment: 'Victoria Chen',
    budget: 290000,
    color: '#10b981',
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
    const variance = (idx - 2.5) * 1.2;
    const att = Math.min(100, Math.max(65, Math.round(baseAttendance + (Math.sin(idx) * 3) + variance)));
    const prod = Math.min(100, Math.max(60, Math.round(baseProd + (Math.cos(idx) * 4) + variance)));
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
  // Engineering (3)
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
    tags: ['Kubernetes', 'Multi-Cloud', 'Security Lead'],
    tasks: [
      { title: 'Deploy Multi-Region Kubernetes Cluster', project: 'InfraScale', status: 'Completed', priority: 'High', efficiencyRating: 99 },
      { title: 'SOC-2 Compliance Automation Pipeline', project: 'InfraSec', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    monthlyHistory: generateMonthlyHistory(97, 99, 96)
  },
  {
    employeeId: 'EMP-1003',
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

  // Product (3)
  {
    employeeId: 'EMP-1004',
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
    managerName: 'Executive Committee',
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
    employeeId: 'EMP-1005',
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
    tags: ['Design System', 'Figma Pro', 'UX Architecture'],
    tasks: [
      { title: 'Design Modern Dashboard Master Specs', project: 'HR Hub Redesign', status: 'Completed', priority: 'High', efficiencyRating: 98 },
      { title: 'Accessibility Compliance Audit', project: 'Inclusion UX', status: 'Completed', priority: 'High', efficiencyRating: 94 }
    ],
    monthlyHistory: generateMonthlyHistory(95, 96, 95)
  },
  {
    employeeId: 'EMP-1006',
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

  // Marketing (3)
  {
    employeeId: 'EMP-1007',
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
    managerName: 'Executive Committee',
    metrics: { attendanceRate: 98, taskCompletionRate: 96, productivityScore: 97, projectContribution: 95, workEfficiency: 96, overallScore: 96 },
    performanceCategory: 'Exceptional',
    tags: ['Brand Builder', 'Growth Vision', 'Strategy'],
    tasks: [
      { title: 'Global Brand Campaign Refresh', project: 'Rebrand 2026', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    monthlyHistory: generateMonthlyHistory(96, 98, 97)
  },
  {
    employeeId: 'EMP-1008',
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
    employeeId: 'EMP-1009',
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

  // Sales (3)
  {
    employeeId: 'EMP-1010',
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
    managerName: 'Executive Committee',
    metrics: { attendanceRate: 98, taskCompletionRate: 97, productivityScore: 98, projectContribution: 99, workEfficiency: 96, overallScore: 98 },
    performanceCategory: 'Exceptional',
    tags: ['Deal Closer', 'Enterprise B2B', 'Revenue Strategy'],
    tasks: [
      { title: 'Close Global HR Enterprise Contract', project: 'Enterprise Pipeline', status: 'Completed', priority: 'High', efficiencyRating: 99 }
    ],
    monthlyHistory: generateMonthlyHistory(98, 98, 98)
  },
  {
    employeeId: 'EMP-1011',
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
    tags: ['Quota Crusher', 'B2B SaaS', 'Negotiations'],
    tasks: [
      { title: 'Achieve 135% of Strategic Quota', project: 'Sales Quota', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    monthlyHistory: generateMonthlyHistory(95, 96, 94)
  },
  {
    employeeId: 'EMP-1012',
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
    managerName: 'Alexander Hayes',
    metrics: { attendanceRate: 70, taskCompletionRate: 62, productivityScore: 61, projectContribution: 60, workEfficiency: 65, overallScore: 64 },
    performanceCategory: 'Needs Improvement',
    tags: ['Onboarding', 'Needs Pipeline Training', 'Missed Targets'],
    tasks: [
      { title: 'Outbound Prospecting Cold Call Quota', project: 'Pipeline', status: 'In Progress', priority: 'High', efficiencyRating: 62 }
    ],
    monthlyHistory: generateMonthlyHistory(64, 70, 61)
  },

  // Human Resources (3)
  {
    employeeId: 'EMP-1013',
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
    managerName: 'Executive Committee',
    metrics: { attendanceRate: 99, taskCompletionRate: 98, productivityScore: 98, projectContribution: 99, workEfficiency: 97, overallScore: 98 },
    performanceCategory: 'Exceptional',
    tags: ['HR Strategy', 'Culture Architect', 'Talent Lead'],
    tasks: [
      { title: 'Orchestrate Annual Workforce Performance Framework', project: 'HR Hub Initiative', status: 'Completed', priority: 'High', efficiencyRating: 99 }
    ],
    monthlyHistory: generateMonthlyHistory(98, 99, 98)
  },
  {
    employeeId: 'EMP-1014',
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
    tags: ['Headhunting', 'Tech Recruiting', 'Talent Ops'],
    tasks: [
      { title: 'Close 15 Senior Hires', project: 'HyperGrowth', status: 'Completed', priority: 'High', efficiencyRating: 97 }
    ],
    monthlyHistory: generateMonthlyHistory(95, 97, 95)
  },
  {
    employeeId: 'EMP-1015',
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
    managerName: 'Victoria Chen',
    metrics: { attendanceRate: 88, taskCompletionRate: 83, productivityScore: 84, projectContribution: 81, workEfficiency: 85, overallScore: 84 },
    performanceCategory: 'Strong Performer',
    tags: ['Onboarding', 'HR Records', 'Compliance'],
    tasks: [
      { title: 'Streamline Digital Onboarding Checklist', project: 'Onboarding Flow', status: 'Completed', priority: 'Medium', efficiencyRating: 86 }
    ],
    monthlyHistory: generateMonthlyHistory(84, 88, 84)
  }
];
