/**
 * Generates WebSite JSON-LD with SearchAction (for homepage)
 */
export function WebSiteJsonLd({ locale = 'cs' }: { locale?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MyBox',
    alternateName: 'MyBox Charging Stations',
    url: 'https://mybox.eco',
    description:
      locale === 'cs'
        ? 'Český výrobce nabíjecích stanic pro elektromobily'
        : locale === 'de'
          ? 'Tschechischer Hersteller von Ladestationen für Elektrofahrzeuge'
          : 'Czech manufacturer of EV charging stations',
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: 'ELEXIM, a.s.',
      url: 'https://mybox.eco',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          locale === 'cs'
            ? 'https://mybox.eco/blog?q={search_term_string}'
            : locale === 'de'
              ? 'https://mybox.eco/de/blog?q={search_term_string}'
              : 'https://mybox.eco/en/blog?q={search_term_string}',
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
