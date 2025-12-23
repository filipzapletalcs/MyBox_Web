'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductForm } from '@/components/admin/products'

interface Product {
  id: string
  slug: string
  type: 'ac_mybox' | 'dc_alpitronic'
  sku: string | null
  is_active: boolean | null
  is_featured: boolean | null
  sort_order: number | null
  translations: {
    locale: string
    name: string
    tagline: string | null
    description: string | null
    seo_title: string | null
    seo_description: string | null
  }[]
  specifications?: {
    spec_key: string
    value: string
    unit: string | null
    group_name: string | null
    sort_order: number | null
    label_cs: string | null
    label_en: string | null
    label_de: string | null
  }[]
}

interface EditProductFormProps {
  product: Product
}

export function EditProductForm({ product }: EditProductFormProps) {
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
          tagline: t.tagline || null,
          description: t.description || null,
          seo_title: t.seo_title || null,
          seo_description: t.seo_description || null,
        }))

      const payload = {
        slug: data.slug,
        type: data.type,
        sku: data.sku || null,
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order || 0,
        translations,
        specifications: data.specifications?.map((spec: any, index: number) => ({
          spec_key: spec.spec_key,
          value: spec.value,
          unit: spec.unit || null,
          group_name: spec.group_name || null,
          sort_order: spec.sort_order ?? index,
          label_cs: spec.label_cs || null,
          label_en: spec.label_en || null,
          label_de: spec.label_de || null,
        })) || [],
      }

      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při ukládání produktu')
      }

      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProductForm
      product={product}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  )
}
