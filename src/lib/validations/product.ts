import { z } from 'zod'

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

export const createProductSchema = z.object({
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
  translations: z
    .array(productTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
  specifications: z.array(productSpecificationSchema).optional(),
  feature_ids: z.array(z.string().uuid()).optional(),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
