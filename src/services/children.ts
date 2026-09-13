import { api } from './api'
import type { Child, CreateChildRequest, UpdateChildRequest } from '@/types/child'

/**
 * GET /children
 * Return all children belonging to the authenticated parent.
 */
export async function getChildren(): Promise<Child[]> {
  const { data } = await api.get<Child[]>('/children')
  return data
}

/**
 * GET /children/:id
 * Return a single child profile.
 */
export async function getChild(id: string | number): Promise<Child> {
  const { data } = await api.get<Child>(`/children/${id}`)
  return data
}

/**
 * POST /children
 * Create a new child profile.
 */
export async function createChild(payload: CreateChildRequest): Promise<Child> {
  const { data } = await api.post<Child>('/children', payload)
  return data
}

/**
 * PUT /children/:id
 * Update a child profile.
 */
export async function updateChild(
  id: string | number,
  payload: UpdateChildRequest,
): Promise<Child> {
  const { data } = await api.put<Child>(`/children/${id}`, payload)
  return data
}
