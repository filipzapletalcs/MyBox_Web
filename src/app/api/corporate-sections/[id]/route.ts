import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCorporateSectionSchema } from '@/lib/validations/corporate-page'
import type { Json } from '@/lib/supabase/database.types'
import type { CorporateSectionType } from '@/types/corporate'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/corporate-sections/[id] - Get a single section
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('corporate_sections')
    .select('*, corporate_section_translations(*)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }
    console.error('Corporate section fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch corporate section' }, { status: 500 })
  }

  return NextResponse.json({
    data: {
      ...data,
      translations: data.corporate_section_translations,
    },
  })
}

// PATCH /api/corporate-sections/[id] - Update a section
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
  const parsed = updateCorporateSectionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, config, section_type, ...sectionData } = parsed.data

  // Update the section if there are section-level changes
  const updateData = {
    ...sectionData,
    ...(config !== undefined && { config: config as Json }),
    ...(section_type !== undefined && { section_type: section_type as CorporateSectionType }),
  }

  if (Object.keys(updateData).length > 0) {
    const { error: sectionError } = await supabase
      .from('corporate_sections')
      .update(updateData)
      .eq('id', id)

    if (sectionError) {
      console.error('Corporate section update error:', sectionError)
      return NextResponse.json({ error: 'Failed to update corporate section' }, { status: 500 })
    }
  }

  // Update translations if provided
  if (translations && translations.length > 0) {
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from('corporate_section_translations')
        .upsert(
          {
            ...translation,
            section_id: id,
          },
          {
            onConflict: 'section_id,locale',
          }
        )

      if (translationError) {
        console.error('Corporate section translation error:', translationError)
        return NextResponse.json(
          { error: 'Failed to update corporate section translation' },
          { status: 500 }
        )
      }
    }
  }

  // Fetch updated section
  const { data: updatedSection, error: fetchError } = await supabase
    .from('corporate_sections')
    .select('*, corporate_section_translations(*)')
    .eq('id', id)
    .single()

  if (fetchError) {
    console.error('Corporate section fetch error:', fetchError)
    return NextResponse.json({ error: 'Failed to fetch corporate section' }, { status: 500 })
  }

  return NextResponse.json({
    data: {
      ...updatedSection,
      translations: updatedSection.corporate_section_translations,
    },
  })
}

// DELETE /api/corporate-sections/[id] - Delete a section
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

  // Delete the section (cascades to translations)
  const { error } = await supabase
    .from('corporate_sections')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Corporate section delete error:', error)
    return NextResponse.json({ error: 'Failed to delete corporate section' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
