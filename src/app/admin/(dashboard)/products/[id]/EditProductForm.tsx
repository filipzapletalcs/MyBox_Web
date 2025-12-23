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
  // Extended product fields
  hero_image?: string | null
  hero_video?: string | null
  front_image?: string | null
  datasheet_url?: string | null
  datasheet_filename?: string | null
  brand?: string | null
  power?: string | null
  manufacturer_name?: string | null
  manufacturer_url?: string | null
  country_of_origin?: string | null
  product_category?: string | null
  // Translations
  translations: {
    locale: string
    name: string
    tagline: string | null
    description: string | null
    seo_title: string | null
    seo_description: string | null
  }[]
  // Specifications
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
  // Product images (gallery)
  product_images?: {
    url: string
    alt: string | null
    is_primary: boolean
    sort_order: number
  }[]
  // Feature points
  product_feature_points?: {
    id: string
    icon: string
    position: string
    sort_order: number
    product_feature_point_translations: {
      locale: string
      label: string
      value: string
    }[]
  }[]
  // Color variants
  product_color_variants?: {
    id: string
    color_key: string
    image_url: string
    sort_order: number
    product_color_variant_translations: {
      locale: string
      label: string
    }[]
  }[]
  // Content sections
  product_content_sections?: {
    id: string
    image_url: string | null
    image_alt: string | null
    sort_order: number
    product_content_section_translations: {
      locale: string
      title: string
      subtitle: string | null
      content: string
    }[]
  }[]
  // Documents
  product_documents?: {
    document_id: string
    sort_order: number
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

      // Transform images
      const images = data.images?.map((img: any, index: number) => ({
        url: img.url,
        alt: img.alt || null,
        is_primary: img.is_primary || false,
        sort_order: img.sort_order ?? index,
      })) || []

      // Transform feature points
      const feature_points = data.feature_points?.map((point: any, index: number) => ({
        icon: point.icon || null,
        position: point.position || 'left',
        sort_order: point.sort_order ?? index,
        translations: Object.entries(point.translations || {})
          .filter(([_, t]: [string, any]) => t.label || t.value)
          .map(([locale, t]: [string, any]) => ({
            locale,
            label: t.label || null,
            value: t.value || null,
          })),
      })) || []

      // Transform color variants
      const color_variants = data.color_variants?.map((variant: any, index: number) => ({
        color_key: variant.color_key,
        image_url: variant.image_url || null,
        sort_order: variant.sort_order ?? index,
        translations: Object.entries(variant.translations || {})
          .filter(([_, t]: [string, any]) => t.label)
          .map(([locale, t]: [string, any]) => ({
            locale,
            label: t.label || null,
          })),
      })) || []

      // Transform content sections
      const content_sections = data.content_sections?.map((section: any, index: number) => ({
        image_url: section.image_url || null,
        image_alt: section.image_alt || null,
        sort_order: section.sort_order ?? index,
        translations: Object.entries(section.translations || {})
          .filter(([_, t]: [string, any]) => t.title || t.content)
          .map(([locale, t]: [string, any]) => ({
            locale,
            title: t.title || null,
            subtitle: t.subtitle || null,
            content: t.content || null,
          })),
      })) || []

      // Transform documents
      const documents = data.documents?.map((doc: any, index: number) => ({
        document_id: doc.document_id,
        sort_order: doc.sort_order ?? index,
      })) || []

      const payload = {
        // Basic fields
        slug: data.slug,
        type: data.type,
        sku: data.sku || null,
        is_active: data.is_active,
        is_featured: data.is_featured,
        sort_order: data.sort_order || 0,
        // Extended fields
        hero_image: data.hero_image || null,
        hero_video: data.hero_video || null,
        front_image: data.front_image || null,
        datasheet_url: data.datasheet_url || null,
        datasheet_filename: data.datasheet_filename || null,
        brand: data.brand || null,
        power: data.power || null,
        manufacturer_name: data.manufacturer_name || null,
        manufacturer_url: data.manufacturer_url || null,
        country_of_origin: data.country_of_origin || null,
        product_category: data.product_category || null,
        // Relations
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
        images,
        feature_points,
        color_variants,
        content_sections,
        documents,
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
