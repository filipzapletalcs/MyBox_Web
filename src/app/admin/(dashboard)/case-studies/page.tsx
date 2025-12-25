import { createClient } from '@/lib/supabase/server'
import { CaseStudyList } from '@/components/admin/case-studies'

export default async function CaseStudiesPage() {
  const supabase = await createClient()

  const { data: caseStudies, error } = await supabase
    .from('case_studies')
    .select(`
      id,
      slug,
      client_name,
      client_logo_url,
      industry,
      station_count,
      is_featured,
      is_active,
      sort_order,
      created_at,
      case_study_translations (
        locale,
        title
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching case studies:', error)
  }

  // Transform data to match component interface
  const transformedCaseStudies = (caseStudies || []).map((cs) => ({
    id: cs.id,
    slug: cs.slug,
    client_name: cs.client_name,
    client_logo_url: cs.client_logo_url,
    industry: cs.industry,
    station_count: cs.station_count,
    is_featured: cs.is_featured,
    is_active: cs.is_active,
    sort_order: cs.sort_order,
    created_at: cs.created_at,
    translations: cs.case_study_translations || [],
  }))

  return <CaseStudyList caseStudies={transformedCaseStudies} />
}
