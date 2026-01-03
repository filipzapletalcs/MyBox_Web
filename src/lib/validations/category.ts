import { z } from 'zod'
import { localeSchema } from './locale'

export const categoryTranslationSchema = z.object({
  locale: localeSchema,
  name: z.string().min(1, 'Název je povinný').max(100),
  description: z.string().max(500).optional().nullable(),
})

export const createCategorySchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug'),
  sort_order: z.number().int().default(0),
  translations: z
    .array(categoryTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
