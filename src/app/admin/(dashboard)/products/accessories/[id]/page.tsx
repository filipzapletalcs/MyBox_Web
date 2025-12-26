import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EditAccessoryForm } from './EditAccessoryForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditAccessoryPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the accessory
  const { data: accessory, error } = await supabase
    .from('accessories')
    .select(`
      id,
      slug,
      image_url,
      link_url,
      is_active,
      sort_order,
      accessory_translations (
        locale,
        name,
        description
      ),
      product_accessories (
        product_id
      )
    `)
    .eq('id', id)
    .single()

  if (error || !accessory) {
    notFound()
  }

  // Fetch products for selection
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      product_translations (
        locale,
        name
      )
    `)
    .order('sort_order', { ascending: true })

  return <EditAccessoryForm accessory={accessory} products={products || []} />
}
