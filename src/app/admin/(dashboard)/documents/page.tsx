import { createClient } from '@/lib/supabase/server'
import { DocumentList } from '@/components/admin/documents'

export default async function DocumentsPage() {
  const supabase = await createClient()

  const { data: documents, error } = await supabase
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
      created_at,
      document_translations (
        locale,
        title,
        description
      ),
      document_categories (
        id,
        slug,
        document_category_translations (
          locale,
          name
        )
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching documents:', error)
  }

  return <DocumentList documents={documents || []} />
}
