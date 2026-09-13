import { format, differenceInYears, parseISO, isValid } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

/**
 * Calculate age in years from an ISO date string.
 * Age is always derived from birthDate; it is never stored directly.
 */
export function calculateAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null
  const parsed = parseISO(birthDate)
  if (!isValid(parsed)) return null
  return differenceInYears(new Date(), parsed)
}

/**
 * Format an ISO date string as a human-readable date in Bahasa Indonesia.
 * Example: "15 Agustus 2005"
 */
export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  const parsed = parseISO(date)
  if (!isValid(parsed)) return '—'
  return format(parsed, 'd MMMM yyyy', { locale: idLocale })
}

/**
 * Format an ISO datetime string as a human-readable date + time in Bahasa Indonesia.
 * Example: "15 Agustus 2005, 14:30"
 */
export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '—'
  const parsed = parseISO(date)
  if (!isValid(parsed)) return '—'
  return format(parsed, "d MMMM yyyy, HH:mm", { locale: idLocale })
}

/**
 * Format an ISO date string into a YYYY-MM-DD string for form inputs.
 */
export function toInputDate(date: string | null | undefined): string {
  if (!date) return ''
  const parsed = parseISO(date)
  if (!isValid(parsed)) return ''
  return format(parsed, 'yyyy-MM-dd')
}

/**
 * Get today's date as a YYYY-MM-DD string for use as a max date on date inputs.
 */
export function todayInputDate(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
