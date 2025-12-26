'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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

  const handleSubmit = async (data: any, publish = false) => {
    setIsSubmitting(true)
    console.log('[EditArticleForm] Starting submit, publish:', publish)
    console.log('[EditArticleForm] Form data:', data)

    try {
      // Transform form data to API format
      const translations = Object.entries(data.translations)
        .filter(([_, t]: [string, any]) => t.title) // Only include translations with title
        .map(([locale, t]: [string, any]) => {
          let content = null
          if (t.content) {
            try {
              content = JSON.parse(t.content)
            } catch (e) {
              console.error(`[EditArticleForm] Failed to parse content for locale ${locale}:`, e)
              throw new Error(`Chyba v obsahu pro jazyk ${locale}: neplatný JSON`)
            }
          }
          return {
            locale,
            title: t.title,
            excerpt: t.excerpt || null,
            content,
            seo_title: t.seo_title || null,
            seo_description: t.seo_description || null,
          }
        })

      const payload = {
        slug: data.slug,
        status: publish ? 'published' : data.status,
        category_id: data.category_id || null,
        featured_image_url: data.featured_image_url || null,
        is_featured: data.is_featured,
        translations,
      }

      console.log('[EditArticleForm] Sending payload:', payload)

      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()
      console.log('[EditArticleForm] Response:', response.status, responseData)

      if (!response.ok) {
        const errorMessage = responseData.error || 'Chyba při ukládání článku'
        const details = responseData.details ? JSON.stringify(responseData.details, null, 2) : ''
        console.error('[EditArticleForm] Error:', errorMessage, details)
        throw new Error(errorMessage + (details ? `\n${details}` : ''))
      }

      toast.success(publish ? 'Článek byl publikován' : 'Článek byl uložen')
      router.refresh()
    } catch (error) {
      console.error('[EditArticleForm] Submit error:', error)
      const message = error instanceof Error ? error.message : 'Neznámá chyba'
      toast.error(message)
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
