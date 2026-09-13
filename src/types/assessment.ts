import type { EntityId } from './common'

/** Maps to `assessment_templates` table */
export interface AssessmentTemplate {
  id: EntityId
  name?: string | null
  description?: string | null
  version?: string | null
  isActive?: boolean | null
  createdAt: string
  updatedAt?: string | null
}

/**
 * Maps to `questions` table.
 * Note: the database column is `assesment_id` (typo in DB) but the Go API
 * may expose `assessmentId`. Frontend uses the API field name.
 * Note: `weight` is included in the API response but MUST NOT be used
 * for any DSS calculation in the frontend.
 */
export interface AssessmentQuestion {
  id: EntityId
  assessmentId?: EntityId | null
  questionText?: string | null
  category?: string | null
  questionOrder?: number | null
  // weight is intentionally omitted from this interface to prevent accidental use
}

/** Maps to `assessment_attempts` table.
 *  Note: status values are not yet finalised — kept as string. */
export interface AssessmentAttempt {
  id: EntityId
  childId?: EntityId | null
  assessmentId?: EntityId | null
  /** Backend-defined status string. Do NOT invent enum values. */
  status?: string | null
  startedAt?: string | null
  completedAt?: string | null
  createdAt: string
}

/** Maps to `assessment_answers` table */
export interface AssessmentAnswer {
  id: EntityId
  attemptId?: EntityId | null
  questionId?: EntityId | null
  /** Answer on a 1–5 scale. Semantic meaning depends on research methodology. */
  answer?: number | null
  updatedAt?: string | null
  createdAt: string
}

/** DTO used when submitting a single answer */
export interface AssessmentAnswerInput {
  questionId: EntityId
  /** Must be 1, 2, 3, 4, or 5 */
  answer: number
}

/** Request body for submitting all answers in one batch */
export interface SubmitAssessmentAnswersRequest {
  answers: AssessmentAnswerInput[]
}
