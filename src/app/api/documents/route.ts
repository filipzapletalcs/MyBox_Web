import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkUserRole } from '@/lib/auth/checkRole'

// GET /api/documents - Seznam dokumentů
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const categoryId = searchParams.get('category_id')
  const active = searchParams.get('active')
  const locale = searchParams.get('locale')

  let query = supabase
    .from('documents')
    .select(`
      *,
      document_translations(*),
      document_categories(
        id,
        slug,
        document_category_translations(*)
      )
    `)
    .order('sort_order', { ascending: true })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  if (active !== null) {
    query = query.eq('is_active', active === 'true')
  }

  const { data, error } = await query

  if (error) {
    console.error('Documents fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }

  // If locale is specified, filter translations
  if (locale && data) {
    const filteredData = data.map((doc) => ({
      ...doc,
      document_translations: doc.document_translations?.filter(
        (t: { locale: string }) => t.locale === locale
      ),
      document_categories: doc.document_categories
        ? {
            ...doc.document_categories,
            document_category_translations:
              doc.document_categories.document_category_translations?.filter(
                (t: { locale: string }) => t.locale === locale
              ),
          }
        : null,
    }))
    return NextResponse.json({ data: filteredData })
  }

  return NextResponse.json({ data })
}

// POST /api/documents - Vytvoření dokumentu
// New pattern: files are stored in document_translations.file_path
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RBAC check - only admin/editor can manage documents
  const { hasRole } = await checkUserRole(supabase, user.id)
  if (!hasRole) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 })
  }

  const body = await request.json()
  const { translations, ...documentData } = body

  // Validate required fields
  if (!documentData.category_id || !documentData.slug) {
    return NextResponse.json(
      { error: 'category_id and slug are required' },
      { status: 400 }
    )
  }

  // Validate translations exist and at least one has a file
  if (!translations || translations.length === 0) {
    return NextResponse.json(
      { error: 'At least one translation is required' },
      { status: 400 }
    )
  }

  const hasFile = translations.some(
    (t: { file_path?: string }) => t.file_path && t.file_path.trim() !== ''
  )
  if (!hasFile) {
    return NextResponse.json(
      { error: 'At least one translation must have a file' },
      { status: 400 }
    )
  }

  // Create document
  const { data: document, error: documentError } = await supabase
    .from('documents')
    .insert(documentData)
    .select()
    .single()

  if (documentError) {
    console.error('Document create error:', documentError)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }

  // Insert translations with file_path and file_size
  const translationsToInsert = translations.map(
    (t: { locale: string; title: string; description?: string; file_path?: string; file_size?: number }) => ({
      document_id: document.id,
      locale: t.locale,
      title: t.title,
      description: t.description,
      file_path: t.file_path,
      file_size: t.file_size,
    })
  )

  const { error: translationsError } = await supabase
    .from('document_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    console.error('Document translations error:', translationsError)
    // Rollback document creation
    await supabase.from('documents').delete().eq('id', document.id)
    return NextResponse.json(
      { error: 'Failed to create document translations' },
      { status: 500 }
    )
  }

  // Fetch complete document
  const { data: completeDocument } = await supabase
    .from('documents')
    .select('*, document_translations(*)')
    .eq('id', document.id)
    .single()

  return NextResponse.json({ data: completeDocument }, { status: 201 })
}
