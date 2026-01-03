const BASE_URL = 'https://mybox.eco'

const DESCRIPTIONS: Record<string, string> = {
  cs: 'Český výrobce nabíjecích stanic pro elektromobily',
  en: 'Czech manufacturer of EV charging stations',
  de: 'Tschechischer Hersteller von Ladestationen für Elektrofahrzeuge',
}

/**
 * Build locale-aware URL path
 * CS is the default locale (no prefix), others get /{locale} prefix
 */
function buildLocalePath(locale: string, path: string): string {
  const prefix = locale === 'cs' ? '' : `/${locale}`
  return `${BASE_URL}${prefix}${path}`
}

/**
 * Generates WebSite JSON-LD with SearchAction (for homepage)
 */
export function WebSiteJsonLd({ locale = 'cs' }: { locale?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MyBox',
    alternateName: 'MyBox Charging Stations',
    url: buildLocalePath(locale, ''),
    description: DESCRIPTIONS[locale] || DESCRIPTIONS.en,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'ELEXIM, a.s.',
      url: BASE_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${buildLocalePath(locale, '/blog')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  )
}
