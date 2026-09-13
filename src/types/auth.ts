import type { EntityId } from './common'

/** The authenticated user account (from the `users` table).
 *  Password is NEVER included in this type. */
export interface User {
  id: EntityId
  phoneNumber: string
  createdAt: string
  updatedAt?: string | null
}

export interface LoginRequest {
  phoneNumber: string
  password: string
}

export interface RegisterRequest {
  phoneNumber: string
  password: string
}

/** Shape of the Go API auth response. Adjust when Go structs are finalised. */
export interface AuthResponse {
  user: User
  token?: string // JWT or session token, may vary
}
