import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  project: { type: String, default: 'Internal Deliverable' },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    default: 'In Progress'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  efficiencyRating: { type: Number, min: 0, max: 100, default: 85 }
}, { timestamps: true });

const MonthlyHistorySchema = new mongoose.Schema({
  month: { type: String, required: true },
  attendance: { type: Number, min: 0, max: 100, required: true },
  productivity: { type: Number, min: 0, max: 100, required: true },
  tasksCompleted: { type: Number, default: 0 },
  overallScore: { type: Number, min: 0, max: 100, required: true }
});

const FeedbackSchema = new mongoose.Schema({
  from: { type: String, default: 'Priya Sharma (HR Director)' },
  message: { type: String, required: true },
  category: {
    type: String,
    enum: ['Appraisal', 'Recognition', 'Improvement Plan', 'General Notice'],
    default: 'Recognition'
  },
  date: { type: Date, default: Date.now }
});

const LeaveRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Casual Leave', 'Sick Leave', 'Privilege Leave', 'Work From Home'],
    default: 'Casual Leave'
  },
  reason: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  days: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  appliedAt: { type: Date, default: Date.now },
  decisionNote: { type: String, default: '' }
});

const EmployeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Employee email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: { type: String, default: '+91 98765 43210' },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources']
  },
  role: {
    type: String,
    required: [true, 'Role title is required'],
    trim: true
  },
  initials: { type: String, default: 'EM' },
  avatarBg: { type: String, default: '#2563eb' },
  joinDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Probation', 'Notice Period', 'Terminated', 'Absent'],
    default: 'Active'
  },
  salary: { type: Number, default: 850000 }, // Annual CTC in INR
  compensation: {
    baseSalary: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    bonusReason: { type: String, default: 'Performance KPI Incentive' },
    pfDeduction: { type: Number, default: 0 },
    professionalTax: { type: Number, default: 200 },
    tdsDeduction: { type: Number, default: 0 },
    lopDeduction: { type: Number, default: 0 },
    customDeductions: { type: Number, default: 0 },
    customDeductionReason: { type: String, default: '' },
    netMonthlySalary: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'Processed' },
    lastRevisedDate: { type: Date, default: Date.now }
  },
  designationHistory: [{
    previousRole: String,
    newRole: String,
    previousDepartment: String,
    newDepartment: String,
    reason: String,
    effectiveDate: { type: Date, default: Date.now },
    updatedBy: { type: String, default: 'Priya Sharma (HR Director)' }
  }],
  location: { type: String, default: 'Bengaluru, India' },
  workMode: {
    type: String,
    enum: ['On-site', 'Hybrid', 'Remote'],
    default: 'Hybrid'
  },
  managerName: { type: String, default: 'Executive Committee' },
  experienceYears: { type: Number, default: 3 },

  // Real-time KPI Data based on Tasks Given/Completed and Review Score (0.0 to 10.0)
  kpiData: {
    tasksGiven: { type: Number, default: 20 },
    tasksCompleted: { type: Number, default: 18 },
    reviewScore: { type: Number, min: 0, max: 10, default: 8.5 }, // 0.0 to 10.0 scale, 0.1 step
    attendanceRate: { type: Number, min: 0, max: 100, default: 92 },
    projectContribution: { type: Number, min: 0, max: 100, default: 85 },
    workEfficiency: { type: Number, min: 0, max: 100, default: 86 }
  },

  metrics: {
    attendanceRate: { type: Number, min: 0, max: 100, default: 92 },
    taskCompletionRate: { type: Number, min: 0, max: 100, default: 90 },
    productivityScore: { type: Number, min: 0, max: 100, default: 85 },
    projectContribution: { type: Number, min: 0, max: 100, default: 85 },
    workEfficiency: { type: Number, min: 0, max: 100, default: 86 },
    overallScore: { type: Number, min: 0, max: 100, default: 88 }
  },

  performanceCategory: {
    type: String,
    enum: ['Exceptional', 'Strong Performer', 'Meets Expectations', 'Needs Improvement', 'Critical Attention'],
    default: 'Strong Performer'
  },

  tasks: [TaskSchema],
  monthlyHistory: [MonthlyHistorySchema],
  feedbacks: [FeedbackSchema],
  leaveRequests: [LeaveRequestSchema],
  tags: [{ type: String }],
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

// Auto-derive Initials & Performance KPI before saving
EmployeeSchema.pre('save', function (next) {
  // Generate initials from Indian full name
  if (this.name) {
    const parts = this.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      this.initials = `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    } else if (parts.length === 1 && parts[0].length >= 1) {
      this.initials = parts[0].substring(0, 2).toUpperCase();
    }
  }

  // Calculate task completion rate and review percent from kpiData
  const given = Math.max(1, this.kpiData?.tasksGiven || 20);
  let completed = this.kpiData?.tasksCompleted !== undefined ? this.kpiData.tasksCompleted : 18;
  if (completed > given) completed = given;
  this.kpiData.tasksCompleted = completed;

  const review = this.kpiData?.reviewScore !== undefined ? this.kpiData.reviewScore : 8.5;
  const att = this.kpiData?.attendanceRate !== undefined ? Math.max(0, Math.min(100, this.kpiData.attendanceRate)) : 92;
  const contrib = this.kpiData?.projectContribution || 85;
  const eff = this.kpiData?.workEfficiency || 86;

  const taskRate = Math.min(100, Math.round((completed / given) * 100));
  const reviewPercent = Math.min(100, Math.round(review * 10)); // e.g. 8.5 -> 85%

  // Update metrics object
  if (!this.metrics) this.metrics = {};
  this.metrics.attendanceRate = att;
  this.metrics.taskCompletionRate = taskRate;
  this.metrics.productivityScore = reviewPercent;
  this.metrics.projectContribution = contrib;
  this.metrics.workEfficiency = eff;

  // Overall Score Formula: Attendance (20%) + Task Completion (40%) + HR Review (40%)
  const calculatedOverall = Math.round(
    (att * 0.20) +
    (taskRate * 0.40) +
    (reviewPercent * 0.40)
  );

  this.metrics.overallScore = calculatedOverall;

  if (calculatedOverall >= 92) {
    this.performanceCategory = 'Exceptional';
  } else if (calculatedOverall >= 82) {
    this.performanceCategory = 'Strong Performer';
  } else if (calculatedOverall >= 70) {
    this.performanceCategory = 'Meets Expectations';
  } else if (calculatedOverall >= 60) {
    this.performanceCategory = 'Needs Improvement';
  } else {
    this.performanceCategory = 'Critical Attention';
  }

  next();
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
