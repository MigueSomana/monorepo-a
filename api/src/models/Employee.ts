import mongoose, { Schema, Document } from 'mongoose';
import { IEmployee } from '../types';

// Schema de Empleado
const EmployeeSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  }
}, {
  timestamps:  { createdAt: true, updatedAt: false },
  versionKey: false });

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
