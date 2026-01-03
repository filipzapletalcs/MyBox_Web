import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCategorySchema } from '@/lib/validations/category'
import { createCachedResponse, CACHE_TTL } from '@/lib/utils/cache-response'
import { checkUserRole } from '@/lib/auth/checkRole'

// GET /api/categories - Seznam kategorií
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*, category_translations(*)')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }

  // Categories rarely change - use static cache (1 day browser, 7 days CDN)
  return createCachedResponse(data, CACHE_TTL.STATIC)
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

  // RBAC check - only admin/editor can manage categories
  const { hasRole } = await checkUserRole(supabase, user.id)
  if (!hasRole) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 })
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
    console.error('Category create error:', categoryError)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
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
    console.error('Category translations error:', translationsError)
    await supabase.from('categories').delete().eq('id', category.id)
    return NextResponse.json(
      { error: 'Failed to create category translations' },
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
