import { createClient } from '@/lib/supabase/server'
import { CategoryList } from '@/components/admin/categories'

export default async function CategoriesPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select(`
      id,
      slug,
      parent_id,
      created_at,
      category_translations (
        locale,
        name,
        description
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching categories:', error)
  }

  // Transform data to match component interface
  const transformedCategories = (categories || []).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    parent_id: cat.parent_id,
    created_at: cat.created_at,
    translations: cat.category_translations || [],
  }))

  return <CategoryList categories={transformedCategories} />
}
