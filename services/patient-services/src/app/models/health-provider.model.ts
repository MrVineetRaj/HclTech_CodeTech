import { Schema, model, Document } from "mongoose";

/**
 * TypeScript interface for HealthProvider document
 */
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
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for HealthProvider
 * Represents doctors/assistants who manage patients
 */
const healthProviderSchema = new Schema<IHealthProvider>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
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
// Note: email already has unique index from unique: true
healthProviderSchema.index({ phone: 1 });

// Export the model
export const HealthProvider = model<IHealthProvider>(
  "HealthProvider",
  healthProviderSchema
);
