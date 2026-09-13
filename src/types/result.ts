import type { EntityId } from './common'
import type { SchoolRecommendationDetail } from './school'

/** Maps to `assessment_results` table.
 *  Note: `recommendationExplanation` is NOT a verified DB column;
 *  treat it as an optional API-level computed field. */
export interface AssessmentResult {
  id: EntityId
  attemptId?: EntityId | null
  /** Backend-calculated. Do NOT compute on the frontend. */
  totalScore?: number | null
  /** Backend-provided string. Values not yet finalised. */
  classification?: string | null
  /** Backend-provided placement decision. Values not yet finalised. */
  placement?: string | null
  interpretation?: string | null
  createdAt: string
}

/**
 * Extended result DTO — may include API-composed fields not in the DB.
 * Align with actual Go API when structs are available.
 */
export interface AssessmentResultDetail extends AssessmentResult {
  /** Optional API-composed explanation. Not a verified DB column. */
  recommendationExplanation?: string | null
  /** Nested school recommendations (API-composed, not raw FK join). */
  recommendedSchools?: SchoolRecommendationDetail[]
}
