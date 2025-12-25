import { z } from 'zod'
import { LOCALES } from '@/config/locales'
import { CASE_STUDY_INDUSTRIES } from '@/types/case-study'

// Dynamic locale schema based on config
const localeSchema = z.enum(LOCALES as unknown as [string, ...string[]])

// Case Study Translation
export const caseStudyTranslationSchema = z.object({
  locale: localeSchema,
  title: z.string().min(1, 'Titulek je povinný').max(200),
  subtitle: z.string().max(300).optional().nullable(),
  challenge: z.string().max(2000).optional().nullable(),
  solution: z.string().max(2000).optional().nullable(),
  results: z.string().max(2000).optional().nullable(),
  testimonial_text: z.string().max(1000).optional().nullable(),
  testimonial_author: z.string().max(200).optional().nullable(),
  seo_title: z.string().max(60).optional().nullable(),
  seo_description: z.string().max(160).optional().nullable(),
})

// Case Study
export const createCaseStudySchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug'),
  client_name: z.string().min(1, 'Název klienta je povinný').max(200),
  client_logo_url: z.string().url().optional().nullable().or(z.literal('')),
  featured_image_url: z.string().url().optional().nullable().or(z.literal('')),
  industry: z.enum(CASE_STUDY_INDUSTRIES as unknown as [string, ...string[]]).optional().nullable(),
  station_count: z.number().int().positive().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  published_at: z.string().datetime().optional().nullable(),
  sort_order: z.number().int().default(0),
  translations: z
    .array(caseStudyTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
})

export const updateCaseStudySchema = createCaseStudySchema.partial()

// Case Study Image
export const caseStudyImageSchema = z.object({
  case_study_id: z.string().uuid(),
  url: z.string().url('Neplatná URL obrázku'),
  alt: z.string().max(200).optional().nullable(),
  is_primary: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

export const createCaseStudyImagesSchema = z.object({
  case_study_id: z.string().uuid(),
  images: z.array(caseStudyImageSchema.omit({ case_study_id: true })),
})

// Case Study Metric Translation
export const caseStudyMetricTranslationSchema = z.object({
  locale: localeSchema,
  label: z.string().min(1, 'Popis metriky je povinný').max(100),
})

// Case Study Metric
export const caseStudyMetricSchema = z.object({
  case_study_id: z.string().uuid(),
  icon: z.string().max(50).optional().nullable(),
  value: z.string().min(1, 'Hodnota je povinná').max(50),
  sort_order: z.number().int().default(0),
  translations: z
    .array(caseStudyMetricTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
})

export const createCaseStudyMetricsSchema = z.object({
  case_study_id: z.string().uuid(),
  metrics: z.array(caseStudyMetricSchema.omit({ case_study_id: true })),
})

// Export types
export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>
export type CaseStudyTranslationInput = z.infer<typeof caseStudyTranslationSchema>

export type CaseStudyImageInput = z.infer<typeof caseStudyImageSchema>
export type CreateCaseStudyImagesInput = z.infer<typeof createCaseStudyImagesSchema>

export type CaseStudyMetricInput = z.infer<typeof caseStudyMetricSchema>
export type CaseStudyMetricTranslationInput = z.infer<typeof caseStudyMetricTranslationSchema>
export type CreateCaseStudyMetricsInput = z.infer<typeof createCaseStudyMetricsSchema>
