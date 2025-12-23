import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/documents/categories/[id] - Detail kategorie
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('document_categories')
    .select('*, document_category_translations(*)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// PUT /api/documents/categories/[id] - Aktualizace kategorie
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
  const { translations, ...categoryData } = body

  // Update category
  const { error: categoryError } = await supabase
    .from('document_categories')
    .update(categoryData)
    .eq('id', id)

  if (categoryError) {
    return NextResponse.json({ error: categoryError.message }, { status: 500 })
  }

  // Update translations (upsert)
  if (translations && translations.length > 0) {
    for (const t of translations) {
      const { error: translationError } = await supabase
        .from('document_category_translations')
        .upsert(
          {
            category_id: id,
            locale: t.locale,
            name: t.name,
            description: t.description,
          },
          {
            onConflict: 'category_id,locale',
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

  // Fetch complete category
  const { data: completeCategory, error: fetchError } = await supabase
    .from('document_categories')
    .select('*, document_category_translations(*)')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json({ data: completeCategory })
}

// DELETE /api/documents/categories/[id] - Smazání kategorie
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if category has documents
  const { count } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id)

  if (count && count > 0) {
    return NextResponse.json(
      { error: 'Cannot delete category with documents. Delete documents first.' },
      { status: 400 }
    )
  }

  // Delete category (translations will cascade)
  const { error } = await supabase
    .from('document_categories')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
