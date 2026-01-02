import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProductSchema } from '@/lib/validations/product'

// GET /api/products
// Supports pagination: ?page=1&limit=20
// Supports filtering: ?type=ac_mybox&active=true
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  // Pagination params
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')))
  const offset = (page - 1) * limit

  // Filter params
  const type = searchParams.get('type')
  const active = searchParams.get('active')

  // Build query with count
  let query = supabase
    .from('products')
    .select(
      `
      *,
      product_translations(*),
      product_specifications(*),
      product_images(*),
      product_to_features(feature_id, product_features(id, slug, icon, product_feature_translations(*)))
    `,
      { count: 'exact' }
    )
    .order('sort_order', { ascending: true })

  if (type) {
    query = query.eq('type', type as 'ac_mybox' | 'dc_alpitronic')
  }

  if (active !== null) {
    query = query.eq('is_active', active === 'true')
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: count ? Math.ceil(count / limit) : 0,
    },
  })
}

// POST /api/products
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createProductSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, specifications, feature_ids, ...productData } =
    parsed.data

  // Vytvoření produktu
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single()

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 })
  }

  // Překlady
  const translationsToInsert = translations.map((t) => ({
    ...t,
    product_id: product.id,
  }))

  const { error: translationsError } = await supabase
    .from('product_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    await supabase.from('products').delete().eq('id', product.id)
    return NextResponse.json(
      { error: translationsError.message },
      { status: 500 }
    )
  }

  // Specifikace
  if (specifications && specifications.length > 0) {
    const specsToInsert = specifications.map((s) => ({
      ...s,
      product_id: product.id,
    }))

    await supabase.from('product_specifications').insert(specsToInsert)
  }

  // Features
  if (feature_ids && feature_ids.length > 0) {
    const featuresToInsert = feature_ids.map((feature_id) => ({
      product_id: product.id,
      feature_id,
    }))

    await supabase.from('product_to_features').insert(featuresToInsert)
  }

  // Načíst kompletní produkt
  const { data: completeProduct } = await supabase
    .from('products')
    .select('*, product_translations(*), product_specifications(*)')
    .eq('id', product.id)
    .single()

  return NextResponse.json({ data: completeProduct }, { status: 201 })
}
