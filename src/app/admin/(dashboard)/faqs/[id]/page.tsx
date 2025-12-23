import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditFaqForm } from './EditFaqForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditFaqPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: faq, error } = await supabase
    .from('faqs')
    .select(`
      id,
      slug,
      category,
      sort_order,
      is_active,
      faq_translations (
        locale,
        question,
        answer
      )
    `)
    .eq('id', id)
    .single()

  if (error || !faq) {
    notFound()
  }

  const transformedFaq = {
    id: faq.id,
    slug: faq.slug,
    category: faq.category,
    sort_order: faq.sort_order,
    is_active: faq.is_active,
    translations: faq.faq_translations || [],
  }

  return <EditFaqForm faq={transformedFaq} />
}
