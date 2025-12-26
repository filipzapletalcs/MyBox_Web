import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAccessorySchema } from '@/lib/validations/accessory'

// GET /api/accessories
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const active = searchParams.get('active')
  const withProducts = searchParams.get('withProducts') === 'true'

  let query = supabase
    .from('accessories')
    .select(
      withProducts
        ? `
          *,
          accessory_translations(*),
          product_accessories(
            product_id,
            sort_order,
            products(
              id,
              slug,
              product_translations(locale, name)
            )
          )
        `
        : `
          *,
          accessory_translations(*)
        `
    )
    .order('sort_order', { ascending: true })

  if (active !== null) {
    query = query.eq('is_active', active === 'true')
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/accessories
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = createAccessorySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, product_ids, ...accessoryData } = parsed.data

  // Create accessory
  const { data: accessory, error: accessoryError } = await supabase
    .from('accessories')
    .insert(accessoryData)
    .select()
    .single()

  if (accessoryError) {
    return NextResponse.json({ error: accessoryError.message }, { status: 500 })
  }

  // Insert translations
  const translationsToInsert = translations.map((t) => ({
    ...t,
    accessory_id: accessory.id,
  }))

  const { error: translationsError } = await supabase
    .from('accessory_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    await supabase.from('accessories').delete().eq('id', accessory.id)
    return NextResponse.json(
      { error: translationsError.message },
      { status: 500 }
    )
  }

  // Link to products
  if (product_ids && product_ids.length > 0) {
    const productAccessoriesToInsert = product_ids.map((product_id, index) => ({
      product_id,
      accessory_id: accessory.id,
      sort_order: index,
    }))

    const { error: linkError } = await supabase
      .from('product_accessories')
      .insert(productAccessoriesToInsert)

    if (linkError) {
      console.error('Error linking products:', linkError)
    }
  }

  // Fetch complete accessory
  const { data: completeAccessory } = await supabase
    .from('accessories')
    .select(`
      *,
      accessory_translations(*),
      product_accessories(product_id, sort_order)
    `)
    .eq('id', accessory.id)
    .single()

  return NextResponse.json({ data: completeAccessory }, { status: 201 })
}
