/**
 * API Error Handler
 * Centralized error handling for all API calls with retry logic and logging
 */

export enum ApiErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN",
}

export class ApiError extends Error {
  constructor(
    public type: ApiErrorType,
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = "ApiError";
  }

  isRetryable(): boolean {
    return (
      this.type === ApiErrorType.NETWORK_ERROR ||
      this.type === ApiErrorType.TIMEOUT ||
      this.statusCode === 503 ||
      this.statusCode === 429
    );
  }

  getRetryDelay(): number {
    // Exponential backoff: 1s, 2s, 4s, 8s max
    return Math.min(1000 * Math.pow(2, this.getRetryCount()), 8000);
  }

  private getRetryCount(): number {
    // This would typically be tracked elsewhere
    return 1;
  }
}

/**
 * Classify HTTP status code to ApiErrorType
 */
export function classifyError(statusCode?: number): ApiErrorType {
  if (!statusCode) return ApiErrorType.NETWORK_ERROR;

  switch (statusCode) {
    case 401:
      return ApiErrorType.UNAUTHORIZED;
    case 403:
      return ApiErrorType.FORBIDDEN;
    case 404:
      return ApiErrorType.NOT_FOUND;
    case 400:
      return ApiErrorType.VALIDATION_ERROR;
    case 408:
    case 504:
      return ApiErrorType.TIMEOUT;
    case 500:
    case 502:
    case 503:
      return ApiErrorType.SERVER_ERROR;
    default:
      return ApiErrorType.UNKNOWN;
  }
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: ApiError | Error): string {
  if (error instanceof ApiError) {
    switch (error.type) {
      case ApiErrorType.NETWORK_ERROR:
        return "Network connection error. Please check your internet connection.";
      case ApiErrorType.TIMEOUT:
        return "Request timed out. Please try again.";
      case ApiErrorType.UNAUTHORIZED:
        return "Your session has expired. Please sign in again.";
      case ApiErrorType.FORBIDDEN:
        return "You don't have permission to perform this action.";
      case ApiErrorType.NOT_FOUND:
        return "The requested resource was not found.";
      case ApiErrorType.VALIDATION_ERROR:
        return "Invalid input. Please check your data.";
      case ApiErrorType.SERVER_ERROR:
        return "Server error. Please try again later.";
      default:
        return error.message || "An unknown error occurred.";
    }
  }

  return error.message || "An unexpected error occurred.";
}

/**
 * Retry logic for failed API calls
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  onRetry?: (attempt: number, error: Error) => void
): Promise<T> {
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const isRetryable =
          error instanceof ApiError ? error.isRetryable() : false;
        if (!isRetryable) {
          throw error;
        }

        const delay = error instanceof ApiError ? error.getRetryDelay() : 1000;
        onRetry?.(attempt, lastError);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Log error to external service
 */
export function logError(error: Error, context?: Record<string, any>): void {
  const errorData = {
    message: error.message,
    stack: error.stack,
    type: error.name,
    context,
    timestamp: new Date().toISOString(),
  };

  // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
  console.error("[API Error]", errorData);
}
