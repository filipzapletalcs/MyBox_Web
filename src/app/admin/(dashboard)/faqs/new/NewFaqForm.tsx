'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaqForm } from '@/components/admin/faqs'

export function NewFaqForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // Transform form data to API format
      const translations = Object.entries(data.translations)
        .filter(([_, t]: [string, any]) => t.question && t.answer)
        .map(([locale, t]: [string, any]) => ({
          locale,
          question: t.question,
          answer: t.answer,
        }))

      const payload = {
        slug: data.slug,
        category: data.category || null,
        sort_order: data.sort_order || 0,
        is_active: data.is_active,
        translations,
      }

      const response = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při vytváření FAQ')
      }

      router.push('/admin/faqs')
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FaqForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
