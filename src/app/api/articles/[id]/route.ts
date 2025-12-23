import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateArticleSchema } from '@/lib/validations/article'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/articles/[id] - Detail článku
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      article_translations(*),
      article_tags(tag_id, tags(id, slug, name)),
      categories(id, slug, category_translations(name, locale)),
      profiles(id, full_name, email, avatar_url)
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// PATCH /api/articles/[id] - Úprava článku
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  // Ověření uživatele
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Validace dat
  const body = await request.json()
  const parsed = updateArticleSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, tag_ids, ...articleData } = parsed.data

  // Aktualizace článku
  if (Object.keys(articleData).length > 0) {
    const { error: updateError } = await supabase
      .from('articles')
      .update(articleData)
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
  }

  // Aktualizace překladů
  if (translations && translations.length > 0) {
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from('article_translations')
        .upsert(
          {
            ...translation,
            article_id: id,
          },
          {
            onConflict: 'article_id,locale',
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

  // Aktualizace tagů
  if (tag_ids !== undefined) {
    // Smazat existující
    await supabase.from('article_tags').delete().eq('article_id', id)

    // Přidat nové
    if (tag_ids.length > 0) {
      const tagsToInsert = tag_ids.map((tag_id) => ({
        article_id: id,
        tag_id,
      }))

      await supabase.from('article_tags').insert(tagsToInsert)
    }
  }

  // Načíst aktualizovaný článek
  const { data: updatedArticle } = await supabase
    .from('articles')
    .select('*, article_translations(*), article_tags(tag_id)')
    .eq('id', id)
    .single()

  return NextResponse.json({ data: updatedArticle })
}

// DELETE /api/articles/[id] - Smazání článku
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  // Ověření uživatele
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
