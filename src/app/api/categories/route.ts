import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCategorySchema } from '@/lib/validations/category'

// GET /api/categories - Seznam kategorií
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*, category_translations(*)')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/categories - Vytvoření kategorie
export async function POST(request: NextRequest) {
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
  const parsed = createCategorySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...categoryData } = parsed.data

  // Vytvoření kategorie
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .insert(categoryData)
    .select()
    .single()

  if (categoryError) {
    return NextResponse.json({ error: categoryError.message }, { status: 500 })
  }

  // Vytvoření překladů
  const translationsToInsert = translations.map((t) => ({
    ...t,
    category_id: category.id,
  }))

  const { error: translationsError } = await supabase
    .from('category_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    await supabase.from('categories').delete().eq('id', category.id)
    return NextResponse.json(
      { error: translationsError.message },
      { status: 500 }
    )
  }

  const { data: completeCategory } = await supabase
    .from('categories')
    .select('*, category_translations(*)')
    .eq('id', category.id)
    .single()

  return NextResponse.json({ data: completeCategory }, { status: 201 })
}
