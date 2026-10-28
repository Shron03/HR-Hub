import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  workspaceId: {
    type: String,
    required: true,
    index: true
  },
  docId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Company Policies',
      'Legal & Compliance',
      'Employment Contracts',
      'Templates & Forms',
      'Payroll & Tax'
    ],
    default: 'Company Policies'
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: String,
    default: '1.2 MB'
  },
  fileType: {
    type: String,
    enum: ['PDF', 'DOCX', 'XLSX', 'ZIP'],
    default: 'PDF'
  },
  uploadDate: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    default: 'Priya Sharma (HR Director)'
  },
  accessLevel: {
    type: String,
    enum: ['All Employees', 'Management Only', 'Confidential'],
    default: 'All Employees'
  },
  description: {
    type: String,
    default: ''
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

DocumentSchema.index({ workspaceId: 1, docId: 1 }, { unique: true });

export default mongoose.model('Document', DocumentSchema);
