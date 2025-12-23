import { createClient } from '@/lib/supabase/server'
import { DocumentForm } from '@/components/admin/documents'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditDocumentPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch document
  const { data: document, error: documentError } = await supabase
    .from('documents')
    .select(`
      id,
      slug,
      category_id,
      file_cs,
      file_en,
      file_de,
      file_size_cs,
      file_size_en,
      file_size_de,
      fallback_locale,
      sort_order,
      is_active,
      document_translations (
        locale,
        title,
        description
      )
    `)
    .eq('id', id)
    .single()

  if (documentError || !document) {
    notFound()
  }

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
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

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError)
  }

  return <DocumentForm document={document} categories={categories || []} />
}
