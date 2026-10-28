import mongoose from 'mongoose';

const TimeLogSchema = new mongoose.Schema({
  workspaceId: {
    type: String,
    required: true,
    index: true
  },
  logId: {
    type: String,
    required: true
  },
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: 'Engineering'
  },
  project: {
    type: String,
    required: true
  },
  taskName: {
    type: String,
    required: true
  },
  hours: {
    type: Number,
    required: true,
    min: 0.5,
    max: 24
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending Approval', 'Rejected'],
    default: 'Pending Approval'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

TimeLogSchema.index({ workspaceId: 1, logId: 1 }, { unique: true });

export default mongoose.model('TimeLog', TimeLogSchema);
