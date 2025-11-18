import { Schema, model, Document, Types } from "mongoose";

/**
 * TypeScript interface for UserGoals document
 */
export interface IUserGoals extends Document {
  healthProviderId: Types.ObjectId;
  patientId: Types.ObjectId;
  category: "medication" | "general" | "healthcheckup";
  value: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for UserGoals
 * Represents health goals set by providers for patients
 */
const userGoalsSchema = new Schema<IUserGoals>(
  {
    healthProviderId: {
      type: Schema.Types.ObjectId,
      ref: "HealthProvider",
      required: [true, "Health Provider ID is required"],
      index: true,
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["medication", "general", "healthcheckup"],
        message:
          "{VALUE} is not a valid category. Must be one of: medication, general, healthcheckup",
      },
    },
    value: {
      type: [String],
      required: [true, "Value is required"],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: "Value array must contain at least one item",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create compound indexes for better query performance
userGoalsSchema.index({ patientId: 1, category: 1 });
userGoalsSchema.index({ healthProviderId: 1 });

// Export the model
export const UserGoals = model<IUserGoals>("UserGoals", userGoalsSchema);
