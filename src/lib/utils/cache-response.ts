import { NextResponse } from 'next/server'

/**
 * Cache TTL presets for different types of data
 */
export const CACHE_TTL = {
  /** Data that rarely changes (company info, categories) */
  STATIC: { maxAge: 86400, sMaxAge: 604800 }, // 1 day browser, 7 days CDN
  /** Data that changes occasionally (products, team members) */
  STANDARD: { maxAge: 3600, sMaxAge: 86400 }, // 1 hour browser, 1 day CDN
  /** Data that changes frequently (articles, blog posts) */
  DYNAMIC: { maxAge: 1800, sMaxAge: 3600 }, // 30 min browser, 1 hour CDN
  /** Data that should not be cached */
  NO_CACHE: { maxAge: 0, sMaxAge: 0 },
} as const

interface CacheOptions {
  /** Browser cache max-age in seconds */
  maxAge?: number
  /** CDN cache s-maxage in seconds */
  sMaxAge?: number
  /** Enable stale-while-revalidate (default: true) */
  staleWhileRevalidate?: boolean | number
}

/**
 * Creates a NextResponse with proper Cache-Control headers
 *
 * @example
 * ```ts
 * // Using presets
 * return createCachedResponse(data, CACHE_TTL.STATIC)
 *
 * // Custom TTL
 * return createCachedResponse(data, { maxAge: 3600, sMaxAge: 86400 })
 * ```
 */
export function createCachedResponse<T>(
  data: T,
  options: CacheOptions = CACHE_TTL.STANDARD
): NextResponse {
  const {
    maxAge = 3600,
    sMaxAge = 86400,
    staleWhileRevalidate = true,
  } = options

  const response = NextResponse.json({ data })

  // Build Cache-Control header
  const directives: string[] = ['public']

  if (maxAge > 0) {
    directives.push(`max-age=${maxAge}`)
  }

  if (sMaxAge > 0) {
    directives.push(`s-maxage=${sMaxAge}`)
  }

  if (staleWhileRevalidate) {
    const swr = typeof staleWhileRevalidate === 'number'
      ? staleWhileRevalidate
      : Math.max(sMaxAge, 86400)
    directives.push(`stale-while-revalidate=${swr}`)
  }

  if (maxAge === 0 && sMaxAge === 0) {
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
  } else {
    response.headers.set('Cache-Control', directives.join(', '))
  }

  return response
}

/**
 * Creates a NextResponse for paginated data with caching
 */
export function createPaginatedCachedResponse<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number },
  options: CacheOptions = CACHE_TTL.DYNAMIC
): NextResponse {
  const response = createCachedResponse(
    {
      items: data,
      pagination: {
        ...pagination,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasMore: pagination.page * pagination.limit < pagination.total,
      },
    },
    options
  )

  return response
}
