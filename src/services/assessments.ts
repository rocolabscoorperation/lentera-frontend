import { api } from './api'
import type {
  AssessmentTemplate,
  AssessmentQuestion,
  AssessmentAttempt,
  SubmitAssessmentAnswersRequest,
} from '@/types/assessment'
import type { EntityId } from '@/types/common'

export interface SubmitAttemptResponse {
  resultId?: EntityId
}

/**
 * GET /assessments
 * Return all active assessment templates.
 */
export async function getAssessments(): Promise<AssessmentTemplate[]> {
  const { data } = await api.get<AssessmentTemplate[]>('/assessments')
  return data
}

/**
 * GET /assessments/:id/questions
 * Return ordered questions for a template.
 */
export async function getAssessmentQuestions(
  assessmentId: string | number,
): Promise<AssessmentQuestion[]> {
  const { data } = await api.get<AssessmentQuestion[]>(
    `/assessments/${assessmentId}/questions`,
  )
  return data
}

/**
 * POST /assessments/:id/start
 * Start a new attempt for a child.
 */
export async function startAttempt(
  assessmentId: string | number,
  childId: string | number,
): Promise<AssessmentAttempt> {
  const { data } = await api.post<AssessmentAttempt>(
    `/assessments/${assessmentId}/start`,
    { childId },
  )
  return data
}

/**
 * GET /assessments/attempt/:id
 * Return an existing attempt (for resuming).
 */
export async function getAttempt(attemptId: string | number): Promise<AssessmentAttempt> {
  const { data } = await api.get<AssessmentAttempt>(`/assessments/attempt/${attemptId}`)
  return data
}

/**
 * POST /assessments/attempt/:id/answers
 * Submit collected answers for an attempt.
 * The frontend collects answers but does NOT calculate DSS.
 */
export async function submitAnswers(
  attemptId: string | number,
  payload: SubmitAssessmentAnswersRequest,
): Promise<void> {
  await api.post(`/assessments/attempt/${attemptId}/answers`, payload)
}

/**
 * POST /assessments/attempt/:id/submit
 * Finalise an attempt and trigger backend DSS processing.
 */
export async function submitAttempt(attemptId: EntityId): Promise<SubmitAttemptResponse> {
  const { data } = await api.post<SubmitAttemptResponse>(`/assessments/attempt/${attemptId}/submit`)
  return data ?? {}
}
