/**
 * Document utility functions
 *
 * Handles fallback logic for multi-language documents and file size formatting.
 */

export type Locale = 'cs' | 'en' | 'de'

export interface DocumentFile {
  file_cs: string | null
  file_en: string | null
  file_de: string | null
  file_size_cs: number | null
  file_size_en: number | null
  file_size_de: number | null
  fallback_locale: Locale | null
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
 * Resolve the best available file for a given locale
 * Uses fallback chain to find available version
 */
export function resolveDocumentFile(
  document: DocumentFile,
  requestedLocale: Locale
): ResolvedFile | null {
  const fallbackChain = LOCALE_FALLBACKS[requestedLocale]

  // Try each locale in the fallback chain
  for (const locale of fallbackChain) {
    const fileKey = `file_${locale}` as keyof DocumentFile
    const sizeKey = `file_size_${locale}` as keyof DocumentFile

    const filePath = document[fileKey] as string | null
    const fileSize = document[sizeKey] as number | null

    if (filePath && fileSize) {
      return {
        url: getDocumentUrl(filePath),
        path: filePath,
        size: fileSize,
        locale,
        isFallback: locale !== requestedLocale,
      }
    }
  }

  // Last resort: use explicit fallback_locale if set
  if (document.fallback_locale) {
    const locale = document.fallback_locale
    const fileKey = `file_${locale}` as keyof DocumentFile
    const sizeKey = `file_size_${locale}` as keyof DocumentFile

    const filePath = document[fileKey] as string | null
    const fileSize = document[sizeKey] as number | null

    if (filePath && fileSize) {
      return {
        url: getDocumentUrl(filePath),
        path: filePath,
        size: fileSize,
        locale,
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
