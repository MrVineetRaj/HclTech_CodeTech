import apiClient, { type ApiResponse, handleApiError } from "./api";
import {
  type IPatient,
  type LoginCredentials,
  type RegisterData,
} from "./types";

/**
 * Authentication service for login, register, and user management
 */

/**
 * Login patient
 */
export async function loginPatient(
  credentials: LoginCredentials
): Promise<{ user: any; message: string }> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/auth/login/patient",
      credentials
    );

    // Backend uses 'data' field, not 'result'
    if (response.data.data) {
      // Store user data in localStorage
      const userData = { ...response.data.data, userType: "patient" };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("auth_token", "authenticated");
      localStorage.setItem("userType", "patient");

      return {
        user: userData,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Login failed");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Login provider (doctor/assistant)
 */
export async function loginProvider(
  credentials: LoginCredentials
): Promise<{ user: any; message: string }> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/auth/login/provider",
      credentials
    );

    // Backend uses 'data' field, not 'result'
    if (response.data.data) {
      // Store user data in localStorage
      const userData = { ...response.data.data, userType: "provider" };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("auth_token", "authenticated");
      localStorage.setItem("userType", "provider");

      return {
        user: userData,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Login failed");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Register new patient
 */
export async function registerPatient(
  data: RegisterData
): Promise<{ user: any; message: string }> {
  try {
    const response = await apiClient.post<any>(
      "/api/v1/auth/signup/patient",
      data
    );

    // Backend uses 'data' field, not 'result'
    if (response.data.data) {
      return {
        user: response.data.data,
        message: response.data.message,
      };
    }

    throw new Error(response.data.message || "Registration failed");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}

/**
 * Logout patient
 */
export async function logoutPatient(): Promise<void> {
  try {
    await apiClient.post("/api/v1/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userType");
  }
}

/**
 * Logout provider
 */
export async function logoutProvider(): Promise<void> {
  try {
    await apiClient.post("/api/v1/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("userType");
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): IPatient | null {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("auth_token");
}

/**
 * Get user type (patient or provider)
 */
export function getUserType(): "patient" | "provider" | null {
  return localStorage.getItem("userType") as "patient" | "provider" | null;
}

/**
 * Check if current user is a provider
 */
export function isProvider(): boolean {
  return getUserType() === "provider";
}

/**
 * Check if current user is a patient
 */
export function isPatient(): boolean {
  return getUserType() === "patient";
}

/**
 * Get patient profile from backend
 */
export async function getPatientProfile(): Promise<IPatient> {
  try {
    const response = await apiClient.get<ApiResponse<IPatient>>(
      "/api/v1/patient/profile"
    );

    if (response.data.success && response.data.result) {
      // Update localStorage with fresh data
      localStorage.setItem("user", JSON.stringify(response.data.result));
      return response.data.result;
    }

    throw new Error(response.data.message || "Failed to fetch profile");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
}
