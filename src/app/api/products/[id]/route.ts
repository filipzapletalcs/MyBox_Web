import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateProductSchema } from '@/lib/validations/product'
import { checkUserRole } from '@/lib/auth/checkRole'

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
      product_specifications(*, product_specification_translations(*)),
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
    console.error('Product fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
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

  // RBAC check - only admin/editor can manage products
  const { hasRole } = await checkUserRole(supabase, user.id)
  if (!hasRole) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 })
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
      console.error('Product update error:', updateError)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
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
        console.error('Product translation update error:', translationError)
        return NextResponse.json(
          { error: 'Failed to update product translation' },
          { status: 500 }
        )
      }
    }
  }

  // ============================================
  // 3. Update specifications (with translations)
  // ============================================
  if (specifications !== undefined) {
    // Delete old specifications (translations cascade)
    await supabase.from('product_specifications').delete().eq('product_id', id)

    if (specifications.length > 0) {
      for (const spec of specifications) {
        const { translations: specTranslations, ...specData } = spec

        // Insert specification
        const { data: insertedSpec, error: specError } = await supabase
          .from('product_specifications')
          .insert({
            ...specData,
            product_id: id,
          })
          .select('id')
          .single()

        if (specError) {
          console.error('Product specification error:', specError)
          return NextResponse.json({ error: 'Failed to update specification' }, { status: 500 })
        }

        // Insert translations
        if (specTranslations && specTranslations.length > 0) {
          const translationsToInsert = specTranslations.map((t) => ({
            ...t,
            specification_id: insertedSpec.id,
          }))

          const { error: transError } = await supabase
            .from('product_specification_translations')
            .insert(translationsToInsert)

          if (transError) {
            console.error('Specification translation error:', transError)
            return NextResponse.json({ error: 'Failed to update specification translation' }, { status: 500 })
          }
        }
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
        console.error('Product feature error:', featureError)
        return NextResponse.json({ error: 'Failed to update product features' }, { status: 500 })
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
        console.error('Product image error:', imageError)
        return NextResponse.json({ error: 'Failed to update product images' }, { status: 500 })
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
          console.error('Feature point error:', pointError)
          return NextResponse.json({ error: 'Failed to update feature point' }, { status: 500 })
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
            console.error('Feature point translation error:', transError)
            return NextResponse.json({ error: 'Failed to update feature point translation' }, { status: 500 })
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
          console.error('Color variant error:', variantError)
          return NextResponse.json({ error: 'Failed to update color variant' }, { status: 500 })
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
            console.error('Color variant translation error:', transError)
            return NextResponse.json({ error: 'Failed to update color variant translation' }, { status: 500 })
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
          console.error('Content section error:', sectionError)
          return NextResponse.json({ error: 'Failed to update content section' }, { status: 500 })
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
            console.error('Content section translation error:', transError)
            return NextResponse.json({ error: 'Failed to update content section translation' }, { status: 500 })
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
        console.error('Product documents error:', docError)
        return NextResponse.json({ error: 'Failed to update product documents' }, { status: 500 })
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
      product_specifications(*, product_specification_translations(*)),
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

  // RBAC check - only admin/editor can manage products
  const { hasRole } = await checkUserRole(supabase, user.id)
  if (!hasRole) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 })
  }

  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    console.error('Product delete error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
