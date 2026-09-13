import { api } from './api'
import type { SchoolRecommendationDetail } from '@/types/school'

/**
 * GET /recommendations/result/:resultId
 * Return backend-calculated school recommendations for a given result.
 * The frontend MUST NOT recalculate rank or recommendationScore.
 */
export async function getSchoolRecommendations(
  resultId: string | number,
): Promise<SchoolRecommendationDetail[]> {
  const { data } = await api.get<SchoolRecommendationDetail[]>(
    `/recommendations/result/${resultId}`,
  )
  return data
}
