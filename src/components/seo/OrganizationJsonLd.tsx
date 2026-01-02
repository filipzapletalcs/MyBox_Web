/**
 * Generates Organization JSON-LD (for use in layout)
 */
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MyBox',
    legalName: 'ELEXIM, a.s.',
    url: 'https://mybox.eco',
    logo: 'https://mybox.eco/images/logo-mybox.svg',
    description: 'Český výrobce nabíjecích stanic pro elektromobily. AC a DC wallboxy pro domácnosti, firmy i veřejnou infrastrukturu.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hulínská 1814/1b',
      addressLocality: 'Kroměříž',
      postalCode: '767 01',
      addressCountry: 'CZ',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+420-734-597-699',
        contactType: 'sales',
        availableLanguage: ['Czech', 'English', 'German'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+420-739-407-006',
        contactType: 'customer service',
        availableLanguage: ['Czech', 'English'],
      },
    ],
    email: 'info@mybox.eco',
    sameAs: [
      'https://www.facebook.com/myboxchargingstations',
      'https://instagram.com/myboxchargingstations',
      'https://www.linkedin.com/company/mybox-charging-stations/',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  )
}
