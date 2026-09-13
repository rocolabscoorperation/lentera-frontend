import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ParentProfile, UpdateParentProfileRequest } from '@/types/parent'
import * as parentService from '@/services/parent'
import type { ApiError } from '@/types/api'

export const useParentStore = defineStore('parent', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const profile = ref<ParentProfile | null>(null)
  const isLoading = ref(false)
  const hasLoaded = ref(false)
  const error = ref<ApiError | null>(null)

  // ── Actions ────────────────────────────────────────────────────────────────
  async function fetchProfile(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await parentService.getParentProfile()
      profile.value = response.profile
      hasLoaded.value = true
    } catch (e) {
      error.value = e as ApiError
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(payload: UpdateParentProfileRequest): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await parentService.updateParentProfile(payload)
      profile.value = response.profile
    } catch (e) {
      error.value = e as ApiError
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function reset(): void {
    profile.value = null
    hasLoaded.value = false
    error.value = null
  }

  return { profile, isLoading, hasLoaded, error, fetchProfile, updateProfile, reset }
})
