import { createClient } from '@/lib/supabase/server'
import { CategoryForm } from '@/components/admin/documents'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: category, error } = await supabase
    .from('document_categories')
    .select(`
      id,
      slug,
      sort_order,
      is_active,
      document_category_translations (
        locale,
        name,
        description
      )
    `)
    .eq('id', id)
    .single()

  if (error || !category) {
    notFound()
  }

  return <CategoryForm category={category} />
}
