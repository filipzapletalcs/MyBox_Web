import { createClient } from '@/lib/supabase/server'
import { NewArticleForm } from './NewArticleForm'

export const metadata = {
  title: 'Nový článek | MyBox CMS',
}

async function getCategories() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select(`
      id,
      slug,
      translations:category_translations(locale, name)
    `)
    .order('sort_order')

  return data || []
}

export default async function NewArticlePage() {
  const categories = await getCategories()

  return <NewArticleForm categories={categories} />
}
