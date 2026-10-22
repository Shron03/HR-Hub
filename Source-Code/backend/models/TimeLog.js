import mongoose from 'mongoose';

const TimeLogSchema = new mongoose.Schema({
  logId: {
    type: String,
    required: true,
    unique: true
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

export default mongoose.model('TimeLog', TimeLogSchema);
