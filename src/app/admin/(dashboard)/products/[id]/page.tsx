import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditProductForm } from './EditProductForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the product with all relations
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_translations (
        locale,
        name,
        tagline,
        description,
        seo_title,
        seo_description
      ),
      product_specifications (
        spec_key,
        value,
        unit,
        group_name,
        sort_order,
        product_specification_translations (
          locale,
          label
        )
      ),
      product_images (
        url,
        alt,
        is_primary,
        sort_order
      ),
      product_feature_points (
        id,
        icon,
        position,
        sort_order,
        product_feature_point_translations (
          locale,
          label,
          value
        )
      ),
      product_color_variants (
        id,
        color_key,
        image_url,
        sort_order,
        product_color_variant_translations (
          locale,
          label
        )
      ),
      product_content_sections (
        id,
        image_url,
        image_alt,
        sort_order,
        product_content_section_translations (
          locale,
          title,
          subtitle,
          content
        )
      ),
      product_documents (
        document_id,
        sort_order
      )
    `)
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  // Transform data with proper null handling
  const transformedProduct = {
    id: product.id,
    slug: product.slug,
    type: product.type as 'ac_mybox' | 'dc_alpitronic',
    sku: product.sku,
    is_active: product.is_active,
    is_featured: product.is_featured,
    sort_order: product.sort_order,
    // Extended product fields
    hero_image: product.hero_image,
    hero_video: product.hero_video,
    front_image: product.front_image,
    datasheet_url: product.datasheet_url,
    datasheet_filename: product.datasheet_filename,
    brand: product.brand,
    power: product.power,
    manufacturer_name: product.manufacturer_name,
    manufacturer_url: product.manufacturer_url,
    country_of_origin: product.country_of_origin,
    product_category: product.product_category,
    // Relations
    translations: product.product_translations || [],
    specifications: (product.product_specifications || []).map((spec: {
      spec_key: string;
      value: string;
      unit: string | null;
      group_name: string | null;
      sort_order: number | null;
      product_specification_translations: { locale: string; label: string }[]
    }) => ({
      spec_key: spec.spec_key,
      value: spec.value,
      unit: spec.unit,
      group_name: spec.group_name,
      sort_order: spec.sort_order ?? 0,
      product_specification_translations: spec.product_specification_translations || [],
    })),
    // Transform images with null handling
    product_images: (product.product_images || []).map((img: { url: string; alt: string | null; is_primary: boolean | null; sort_order: number | null }) => ({
      url: img.url,
      alt: img.alt,
      is_primary: img.is_primary ?? false,
      sort_order: img.sort_order ?? 0,
    })),
    // Transform feature points with null handling
    product_feature_points: (product.product_feature_points || []).map((fp: { id: string; icon: string | null; position: string | null; sort_order: number | null; product_feature_point_translations: { locale: string; label: string | null; value: string | null }[] }) => ({
      id: fp.id,
      icon: fp.icon ?? 'power',
      position: fp.position ?? 'left',
      sort_order: fp.sort_order ?? 0,
      product_feature_point_translations: (fp.product_feature_point_translations || []).map((t: { locale: string; label: string | null; value: string | null }) => ({
        locale: t.locale,
        label: t.label ?? '',
        value: t.value ?? '',
      })),
    })),
    // Transform color variants with null handling
    product_color_variants: (product.product_color_variants || []).map((cv: { id: string; color_key: string; image_url: string | null; sort_order: number | null; product_color_variant_translations: { locale: string; label: string | null }[] }) => ({
      id: cv.id,
      color_key: cv.color_key,
      image_url: cv.image_url ?? '',
      sort_order: cv.sort_order ?? 0,
      product_color_variant_translations: (cv.product_color_variant_translations || []).map((t: { locale: string; label: string | null }) => ({
        locale: t.locale,
        label: t.label ?? '',
      })),
    })),
    // Transform content sections with null handling
    product_content_sections: (product.product_content_sections || []).map((cs: { id: string; image_url: string | null; image_alt: string | null; sort_order: number | null; product_content_section_translations: { locale: string; title: string | null; subtitle: string | null; content: string | null }[] }) => ({
      id: cs.id,
      image_url: cs.image_url,
      image_alt: cs.image_alt,
      sort_order: cs.sort_order ?? 0,
      product_content_section_translations: (cs.product_content_section_translations || []).map((t: { locale: string; title: string | null; subtitle: string | null; content: string | null }) => ({
        locale: t.locale,
        title: t.title ?? '',
        subtitle: t.subtitle,
        content: t.content ?? '',
      })),
    })),
    // Transform documents with null handling
    product_documents: (product.product_documents || []).map((pd: { document_id: string; sort_order: number | null }) => ({
      document_id: pd.document_id,
      sort_order: pd.sort_order ?? 0,
    })),
  }

  return <EditProductForm product={transformedProduct} />
}
