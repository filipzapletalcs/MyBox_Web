import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCorporatePageSchema } from '@/lib/validations/corporate-page'

// GET /api/corporate-pages - List all corporate pages
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page_type = searchParams.get('page_type')
  const include_inactive = searchParams.get('include_inactive') === 'true'

  let query = supabase
    .from('corporate_pages')
    .select(
      `
      *,
      corporate_page_translations(*)
    `,
      { count: 'exact' }
    )
    .order('sort_order', { ascending: true })

  if (page_type) {
    query = query.eq('page_type', page_type)
  }

  if (!include_inactive) {
    query = query.eq('is_active', true)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Corporate pages fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch corporate pages' }, { status: 500 })
  }

  // Transform data to include translations as object keyed by locale
  const transformedData = data?.map((page) => ({
    ...page,
    translations: page.corporate_page_translations,
  }))

  return NextResponse.json({
    data: transformedData,
    total: count || 0,
  })
}

// POST /api/corporate-pages - Create a new corporate page
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validate request body
  const body = await request.json()
  const parsed = createCorporatePageSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...pageData } = parsed.data

  // Create the page
  const { data: page, error: pageError } = await supabase
    .from('corporate_pages')
    .insert(pageData)
    .select()
    .single()

  if (pageError) {
    console.error('Corporate page create error:', pageError)
    return NextResponse.json({ error: 'Failed to create corporate page' }, { status: 500 })
  }

  // Create translations
  const translationsToInsert = translations.map((t) => ({
    ...t,
    page_id: page.id,
  }))

  const { error: translationsError } = await supabase
    .from('corporate_page_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    console.error('Corporate page translations error:', translationsError)
    // Rollback - delete the page
    await supabase.from('corporate_pages').delete().eq('id', page.id)
    return NextResponse.json(
      { error: 'Failed to create corporate page translations' },
      { status: 500 }
    )
  }

  // Fetch complete page with translations
  const { data: completePage } = await supabase
    .from('corporate_pages')
    .select('*, corporate_page_translations(*)')
    .eq('id', page.id)
    .single()

  return NextResponse.json({ data: completePage }, { status: 201 })
}
