/**
 * Security validation utilities
 */

/**
 * Sanitize a file path to prevent path traversal attacks.
 * - Removes ".." sequences
 * - Removes leading "/"
 * - Only allows alphanumeric, hyphens, underscores, and forward slashes
 *
 * @returns Sanitized path or null if invalid
 */
export function sanitizePath(path: string | null): string | null {
  if (!path) return null

  // Remove .. sequences (path traversal)
  let sanitized = path.replace(/\.\./g, '')

  // Remove leading slashes
  sanitized = sanitized.replace(/^\/+/, '')

  // Remove trailing slashes
  sanitized = sanitized.replace(/\/+$/, '')

  // Collapse multiple slashes
  sanitized = sanitized.replace(/\/+/g, '/')

  // Validate: only alphanumeric, hyphens, underscores, and forward slashes
  if (!/^[a-zA-Z0-9_\-\/]+$/.test(sanitized)) {
    return null
  }

  // Empty after sanitization is invalid
  if (!sanitized) {
    return null
  }

  return sanitized
}

/**
 * Validate that a path doesn't contain dangerous patterns
 */
export function isValidPath(path: string | null): boolean {
  if (!path) return false

  // Check for path traversal attempts
  if (path.includes('..')) return false

  // Check for null bytes
  if (path.includes('\0')) return false

  // Check for protocol handlers
  if (/^[a-zA-Z]+:/.test(path)) return false

  return true
}
