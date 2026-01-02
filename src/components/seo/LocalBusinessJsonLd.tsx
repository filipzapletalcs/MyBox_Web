/**
 * Generates LocalBusiness JSON-LD for the contact page
 * Based on company details from database
 */

interface LocalBusinessJsonLdProps {
  locale?: string
}

export function LocalBusinessJsonLd({ locale = 'cs' }: LocalBusinessJsonLdProps) {
  const descriptions: Record<string, string> = {
    cs: 'Český výrobce nabíjecích stanic pro elektromobily. AC a DC wallboxy pro domácnosti, firmy i veřejnou infrastrukturu.',
    en: 'Czech manufacturer of EV charging stations. AC and DC wallboxes for homes, businesses and public infrastructure.',
    de: 'Tschechischer Hersteller von Ladestationen für Elektrofahrzeuge. AC- und DC-Wallboxen für Privathaushalte, Unternehmen und öffentliche Infrastruktur.',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://mybox.eco/#localbusiness',
    name: 'MyBox',
    legalName: 'ELEXIM, a.s.',
    description: descriptions[locale] || descriptions.cs,
    url: 'https://mybox.eco',
    logo: 'https://mybox.eco/images/logo-mybox.svg',
    image: 'https://mybox.eco/images/og/home-og.png',
    telephone: '+420 734 597 699',
    email: 'obchod@mybox.eco',
    priceRange: '$$',
    currenciesAccepted: 'CZK, EUR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hulínská 1814/1b',
      addressLocality: 'Kroměříž',
      postalCode: '767 01',
      addressRegion: 'Zlínský kraj',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.2986,
      longitude: 17.3914,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '16:30',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+420 734 597 699',
        contactType: 'sales',
        email: 'obchod@mybox.eco',
        availableLanguage: ['Czech', 'English', 'German'],
        areaServed: ['CZ', 'SK', 'DE', 'AT'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+420 739 407 006',
        contactType: 'customer service',
        email: 'servis@mybox.eco',
        availableLanguage: ['Czech', 'English'],
        areaServed: ['CZ', 'SK'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/myboxchargingstations',
      'https://instagram.com/myboxchargingstations',
      'https://www.linkedin.com/company/mybox-charging-stations/',
      'https://www.youtube.com/@myboxchargingstations',
    ],
    // Additional business info
    foundingDate: '2017',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 50,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 49.8175,
        longitude: 15.4730,
      },
      geoRadius: '500000', // 500km radius from Czech Republic center
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Nabíjecí stanice MyBox',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'AC nabíjecí stanice',
            description: 'Wallboxy pro domácnosti a firmy',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'DC rychlonabíjecí stanice',
            description: 'Alpitronic Hypercharger až 400 kW',
          },
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  )
}
