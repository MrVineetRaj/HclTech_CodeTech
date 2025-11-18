import { Schema, model, Document, Types } from "mongoose";

/**
 * TypeScript interface for Patient document
 */
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
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for Patient
 * Represents patients who are managed by health providers
 */
const patientSchema = new Schema<IPatient>(
  {
    healthProviderId: {
      type: Schema.Types.ObjectId,
      ref: "HealthProvider",
      required: [true, "Health Provider ID is required"],
      index: true,
    },
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    pincode: {
      type: Number,
      required: [true, "Pincode is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for better query performance
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ healthProviderId: 1 });

// Export the model
export const Patient = model<IPatient>("Patient", patientSchema);
