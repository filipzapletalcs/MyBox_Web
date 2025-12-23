import { z } from 'zod'

// ============================================
// Base Translations
// ============================================

export const productTranslationSchema = z.object({
  locale: z.enum(['cs', 'en', 'de']),
  name: z.string().min(1, 'Název je povinný').max(100),
  tagline: z.string().max(200).optional().nullable(),
  description: z.string().optional().nullable(),
  seo_title: z.string().max(60).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
})

export const productSpecificationSchema = z.object({
  spec_key: z.string().min(1),
  value: z.string().min(1),
  unit: z.string().optional().nullable(),
  group_name: z.string().optional().nullable(),
  sort_order: z.number().int().default(0),
  label_cs: z.string().optional().nullable(),
  label_en: z.string().optional().nullable(),
  label_de: z.string().optional().nullable(),
})

// ============================================
// Product Images (Gallery)
// ============================================

export const productImageSchema = z.object({
  url: z.string().min(1, 'URL obrázku je povinná'),
  alt: z.string().optional().nullable(),
  is_primary: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

// ============================================
// Feature Points (Visual hotspots)
// ============================================

export const featurePointTranslationSchema = z.object({
  locale: z.enum(['cs', 'en', 'de']),
  label: z.string().min(1, 'Label je povinný'),
  value: z.string().min(1, 'Value je povinná'),
})

export const productFeaturePointSchema = z.object({
  icon: z.enum(['power', 'protocol', 'connectivity', 'protection', 'meter', 'temperature']),
  position: z.enum(['left', 'right']),
  sort_order: z.number().int().default(0),
  translations: z.array(featurePointTranslationSchema).min(1, 'Alespoň jeden překlad je povinný'),
})

// ============================================
// Color Variants
// ============================================

export const colorVariantTranslationSchema = z.object({
  locale: z.enum(['cs', 'en', 'de']),
  label: z.string().min(1, 'Label je povinný'),
})

export const productColorVariantSchema = z.object({
  color_key: z.string().min(1, 'Color key je povinný'),
  image_url: z.string().min(1, 'URL obrázku je povinná'),
  sort_order: z.number().int().default(0),
  translations: z.array(colorVariantTranslationSchema).min(1, 'Alespoň jeden překlad je povinný'),
})

// ============================================
// Content Sections (SEO blocks)
// ============================================

export const contentSectionTranslationSchema = z.object({
  locale: z.enum(['cs', 'en', 'de']),
  title: z.string().min(1, 'Titulek je povinný'),
  subtitle: z.string().optional().nullable(),
  content: z.string().min(1, 'Obsah je povinný'),
})

export const productContentSectionSchema = z.object({
  image_url: z.string().optional().nullable(),
  image_alt: z.string().optional().nullable(),
  sort_order: z.number().int().default(0),
  translations: z.array(contentSectionTranslationSchema).min(1, 'Alespoň jeden překlad je povinný'),
})

// ============================================
// Product Documents (junction)
// ============================================

export const productDocumentSchema = z.object({
  document_id: z.string().uuid(),
  sort_order: z.number().int().default(0),
})

// ============================================
// Main Product Schema
// ============================================

export const createProductSchema = z.object({
  // Base fields
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug'),
  type: z.enum(['ac_mybox', 'dc_alpitronic']),
  sku: z.string().max(50).optional().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),

  // Extended product fields
  hero_image: z.string().optional().nullable(),
  hero_video: z.string().optional().nullable(),
  front_image: z.string().optional().nullable(),
  datasheet_url: z.string().optional().nullable(),
  datasheet_filename: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  power: z.string().optional().nullable(),
  manufacturer_name: z.string().optional().nullable(),
  manufacturer_url: z.string().url().optional().nullable(),
  country_of_origin: z.string().max(2).optional().nullable(),
  product_category: z.string().optional().nullable(),

  // Relations
  translations: z
    .array(productTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
  specifications: z.array(productSpecificationSchema).optional(),
  feature_ids: z.array(z.string().uuid()).optional(),

  // Extension relations
  images: z.array(productImageSchema).optional(),
  feature_points: z.array(productFeaturePointSchema).optional(),
  color_variants: z.array(productColorVariantSchema).optional(),
  content_sections: z.array(productContentSectionSchema).optional(),
  documents: z.array(productDocumentSchema).optional(),
})

export const updateProductSchema = createProductSchema.partial()

// ============================================
// Types
// ============================================

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductImage = z.infer<typeof productImageSchema>
export type ProductFeaturePoint = z.infer<typeof productFeaturePointSchema>
export type ProductColorVariant = z.infer<typeof productColorVariantSchema>
export type ProductContentSection = z.infer<typeof productContentSectionSchema>
export type ProductDocument = z.infer<typeof productDocumentSchema>
