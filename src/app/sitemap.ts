import type { MetadataRoute } from 'next'
import { routing, locales, defaultLocale, type Locale } from '@/i18n/routing'

const baseUrl = 'https://mybox.eco'

// Get localized URL for a given path and locale
function getLocalizedUrl(path: string, locale: Locale): string {
  const pathConfig = routing.pathnames[path as keyof typeof routing.pathnames]

  if (!pathConfig) {
    // Fallback for paths not in routing config
    return locale === defaultLocale
      ? `${baseUrl}${path}`
      : `${baseUrl}/${locale}${path}`
  }

  // Get the localized path
  const localizedPath = typeof pathConfig === 'string'
    ? pathConfig
    : pathConfig[locale]

  // For default locale, don't add prefix (localePrefix: 'as-needed')
  if (locale === defaultLocale) {
    return `${baseUrl}${localizedPath}`
  }

  return `${baseUrl}/${locale}${localizedPath}`
}

// Generate alternates for all locales
function generateAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {}

  for (const locale of locales) {
    alternates[locale] = getLocalizedUrl(path, locale)
  }

  return alternates
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Get all static paths from routing config (exclude dynamic routes like [slug])
  const staticPaths = Object.keys(routing.pathnames).filter(
    path => !path.includes('[')
  )

  const entries: MetadataRoute.Sitemap = []

  for (const path of staticPaths) {
    // Generate entry for each locale
    for (const locale of locales) {
      entries.push({
        url: getLocalizedUrl(path, locale as Locale),
        lastModified: new Date(),
        changeFrequency: getChangeFrequency(path),
        priority: getPriority(path),
        alternates: {
          languages: generateAlternates(path),
        },
      })
    }
  }

  return entries
}

// Determine change frequency based on path type
function getChangeFrequency(path: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  if (path === '/') return 'weekly'
  if (path.includes('/blog')) return 'daily'
  if (path.includes('/reference')) return 'weekly'
  if (path.includes('/nabijeci-stanice')) return 'monthly'
  return 'monthly'
}

// Determine priority based on path depth and importance
function getPriority(path: string): number {
  if (path === '/') return 1.0

  // Main category pages
  if (['/nabijeci-stanice', '/nabijeni-pro-firmy', '/reseni-nabijeni', '/kontakt', '/poptavka'].includes(path)) {
    return 0.9
  }

  // Product pages
  if (path.includes('/nabijeci-stanice/ac/') || path.includes('/nabijeci-stanice/dc/')) {
    return 0.8
  }

  // Sub-category pages
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 2) return 0.7
  if (segments.length === 3) return 0.6

  return 0.5
}
