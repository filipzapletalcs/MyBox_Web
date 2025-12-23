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
      id,
      slug,
      type,
      sku,
      is_active,
      is_featured,
      sort_order,
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
        label_cs,
        label_en,
        label_de
      )
    `)
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const transformedProduct = {
    id: product.id,
    slug: product.slug,
    type: product.type as 'ac_mybox' | 'dc_alpitronic',
    sku: product.sku,
    is_active: product.is_active,
    is_featured: product.is_featured,
    sort_order: product.sort_order,
    translations: product.product_translations || [],
    specifications: product.product_specifications || [],
  }

  return <EditProductForm product={transformedProduct} />
}
