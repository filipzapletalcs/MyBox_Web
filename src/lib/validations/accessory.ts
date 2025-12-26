import { z } from 'zod'

// ============================================
// Accessory Translation
// ============================================

export const accessoryTranslationSchema = z.object({
  locale: z.enum(['cs', 'en', 'de']),
  name: z.string().min(1, 'Název je povinný').max(100),
  description: z.string().max(500).optional().nullable(),
})

// ============================================
// Main Accessory Schema
// ============================================

export const createAccessorySchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug'),
  image_url: z.string().optional().nullable(),
  link_url: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
  translations: z
    .array(accessoryTranslationSchema)
    .min(1, 'Alespoň jeden překlad je povinný'),
  product_ids: z.array(z.string().uuid()).optional(),
})

export const updateAccessorySchema = createAccessorySchema.partial()

// ============================================
// Product-Accessory Junction Schema
// ============================================

export const productAccessorySchema = z.object({
  accessory_id: z.string().uuid(),
  sort_order: z.number().int().default(0),
})

// ============================================
// Types
// ============================================

export type CreateAccessoryInput = z.infer<typeof createAccessorySchema>
export type UpdateAccessoryInput = z.infer<typeof updateAccessorySchema>
export type AccessoryTranslationInput = z.infer<typeof accessoryTranslationSchema>
export type ProductAccessoryInput = z.infer<typeof productAccessorySchema>
