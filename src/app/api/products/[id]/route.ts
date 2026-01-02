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
      product_to_features(feature_id, product_features(id, slug, icon, product_feature_translations(*))),
      product_feature_points(
        id,
        icon,
        position,
        sort_order,
        product_feature_point_translations(*)
      ),
      product_color_variants(
        id,
        color_key,
        image_url,
        sort_order,
        product_color_variant_translations(*)
      ),
      product_content_sections(
        id,
        image_url,
        image_alt,
        sort_order,
        product_content_section_translations(*)
      ),
      product_documents(
        document_id,
        sort_order,
        documents(
          id,
          slug,
          category_id,
          fallback_locale,
          is_active,
          document_translations(locale, title, description, file_path, file_size),
          document_categories(
            id,
            slug,
            document_category_translations(*)
          )
        )
      )
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

  const {
    translations,
    specifications,
    feature_ids,
    images,
    feature_points,
    color_variants,
    content_sections,
    documents,
    ...productData
  } = parsed.data

  // ============================================
  // 1. Update base product data
  // ============================================
  if (Object.keys(productData).length > 0) {
    const { error: updateError } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }
  }

  // ============================================
  // 2. Update translations
  // ============================================
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

  // ============================================
  // 3. Update specifications
  // ============================================
  if (specifications !== undefined) {
    await supabase.from('product_specifications').delete().eq('product_id', id)

    if (specifications.length > 0) {
      const specsToInsert = specifications.map((s) => ({
        ...s,
        product_id: id,
      }))

      const { error: specError } = await supabase
        .from('product_specifications')
        .insert(specsToInsert)

      if (specError) {
        return NextResponse.json({ error: specError.message }, { status: 500 })
      }
    }
  }

  // ============================================
  // 4. Update feature badges
  // ============================================
  if (feature_ids !== undefined) {
    await supabase.from('product_to_features').delete().eq('product_id', id)

    if (feature_ids.length > 0) {
      const featuresToInsert = feature_ids.map((feature_id) => ({
        product_id: id,
        feature_id,
      }))

      const { error: featureError } = await supabase
        .from('product_to_features')
        .insert(featuresToInsert)

      if (featureError) {
        return NextResponse.json({ error: featureError.message }, { status: 500 })
      }
    }
  }

  // ============================================
  // 5. Update product images (gallery)
  // ============================================
  if (images !== undefined) {
    await supabase.from('product_images').delete().eq('product_id', id)

    if (images.length > 0) {
      const imagesToInsert = images.map((img) => ({
        ...img,
        product_id: id,
      }))

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imagesToInsert)

      if (imageError) {
        return NextResponse.json({ error: imageError.message }, { status: 500 })
      }
    }
  }

  // ============================================
  // 6. Update feature points
  // ============================================
  if (feature_points !== undefined) {
    // First delete old feature points (translations cascade)
    await supabase.from('product_feature_points').delete().eq('product_id', id)

    if (feature_points.length > 0) {
      for (const point of feature_points) {
        const { translations: pointTranslations, ...pointData } = point

        // Insert feature point
        const { data: insertedPoint, error: pointError } = await supabase
          .from('product_feature_points')
          .insert({
            ...pointData,
            product_id: id,
          })
          .select('id')
          .single()

        if (pointError) {
          return NextResponse.json({ error: pointError.message }, { status: 500 })
        }

        // Insert translations
        if (pointTranslations && pointTranslations.length > 0) {
          const translationsToInsert = pointTranslations.map((t) => ({
            ...t,
            feature_point_id: insertedPoint.id,
          }))

          const { error: transError } = await supabase
            .from('product_feature_point_translations')
            .insert(translationsToInsert)

          if (transError) {
            return NextResponse.json({ error: transError.message }, { status: 500 })
          }
        }
      }
    }
  }

  // ============================================
  // 7. Update color variants
  // ============================================
  if (color_variants !== undefined) {
    // First delete old variants (translations cascade)
    await supabase.from('product_color_variants').delete().eq('product_id', id)

    if (color_variants.length > 0) {
      for (const variant of color_variants) {
        const { translations: variantTranslations, ...variantData } = variant

        // Insert color variant
        const { data: insertedVariant, error: variantError } = await supabase
          .from('product_color_variants')
          .insert({
            ...variantData,
            product_id: id,
          })
          .select('id')
          .single()

        if (variantError) {
          return NextResponse.json({ error: variantError.message }, { status: 500 })
        }

        // Insert translations
        if (variantTranslations && variantTranslations.length > 0) {
          const translationsToInsert = variantTranslations.map((t) => ({
            ...t,
            variant_id: insertedVariant.id,
          }))

          const { error: transError } = await supabase
            .from('product_color_variant_translations')
            .insert(translationsToInsert)

          if (transError) {
            return NextResponse.json({ error: transError.message }, { status: 500 })
          }
        }
      }
    }
  }

  // ============================================
  // 8. Update content sections
  // ============================================
  if (content_sections !== undefined) {
    // First delete old sections (translations cascade)
    await supabase.from('product_content_sections').delete().eq('product_id', id)

    if (content_sections.length > 0) {
      for (const section of content_sections) {
        const { translations: sectionTranslations, ...sectionData } = section

        // Insert content section
        const { data: insertedSection, error: sectionError } = await supabase
          .from('product_content_sections')
          .insert({
            ...sectionData,
            product_id: id,
          })
          .select('id')
          .single()

        if (sectionError) {
          return NextResponse.json({ error: sectionError.message }, { status: 500 })
        }

        // Insert translations
        if (sectionTranslations && sectionTranslations.length > 0) {
          const translationsToInsert = sectionTranslations.map((t) => ({
            ...t,
            section_id: insertedSection.id,
          }))

          const { error: transError } = await supabase
            .from('product_content_section_translations')
            .insert(translationsToInsert)

          if (transError) {
            return NextResponse.json({ error: transError.message }, { status: 500 })
          }
        }
      }
    }
  }

  // ============================================
  // 9. Update product documents
  // ============================================
  if (documents !== undefined) {
    await supabase.from('product_documents').delete().eq('product_id', id)

    if (documents.length > 0) {
      const docsToInsert = documents.map((doc) => ({
        product_id: id,
        document_id: doc.document_id,
        sort_order: doc.sort_order,
      }))

      const { error: docError } = await supabase
        .from('product_documents')
        .insert(docsToInsert)

      if (docError) {
        return NextResponse.json({ error: docError.message }, { status: 500 })
      }
    }
  }

  // ============================================
  // 10. Fetch and return updated product
  // ============================================
  const { data: updatedProduct } = await supabase
    .from('products')
    .select(
      `
      *,
      product_translations(*),
      product_specifications(*),
      product_images(*),
      product_to_features(feature_id, product_features(id, slug, icon, product_feature_translations(*))),
      product_feature_points(
        id,
        icon,
        position,
        sort_order,
        product_feature_point_translations(*)
      ),
      product_color_variants(
        id,
        color_key,
        image_url,
        sort_order,
        product_color_variant_translations(*)
      ),
      product_content_sections(
        id,
        image_url,
        image_alt,
        sort_order,
        product_content_section_translations(*)
      ),
      product_documents(
        document_id,
        sort_order,
        documents(
          id,
          slug,
          document_translations(*)
        )
      )
    `
    )
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
