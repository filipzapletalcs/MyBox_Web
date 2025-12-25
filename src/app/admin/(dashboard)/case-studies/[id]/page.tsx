import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CaseStudyForm } from '@/components/admin/case-studies'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCaseStudyPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the case study with all relations
  const { data: caseStudy, error } = await supabase
    .from('case_studies')
    .select(`
      *,
      case_study_translations (*)
    `)
    .eq('id', id)
    .single()

  if (error || !caseStudy) {
    notFound()
  }

  // Transform data
  const transformedCaseStudy = {
    id: caseStudy.id,
    slug: caseStudy.slug,
    client_name: caseStudy.client_name,
    client_logo_url: caseStudy.client_logo_url,
    featured_image_url: caseStudy.featured_image_url,
    industry: caseStudy.industry,
    station_count: caseStudy.station_count,
    is_featured: caseStudy.is_featured,
    is_active: caseStudy.is_active,
    sort_order: caseStudy.sort_order,
    translations: caseStudy.case_study_translations || [],
  }

  return <CaseStudyForm caseStudy={transformedCaseStudy} />
}
