import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    uppercase: true
  },
  headOfDepartment: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    default: 250000
  },
  color: {
    type: String,
    default: '#3b82f6'
  },
  description: {
    type: String,
    default: ''
  },
  targetPerformanceScore: {
    type: Number,
    default: 85
  }
}, { timestamps: true });

const Department = mongoose.model('Department', DepartmentSchema);
export default Department;
