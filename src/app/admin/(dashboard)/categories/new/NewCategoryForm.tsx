'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CategoryForm } from '@/components/admin/categories'

interface Category {
  id: string
  slug: string
  parent_id: string | null
  translations: {
    locale: string
    name: string
    description: string | null
  }[]
}

interface NewCategoryFormProps {
  categories: Category[]
}

export function NewCategoryForm({ categories }: NewCategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // Transform form data to API format
      const translations = Object.entries(data.translations)
        .filter(([_, t]: [string, any]) => t.name) // Only include translations with name
        .map(([locale, t]: [string, any]) => ({
          locale,
          name: t.name,
          description: t.description || null,
        }))

      const payload = {
        slug: data.slug,
        parent_id: data.parent_id || null,
        translations,
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při vytváření kategorie')
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CategoryForm
      categories={categories}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
