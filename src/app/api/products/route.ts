import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createProductSchema } from '@/lib/validations/product'

// GET /api/products
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const type = searchParams.get('type')
  const active = searchParams.get('active')

  let query = supabase
    .from('products')
    .select(
      `
      *,
      product_translations(*),
      product_specifications(*),
      product_images(*),
      product_to_features(feature_id, product_features(id, slug, icon, product_feature_translations(*)))
    `
    )
    .order('sort_order', { ascending: true })

  if (type) {
    query = query.eq('type', type as 'ac_mybox' | 'dc_alpitronic')
  }

  if (active !== null) {
    query = query.eq('is_active', active === 'true')
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
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
