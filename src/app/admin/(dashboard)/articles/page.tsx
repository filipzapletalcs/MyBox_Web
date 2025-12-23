import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui'
import { ArticleListWrapper } from './ArticleListWrapper'

export const metadata = {
  title: 'Články | MyBox CMS',
}

async function getArticles() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      slug,
      status,
      is_featured,
      created_at,
      updated_at,
      author:profiles(full_name, email),
      translations:article_translations(locale, title),
      category:categories(
        translations:category_translations(locale, name)
      )
    `)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data || []
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

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ])

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Články</h1>
          <p className="mt-1 text-sm text-text-muted">
            Správa blogových článků
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nový článek
          </Button>
        </Link>
      </div>

      {/* Articles list */}
      <Suspense
        fallback={
          <div className="animate-pulse rounded-xl border border-border-subtle bg-bg-secondary p-8 text-center text-text-muted">
            Načítání článků...
          </div>
        }
      >
        <ArticleListWrapper articles={articles as any} />
      </Suspense>
    </div>
  )
}
