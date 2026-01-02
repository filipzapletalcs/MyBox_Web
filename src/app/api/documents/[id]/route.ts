import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/documents/[id] - Detail dokumentu
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
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
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// PUT /api/documents/[id] - Aktualizace dokumentu
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { translations, ...documentData } = body

  // Update document
  const { error: documentError } = await supabase
    .from('documents')
    .update(documentData)
    .eq('id', id)

  if (documentError) {
    return NextResponse.json({ error: documentError.message }, { status: 500 })
  }

  // Update translations (upsert) including file_path and file_size
  if (translations && translations.length > 0) {
    for (const t of translations) {
      const { error: translationError } = await supabase
        .from('document_translations')
        .upsert(
          {
            document_id: id,
            locale: t.locale,
            title: t.title,
            description: t.description,
            file_path: t.file_path,
            file_size: t.file_size,
          },
          {
            onConflict: 'document_id,locale',
          }
        )

      if (translationError) {
        return NextResponse.json(
          { error: translationError.message },
          { status: 500 }
        )
      }
    }
  }

  // Fetch complete document
  const { data: completeDocument, error: fetchError } = await supabase
    .from('documents')
    .select('*, document_translations(*)')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json({ data: completeDocument })
}

// DELETE /api/documents/[id] - Smazání dokumentu
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get document translations to delete associated files
  const { data: translations } = await supabase
    .from('document_translations')
    .select('file_path')
    .eq('document_id', id)

  // Delete files from storage
  if (translations && translations.length > 0) {
    const filesToDelete = translations
      .map((t) => t.file_path)
      .filter((path): path is string => !!path)

    if (filesToDelete.length > 0) {
      await supabase.storage.from('documents').remove(filesToDelete)
    }
  }

  // Delete document (translations will cascade)
  const { error } = await supabase.from('documents').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
