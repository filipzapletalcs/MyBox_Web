import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateAccessorySchema } from '@/lib/validations/accessory'
import { getProductImageUrl } from '@/lib/supabase/storage'

// Helper to convert relative image path to full storage URL
function transformAccessoryImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null
  // If already a full URL or starts with /, return as-is
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
    return imageUrl
  }
  // Relative path like 'accessories/...' - convert to storage URL
  return getProductImageUrl(imageUrl)
}

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/accessories/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('accessories')
    .select(`
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
    `)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Accessory not found' }, { status: 404 })
    }
    console.error('Accessory fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch accessory' }, { status: 500 })
  }

  // Transform image_url to full storage URL
  const transformedData = {
    ...data,
    image_url: transformAccessoryImageUrl(data.image_url),
  }

  return NextResponse.json({ data: transformedData })
}

// PATCH /api/accessories/[id]
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
  const parsed = updateAccessorySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, product_ids, ...accessoryData } = parsed.data

  // Update base accessory data
  if (Object.keys(accessoryData).length > 0) {
    const { error: updateError } = await supabase
      .from('accessories')
      .update(accessoryData)
      .eq('id', id)

    if (updateError) {
      console.error('Accessory update error:', updateError)
      return NextResponse.json({ error: 'Failed to update accessory' }, { status: 500 })
    }
  }

  // Update translations
  if (translations && translations.length > 0) {
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from('accessory_translations')
        .upsert(
          { ...translation, accessory_id: id },
          { onConflict: 'accessory_id,locale' }
        )

      if (translationError) {
        console.error('Accessory translation error:', translationError)
        return NextResponse.json(
          { error: 'Failed to update accessory translation' },
          { status: 500 }
        )
      }
    }
  }

  // Update product links
  if (product_ids !== undefined) {
    // Delete existing links
    await supabase.from('product_accessories').delete().eq('accessory_id', id)

    // Insert new links
    if (product_ids.length > 0) {
      const productAccessoriesToInsert = product_ids.map((product_id, index) => ({
        product_id,
        accessory_id: id,
        sort_order: index,
      }))

      const { error: linkError } = await supabase
        .from('product_accessories')
        .insert(productAccessoriesToInsert)

      if (linkError) {
        console.error('Accessory product link error:', linkError)
        return NextResponse.json({ error: 'Failed to update accessory product links' }, { status: 500 })
      }
    }
  }

  // Fetch and return updated accessory
  const { data: updatedAccessory } = await supabase
    .from('accessories')
    .select(`
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
    `)
    .eq('id', id)
    .single()

  // Transform image_url to full storage URL
  const transformedAccessory = updatedAccessory ? {
    ...updatedAccessory,
    image_url: transformAccessoryImageUrl(updatedAccessory.image_url),
  } : null

  return NextResponse.json({ data: transformedAccessory })
}

// DELETE /api/accessories/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('accessories').delete().eq('id', id)

  if (error) {
    console.error('Accessory delete error:', error)
    return NextResponse.json({ error: 'Failed to delete accessory' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
