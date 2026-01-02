import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * On-demand revalidation API endpoint
 *
 * Usage:
 * POST /api/revalidate
 * Body: { path: "/blog/article-slug", type: "path" | "tag", secret?: string }
 *
 * Or query params:
 * POST /api/revalidate?path=/blog/article-slug&type=path
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is editor or admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.role || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Editor or Admin role required' },
        { status: 403 }
      )
    }

    // Parse request
    const searchParams = request.nextUrl.searchParams
    let path = searchParams.get('path')
    let type = searchParams.get('type') || 'path'
    let tag = searchParams.get('tag')
    let locales = searchParams.get('locales')?.split(',') || ['cs', 'en', 'de']

    // Try to get from body if not in query params
    if (!path && !tag) {
      try {
        const body = await request.json()
        path = body.path
        type = body.type || 'path'
        tag = body.tag
        locales = body.locales || ['cs', 'en', 'de']
      } catch {
        // No body, continue with query params
      }
    }

    const revalidated: string[] = []

    // Revalidate by tag (Next.js 16 requires cache profile as second arg)
    if (type === 'tag' && tag) {
      revalidateTag(tag, 'max') // 'max' profile for stale-while-revalidate
      revalidated.push(`tag:${tag}`)
    }

    // Revalidate by path
    if (type === 'path' && path) {
      // If path starts with /[locale]/, revalidate for all locales
      if (path.includes('[locale]')) {
        for (const locale of locales) {
          const localizedPath = path.replace('[locale]', locale)
          revalidatePath(localizedPath)
          revalidated.push(localizedPath)
        }
      } else {
        // Check if path already has locale prefix
        const hasLocale = locales.some(l => path!.startsWith(`/${l}/`) || path === `/${l}`)

        if (hasLocale) {
          // Revalidate as-is
          revalidatePath(path)
          revalidated.push(path)
        } else {
          // Revalidate for all locales
          for (const locale of locales) {
            const localizedPath = `/${locale}${path.startsWith('/') ? '' : '/'}${path}`
            revalidatePath(localizedPath)
            revalidated.push(localizedPath)
          }
        }
      }
    }

    // Revalidate all blog pages (for listing updates)
    if (path?.includes('/blog/')) {
      for (const locale of locales) {
        revalidatePath(`/${locale}/blog`)
        revalidated.push(`/${locale}/blog`)
      }
    }

    if (revalidated.length === 0) {
      return NextResponse.json(
        { error: 'No path or tag specified' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      revalidated,
      message: `Revalidated ${revalidated.length} paths`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    )
  }
}

// Also support GET for simpler testing
export async function GET(request: NextRequest) {
  return POST(request)
}
