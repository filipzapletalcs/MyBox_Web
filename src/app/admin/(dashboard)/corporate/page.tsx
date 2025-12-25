import { createClient } from '@/lib/supabase/server'
import { CorporatePageList } from '@/components/admin/corporate'

export default async function CorporatePagesPage() {
  const supabase = await createClient()

  const { data: pages, error } = await supabase
    .from('corporate_pages')
    .select(`
      id,
      slug,
      page_type,
      is_active,
      sort_order,
      created_at,
      corporate_page_translations (
        locale,
        title
      ),
      corporate_sections (
        id
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching corporate pages:', error)
  }

  // Transform data to match component interface
  const transformedPages = (pages || []).map((page) => ({
    id: page.id,
    slug: page.slug,
    page_type: page.page_type as 'landing' | 'subpage',
    is_active: page.is_active,
    sort_order: page.sort_order,
    created_at: page.created_at,
    translations: page.corporate_page_translations || [],
    sections_count: page.corporate_sections?.length || 0,
  }))

  return <CorporatePageList pages={transformedPages} />
}
