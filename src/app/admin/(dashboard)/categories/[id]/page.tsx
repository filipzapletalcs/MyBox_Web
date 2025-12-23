import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditCategoryForm } from './EditCategoryForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the category
  const { data: category, error } = await supabase
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
    .eq('id', id)
    .single()

  if (error || !category) {
    notFound()
  }

  // Fetch all categories for parent selection
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

  const transformedCategory = {
    id: category.id,
    slug: category.slug,
    parent_id: category.parent_id,
    translations: category.category_translations || [],
  }

  const transformedCategories = (categories || []).map((cat) => ({
    id: cat.id,
    slug: cat.slug,
    parent_id: cat.parent_id,
    translations: cat.category_translations || [],
  }))

  return (
    <EditCategoryForm
      category={transformedCategory}
      categories={transformedCategories}
    />
  )
}
