import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Child, CreateChildRequest, UpdateChildRequest } from '@/types/child'
import type { EntityId } from '@/types/common'
import * as childrenService from '@/services/children'
import type { ApiError } from '@/types/api'

export const useChildrenStore = defineStore('children', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const children = ref<Child[]>([])
  const selectedChild = ref<Child | null>(null)
  const isLoading = ref(false)
  const error = ref<ApiError | null>(null)

  // ── Actions ────────────────────────────────────────────────────────────────
  async function fetchChildren(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      children.value = await childrenService.getChildren()
    } catch (e) {
      error.value = e as ApiError
    } finally {
      isLoading.value = false
    }
  }

  async function createChild(payload: CreateChildRequest): Promise<Child> {
    const child = await childrenService.createChild(payload)
    children.value.push(child)
    return child
  }

  async function updateChild(id: EntityId, payload: UpdateChildRequest): Promise<Child> {
    const updated = await childrenService.updateChild(id, payload)
    const idx = children.value.findIndex((c) => String(c.id) === String(id))
    if (idx !== -1) children.value[idx] = updated
    if (selectedChild.value && String(selectedChild.value.id) === String(id)) {
      selectedChild.value = updated
    }
    return updated
  }

  function selectChild(child: Child): void {
    selectedChild.value = child
  }

  function clearSelection(): void {
    selectedChild.value = null
  }

  function reset(): void {
    children.value = []
    selectedChild.value = null
    error.value = null
  }

  return {
    children,
    selectedChild,
    isLoading,
    error,
    fetchChildren,
    createChild,
    updateChild,
    selectChild,
    clearSelection,
    reset,
  }
})
