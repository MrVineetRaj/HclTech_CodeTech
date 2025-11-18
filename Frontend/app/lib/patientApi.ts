import apiClient, { type ApiResponse, handleApiError } from "./api";
import type {
  IPatient,
  IUserGoals,
  IGoalTracking,
  IMedicalCondition,
} from "./types";

/**
 * Patient Profile APIs
 */
export async function getPatientProfile(): Promise<IPatient> {
  try {
    const response = await apiClient.get<any>("/api/v1/patient/profile");
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to fetch patient profile");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updatePatientProfile(
  data: Partial<IPatient>
): Promise<IPatient> {
  try {
    const response = await apiClient.put<any>("/api/v1/patient/profile", data);
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to update profile");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * User Goals APIs
 */
export async function getUserGoals(category?: string): Promise<IUserGoals[]> {
  try {
    const url = category
      ? `/api/v1/patient/goals/category/${category}`
      : "/api/v1/patient/goals";
    const response = await apiClient.get<any>(url);
    if (response.data && "result" in response.data) {
      return response.data.result || [];
    }
    throw new Error(response.data?.message || "Failed to fetch user goals");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createUserGoal(
  data: Partial<IUserGoals>
): Promise<IUserGoals> {
  try {
    const response = await apiClient.post<any>("/api/v1/patient/goals", data);
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to create goal");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateUserGoal(
  id: string,
  data: Partial<IUserGoals>
): Promise<IUserGoals> {
  try {
    const response = await apiClient.put<any>(
      `/api/v1/patient/goals/${id}`,
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

export async function deleteUserGoal(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/v1/patient/goals/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Medical Conditions APIs
 */
export async function getMedicalConditions(
  category?: string
): Promise<IMedicalCondition[]> {
  try {
    const url = category
      ? `/api/v1/patient/medical-conditions/category/${category}`
      : "/api/v1/patient/medical-conditions";
    const response = await apiClient.get<any>(url);
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

export async function createMedicalCondition(
  data: Partial<IMedicalCondition>
): Promise<IMedicalCondition> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/patient/medical-conditions",
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(
      response.data.message || "Failed to create medical condition"
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateMedicalCondition(
  id: string,
  data: Partial<IMedicalCondition>
): Promise<IMedicalCondition> {
  try {
    const response = await apiClient.put<any>(
      `/api/v1/patient/medical-conditions/${id}`,
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

export async function deleteMedicalCondition(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/v1/patient/medical-conditions/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Goal Tracking APIs
 */
export async function getGoalTracking(): Promise<IGoalTracking[]> {
  try {
    const response = await apiClient.get<any>("/api/v1/patient/goal-tracking");
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to fetch goal tracking");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getPendingGoals(): Promise<IGoalTracking[]> {
  try {
    const response = await apiClient.get<any>(
      "/api/v1/patient/goal-tracking/pending"
    );
    if (response.data && "result" in response.data) {
      return response.data.result || [];
    }
    throw new Error(response.data?.message || "Failed to fetch pending goals");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function getCompletedGoals(): Promise<IGoalTracking[]> {
  try {
    const response = await apiClient.get<any>(
      "/api/v1/patient/goal-tracking/completed"
    );
    if (response.data && "result" in response.data) {
      return response.data.result || [];
    }
    throw new Error(
      response.data?.message || "Failed to fetch completed goals"
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function createGoalTracking(
  data: Partial<IGoalTracking>
): Promise<IGoalTracking> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/patient/goal-tracking",
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to create goal tracking");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function updateGoalTracking(
  id: string,
  data: Partial<IGoalTracking>
): Promise<IGoalTracking> {
  try {
    const response = await apiClient.put<any>(
      `/api/v1/patient/goal-tracking/${id}`,
      data
    );
    if (response.data.result) {
      return response.data.result;
    }
    throw new Error(response.data.message || "Failed to update goal tracking");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

export async function deleteGoalTracking(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/v1/patient/goal-tracking/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
