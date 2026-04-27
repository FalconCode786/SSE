import axios, { AxiosError } from "axios";

import { DashboardData, EligibilityResponse } from "../types/app";
import { ApiError, classifyError } from "./errorHandler";

const API_BASE_URL = "http://127.0.0.1:5000/api";

/**
 * Axios client instance with base configuration
 * - Base URL for API endpoints
 * - 6-second timeout for requests
 * - Automatic JSON serialization
 */
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor for error handling
 */
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = new ApiError(
      classifyError(error.response?.status),
      error.message,
      error.response?.status,
      error
    );
    throw apiError;
  }
);

/**
 * Authenticate user with email and role
 * 
 * @param email - User's email address
 * @param role - User's role (prospective_student, enrolled_student, faculty, admin)
 * @returns Access token and user role
 * @throws ApiError on authentication failure
 * 
 * @example
 * const { access_token, role } = await login("student@example.com", "enrolled_student");
 */
export async function login(email: string, role: string) {
  try {
    const { data } = await client.post("/auth/login", { email, role });
    return data as { access_token: string; role: string };
  } catch (error) {
    throw new ApiError(
      classifyError((error as AxiosError).response?.status),
      "Failed to login. Please check your credentials.",
      (error as AxiosError).response?.status,
      error
    );
  }
}

/**
 * Check student eligibility for admission
 * 
 * @param token - JWT authentication token
 * @param previousMarks - Student's previous exam marks (0-100)
 * @param requiredMarks - Minimum marks required for eligibility (default: 60)
 * @returns Eligibility status and message
 * @throws ApiError on eligibility check failure
 * 
 * @example
 * const result = await checkEligibility(token, 75, 60);
 * if (result.eligible) {
 *   console.log("Student is eligible!");
 * }
 */
export async function checkEligibility(
  token: string,
  previousMarks: number,
  requiredMarks = 60
) {
  try {
    const { data } = await client.post(
      "/admissions/eligibility",
      { previous_marks: previousMarks, required_marks: requiredMarks },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data as EligibilityResponse;
  } catch (error) {
    throw new ApiError(
      classifyError((error as AxiosError).response?.status),
      "Failed to check eligibility. Please try again.",
      (error as AxiosError).response?.status,
      error
    );
  }
}

/**
 * Fetch student dashboard data
 * 
 * @param token - JWT authentication token
 * @returns Dashboard data including attendance, assignments, schedule
 * @throws ApiError on fetch failure
 * 
 * @example
 * const dashboard = await fetchDashboard(token);
 * console.log(`Attendance: ${dashboard.attendance_percentage}%`);
 */
export async function fetchDashboard(token: string) {
  try {
    const { data } = await client.get("/lms/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data as DashboardData;
  } catch (error) {
    throw new ApiError(
      classifyError((error as AxiosError).response?.status),
      "Failed to load dashboard. Please try again.",
      (error as AxiosError).response?.status,
      error
    );
  }
}

/**
 * Mark attendance via geofence verification
 * 
 * @param token - JWT authentication token
 * @param latitude - User's current latitude
 * @param longitude - User's current longitude
 * @returns Attendance status and any relevant message
 * @throws ApiError on attendance marking failure
 * 
 * @example
 * const result = await scanAttendance(token, 24.8607, 67.0011);
 * if (result.marked) {
 *   console.log("Attendance marked successfully!");
 * }
 */
export async function scanAttendance(token: string, latitude: number, longitude: number) {
  try {
    const { data } = await client.post(
      "/lms/attendance/scan",
      { latitude, longitude },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data as { marked: boolean; status?: string; reason?: string };
  } catch (error) {
    throw new ApiError(
      classifyError((error as AxiosError).response?.status),
      "Failed to mark attendance. You may be outside campus.",
      (error as AxiosError).response?.status,
      error
    );
  }
}

/**
 * Get AI chatbot response for course questions
 * 
 * @param token - JWT authentication token
 * @param prompt - User's question or prompt
 * @param courseContext - Course context for relevance
 * @returns AI-generated response
 * @throws ApiError on chatbot failure
 * 
 * @example
 * const response = await askChatbot(token, "What is a binary tree?", "Data Structures");
 * console.log(response.answer);
 */
export async function askChatbot(token: string, prompt: string, courseContext: string) {
  try {
    const { data } = await client.post(
      "/lms/chat",
      { prompt, course_context: courseContext },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data as { answer: string };
  } catch (error) {
    throw new ApiError(
      classifyError((error as AxiosError).response?.status),
      "Failed to get chatbot response. Please try again.",
      (error as AxiosError).response?.status,
      error
    );
  }
}

/**
 * Get predictive risk alert for a student
 * 
 * @param token - JWT authentication token
 * @param studentId - Student's ID to analyze
 * @returns Risk analysis with score and message
 * @throws ApiError on analysis failure
 * 
 * @example
 * const alert = await fetchPredictiveAlert(token, "STU-001");
 * if (alert.risk_score > 70) {
 *   console.log("Critical risk: " + alert.message);
 * }
 */
export async function fetchPredictiveAlert(token: string, studentId: string) {
  try {
    const { data } = await client.post(
      "/admin/predictive-alert",
      {
        student_id: studentId,
        attendance_percentage: 64,
        assignment_submission_rate: 0.45,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data as { message: string; risk_score: number };
  } catch (error) {
    throw new ApiError(
      classifyError((error as AxiosError).response?.status),
      "Failed to fetch student alert. Please try again.",
      (error as AxiosError).response?.status,
      error
    );
  }
}
