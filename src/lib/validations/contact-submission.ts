import { z } from 'zod'

// ============================================
// Station Types
// ============================================

export const stationTypes = ['ac-home', 'ac-company', 'dc', 'service', 'other'] as const
export type StationType = (typeof stationTypes)[number]

// ============================================
// Segments
// ============================================

export const segments = [
  'home',
  'company',
  'developer',
  'municipality',
  'hospitality',
  'retail',
  'fleet',
  'other',
] as const
export type Segment = (typeof segments)[number]

// ============================================
// Contact Submission Schema (Public Form)
// ============================================

export const contactSubmissionSchema = z.object({
  company: z.string().min(2, 'Název společnosti je povinný'),
  contact_person: z.string().min(2, 'Kontaktní osoba je povinná'),
  email: z.string().email('Neplatný email'),
  phone: z.string().max(20).optional().nullable(),
  station_type: z.enum(stationTypes, {
    message: 'Vyberte typ stanice',
  }),
  location: z.string().min(1, 'Lokalita je povinná'),
  segment: z.enum(segments, {
    message: 'Vyberte segment',
  }),
  message: z.string().min(10, 'Zpráva musí mít alespoň 10 znaků'),
})

// ============================================
// Update Submission Schema (Admin)
// ============================================

export const updateContactSubmissionSchema = z.object({
  is_read: z.boolean().optional(),
  notes: z.string().max(2000).optional().nullable(),
})

// ============================================
// Filter Schema
// ============================================

export const contactSubmissionFilterSchema = z.object({
  is_read: z.enum(['all', 'read', 'unread']).optional(),
  station_type: z.enum([...stationTypes, 'all']).optional(),
  segment: z.enum([...segments, 'all']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
})

// ============================================
// Types
// ============================================

export type ContactSubmissionData = z.infer<typeof contactSubmissionSchema>
export type UpdateContactSubmissionData = z.infer<typeof updateContactSubmissionSchema>
export type ContactSubmissionFilter = z.infer<typeof contactSubmissionFilterSchema>
