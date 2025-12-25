import type { Database } from './database'

// Database types
export type CaseStudy = Database['public']['Tables']['case_studies']['Row']
export type CaseStudyInsert = Database['public']['Tables']['case_studies']['Insert']
export type CaseStudyUpdate = Database['public']['Tables']['case_studies']['Update']

export type CaseStudyTranslation = Database['public']['Tables']['case_study_translations']['Row']
export type CaseStudyTranslationInsert = Database['public']['Tables']['case_study_translations']['Insert']

export type CaseStudyImage = Database['public']['Tables']['case_study_images']['Row']
export type CaseStudyImageInsert = Database['public']['Tables']['case_study_images']['Insert']

export type CaseStudyMetric = Database['public']['Tables']['case_study_metrics']['Row']
export type CaseStudyMetricInsert = Database['public']['Tables']['case_study_metrics']['Insert']

export type CaseStudyMetricTranslation = Database['public']['Tables']['case_study_metric_translations']['Row']
export type CaseStudyMetricTranslationInsert = Database['public']['Tables']['case_study_metric_translations']['Insert']

// Industry options
export const CASE_STUDY_INDUSTRIES = [
  'logistics',
  'manufacturing',
  'retail',
  'hospitality',
  'real_estate',
  'energy',
  'automotive',
  'public_sector',
  'other',
] as const

export type CaseStudyIndustry = typeof CASE_STUDY_INDUSTRIES[number]

export const INDUSTRY_LABELS: Record<CaseStudyIndustry, string> = {
  logistics: 'Logistika',
  manufacturing: 'Výroba',
  retail: 'Retail',
  hospitality: 'Hotelnictví',
  real_estate: 'Reality',
  energy: 'Energetika',
  automotive: 'Automotive',
  public_sector: 'Veřejný sektor',
  other: 'Ostatní',
}

// Extended types with relations
export interface CaseStudyMetricWithTranslations extends CaseStudyMetric {
  translations: CaseStudyMetricTranslation[]
}

export interface CaseStudyWithTranslations extends CaseStudy {
  translations: CaseStudyTranslation[]
}

export interface CaseStudyFull extends CaseStudy {
  translations: CaseStudyTranslation[]
  images: CaseStudyImage[]
  metrics: CaseStudyMetricWithTranslations[]
}

// Form data types for admin
export interface CaseStudyFormData {
  slug: string
  client_name: string
  client_logo_url?: string | null
  featured_image_url?: string | null
  industry?: string | null
  station_count?: number | null
  is_featured: boolean
  is_active: boolean
  published_at?: string | null
  sort_order: number
  translations: Record<string, {
    title: string
    subtitle?: string
    challenge?: string
    solution?: string
    results?: string
    testimonial_text?: string
    testimonial_author?: string
    seo_title?: string
    seo_description?: string
  }>
}

export interface CaseStudyImageFormData {
  case_study_id: string
  url: string
  alt?: string
  is_primary: boolean
  sort_order: number
}

export interface CaseStudyMetricFormData {
  case_study_id: string
  icon?: string
  value: string
  sort_order: number
  translations: Record<string, {
    label: string
  }>
}
