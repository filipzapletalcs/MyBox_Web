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
