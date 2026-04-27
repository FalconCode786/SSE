/**
 * Form Validation Utilities
 * Provides validators for common form fields with consistent error messages
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === "") {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (
  password: string,
  minLength: number = 8
): ValidationResult => {
  if (!password || password.length === 0) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < minLength) {
    return {
      valid: false,
      error: `Password must be at least ${minLength} characters`,
    };
  }

  // Check for uppercase, lowercase, number, and special character
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    password
  );

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      valid: false,
      error:
        "Password must contain uppercase, lowercase, and number characters",
    };
  }

  return { valid: true };
};

/**
 * Validate CNIC format (Pakistan)
 */
export const validateCNIC = (cnic: string): ValidationResult => {
  if (!cnic || cnic.trim() === "") {
    return { valid: false, error: "CNIC is required" };
  }

  // Remove any dashes for validation
  const cleanCNIC = cnic.replace(/-/g, "");

  // CNIC should be 13 digits
  if (!/^\d{13}$/.test(cleanCNIC)) {
    return {
      valid: false,
      error: "CNIC must be 13 digits (format: XXXXX-XXXXXXX-X)",
    };
  }

  return { valid: true };
};

/**
 * Validate phone number (Pakistan)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === "") {
    return { valid: false, error: "Phone number is required" };
  }

  const phoneRegex = /^(\+92|0)?3[0-9]{2}\d{7}$/;
  if (!phoneRegex.test(phone.replace(/-/g, ""))) {
    return {
      valid: false,
      error: "Please enter a valid Pakistan phone number",
    };
  }

  return { valid: true };
};

/**
 * Validate name (letters, spaces, hyphens allowed)
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === "") {
    return { valid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }

  if (name.trim().length > 100) {
    return { valid: false, error: "Name must be less than 100 characters" };
  }

  // Allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return {
      valid: false,
      error: "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { valid: true };
};

/**
 * Validate marks/score (0-100)
 */
export const validateMarks = (marks: string | number): ValidationResult => {
  const numMarks = typeof marks === "string" ? parseFloat(marks) : marks;

  if (isNaN(numMarks)) {
    return { valid: false, error: "Marks must be a valid number" };
  }

  if (numMarks < 0 || numMarks > 100) {
    return { valid: false, error: "Marks must be between 0 and 100" };
  }

  return { valid: true };
};

/**
 * Validate GPA (0.0-4.0)
 */
export const validateGPA = (gpa: string | number): ValidationResult => {
  const numGPA = typeof gpa === "string" ? parseFloat(gpa) : gpa;

  if (isNaN(numGPA)) {
    return { valid: false, error: "GPA must be a valid number" };
  }

  if (numGPA < 0 || numGPA > 4.0) {
    return { valid: false, error: "GPA must be between 0.0 and 4.0" };
  }

  return { valid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value: any): ValidationResult => {
  if (value === null || value === undefined || value === "") {
    return { valid: false, error: "This field is required" };
  }

  if (typeof value === "string" && value.trim() === "") {
    return { valid: false, error: "This field is required" };
  }

  return { valid: true };
};

/**
 * Validate URL format
 */
export const validateURL = (url: string): ValidationResult => {
  if (!url || url.trim() === "") {
    return { valid: false, error: "URL is required" };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: "Please enter a valid URL" };
  }
};

/**
 * Validate array of data (for batch validation)
 */
export interface ValidationSchema {
  [key: string]: (value: any) => ValidationResult;
}

export const validateForm = (
  data: Record<string, any>,
  schema: ValidationSchema
): Record<string, string> => {
  const errors: Record<string, string> = {};

  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(data[field]);
    if (!result.valid && result.error) {
      errors[field] = result.error;
    }
  }

  return errors;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};
