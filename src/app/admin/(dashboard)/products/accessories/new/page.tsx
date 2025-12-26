import { createClient } from '@/lib/supabase/server'
import { NewAccessoryForm } from './NewAccessoryForm'

export default async function NewAccessoryPage() {
  const supabase = await createClient()

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

  return <NewAccessoryForm products={products || []} />
}
