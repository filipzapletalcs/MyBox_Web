import { z } from 'zod'
import { LOCALES } from '@/config/locales'
import { CORPORATE_SECTION_TYPES } from '@/types/corporate'

// Dynamic locale schema based on config
const localeSchema = z.enum(LOCALES as unknown as [string, ...string[]])

// Corporate Page Translation
export const corporatePageTranslationSchema = z.object({
  locale: localeSchema,
  title: z.string().min(1, 'Titulek je povinný').max(200),
  subtitle: z.string().max(500).optional().nullable(),
  hero_heading: z.string().max(200).optional().nullable(),
  hero_subheading: z.string().max(500).optional().nullable(),
  seo_title: z.string().max(60).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
})

// Corporate Page
export const createCorporatePageSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug'),
  page_type: z.enum(['landing', 'subpage']),
  hero_video_url: z.string().url().optional().nullable().or(z.literal('')),
  hero_image_url: z.string().url().optional().nullable().or(z.literal('')),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  translations: z
    .array(corporatePageTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
})

export const updateCorporatePageSchema = createCorporatePageSchema.partial()

// Corporate Section Translation
export const corporateSectionTranslationSchema = z.object({
  locale: localeSchema,
  heading: z.string().max(200).optional().nullable(),
  subheading: z.string().max(500).optional().nullable(),
  content: z.any().optional().nullable(), // TipTap JSON
})

// Corporate Section
export const createCorporateSectionSchema = z.object({
  page_id: z.string().uuid(),
  section_type: z.enum(CORPORATE_SECTION_TYPES as unknown as [string, ...string[]]),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  config: z.record(z.string(), z.unknown()).default({}),
  translations: z.array(corporateSectionTranslationSchema).optional(),
})

export const updateCorporateSectionSchema = createCorporateSectionSchema.partial().omit({ page_id: true })

// Reorder sections
export const reorderSectionsSchema = z.object({
  page_id: z.string().uuid(),
  section_ids: z.array(z.string().uuid()),
})

// Corporate Benefit Translation
export const corporateBenefitTranslationSchema = z.object({
  locale: localeSchema,
  title: z.string().min(1, 'Titulek je povinný').max(200),
  description: z.string().max(1000).optional().nullable(),
})

// Corporate Benefit
export const createCorporateBenefitSchema = z.object({
  page_id: z.string().uuid().optional().nullable(),
  section_id: z.string().uuid().optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  color_accent: z.string().max(20).optional().nullable(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  translations: z
    .array(corporateBenefitTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
})

export const updateCorporateBenefitSchema = createCorporateBenefitSchema.partial()

// Export types
export type CreateCorporatePageInput = z.infer<typeof createCorporatePageSchema>
export type UpdateCorporatePageInput = z.infer<typeof updateCorporatePageSchema>
export type CorporatePageTranslationInput = z.infer<typeof corporatePageTranslationSchema>

export type CreateCorporateSectionInput = z.infer<typeof createCorporateSectionSchema>
export type UpdateCorporateSectionInput = z.infer<typeof updateCorporateSectionSchema>
export type CorporateSectionTranslationInput = z.infer<typeof corporateSectionTranslationSchema>

export type CreateCorporateBenefitInput = z.infer<typeof createCorporateBenefitSchema>
export type UpdateCorporateBenefitInput = z.infer<typeof updateCorporateBenefitSchema>
export type CorporateBenefitTranslationInput = z.infer<typeof corporateBenefitTranslationSchema>
