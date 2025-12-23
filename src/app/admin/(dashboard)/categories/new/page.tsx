import { createClient } from '@/lib/supabase/server'
import { NewCategoryForm } from './NewCategoryForm'

export default async function NewCategoryPage() {
  const supabase = await createClient()

  // Fetch existing categories for parent selection
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      id,
      slug,
      parent_id,
      category_translations (
        locale,
        name,
        description
      )
    `)
    .order('created_at', { ascending: false })

  const transformedCategories = (categories || []).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    parent_id: cat.parent_id,
    translations: cat.category_translations || [],
  }))

  return <NewCategoryForm categories={transformedCategories} />
}
