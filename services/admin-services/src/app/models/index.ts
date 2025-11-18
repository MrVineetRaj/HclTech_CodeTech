/**
 * Central export file for all database models
 * Import models from this file to ensure consistency across the application
 */

export { HealthProvider } from "./health-provider.model";
export type { IHealthProvider } from "./health-provider.model";

export { Patient } from "./patient.model";
export type { IPatient } from "./patient.model";

export { PatientMedicalConditions } from "./patient-medical-conditions.model";
export type { IPatientMedicalConditions } from "./patient-medical-conditions.model";

export { UserGoals } from "./user-goals.model";
export type { IUserGoals } from "./user-goals.model";

export { GoalTracking } from "./goal-tracking.model";
export type { IGoalTracking } from "./goal-tracking.model";

