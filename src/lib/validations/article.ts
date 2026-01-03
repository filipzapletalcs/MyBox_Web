import { z } from 'zod'
import { localeSchema } from './locale'

export const articleTranslationSchema = z.object({
  locale: localeSchema,
  title: z.string().min(1, 'Titulek je povinný').max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.any(), // TipTap JSON
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

export const createArticleSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug'),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  published_at: z.string().datetime().optional().nullable(),
  category_id: z.string().optional().nullable(),
  featured_image_url: z.string().url().optional().nullable(),
  is_featured: z.boolean().default(false),
  translations: z
    .array(articleTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
  tag_ids: z.array(z.string().uuid()).optional(),
})

export const updateArticleSchema = createArticleSchema.partial()

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type ArticleTranslation = z.infer<typeof articleTranslationSchema>
