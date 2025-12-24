import { z } from 'zod'

// ============================================
// Team Member Translations
// ============================================

export const teamMemberTranslationSchema = z.object({
  name: z.string().min(1, 'Jméno je povinné').max(100),
  position: z.string().min(1, 'Pozice je povinná').max(100),
  description: z.string().max(500).optional().nullable(),
})

// ============================================
// Team Member Form Schema
// ============================================

export const teamMemberFormSchema = z.object({
  image_url: z.string().url('Neplatná URL obrázku').optional().nullable(),
  email: z.string().email('Neplatný email'),
  phone: z.string().max(20).optional().nullable(),
  linkedin_url: z.string().url('Neplatná LinkedIn URL').optional().nullable().or(z.literal('')),
  is_active: z.boolean(),
  sort_order: z.number().int(),
  translations: z.object({
    cs: teamMemberTranslationSchema,
    en: teamMemberTranslationSchema.partial().extend({
      name: z.string().optional(), // Jméno se kopíruje z CS
    }),
    de: teamMemberTranslationSchema.partial().extend({
      name: z.string().optional(), // Jméno se kopíruje z CS
    }),
  }),
})

// ============================================
// Create Team Member Schema (API)
// ============================================

export const createTeamMemberSchema = teamMemberFormSchema

// ============================================
// Update Team Member Schema (API - partial)
// ============================================

export const updateTeamMemberSchema = teamMemberFormSchema.partial()

// ============================================
// Reorder Schema
// ============================================

export const reorderTeamMembersSchema = z.object({
  members: z.array(z.object({
    id: z.string().uuid(),
    sort_order: z.number().int(),
  })),
})

// ============================================
// Types
// ============================================

export type TeamMemberFormData = z.infer<typeof teamMemberFormSchema>
export type CreateTeamMemberData = z.infer<typeof createTeamMemberSchema>
export type UpdateTeamMemberData = z.infer<typeof updateTeamMemberSchema>
export type ReorderTeamMembersData = z.infer<typeof reorderTeamMembersSchema>
