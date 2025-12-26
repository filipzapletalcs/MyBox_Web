'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccessoryForm } from '@/components/admin/accessories'

interface Product {
  id: string
  slug: string
  product_translations: { locale: string; name: string }[]
}

interface NewAccessoryFormProps {
  products: Product[]
}

export function NewAccessoryForm({ products }: NewAccessoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      // Transform form data to API format
      const translations = Object.entries(data.translations)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter(([, t]: [string, any]) => t.name)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map(([locale, t]: [string, any]) => ({
          locale,
          name: t.name,
          description: t.description || null,
        }))

      const payload = {
        slug: data.slug,
        image_url: data.image_url || null,
        link_url: data.link_url || '/poptavka',
        is_active: data.is_active,
        sort_order: data.sort_order || 0,
        translations,
        product_ids: data.product_ids || [],
      }

      const response = await fetch('/api/accessories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při vytváření příslušenství')
      }

      router.push('/admin/products/accessories')
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AccessoryForm
      products={products}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
