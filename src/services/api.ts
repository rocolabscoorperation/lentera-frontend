import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types/api'

/**
 * Central Axios instance for all LENTERA API calls.
 * Components MUST NOT call axios directly — use domain services instead.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies if backend uses cookie-based sessions
})

// ── Request interceptor: attach Bearer token if stored ──────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('lentera_token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response interceptor: normalise errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = normaliseError(error)

    // 401 — clear stale auth and redirect to login
    if (apiError.status === 401) {
      localStorage.removeItem('lentera_token')
      // Avoid circular dependency with router — use location directly
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(apiError)
  },
)

/**
 * Normalise an Axios error into a frontend-safe ApiError.
 * Components never need to import axios or inspect AxiosError.
 */
function normaliseError(error: AxiosError): ApiError {
  if (error.response) {
    const status = error.response.status
    const data = error.response.data as Record<string, unknown> | undefined

    // Try to extract field-level errors for 422
    const fieldErrors =
      data && typeof data.errors === 'object' && data.errors !== null
        ? (data.errors as Record<string, string>)
        : undefined

    // Use backend message if available, else provide a sensible Indonesian default
    const message =
      (data?.message as string) ||
      (data?.error as string) ||
      defaultMessage(status)

    return { status, message, fieldErrors }
  }

  if (error.request) {
    return {
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    }
  }

  return { message: 'Terjadi kesalahan yang tidak diketahui.' }
}

function defaultMessage(status: number): string {
  switch (status) {
    case 400: return 'Permintaan tidak valid.'
    case 401: return 'Sesi Anda telah berakhir. Silakan masuk kembali.'
    case 403: return 'Anda tidak memiliki akses ke data ini.'
    case 404: return 'Data tidak ditemukan.'
    case 422: return 'Data yang dikirim tidak valid. Periksa kembali isian Anda.'
    case 429: return 'Terlalu banyak permintaan. Silakan tunggu sebentar.'
    case 500: return 'Terjadi kesalahan pada sistem. Silakan coba lagi.'
    default:  return 'Terjadi kesalahan. Silakan coba lagi.'
  }
}
