import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/documents/categories - Seznam kategorií dokumentů
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const active = searchParams.get('active')
  const locale = searchParams.get('locale')

  let query = supabase
    .from('document_categories')
    .select('*, document_category_translations(*)')
    .order('sort_order', { ascending: true })

  if (active !== null) {
    query = query.eq('is_active', active === 'true')
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If locale is specified, filter translations
  if (locale && data) {
    const filteredData = data.map((cat) => ({
      ...cat,
      document_category_translations: cat.document_category_translations?.filter(
        (t: { locale: string }) => t.locale === locale
      ),
    }))
    return NextResponse.json({ data: filteredData })
  }

  return NextResponse.json({ data })
}

// POST /api/documents/categories - Vytvoření kategorie
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { translations, ...categoryData } = body

  // Validate required fields
  if (!categoryData.slug) {
    return NextResponse.json({ error: 'slug is required' }, { status: 400 })
  }

  // Create category
  const { data: category, error: categoryError } = await supabase
    .from('document_categories')
    .insert(categoryData)
    .select()
    .single()

  if (categoryError) {
    return NextResponse.json({ error: categoryError.message }, { status: 500 })
  }

  // Insert translations
  if (translations && translations.length > 0) {
    const translationsToInsert = translations.map(
      (t: { locale: string; name: string; description?: string }) => ({
        category_id: category.id,
        locale: t.locale,
        name: t.name,
        description: t.description,
      })
    )

    const { error: translationsError } = await supabase
      .from('document_category_translations')
      .insert(translationsToInsert)

    if (translationsError) {
      // Rollback category creation
      await supabase.from('document_categories').delete().eq('id', category.id)
      return NextResponse.json(
        { error: translationsError.message },
        { status: 500 }
      )
    }
  }

  // Fetch complete category
  const { data: completeCategory } = await supabase
    .from('document_categories')
    .select('*, document_category_translations(*)')
    .eq('id', category.id)
    .single()

  return NextResponse.json({ data: completeCategory }, { status: 201 })
}
