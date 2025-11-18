import { Schema, model, Document, Types } from "mongoose";

// Health Provider Interface & Model
export interface IHealthProvider extends Document {
  name: string;
  password: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: number;
  country: string;
}

const healthProviderSchema = new Schema<IHealthProvider>(
  {
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: Number, required: true },
    country: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export const HealthProvider = model<IHealthProvider>(
  "HealthProvider",
  healthProviderSchema
);

// Patient Interface & Model
export interface IPatient extends Document {
  healthProviderId: Types.ObjectId;
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

const patientSchema = new Schema<IPatient>(
  {
    healthProviderId: {
      type: Schema.Types.ObjectId,
      ref: "HealthProvider",
      required: true,
    },
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: Number, required: true },
    country: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

export const Patient = model<IPatient>("Patient", patientSchema);

// User Goals Interface & Model
export interface IUserGoals extends Document {
  healthProviderId: Types.ObjectId;
  patientId: Types.ObjectId;
  category: "medication" | "general" | "healthcheckup";
  value: string[];
}

const userGoalsSchema = new Schema<IUserGoals>(
  {
    healthProviderId: {
      type: Schema.Types.ObjectId,
      ref: "HealthProvider",
      required: true,
    },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    category: {
      type: String,
      required: true,
      enum: ["medication", "general", "healthcheckup"],
    },
    value: { type: [String], required: true },
  },
  { timestamps: true, versionKey: false }
);

export const UserGoals = model<IUserGoals>("UserGoals", userGoalsSchema);

// Goal Tracking Interface & Model
export interface IGoalTracking extends Document {
  userId: Types.ObjectId;
  healthProviderId: Types.ObjectId;
  target: string;
  completed: boolean;
  goalID: Types.ObjectId;
}

const goalTrackingSchema = new Schema<IGoalTracking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    healthProviderId: {
      type: Schema.Types.ObjectId,
      ref: "HealthProvider",
      required: true,
    },
    target: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false, required: true },
    goalID: { type: Schema.Types.ObjectId, ref: "UserGoals", required: true },
  },
  { timestamps: true, versionKey: false }
);

export const GoalTracking = model<IGoalTracking>(
  "GoalTracking",
  goalTrackingSchema
);
