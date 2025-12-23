'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArticleForm } from '@/components/admin/articles'

interface Category {
  id: string
  slug: string
  translations: { locale: string; name: string }[]
}

interface Article {
  id: string
  slug: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  category_id: string | null
  featured_image_url: string | null
  is_featured: boolean
  translations: {
    locale: string
    title: string
    excerpt: string | null
    content: unknown
    seo_title: string | null
    seo_description: string | null
  }[]
}

interface EditArticleFormProps {
  article: Article
  categories: Category[]
}

export function EditArticleForm({ article, categories }: EditArticleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // Transform form data to API format
      const translations = Object.entries(data.translations)
        .filter(([_, t]: [string, any]) => t.title) // Only include translations with title
        .map(([locale, t]: [string, any]) => ({
          locale,
          title: t.title,
          excerpt: t.excerpt || null,
          content: t.content ? JSON.parse(t.content) : null,
          seo_title: t.seo_title || null,
          seo_description: t.seo_description || null,
        }))

      const payload = {
        slug: data.slug,
        status: data.status,
        category_id: data.category_id || null,
        featured_image_url: data.featured_image_url || null,
        is_featured: data.is_featured,
        translations,
      }

      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při ukládání článku')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ArticleForm
      article={article}
      categories={categories}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
