import { createClient } from '@/lib/supabase/server'
import { ProductList } from '@/components/admin/products'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      type,
      sku,
      is_active,
      is_featured,
      sort_order,
      created_at,
      product_translations (
        locale,
        name,
        tagline
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
  }

  // Transform data to match component interface
  const transformedProducts = (products || []).map((product) => ({
    id: product.id,
    slug: product.slug,
    type: product.type as 'ac_mybox' | 'dc_alpitronic',
    sku: product.sku,
    is_active: product.is_active,
    is_featured: product.is_featured,
    sort_order: product.sort_order,
    created_at: product.created_at,
    translations: product.product_translations || [],
  }))

  return <ProductList products={transformedProducts} />
}
