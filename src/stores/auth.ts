import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/types/auth'
import * as authService from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('lentera_token'))
  const isInitialized = ref(false)
  const isLoading = ref(false)

  // ── Getters ────────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!user.value)

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Called once on app bootstrap.
   * Tries to restore the session via GET /auth/me without blocking navigation.
   */
  async function initialize(): Promise<void> {
    if (isInitialized.value) return
    if (token.value) {
      try {
        user.value = await authService.getMe()
      } catch {
        // Token is stale — clear it silently
        clearAuth()
      }
    }
    isInitialized.value = true
  }

  async function login(payload: LoginRequest): Promise<void> {
    isLoading.value = true
    try {
      const response = await authService.login(payload)
      user.value = response.user
      if (response.token) {
        token.value = response.token
        localStorage.setItem('lentera_token', response.token)
      }
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterRequest): Promise<void> {
    isLoading.value = true
    try {
      const response = await authService.register(payload)
      user.value = response.user
      if (response.token) {
        token.value = response.token
        localStorage.setItem('lentera_token', response.token)
      }
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
