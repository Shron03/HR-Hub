import mongoose from 'mongoose';

const ReplySchema = new mongoose.Schema({
  sender: { type: String, required: true },
  senderRole: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TicketSchema = new mongoose.Schema({
  ticketId: {
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
    required: true
  },
  category: {
    type: String,
    enum: [
      'Payroll & Compensation',
      'Leave & Attendance',
      'Hardware & IT Assets',
      'Policies & HR Governance',
      'General Administrative'
    ],
    default: 'General Administrative'
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  assignedTo: {
    type: String,
    default: 'Priya Sharma (HR Director)'
  },
  resolutionNote: {
    type: String,
    default: ''
  },
  replies: [ReplySchema]
}, { timestamps: true });

export default mongoose.model('Ticket', TicketSchema);
