export type UserRole =
  | "admin"
  | "faculty"
  | "enrolled_student"
  | "prospective_student";

export interface DashboardData {
  today_schedule: string[];
  pending_assignments: number;
  attendance_percentage: number;
  role: string;
}

export interface EligibilityResponse {
  eligible: boolean;
  required_marks: number;
  obtained_marks: number;
  message: string;
}
