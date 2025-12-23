/**
 * Supabase Storage URL helpers
 *
 * Usage:
 * - getProductImageUrl('profi/gallery/image.jpg')
 * - getMediaUrl('logos/volvo.svg')
 * - getArticleImageUrl('2024/01/hero.jpg')
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'

export type StorageBucket = 'product-images' | 'article-images' | 'media'

/**
 * Get public URL for a file in Supabase Storage
 */
export function getStorageUrl(bucket: StorageBucket, path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${cleanPath}`
}

/**
 * Get product image URL
 * @param path - Path within product-images bucket (e.g., 'profi/gallery/image.jpg')
 */
export function getProductImageUrl(path: string): string {
  return getStorageUrl('product-images', path)
}

/**
 * Get article image URL
 * @param path - Path within article-images bucket
 */
export function getArticleImageUrl(path: string): string {
  return getStorageUrl('article-images', path)
}

/**
 * Get media URL (logos, icons, videos, etc.)
 * @param path - Path within media bucket (e.g., 'logos/volvo.svg')
 */
export function getMediaUrl(path: string): string {
  return getStorageUrl('media', path)
}

/**
 * Get video URL from media bucket
 * @param path - Path within media bucket (e.g., 'videos/hero-stations.mp4')
 */
export function getVideoUrl(path: string): string {
  return getStorageUrl('media', path)
}

/**
 * Check if URL is already a Storage URL
 */
export function isStorageUrl(url: string): boolean {
  return url.includes('/storage/v1/object/public/')
}

/**
 * Convert old /images/... path to Storage URL
 * Useful during migration period
 */
export function convertLegacyImageUrl(url: string): string {
  if (isStorageUrl(url)) {
    return url // Already converted
  }

  // /images/products/... → product-images bucket
  if (url.startsWith('/images/products/')) {
    const path = url.replace('/images/products/', '')
    return getProductImageUrl(path)
  }

  // /images/logos/... → media bucket
  if (url.startsWith('/images/logos/')) {
    const path = url.replace('/images/', '')
    return getMediaUrl(path)
  }

  // /images/... → media bucket (general)
  if (url.startsWith('/images/')) {
    const path = url.replace('/images/', '')
    return getMediaUrl(path)
  }

  return url // Return as-is if no match
}
