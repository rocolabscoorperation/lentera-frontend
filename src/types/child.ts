import type { EntityId, Gender } from './common'

/** Maps to the `children_profile` database table.
 *  Note: age is NOT stored — derive it client-side from birthDate.
 *  Note: address is NOT a column in this table; do NOT persist it. */
export interface Child {
  id: EntityId
  parentId?: EntityId | null
  name?: string | null
  birthDate?: string | null
  gender?: Gender | null
  createdAt: string
  updatedAt?: string | null
}

export interface CreateChildRequest {
  name: string
  birthDate: string
  gender: Gender
}

export type UpdateChildRequest = CreateChildRequest
