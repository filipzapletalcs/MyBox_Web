import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditArticleForm } from './EditArticleForm'

export const metadata = {
  title: 'Upravit článek | MyBox CMS',
}

async function getArticle(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      slug,
      status,
      category_id,
      featured_image_url,
      is_featured,
      translations:article_translations(
        locale,
        title,
        excerpt,
        content,
        seo_title,
        seo_description
      )
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
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

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const [article, categories] = await Promise.all([
    getArticle(id),
    getCategories(),
  ])

  if (!article) {
    notFound()
  }

  return <EditArticleForm article={article as any} categories={categories} />
}
