import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCorporateSectionSchema, reorderSectionsSchema } from '@/lib/validations/corporate-page'
import type { Json } from '@/lib/supabase/database.types'
import type { CorporateSectionType } from '@/types/corporate'

// GET /api/corporate-sections - List sections (optionally filtered by page)
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page_id = searchParams.get('page_id')

  let query = supabase
    .from('corporate_sections')
    .select(
      `
      *,
      corporate_section_translations(*)
    `
    )
    .order('sort_order', { ascending: true })

  if (page_id) {
    query = query.eq('page_id', page_id)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform data
  const transformedData = data?.map((section) => ({
    ...section,
    translations: section.corporate_section_translations,
  }))

  return NextResponse.json({ data: transformedData })
}

// POST /api/corporate-sections - Create a new section
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
  const parsed = createCorporateSectionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, config, ...sectionData } = parsed.data

  // Get the highest sort_order for this page
  const { data: existingSections } = await supabase
    .from('corporate_sections')
    .select('sort_order')
    .eq('page_id', sectionData.page_id)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextSortOrder = existingSections?.[0]?.sort_order
    ? existingSections[0].sort_order + 1
    : 0

  // Create the section
  const { data: section, error: sectionError } = await supabase
    .from('corporate_sections')
    .insert({
      page_id: sectionData.page_id,
      section_type: sectionData.section_type as CorporateSectionType,
      is_active: sectionData.is_active,
      config: (config ?? {}) as Json,
      sort_order: sectionData.sort_order ?? nextSortOrder,
    })
    .select()
    .single()

  if (sectionError) {
    return NextResponse.json({ error: sectionError.message }, { status: 500 })
  }

  // Create translations if provided
  if (translations && translations.length > 0) {
    const translationsToInsert = translations.map((t) => ({
      ...t,
      section_id: section.id,
    }))

    const { error: translationsError } = await supabase
      .from('corporate_section_translations')
      .insert(translationsToInsert)

    if (translationsError) {
      // Rollback
      await supabase.from('corporate_sections').delete().eq('id', section.id)
      return NextResponse.json(
        { error: translationsError.message },
        { status: 500 }
      )
    }
  }

  // Fetch complete section
  const { data: completeSection } = await supabase
    .from('corporate_sections')
    .select('*, corporate_section_translations(*)')
    .eq('id', section.id)
    .single()

  return NextResponse.json({ data: completeSection }, { status: 201 })
}

// PUT /api/corporate-sections - Reorder sections
export async function PUT(request: NextRequest) {
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
  const parsed = reorderSectionsSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { section_ids } = parsed.data

  // Update sort_order for each section
  const updates = section_ids.map((id, index) =>
    supabase
      .from('corporate_sections')
      .update({ sort_order: index })
      .eq('id', id)
  )

  const results = await Promise.all(updates)

  const errors = results.filter((r) => r.error)
  if (errors.length > 0) {
    return NextResponse.json(
      { error: 'Failed to reorder sections' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
