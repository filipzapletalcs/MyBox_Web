const BASE_URL = 'https://mybox.eco'

interface VideoObjectJsonLdProps {
  // Required
  name: string
  description: string
  contentUrl: string // URL to video file (.mp4, .webm, etc.)

  // Optional
  thumbnailUrl?: string | null
  uploadDate?: string | null // ISO date string
  duration?: string | null // ISO 8601 duration (e.g., PT1M30S for 1min 30sec)
  pageUrl?: string | null // URL of the page where video is embedded
  locale?: string // Default: 'cs'
  embedUrl?: string | null // For YouTube/Vimeo embedded videos
}

/**
 * Normalize URL - handle both absolute and relative URLs
 */
function normalizeUrl(url: string): string {
  if (url.startsWith('http')) {
    return url
  }
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Generates VideoObject JSON-LD structured data
 * Following schema.org VideoObject specification
 * @see https://schema.org/VideoObject
 */
export function VideoObjectJsonLd({
  name,
  description,
  contentUrl,
  thumbnailUrl,
  uploadDate,
  duration,
  pageUrl,
  locale = 'cs',
  embedUrl,
}: VideoObjectJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    contentUrl: normalizeUrl(contentUrl),
    inLanguage: locale,

    // Thumbnail
    ...(thumbnailUrl && {
      thumbnailUrl: normalizeUrl(thumbnailUrl),
    }),

    // Upload date
    ...(uploadDate && {
      uploadDate: new Date(uploadDate).toISOString(),
    }),

    // Duration in ISO 8601 format
    ...(duration && {
      duration,
    }),

    // Page URL where video is embedded
    ...(pageUrl && {
      url: normalizeUrl(pageUrl),
    }),

    // Embed URL for YouTube/Vimeo
    ...(embedUrl && {
      embedUrl,
    }),

    // Publisher info
    publisher: {
      '@type': 'Organization',
      name: 'ELEXIM, a.s.',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo-mybox.svg`,
        width: 85,
        height: 24,
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
