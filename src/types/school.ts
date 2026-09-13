import type { EntityId, SchoolType } from './common'

/** Maps to the `schools` table.
 *  lat/long are normalised to latitude/longitude in API responses. */
export interface School {
  id: EntityId
  name?: string | null
  schoolType?: SchoolType | null
  address?: string | null
  city?: string | null
  /** Normalised from `lat` DB column */
  latitude?: number | null
  /** Normalised from `long` DB column */
  longitude?: number | null
  description?: string | null
  createdAt: string
  updatedAt?: string | null
}

/** Maps to the `school_recommendations` table.
 *  rank, recommendationScore, and reason are backend-calculated.
 *  The frontend MUST NOT recalculate these values. */
export interface SchoolRecommendation {
  id: EntityId
  resultId?: EntityId | null
  schoolId?: EntityId | null
  /** Backend-assigned ranking. Do NOT recalculate on frontend. */
  rank?: number | null
  /** Backend-calculated score. Do NOT expose unless product requires it. */
  recommendationScore?: number | null
  /** Backend-provided reason text. */
  reason?: string | null
  createdAt: string
}

/** Composed DTO: recommendation + embedded school detail */
export interface SchoolRecommendationDetail extends SchoolRecommendation {
  school: School
}
