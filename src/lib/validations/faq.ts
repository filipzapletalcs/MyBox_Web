import { z } from 'zod'
import { localeSchema } from './locale'

export const faqTranslationSchema = z.object({
  locale: localeSchema,
  question: z.string().min(1, 'Otázka je povinná').max(500),
  answer: z.string().min(1, 'Odpověď je povinná').max(5000),
})

export const createFaqSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug'),
  category: z.string().max(50).optional().nullable(),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  translations: z
    .array(faqTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
})

export const updateFaqSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug')
    .optional(),
  category: z.string().max(50).optional().nullable(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
  translations: z.array(faqTranslationSchema).optional(),
})

export type CreateFaqInput = z.infer<typeof createFaqSchema>
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>
