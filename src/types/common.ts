/**
 * Shared primitive types used across the entire LENTERA frontend.
 * These reflect the verified PostgreSQL schema and Go API contract.
 */

/**
 * PostgreSQL uses BIGINT for all primary keys.
 * JavaScript cannot safely represent every BIGINT as a number.
 * Use EntityId throughout the app; centralise the type here so it
 * can be changed once when the Go API serialisation contract is final.
 */
export type EntityId = string | number

/**
 * Gender values as stored in the PostgreSQL gender enum.
 * Do NOT use 'MALE' / 'FEMALE' unless the Go API explicitly maps to those.
 */
export type Gender = 'Laki-laki' | 'Perempuan'

/**
 * School type values as stored in the PostgreSQL school_types enum.
 */
export type SchoolType = 'Sekolah Inklusi' | 'Sekolah Luar Biasa'

/** ISO 8601 date string (YYYY-MM-DD) */
export type ISODate = string

/** ISO 8601 date-time string */
export type ISODateTime = string
