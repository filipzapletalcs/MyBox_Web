import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCategorySchema } from '@/lib/validations/category'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/categories/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*, category_translations(*)')
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

// PATCH /api/categories/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = updateCategorySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...categoryData } = parsed.data

  if (Object.keys(categoryData).length > 0) {
    const { error: updateError } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
  }

  if (translations && translations.length > 0) {
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from('category_translations')
        .upsert(
          { ...translation, category_id: id },
          { onConflict: 'category_id,locale' }
        )

      if (translationError) {
        return NextResponse.json(
          { error: translationError.message },
          { status: 500 }
        )
      }
    }
  }

  const { data: updatedCategory } = await supabase
    .from('categories')
    .select('*, category_translations(*)')
    .eq('id', id)
    .single()

  return NextResponse.json({ data: updatedCategory })
}

// DELETE /api/categories/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
