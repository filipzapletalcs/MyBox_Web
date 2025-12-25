import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCaseStudySchema } from '@/lib/validations/case-study'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/case-studies/[id] - Get a single case study
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('case_studies')
    .select(
      `
      *,
      case_study_translations(*),
      case_study_images(*),
      case_study_metrics(
        *,
        case_study_metric_translations(*)
      )
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform data
  const transformedData = {
    ...data,
    translations: data.case_study_translations,
    images: data.case_study_images?.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    metrics: data.case_study_metrics
      ?.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((metric) => ({
        ...metric,
        translations: metric.case_study_metric_translations,
      })),
  }

  return NextResponse.json({ data: transformedData })
}

// PATCH /api/case-studies/[id] - Update a case study
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
  const parsed = updateCaseStudySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...studyData } = parsed.data

  // Update the case study if there are study-level changes
  if (Object.keys(studyData).length > 0) {
    const { error: studyError } = await supabase
      .from('case_studies')
      .update(studyData)
      .eq('id', id)

    if (studyError) {
      return NextResponse.json({ error: studyError.message }, { status: 500 })
    }
  }

  // Update translations if provided
  if (translations && translations.length > 0) {
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from('case_study_translations')
        .upsert(
          {
            ...translation,
            case_study_id: id,
          },
          {
            onConflict: 'case_study_id,locale',
          }
        )

      if (translationError) {
        return NextResponse.json(
          { error: translationError.message },
          { status: 500 }
        )
      }
    }
  }

  // Fetch updated case study
  const { data: updatedStudy, error: fetchError } = await supabase
    .from('case_studies')
    .select(
      `
      *,
      case_study_translations(*),
      case_study_images(*),
      case_study_metrics(*, case_study_metric_translations(*))
    `
    )
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json({ data: updatedStudy })
}

// DELETE /api/case-studies/[id] - Delete a case study
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

  // Delete the case study (cascades to all related tables)
  const { error } = await supabase
    .from('case_studies')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
