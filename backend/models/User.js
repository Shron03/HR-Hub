import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['HR Director', 'Engineering Manager', 'HR Specialist', 'Employee'],
    default: 'Employee'
  },
  department: { type: String, default: 'Engineering' },
  avatar: { type: String, default: '' },
  isApproved: { type: Boolean, default: true },
  approvalStatus: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: 'Approved'
  }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) {
    throw new Error('Password hash was not selected in query');
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
