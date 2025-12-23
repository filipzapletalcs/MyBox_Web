import { createClient } from '@/lib/supabase/server'
import { CategoryList } from '@/components/admin/documents'

export default async function DocumentCategoriesPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('document_categories')
    .select(`
      id,
      slug,
      sort_order,
      is_active,
      created_at,
      document_category_translations (
        locale,
        name,
        description
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
  }

  return <CategoryList categories={categories || []} />
}
