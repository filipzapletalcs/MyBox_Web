import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CorporatePageForm } from '@/components/admin/corporate'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCorporatePagePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the page with all relations
  const { data: page, error } = await supabase
    .from('corporate_pages')
    .select(`
      *,
      corporate_page_translations (*)
    `)
    .eq('id', id)
    .single()

  if (error || !page) {
    notFound()
  }

  // Transform data
  const transformedPage = {
    id: page.id,
    slug: page.slug,
    page_type: page.page_type as 'landing' | 'subpage',
    hero_video_url: page.hero_video_url,
    hero_image_url: page.hero_image_url,
    is_active: page.is_active,
    sort_order: page.sort_order,
    created_at: page.created_at,
    updated_at: page.updated_at,
    translations: page.corporate_page_translations || [],
  }

  return <CorporatePageForm page={transformedPage} />
}
