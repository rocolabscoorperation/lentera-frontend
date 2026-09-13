import { api } from './api'
import type { ParentMeResponse, UpdateParentProfileRequest } from '@/types/parent'

/**
 * GET /parents/me
 * Return the authenticated parent's profile (may include user info).
 */
export async function getParentProfile(): Promise<ParentMeResponse> {
  const { data } = await api.get<ParentMeResponse>('/parents/me')
  return data
}

/**
 * PUT /parents/me
 * Update the authenticated parent's profile.
 */
export async function updateParentProfile(
  payload: UpdateParentProfileRequest,
): Promise<ParentMeResponse> {
  const { data } = await api.put<ParentMeResponse>('/parents/me', payload)
  return data
}
