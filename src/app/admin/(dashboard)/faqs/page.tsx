import { createClient } from '@/lib/supabase/server'
import { FaqList } from '@/components/admin/faqs'

export default async function FaqsPage() {
  const supabase = await createClient()

  const { data: faqs, error } = await supabase
    .from('faqs')
    .select(`
      id,
      slug,
      category,
      sort_order,
      is_active,
      created_at,
      faq_translations (
        locale,
        question,
        answer
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching faqs:', error)
  }

  // Transform data to match component interface
  const transformedFaqs = (faqs || []).map((faq) => ({
    id: faq.id,
    slug: faq.slug,
    category: faq.category,
    sort_order: faq.sort_order,
    is_active: faq.is_active,
    created_at: faq.created_at,
    translations: faq.faq_translations || [],
  }))

  return <FaqList faqs={transformedFaqs} />
}
