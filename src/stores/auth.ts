import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/types/auth'
import * as authService from '@/services/auth'
import { useParentStore } from '@/stores/parent'
import { useChildrenStore } from '@/stores/children'
import { useAssessmentStore } from '@/stores/assessment'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('lentera_token'))
  const isInitialized = ref(false)
  const isLoading = ref(false)

  // ── Getters ────────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!user.value)

  window.addEventListener('lentera:unauthorized', clearAuth)

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Called once on app bootstrap.
   * Restore either a cookie session or a bearer-token session.
   */
  async function initialize(): Promise<void> {
    if (isInitialized.value) return
    try {
      user.value = await authService.getMe()
    } catch {
      clearAuth()
    }
    isInitialized.value = true
  }

  async function login(payload: LoginRequest): Promise<void> {
    isLoading.value = true
    try {
      const response = await authService.login(payload)
      if (response.token) {
        token.value = response.token
        localStorage.setItem('lentera_token', response.token)
      }
      user.value = response.user ?? await authService.getMe()
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterRequest): Promise<boolean> {
    isLoading.value = true
    try {
      const response = await authService.register(payload)
      if (response.token) {
        token.value = response.token
        localStorage.setItem('lentera_token', response.token)
      }
      if (response.user) {
        user.value = response.user
      } else {
        try {
          user.value = await authService.getMe()
        } catch {
          return false
        }
      }
      return true
    } finally {
      isLoading.value = false
    }
  }

  async function logout(): Promise<void> {
    try {
      await authService.logout()
    } catch {
      // Ignore logout errors — clear state regardless
    } finally {
      clearAuth()
    }
  }

  function clearAuth(): void {
    user.value = null
    token.value = null
    localStorage.removeItem('lentera_token')
    useParentStore().reset()
    useChildrenStore().reset()
    useAssessmentStore().reset()
  }

  return {
    user,
    token,
    isInitialized,
    isLoading,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    clearAuth,
  }
})
