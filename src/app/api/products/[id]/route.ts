import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateProductSchema } from '@/lib/validations/product'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/products/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
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
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// PATCH /api/products/[id]
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
  const parsed = updateProductSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, specifications, feature_ids, ...productData } =
    parsed.data

  // Aktualizace produktu
  if (Object.keys(productData).length > 0) {
    const { error: updateError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
  }

  // Aktualizace překladů
  if (translations && translations.length > 0) {
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from('product_translations')
        .upsert(
          { ...translation, product_id: id },
          { onConflict: 'product_id,locale' }
        )

      if (translationError) {
        return NextResponse.json(
          { error: translationError.message },
          { status: 500 }
        )
      }
    }
  }

  // Aktualizace specifikací
  if (specifications !== undefined) {
    // Smazat existující
    await supabase.from('product_specifications').delete().eq('product_id', id)

    // Přidat nové
    if (specifications.length > 0) {
      const specsToInsert = specifications.map((s) => ({
        ...s,
        product_id: id,
      }))

      await supabase.from('product_specifications').insert(specsToInsert)
    }
  }

  // Aktualizace features
  if (feature_ids !== undefined) {
    await supabase.from('product_to_features').delete().eq('product_id', id)

    if (feature_ids.length > 0) {
      const featuresToInsert = feature_ids.map((feature_id) => ({
        product_id: id,
        feature_id,
      }))

      await supabase.from('product_to_features').insert(featuresToInsert)
    }
  }

  // Načíst aktualizovaný produkt
  const { data: updatedProduct } = await supabase
    .from('products')
    .select('*, product_translations(*), product_specifications(*)')
    .eq('id', id)
    .single()

  return NextResponse.json({ data: updatedProduct })
}

// DELETE /api/products/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
