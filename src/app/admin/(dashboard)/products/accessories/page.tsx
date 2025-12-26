import { createClient } from '@/lib/supabase/server'
import { AccessoryList } from '@/components/admin/accessories'

export default async function AccessoriesPage() {
  const supabase = await createClient()

  const { data: accessories, error } = await supabase
    .from('accessories')
    .select(`
      id,
      slug,
      image_url,
      link_url,
      is_active,
      sort_order,
      created_at,
      accessory_translations (
        locale,
        name,
        description
      ),
      product_accessories (
        product_id,
        products (
          slug,
          product_translations (
            locale,
            name
          )
        )
      )
    `)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching accessories:', error)
  }

  return <AccessoryList accessories={accessories || []} />
}
