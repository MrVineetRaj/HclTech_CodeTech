import apiClient, { type ApiResponse, handleApiError } from "./api";
import type {
  IPatient,
  IUserGoals,
  IGoalTracking,
  IMedicalCondition,
  IHealthProvider,
} from "./types";

/**
 * API service for patient-related operations
 */

/**
 * Get patient profile
 */
export async function getPatientProfile(): Promise<IPatient> {
  try {
    const response = await apiClient.get<ApiResponse<IPatient>>(
      "/api/v1/patient/profile"
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    throw new Error(response.data.message || "Failed to fetch profile");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get patient's health provider
 */
export async function getHealthProvider(): Promise<IHealthProvider> {
  try {
    const response = await apiClient.get<ApiResponse<IHealthProvider>>(
      "/api/v1/patient/health-provider"
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    throw new Error(response.data.message || "Failed to fetch health provider");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get patient's medical conditions
 */
export async function getMedicalConditions(): Promise<IMedicalCondition[]> {
  try {
    const response = await apiClient.get<ApiResponse<IMedicalCondition[]>>(
      "/api/v1/patient/medical-conditions"
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get patient's goals
 * @param category - Filter by category: "medication" | "general" | "healthcheckup"
 */
export async function getUserGoals(category?: string): Promise<IUserGoals[]> {
  try {
    const url = category
      ? `/api/v1/patient/goals/category/${category}`
      : "/api/v1/patient/goals";

    const response = await apiClient.get<ApiResponse<IUserGoals[]>>(url);

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get patient's goal tracking
 */
export async function getGoalTracking(): Promise<IGoalTracking[]> {
  try {
    const response = await apiClient.get<ApiResponse<IGoalTracking[]>>(
      "/api/v1/patient/goal-tracking"
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get completed goals
 */
export async function getCompletedGoals(): Promise<IGoalTracking[]> {
  try {
    const response = await apiClient.get<ApiResponse<IGoalTracking[]>>(
      "/api/v1/patient/goal-tracking/completed"
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Get pending goals
 */
export async function getPendingGoals(): Promise<IGoalTracking[]> {
  try {
    const response = await apiClient.get<ApiResponse<IGoalTracking[]>>(
      "/api/v1/patient/goal-tracking/pending"
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    return [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Update goal tracking (mark as completed)
 */
export async function updateGoalTracking(
  id: string,
  data: { completed?: boolean; target?: number }
): Promise<IGoalTracking> {
  try {
    const response = await apiClient.put<ApiResponse<IGoalTracking>>(
      `/api/v1/patient/goal-tracking/${id}`,
      data
    );

    if (response.data.success && response.data.result) {
      return response.data.result;
    }

    throw new Error(response.data.message || "Failed to update goal tracking");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
