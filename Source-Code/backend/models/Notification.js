import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['leave_request', 'leave_decision', 'registration', 'appraisal_feedback', 'kpi_update', 'system'],
    default: 'system'
  },
  recipientRole: {
    type: String,
    enum: ['HR Director', 'Engineering Manager', 'Employee', 'ALL'],
    default: 'ALL'
  },
  recipientEmployeeId: {
    type: String,
    default: null
  },
  readBy: [{
    type: String
  }],
  actionLink: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 259200 // 3 days in seconds (MongoDB TTL index: 3 * 24 * 60 * 60)
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
