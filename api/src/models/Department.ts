import mongoose, { Schema, Document } from 'mongoose';
import { IDepartment, IMember } from '../types';

// Schema de Member
const MemberSchema: Schema = new Schema({
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  superiorId: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  subordinateIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }]
}, { _id: false });

// Schema de Departamento
const DepartmentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  members: [MemberSchema]
}, { versionKey: false });

export default mongoose.model<IDepartment>('Department', DepartmentSchema);