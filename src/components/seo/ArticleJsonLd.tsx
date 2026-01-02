/**
 * Generates Article JSON-LD for blog posts
 * Following schema.org Article specification
 */
interface ArticleJsonLdProps {
  title: string
  description: string
  url: string
  imageUrl?: string | null
  datePublished?: string | null
  dateModified?: string | null
  authorName?: string | null
  categoryName?: string | null
  locale?: string
  /** Optional article body text (plain text, no HTML) for better SEO */
  articleBody?: string | null
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  categoryName,
  locale = 'cs',
  articleBody,
}: ArticleJsonLdProps) {
  const baseUrl = 'https://mybox.eco'

  // Determine language from locale or URL
  const language = locale || (url.includes('/en/') ? 'en' : url.includes('/de/') ? 'de' : 'cs')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(imageUrl && {
      image: imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`,
    }),
    ...(datePublished && {
      datePublished: new Date(datePublished).toISOString(),
    }),
    ...(dateModified && {
      dateModified: new Date(dateModified).toISOString(),
    }),
    author: {
      '@type': authorName ? 'Person' : 'Organization',
      name: authorName || 'MyBox',
      ...(authorName ? {} : { url: baseUrl }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'MyBox',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo-mybox.svg`,
        width: 85,
        height: 24,
      },
    },
    ...(categoryName && {
      articleSection: categoryName,
    }),
    ...(articleBody && {
      articleBody: articleBody,
    }),
    inLanguage: language,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 0) }}
    />
  )
}
