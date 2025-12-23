'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArticleForm } from '@/components/admin/articles'

interface Category {
  id: string
  slug: string
  translations: { locale: string; name: string }[]
}

interface NewArticleFormProps {
  categories: Category[]
}

export function NewArticleForm({ categories }: NewArticleFormProps) {
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

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při vytváření článku')
      }

      const article = await response.json()
      router.push(`/admin/articles/${article.id}`)
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ArticleForm
      categories={categories}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
