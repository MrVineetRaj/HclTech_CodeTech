/**
 * TypeScript interfaces matching backend models
 */

// Health Provider
export interface IHealthProvider {
  _id: string;
  name: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  country: string;
  createdAt: string;
  updatedAt: string;
}

// Patient
export interface IPatient {
  _id: string;
  healthProviderId: string | IHealthProvider;
  fullname: string;
  email: string;
  password?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  country: string;
  createdAt: string;
  updatedAt: string;
}

// Medical Conditions
export interface IMedicalCondition {
  _id: string;
  category: string;
  patientId: string;
  label: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

// User Goals
export interface IUserGoals {
  _id: string;
  healthProviderId: string | IHealthProvider;
  patientId: string | IPatient;
  category: "medication" | "general" | "healthcheckup";
  value: string[];
  createdAt: string;
  updatedAt: string;
}

// Goal Tracking
export interface IGoalTracking {
  _id: string;
  userId: string;
  healthProviderId: string | IHealthProvider;
  target: number;
  goalID: string | IUserGoals;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification Job
export interface INotificationJob {
  jobId: string;
  patientId: string;
  notificationType?: "medication" | "goal" | "checkup";
  status: "waiting" | "active" | "completed" | "failed";
  callId?: string;
  createdAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  healthProviderId: string;
  fullname: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  country: string;
}

// API Response types
export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  result?: T;
}

export interface ApiError {
  statusCode: number;
  success: false;
  message: string;
  details?: any;
}

// User context
export interface User {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  role?: "patient" | "doctor" | "admin";
}

