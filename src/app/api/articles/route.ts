import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createArticleSchema } from '@/lib/validations/article'
import { checkUserRole } from '@/lib/auth/checkRole'
import { CACHE_TTL } from '@/lib/utils/cache-response'

// GET /api/articles - Seznam článků
// Supports pagination: ?page=1&limit=20
// Supports filtering: ?status=published&category=uuid
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  // Pagination params with safety limits
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const offset = (page - 1) * limit

  // Filter params
  const status = searchParams.get('status')
  const category = searchParams.get('category')

  let query = supabase
    .from('articles')
    .select(
      `
      *,
      article_translations(*),
      categories(slug, category_translations(name, locale)),
      profiles(full_name, email)
    `,
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status as 'draft' | 'scheduled' | 'published' | 'archived')
  }

  if (category) {
    query = query.eq('category_id', category)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Articles fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }

  const response = NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })

  // Articles change more frequently - use dynamic cache (30 min browser, 1 hour CDN)
  response.headers.set(
    'Cache-Control',
    `public, max-age=${CACHE_TTL.DYNAMIC.maxAge}, s-maxage=${CACHE_TTL.DYNAMIC.sMaxAge}, stale-while-revalidate=86400`
  )

  return response
}

// POST /api/articles - Vytvoření článku
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Ověření uživatele
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RBAC check - admin, editor, and author can create articles
  const { hasRole } = await checkUserRole(supabase, user.id, ['admin', 'editor', 'author'])
  if (!hasRole) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 })
  }

  // Validace dat
  const body = await request.json()
  const parsed = createArticleSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, tag_ids, ...articleData } = parsed.data

  // Vytvoření článku
  const { data: article, error: articleError } = await supabase
    .from('articles')
    .insert({
      ...articleData,
      author_id: user.id,
    })
    .select()
    .single()

  if (articleError) {
    console.error('Article create error:', articleError)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }

  // Vytvoření překladů
  const translationsToInsert = translations.map((t) => ({
    ...t,
    article_id: article.id,
  }))

  const { error: translationsError } = await supabase
    .from('article_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    console.error('Article translations error:', translationsError)
    // Rollback - smazat článek
    await supabase.from('articles').delete().eq('id', article.id)
    return NextResponse.json(
      { error: 'Failed to create article translations' },
      { status: 500 }
    )
  }

  // Přiřazení tagů
  if (tag_ids && tag_ids.length > 0) {
    const tagsToInsert = tag_ids.map((tag_id) => ({
      article_id: article.id,
      tag_id,
    }))

    await supabase.from('article_tags').insert(tagsToInsert)
  }

  // Načíst kompletní článek
  const { data: completeArticle } = await supabase
    .from('articles')
    .select('*, article_translations(*)')
    .eq('id', article.id)
    .single()

  return NextResponse.json({ data: completeArticle }, { status: 201 })
}
