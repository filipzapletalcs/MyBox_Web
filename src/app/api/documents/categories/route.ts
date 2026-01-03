import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { checkUserRole } from '@/lib/auth/checkRole'
import { localeSchema } from '@/lib/validations/locale'

// Zod schema for document category validation
const documentCategorySchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  icon: z.string().optional(),
  sort_order: z.number().optional(),
  is_active: z.boolean().optional().default(true),
  translations: z.array(z.object({
    locale: localeSchema,
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional().nullable()
  })).min(1, 'At least one translation is required')
})

// GET /api/documents/categories - Seznam kategorií dokumentů
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const active = searchParams.get('active')
  const locale = searchParams.get('locale')

  let query = supabase
    .from('document_categories')
    .select('*, document_category_translations(*)')
    .order('sort_order', { ascending: true })

  if (active !== null) {
    query = query.eq('is_active', active === 'true')
  }

  const { data, error } = await query

  if (error) {
    console.error('Document categories fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch document categories' }, { status: 500 })
  }

  // If locale is specified, filter translations
  if (locale && data) {
    const filteredData = data.map((cat) => ({
      ...cat,
      document_category_translations: cat.document_category_translations?.filter(
        (t: { locale: string }) => t.locale === locale
      ),
    }))
    return NextResponse.json({ data: filteredData })
  }

  return NextResponse.json({ data })
}

// POST /api/documents/categories - Vytvoření kategorie
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RBAC check - only admin/editor can create categories
  const { hasRole } = await checkUserRole(supabase, user.id)
  if (!hasRole) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 })
  }

  // Zod validation
  const body = await request.json()
  const parsed = documentCategorySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...categoryData } = parsed.data

  // Create category
  const { data: category, error: categoryError } = await supabase
    .from('document_categories')
    .insert(categoryData)
    .select()
    .single()

  if (categoryError) {
    console.error('Document category create error:', categoryError)
    return NextResponse.json({ error: 'Failed to create document category' }, { status: 500 })
  }

  // Insert translations
  if (translations && translations.length > 0) {
    const translationsToInsert = translations.map(
      (t: { locale: string; name: string; description?: string | null }) => ({
        category_id: category.id,
        locale: t.locale,
        name: t.name,
        description: t.description,
      })
    )

    const { error: translationsError } = await supabase
      .from('document_category_translations')
      .insert(translationsToInsert)

    if (translationsError) {
      console.error('Document category translations error:', translationsError)
      // Rollback category creation
      await supabase.from('document_categories').delete().eq('id', category.id)
      return NextResponse.json(
        { error: 'Failed to create document category translations' },
        { status: 500 }
      )
    }
  }

  // Fetch complete category
  const { data: completeCategory } = await supabase
    .from('document_categories')
    .select('*, document_category_translations(*)')
    .eq('id', category.id)
    .single()

  return NextResponse.json({ data: completeCategory }, { status: 201 })
}
