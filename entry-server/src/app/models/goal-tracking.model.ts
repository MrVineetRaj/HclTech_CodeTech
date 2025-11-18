import { Schema, model, Document, Types } from "mongoose";

/**
 * TypeScript interface for GoalTracking document
 */
export interface IGoalTracking extends Document {
  userId: Types.ObjectId;
  healthProviderId: Types.ObjectId;
  target: string;
  completed: boolean;
  goalID: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for GoalTracking
 * Tracks the progress and completion status of user goals
 */
const goalTrackingSchema = new Schema<IGoalTracking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "User ID (Patient ID) is required"],
      index: true,
    },
    healthProviderId: {
      type: Schema.Types.ObjectId,
      ref: "HealthProvider",
      required: [true, "Health Provider ID is required"],
      index: true,
    },
    target: {
      type: String,
      required: [true, "Target is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
    goalID: {
      type: Schema.Types.ObjectId,
      ref: "UserGoals",
      required: [true, "Goal ID is required"],
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create compound indexes for better query performance
// Note: userId, healthProviderId, and goalID already have index: true
goalTrackingSchema.index({ userId: 1, goalID: 1 });
goalTrackingSchema.index({ userId: 1, completed: 1 });
goalTrackingSchema.index({ healthProviderId: 1, userId: 1 });

// Export the model
export const GoalTracking = model<IGoalTracking>(
  "GoalTracking",
  goalTrackingSchema
);
