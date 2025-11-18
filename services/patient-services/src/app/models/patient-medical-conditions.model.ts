import { Schema, model, Document, Types } from "mongoose";

/**
 * TypeScript interface for PatientMedicalConditions document
 */
export interface IPatientMedicalConditions extends Document {
  category: string;
  patientId: Types.ObjectId;
  label: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for PatientMedicalConditions
 * Stores medical conditions and health information for patients
 */
const patientMedicalConditionsSchema = new Schema<IPatientMedicalConditions>(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: {
        values: [
          "allergy",
          "chronic_condition",
          "medication",
          "surgery",
          "family_history",
          "lifestyle",
          "other",
        ],
        message: "{VALUE} is not a valid category",
      },
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Patient ID is required"],
    },
    label: {
      type: String,
      required: [true, "Label is required"],
      trim: true,
    },
    value: {
      type: String,
      required: [true, "Value is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create indexes for better query performance
patientMedicalConditionsSchema.index({ patientId: 1, category: 1 });
patientMedicalConditionsSchema.index({ patientId: 1 });

// Export the model
export const PatientMedicalConditions = model<IPatientMedicalConditions>(
  "PatientMedicalConditions",
  patientMedicalConditionsSchema
);
