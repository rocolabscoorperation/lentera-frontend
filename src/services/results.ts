import { api } from './api'
import type { AssessmentResult, AssessmentResultDetail } from '@/types/result'

/**
 * GET /results
 * Return assessment result history for the authenticated parent.
 */
export async function getResults(): Promise<AssessmentResult[]> {
  const { data } = await api.get<AssessmentResult[]>('/results')
  return data
}

/**
 * GET /results/:id
 * Return full result detail including school recommendations.
 */
export async function getResult(id: string | number): Promise<AssessmentResultDetail> {
  const { data } = await api.get<AssessmentResultDetail>(`/results/${id}`)
  return data
}

/**
 * GET /results/:id/pdf
 * Trigger a backend-generated PDF download.
 * Returns a Blob; the caller should initiate browser download.
 */
export async function downloadResultPdf(id: string | number): Promise<Blob> {
  const { data } = await api.get<Blob>(`/results/${id}/pdf`, {
    responseType: 'blob',
  })
  return data
}
