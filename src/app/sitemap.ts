import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
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

// Generate alternates for dynamic paths (not in routing config)
function generateDynamicAlternates(basePath: string, slug: string): Record<string, string> {
  const alternates: Record<string, string> = {}

  for (const locale of locales) {
    if (locale === defaultLocale) {
      alternates[locale] = `${baseUrl}${basePath}/${slug}`
    } else {
      alternates[locale] = `${baseUrl}/${locale}${basePath}/${slug}`
    }
  }

  return alternates
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const entries: MetadataRoute.Sitemap = []

  // ============================================
  // 1. STATIC PAGES from routing config
  // ============================================
  const staticPaths = Object.keys(routing.pathnames).filter(
    path => !path.includes('[')
  )

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

  // ============================================
  // 2. PRODUCTS from database
  // ============================================
  const { data: products } = await supabase
    .from('products')
    .select('slug, type, updated_at')
    .eq('is_active', true)

  if (products) {
    for (const product of products) {
      const category = product.type === 'ac_mybox' ? 'ac' : 'dc'
      const basePath = `/nabijeci-stanice/${category}`

      for (const locale of locales) {
        const localizedBasePath = locale === 'cs'
          ? basePath
          : locale === 'en'
            ? `/charging-stations/${category}`
            : `/ladestationen/${category}`

        const url = locale === defaultLocale
          ? `${baseUrl}${localizedBasePath}/${product.slug}`
          : `${baseUrl}/${locale}${localizedBasePath}/${product.slug}`

        entries.push({
          url,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
          alternates: {
            languages: generateDynamicAlternates(localizedBasePath, product.slug),
          },
        })
      }
    }
  }

  // ============================================
  // 3. BLOG ARTICLES from database
  // ============================================
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')

  if (articles) {
    for (const article of articles) {
      for (const locale of locales) {
        const localizedBasePath = locale === 'cs'
          ? '/blog'
          : locale === 'en'
            ? '/blog'
            : '/blog'

        const url = locale === defaultLocale
          ? `${baseUrl}${localizedBasePath}/${article.slug}`
          : `${baseUrl}/${locale}${localizedBasePath}/${article.slug}`

        entries.push({
          url,
          lastModified: article.updated_at
            ? new Date(article.updated_at)
            : article.published_at
              ? new Date(article.published_at)
              : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: generateDynamicAlternates(localizedBasePath, article.slug),
          },
        })
      }
    }
  }

  // ============================================
  // 4. BLOG CATEGORIES from database
  // ============================================
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')

  if (categories) {
    for (const category of categories) {
      for (const locale of locales) {
        const localizedBasePath = locale === 'cs'
          ? '/blog/kategorie'
          : locale === 'en'
            ? '/blog/category'
            : '/blog/kategorie'

        const url = locale === defaultLocale
          ? `${baseUrl}${localizedBasePath}/${category.slug}`
          : `${baseUrl}/${locale}${localizedBasePath}/${category.slug}`

        entries.push({
          url,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: {
            languages: generateDynamicAlternates(localizedBasePath, category.slug),
          },
        })
      }
    }
  }

  // ============================================
  // 5. DOCUMENTS from database
  // ============================================
  const { data: documents } = await supabase
    .from('documents')
    .select('slug, updated_at')

  if (documents) {
    for (const doc of documents) {
      for (const locale of locales) {
        const localizedBasePath = locale === 'cs'
          ? '/dokumenty'
          : locale === 'en'
            ? '/documents'
            : '/dokumente'

        const url = locale === defaultLocale
          ? `${baseUrl}${localizedBasePath}/${doc.slug}`
          : `${baseUrl}/${locale}${localizedBasePath}/${doc.slug}`

        entries.push({
          url,
          lastModified: doc.updated_at ? new Date(doc.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
          alternates: {
            languages: generateDynamicAlternates(localizedBasePath, doc.slug),
          },
        })
      }
    }
  }

  // ============================================
  // 6. CORPORATE PAGES (Firemní nabíjení)
  // ============================================
  const { data: corporatePages } = await supabase
    .from('corporate_pages')
    .select('slug, page_type, updated_at')
    .eq('is_active', true)

  if (corporatePages) {
    for (const page of corporatePages) {
      for (const locale of locales) {
        // Localized base path for corporate section
        const localizedBasePath = locale === 'cs'
          ? '/nabijeni-pro-firmy'
          : locale === 'en'
            ? '/corporate-charging'
            : '/laden-fur-unternehmen'

        // Landing page has no slug in URL
        const url = page.page_type === 'landing'
          ? (locale === defaultLocale
              ? `${baseUrl}${localizedBasePath}`
              : `${baseUrl}/${locale}${localizedBasePath}`)
          : (locale === defaultLocale
              ? `${baseUrl}${localizedBasePath}/${page.slug}`
              : `${baseUrl}/${locale}${localizedBasePath}/${page.slug}`)

        entries.push({
          url,
          lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: page.page_type === 'landing' ? 0.9 : 0.7,
          alternates: {
            languages: page.page_type === 'landing'
              ? generateDynamicAlternates(localizedBasePath, '')
              : generateDynamicAlternates(localizedBasePath, page.slug),
          },
        })
      }
    }
  }

  return entries
}

// Determine change frequency based on path type
function getChangeFrequency(path: string): 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' {
  if (path === '/') return 'weekly'
  if (path.includes('/blog')) return 'daily'
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
