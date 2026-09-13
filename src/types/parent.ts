import type { EntityId, Gender } from './common'
import type { User } from './auth'

/** Maps to the `parent_profile` database table.
 *  Note: phone number belongs to `users.phone_number`, NOT this table.
 *  Note: there is no email field in this table.
 *  Note: age is NOT stored — derive it from birthDate. */
export interface ParentProfile {
  id: EntityId
  userId?: EntityId | null
  name?: string | null
  birthDate?: string | null
  /** Normalised from `long` database column */
  longitude?: number | null
  /** Normalised from `lat` database column */
  latitude?: number | null
  address?: string | null
  gender?: Gender | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface UpdateParentProfileRequest {
  name: string
  birthDate: string
  gender: Gender
  address?: string
  latitude?: number
  longitude?: number
}

/**
 * Conceptual API DTO — the backend may combine user + profile in one response.
 * Not a guaranteed final contract; align with actual Go API when available.
 */
export interface ParentMeResponse {
  user: User
  profile: ParentProfile | null
}
