import mongoose from 'mongoose';

const ChecklistItemSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  category: {
    type: String,
    enum: ['Documentation', 'IT Assets', 'HR Induction', 'Team KT', 'Exit Clearance', 'Finance Settlement'],
    default: 'Documentation'
  },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date }
});

const OnboardingCaseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Onboarding', 'Offboarding'],
    required: true
  },
  candidateName: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  managerName: {
    type: String,
    default: 'Rajesh Verma'
  },
  targetDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Initiated', 'In Progress', 'Completed', 'On Hold'],
    default: 'In Progress'
  },
  progressPercent: {
    type: Number,
    min: 0,
    max: 100,
    default: 20
  },
  checklist: [ChecklistItemSchema],
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('OnboardingCase', OnboardingCaseSchema);
