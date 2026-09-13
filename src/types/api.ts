/**
 * Centralised API error shape.
 * Components should only interact with ApiError, never with Axios internals.
 */
export interface ApiError {
  /** HTTP status code */
  status?: number
  /** Human-readable error message (Bahasa Indonesia where possible) */
  message: string
  /** Field-level validation errors (for 422 responses) */
  fieldErrors?: Record<string, string>
  /** Application-level error code from the backend (optional) */
  code?: string
}

/** Generic wrapper for successful API responses */
export interface ApiResponse<T> {
  data: T
  message?: string
}
