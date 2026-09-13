import { api } from './api'
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth'

/**
 * POST /auth/register
 * Create a new user account.
 */
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload)
  return data
}

/**
 * POST /auth/login
 * Authenticate with phone number and password.
 */
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload)
  return data
}

/**
 * POST /auth/logout
 * Invalidate the current session / token.
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

/**
 * GET /auth/me
 * Return the currently authenticated user.
 */
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me')
  return data
}
