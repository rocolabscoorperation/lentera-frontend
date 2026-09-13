import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/types/api'

/**
 * Central Axios instance for all LENTERA API calls.
 * Components MUST NOT call axios directly — use domain services instead.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // send cookies if backend uses cookie-based sessions
  timeout: 15000,
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

    // Let the auth store and router react without replacing the current URL.
    if (apiError.status === 401) {
      localStorage.removeItem('lentera_token')
      window.dispatchEvent(new Event('lentera:unauthorized'))
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

    // Only expose structured validation messages, never an arbitrary server body.
    const fieldErrors =
      status === 422 && data && typeof data.errors === 'object' && data.errors !== null
        ? Object.fromEntries(Object.entries(data.errors).filter((entry): entry is [string, string] =>
            typeof entry[1] === 'string'))
        : undefined
    const cooldownUntil = status === 429 && typeof data?.cooldownUntil === 'string'
      ? data.cooldownUntil : undefined
    return {
      status,
      message: defaultMessage(status),
      fieldErrors,
      code: typeof data?.code === 'string' ? data.code : undefined,
      cooldownUntil,
    }
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
