import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCorporatePageSchema } from '@/lib/validations/corporate-page'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/corporate-pages/[id] - Get a single corporate page with all relations
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('corporate_pages')
    .select(
      `
      *,
      corporate_page_translations(*),
      corporate_sections(
        *,
        corporate_section_translations(*)
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    console.error('Corporate page fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch corporate page' }, { status: 500 })
  }

  // Transform sections to include translations
  const transformedData = {
    ...data,
    translations: data.corporate_page_translations,
    sections: data.corporate_sections
      ?.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((section) => ({
        ...section,
        translations: section.corporate_section_translations,
      })),
  }

  return NextResponse.json({ data: transformedData })
}

// PATCH /api/corporate-pages/[id] - Update a corporate page
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
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
  const parsed = updateCorporatePageSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...pageData } = parsed.data

  // Update the page if there are page-level changes
  if (Object.keys(pageData).length > 0) {
    const { error: pageError } = await supabase
      .from('corporate_pages')
      .update(pageData)
      .eq('id', id)

    if (pageError) {
      console.error('Corporate page update error:', pageError)
      return NextResponse.json({ error: 'Failed to update corporate page' }, { status: 500 })
    }
  }

  // Update translations if provided
  if (translations && translations.length > 0) {
    // Delete existing translations and insert new ones (upsert pattern)
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from('corporate_page_translations')
        .upsert(
          {
            ...translation,
            page_id: id,
          },
          {
            onConflict: 'page_id,locale',
          }
        )

      if (translationError) {
        console.error('Corporate page translation error:', translationError)
        return NextResponse.json(
          { error: 'Failed to update corporate page translation' },
          { status: 500 }
        )
      }
    }
  }

  // Fetch updated page
  const { data: updatedPage, error: fetchError } = await supabase
    .from('corporate_pages')
    .select('*, corporate_page_translations(*)')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Corporate page fetch error:', fetchError)
    return NextResponse.json({ error: 'Failed to fetch corporate page' }, { status: 500 })
  }

  return NextResponse.json({ data: updatedPage })
}

// DELETE /api/corporate-pages/[id] - Delete a corporate page
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Delete the page (cascades to translations and sections)
  const { error } = await supabase
    .from('corporate_pages')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Corporate page delete error:', error)
    return NextResponse.json({ error: 'Failed to delete corporate page' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
