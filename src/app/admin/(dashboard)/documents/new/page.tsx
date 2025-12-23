import { createClient } from '@/lib/supabase/server'
import { DocumentForm } from '@/components/admin/documents'
import { redirect } from 'next/navigation'

export default async function NewDocumentPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from('document_categories')
    .select(`
      id,
      slug,
      document_category_translations (
        locale,
        name
      )
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
  }

  // Redirect if no categories exist
  if (!categories || categories.length === 0) {
    redirect('/admin/documents/categories/new')
  }

  return <DocumentForm categories={categories} />
}
