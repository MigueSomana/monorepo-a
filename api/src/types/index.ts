import mongoose from "mongoose";

// Interfaces de respuestas de la API

export interface IEmployee extends Document {
  name: string;
  email: string;
  createdAt: Date;
}

export interface IDepartment extends Document {
  name: string;
  description: string;
  members: IMember[];
}

export interface IMember {
  employeeId: mongoose.Types.ObjectId;
  superiorId?: mongoose.Types.ObjectId;
  subordinateIds: mongoose.Types.ObjectId[];
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}