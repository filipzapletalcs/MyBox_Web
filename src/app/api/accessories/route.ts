import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAccessorySchema } from '@/lib/validations/accessory'
import { getProductImageUrl } from '@/lib/supabase/storage'

// Helper to convert relative image path to full storage URL
function transformAccessoryImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
    return imageUrl
  }
  return getProductImageUrl(imageUrl)
}

// GET /api/accessories
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const active = searchParams.get('active')
  const withProducts = searchParams.get('withProducts') === 'true'

  // Build query based on whether we need product relations
  const selectQuery = withProducts
    ? '*, accessory_translations(*), product_accessories(product_id, sort_order, products(id, slug, product_translations(locale, name)))'
    : '*, accessory_translations(*)'

  let query = supabase
    .from('accessories')
    .select(selectQuery)
    .order('sort_order', { ascending: true })

  if (active !== null) {
    query = query.eq('is_active', active === 'true')
  }

  const { data, error } = await query

  if (error) {
    console.error('Accessories fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch accessories' }, { status: 500 })
  }

  // Transform image_url to full storage URL for each accessory
  const transformedData = (data as unknown[])?.map((accessory) => {
    const acc = accessory as Record<string, unknown>
    return {
      ...acc,
      image_url: transformAccessoryImageUrl(acc.image_url as string | null),
    }
  })

  return NextResponse.json({ data: transformedData })
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
    console.error('Accessory create error:', accessoryError)
    return NextResponse.json({ error: 'Failed to create accessory' }, { status: 500 })
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
    console.error('Accessory translations error:', translationsError)
    await supabase.from('accessories').delete().eq('id', accessory.id)
    return NextResponse.json(
      { error: 'Failed to create accessory translations' },
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

  // Transform image_url to full storage URL
  const transformedAccessory = completeAccessory ? {
    ...(completeAccessory as Record<string, unknown>),
    image_url: transformAccessoryImageUrl(completeAccessory.image_url),
  } : null

  return NextResponse.json({ data: transformedAccessory }, { status: 201 })
}
