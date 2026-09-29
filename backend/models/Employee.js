import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  project: { type: String, default: 'Internal Operations' },
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
  phone: { type: String, default: '+1 (555) 000-0000' },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'Product', 'Marketing', 'Sales', 'Human Resources', 'Design', 'Finance']
  },
  role: {
    type: String,
    required: [true, 'Role title is required'],
    trim: true
  },
  avatar: { type: String, default: '' },
  joinDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Probation', 'Terminated'],
    default: 'Active'
  },
  salary: { type: Number, default: 75000 },
  location: { type: String, default: 'Headquarters' },
  managerName: { type: String, default: 'Director of Operations' },
  experienceYears: { type: Number, default: 3 },
  metrics: {
    attendanceRate: { type: Number, min: 0, max: 100, default: 90 },
    taskCompletionRate: { type: Number, min: 0, max: 100, default: 85 },
    productivityScore: { type: Number, min: 0, max: 100, default: 88 },
    projectContribution: { type: Number, min: 0, max: 100, default: 82 },
    workEfficiency: { type: Number, min: 0, max: 100, default: 86 },
    overallScore: { type: Number, min: 0, max: 100, default: 86.2 }
  },
  performanceCategory: {
    type: String,
    enum: ['Exceptional', 'Strong Performer', 'Meets Expectations', 'Needs Improvement', 'Critical Attention'],
    default: 'Strong Performer'
  },
  tasks: [TaskSchema],
  monthlyHistory: [MonthlyHistorySchema],
  tags: [{ type: String }],
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

// Calculate Overall Performance Score & Category automatically before saving
EmployeeSchema.pre('save', function (next) {
  if (this.metrics) {
    const { attendanceRate = 90, taskCompletionRate = 85, productivityScore = 85, projectContribution = 80, workEfficiency = 85 } = this.metrics;
    
    // Formula weighted: Attendance (20%), Task Completion (25%), Productivity (25%), Project Contribution (15%), Work Efficiency (15%)
    const calculatedOverall = Math.round(
      (attendanceRate * 0.20) +
      (taskCompletionRate * 0.25) +
      (productivityScore * 0.25) +
      (projectContribution * 0.15) +
      (workEfficiency * 0.15)
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
  }
  next();
});

const Employee = mongoose.model('Employee', EmployeeSchema);
export default Employee;
