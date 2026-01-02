/**
 * Document utility functions
 *
 * Handles fallback logic for multi-language documents and file size formatting.
 * Updated to use translations pattern (file_path in document_translations).
 */

export type Locale = 'cs' | 'en' | 'de'

// Document translation with file info
export interface DocumentTranslation {
  locale: string
  title: string
  description: string | null
  file_path: string | null
  file_size: number | null
}

// Minimal document interface for file resolution
export interface DocumentBase {
  fallback_locale: Locale | null
  document_translations: DocumentTranslation[]
}

// Full document interface with all fields
export interface Document extends DocumentBase {
  id: string
  slug: string
  category_id: string
  sort_order: number | null
}

export interface ResolvedFile {
  url: string
  path: string
  size: number
  locale: Locale
  isFallback: boolean
}

/**
 * Fallback chain for each locale
 * - cs: only Czech
 * - en: only English
 * - de: German first, then English as fallback
 */
const LOCALE_FALLBACKS: Record<Locale, Locale[]> = {
  cs: ['cs'],
  en: ['en'],
  de: ['de', 'en'],
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'

/**
 * Get document storage URL
 */
export function getDocumentUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${SUPABASE_URL}/storage/v1/object/public/documents/${cleanPath}`
}

/**
 * Get translation for a specific locale
 */
export function getDocumentTranslation(
  document: DocumentBase,
  locale: Locale
): DocumentTranslation | null {
  return (
    document.document_translations.find((t) => t.locale === locale) ||
    document.document_translations[0] ||
    null
  )
}

/**
 * Resolve the best available file for a given locale
 * Uses fallback chain to find available version
 */
export function resolveDocumentFile(
  document: DocumentBase,
  requestedLocale: Locale
): ResolvedFile | null {
  const fallbackChain = LOCALE_FALLBACKS[requestedLocale]
  const translations = document.document_translations

  // Try each locale in the fallback chain
  for (const locale of fallbackChain) {
    const translation = translations.find((t) => t.locale === locale)

    if (translation?.file_path && translation?.file_size) {
      return {
        url: getDocumentUrl(translation.file_path),
        path: translation.file_path,
        size: translation.file_size,
        locale,
        isFallback: locale !== requestedLocale,
      }
    }
  }

  // Last resort: use explicit fallback_locale if set
  if (document.fallback_locale) {
    const locale = document.fallback_locale
    const translation = translations.find((t) => t.locale === locale)

    if (translation?.file_path && translation?.file_size) {
      return {
        url: getDocumentUrl(translation.file_path),
        path: translation.file_path,
        size: translation.file_size,
        locale,
        isFallback: true,
      }
    }
  }

  // Try any available translation with a file
  for (const translation of translations) {
    if (translation.file_path && translation.file_size) {
      return {
        url: getDocumentUrl(translation.file_path),
        path: translation.file_path,
        size: translation.file_size,
        locale: translation.locale as Locale,
        isFallback: true,
      }
    }
  }

  return null
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Get file extension from path
 */
export function getFileExtension(path: string): string {
  const parts = path.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : ''
}

/**
 * Get locale display name
 */
export const LOCALE_NAMES: Record<Locale, string> = {
  cs: 'Čeština',
  en: 'English',
  de: 'Deutsch',
}

/**
 * Get locale flag emoji
 */
export const LOCALE_FLAGS: Record<Locale, string> = {
  cs: '🇨🇿',
  en: '🇬🇧',
  de: '🇩🇪',
}

/**
 * All supported locales
 */
export const SUPPORTED_LOCALES: Locale[] = ['cs', 'en', 'de']
