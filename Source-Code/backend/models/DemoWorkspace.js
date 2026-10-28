import mongoose from 'mongoose';

const DemoWorkspaceSchema = new mongoose.Schema({
  workspaceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  visitorId: {
    type: String,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
    // Automatically prune abandoned demo workspaces after 7 days
    expires: 604800
  }
}, {
  timestamps: true
});

const DemoWorkspace = mongoose.model('DemoWorkspace', DemoWorkspaceSchema);
export default DemoWorkspace;
