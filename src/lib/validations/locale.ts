import { z } from 'zod'
import { LOCALES } from '@/config/locales'

/**
 * Shared Zod schema for locale validation.
 * Dynamically derived from LOCALES config for single source of truth.
 *
 * Usage in other validation files:
 * import { localeSchema } from './locale'
 * locale: localeSchema
 */
export const localeSchema = z.enum(LOCALES as unknown as [string, ...string[]])

export type LocaleSchema = z.infer<typeof localeSchema>
