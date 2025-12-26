/**
 * Generates CollectionPage JSON-LD for blog listing pages
 * Following schema.org CollectionPage specification
 */
interface CollectionPageJsonLdProps {
  title: string
  description: string
  url: string
  locale?: string
}

export function CollectionPageJsonLd({
  title,
  description,
  url,
  locale = 'cs',
}: CollectionPageJsonLdProps) {
  const baseUrl = 'https://mybox.eco'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': url,
        url: url,
        name: title,
        description: description,
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        inLanguage: locale,
        potentialAction: [
          {
            '@type': 'ReadAction',
            target: [url],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'MyBox',
        description: 'Nabíjecí stanice pro elektromobily',
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
        inLanguage: locale,
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'MyBox',
        legalName: 'ELEXIM, a.s.',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          '@id': `${baseUrl}/#/schema/logo/image/`,
          url: `${baseUrl}/logo.svg`,
          contentUrl: `${baseUrl}/logo.svg`,
          caption: 'MyBox',
        },
        image: {
          '@id': `${baseUrl}/#/schema/logo/image/`,
        },
        sameAs: [
          'https://www.facebook.com/myboxchargingstations',
          'https://instagram.com/myboxchargingstations',
          'https://www.linkedin.com/company/mybox-charging-stations/',
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  )
}
