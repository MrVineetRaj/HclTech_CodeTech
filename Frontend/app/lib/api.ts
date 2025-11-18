import axios, { type AxiosInstance, type AxiosError } from "axios";

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Axios instance configured for the backend API
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/sessions
  timeout: 30000, // 30 seconds
});

/**
 * Request interceptor to add auth token if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for handling errors globally
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Standard API response format from backend
 */
export interface ApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  result?: T;
}

/**
 * API error response format
 */
export interface ApiError {
  statusCode: number;
  success: false;
  message: string;
  details?: any;
}

/**
 * Helper function to handle API errors
 */
export function handleApiError(error: any): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    return apiError?.message || error.message || "An error occurred";
  }
  return error?.message || "An unexpected error occurred";
}

export default apiClient;
