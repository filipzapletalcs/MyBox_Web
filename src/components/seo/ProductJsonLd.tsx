import type { FullProductData } from '@/types/product'

interface ProductJsonLdProps {
  product: FullProductData
  url: string // Full canonical URL of the product page
}

/**
 * Generates JSON-LD structured data for a product page
 * Following schema.org Product specification
 */
export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const baseUrl = 'https://mybox.eco'

  // Build image URLs array
  const images = [
    `${baseUrl}${product.heroImage}`,
    ...product.gallery.slice(0, 5).map(img => `${baseUrl}${img.src}`),
  ]

  // Convert specifications to additionalProperty format
  const additionalProperties = product.specifications.flatMap(category =>
    category.specs.map(spec => ({
      '@type': 'PropertyValue',
      name: spec.label,
      value: spec.unit ? `${spec.value} ${spec.unit}` : spec.value,
    }))
  )

  // Build the JSON-LD object
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    sku: product.sku,
    category: product.category,
    url: url,

    // Brand
    brand: {
      '@type': 'Brand',
      name: 'MyBox',
      url: baseUrl,
    },

    // Manufacturer
    ...(product.manufacturer && {
      manufacturer: {
        '@type': 'Organization',
        name: product.manufacturer.name,
        url: product.manufacturer.url,
      },
    }),

    // Country of origin
    ...(product.countryOfOrigin && {
      countryOfOrigin: {
        '@type': 'Country',
        name: product.countryOfOrigin === 'CZ' ? 'Česká republika' : product.countryOfOrigin,
      },
    }),

    // Technical specifications as additional properties
    additionalProperty: additionalProperties,

    // Offers - price on request
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'CZK',
      seller: {
        '@type': 'Organization',
        name: 'ELEXIM, a.s.',
        url: baseUrl,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  )
}

/**
 * Generates BreadcrumbList JSON-LD for product pages
 */
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  )
}

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
    logo: 'https://mybox.eco/logo.svg',
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

/**
 * Generates FAQPage JSON-LD
 */
interface FAQItem {
  question: string
  answer: string
}

interface FAQJsonLdProps {
  items: FAQItem[]
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  )
}
