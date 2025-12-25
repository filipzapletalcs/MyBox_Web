import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCaseStudySchema } from '@/lib/validations/case-study'

// GET /api/case-studies - List all case studies
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const industry = searchParams.get('industry')
  const featured = searchParams.get('featured')
  const include_inactive = searchParams.get('include_inactive') === 'true'

  const offset = (page - 1) * limit

  let query = supabase
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
    `,
      { count: 'exact' }
    )
    .order('sort_order', { ascending: true })
    .range(offset, offset + limit - 1)

  if (!include_inactive) {
    query = query.eq('is_active', true)
  }

  if (industry) {
    query = query.eq('industry', industry)
  }

  if (featured === 'true') {
    query = query.eq('is_featured', true)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform data
  const transformedData = data?.map((study) => ({
    ...study,
    translations: study.case_study_translations,
    images: study.case_study_images?.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    metrics: study.case_study_metrics
      ?.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((metric) => ({
        ...metric,
        translations: metric.case_study_metric_translations,
      })),
  }))

  return NextResponse.json({
    data: transformedData,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
    },
  })
}

// POST /api/case-studies - Create a new case study
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
  const parsed = createCaseStudySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...studyData } = parsed.data

  // Create the case study
  const { data: study, error: studyError } = await supabase
    .from('case_studies')
    .insert(studyData)
    .select()
    .single()

  if (studyError) {
    return NextResponse.json({ error: studyError.message }, { status: 500 })
  }

  // Create translations
  const translationsToInsert = translations.map((t) => ({
    ...t,
    case_study_id: study.id,
  }))

  const { error: translationsError } = await supabase
    .from('case_study_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    // Rollback
    await supabase.from('case_studies').delete().eq('id', study.id)
    return NextResponse.json(
      { error: translationsError.message },
      { status: 500 }
    )
  }

  // Fetch complete case study
  const { data: completeStudy } = await supabase
    .from('case_studies')
    .select(
      `
      *,
      case_study_translations(*),
      case_study_images(*),
      case_study_metrics(*, case_study_metric_translations(*))
    `
    )
    .eq('id', study.id)
    .single()

  return NextResponse.json({ data: completeStudy }, { status: 201 })
}
