import apiClient, { type ApiResponse, handleApiError } from "./api";
import type {
  IPatient,
  IUserGoals,
  IGoalTracking,
  IMedicalCondition,
  IHealthProvider,
} from "./types";

/**
 * Provider/Admin APIs for managing patients
 */

// ==================== Patient Management ====================

/**
 * Get all patients assigned to the provider
 */
export async function getAllPatients(): Promise<IPatient[]> {
  try {
    const response = await apiClient.get<any>("/api/v1/admin/patients");
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to fetch patients");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get a specific patient by ID
 */
export async function getPatientById(patientId: string): Promise<IPatient> {
  try {
    const response = await apiClient.get<any>(
      `/api/v1/admin/patients/${patientId}`
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to fetch patient");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Update patient information
 */
export async function updatePatient(
  patientId: string,
  data: Partial<IPatient>
): Promise<IPatient> {
  try {
    const response = await apiClient.put<any>(
      `/api/v1/admin/patients/${patientId}`,
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to update patient");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Invite a new patient (create patient account)
 */
export async function invitePatient(data: {
  fullname: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: number;
  country?: string;
}): Promise<IPatient> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/admin/patients/invite",
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to invite patient");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// ==================== Medical Conditions Management ====================

/**
 * Get all medical conditions for a patient
 */
export async function getPatientMedicalConditions(
  patientId: string
): Promise<IMedicalCondition[]> {
  try {
    const response = await apiClient.get<any>(
      `/api/v1/admin/patients/${patientId}/medical-conditions`
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(
      response.data.message || "Failed to fetch medical conditions"
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Add a medical condition for a patient
 */
export async function addMedicalCondition(
  patientId: string,
  data: {
    category: string;
    label: string;
    value: string;
  }
): Promise<IMedicalCondition> {
  try {
    const response = await apiClient.post<any>(
      `/api/v1/admin/patients/${patientId}/medical-conditions`,
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(
      response.data.message || "Failed to add medical condition"
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Update a medical condition
 */
export async function updateMedicalConditionForPatient(
  patientId: string,
  conditionId: string,
  data: Partial<IMedicalCondition>
): Promise<IMedicalCondition> {
  try {
    const response = await apiClient.put<any>(
      `/api/v1/admin/patients/${patientId}/medical-conditions/${conditionId}`,
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(
      response.data.message || "Failed to update medical condition"
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Delete a medical condition
 */
export async function deleteMedicalConditionForPatient(
  patientId: string,
  conditionId: string
): Promise<void> {
  try {
    await apiClient.delete(
      `/api/v1/admin/patients/${patientId}/medical-conditions/${conditionId}`
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// ==================== User Goals Management ====================

/**
 * Get all goals for a patient
 */
export async function getPatientGoals(patientId: string): Promise<IUserGoals[]> {
  try {
    const response = await apiClient.get<any>(
      `/api/v1/admin/patients/${patientId}/goals`
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to fetch patient goals");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Add a goal for a patient
 */
export async function addUserGoal(
  patientId: string,
  data: {
    category: "medication" | "general" | "healthcheckup";
    value: string[];
  }
): Promise<IUserGoals> {
  try {
    const response = await apiClient.post<any>(
      `/api/v1/admin/patients/${patientId}/goals`,
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to add goal");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Update a goal for a patient
 */
export async function updateUserGoalForPatient(
  patientId: string,
  goalId: string,
  data: Partial<IUserGoals>
): Promise<IUserGoals> {
  try {
    const response = await apiClient.put<any>(
      `/api/v1/admin/patients/${patientId}/goals/${goalId}`,
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to update goal");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Delete a goal for a patient
 */
export async function deleteUserGoalForPatient(
  patientId: string,
  goalId: string
): Promise<void> {
  try {
    await apiClient.delete(
      `/api/v1/admin/patients/${patientId}/goals/${goalId}`
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

// ==================== Notification/Call APIs ====================

/**
 * Send a reminder notification to a patient
 */
export async function sendReminderCall(data: {
  patientId: string;
  type: "medication" | "goal" | "general";
  message: string;
}): Promise<any> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/notification/send-reminder",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Send bulk reminders to multiple patients
 */
export async function sendBulkReminders(data: {
  patientIds: string[];
  type: "medication" | "goal" | "general";
  message: string;
}): Promise<any> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/notification/send-bulk",
      data
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get notification job status
 */
export async function getNotificationStatus(jobId: string): Promise<any> {
  try {
    const response = await apiClient.get<any>(
      `/api/v1/notification/status/${jobId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

