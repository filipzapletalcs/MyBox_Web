import type { Database } from '@/lib/supabase/database.types'

// Database types
export type CorporatePage = Database['public']['Tables']['corporate_pages']['Row']
export type CorporatePageInsert = Database['public']['Tables']['corporate_pages']['Insert']
export type CorporatePageUpdate = Database['public']['Tables']['corporate_pages']['Update']

export type CorporatePageTranslation = Database['public']['Tables']['corporate_page_translations']['Row']
export type CorporatePageTranslationInsert = Database['public']['Tables']['corporate_page_translations']['Insert']

export type CorporateSection = Database['public']['Tables']['corporate_sections']['Row']
export type CorporateSectionInsert = Database['public']['Tables']['corporate_sections']['Insert']
export type CorporateSectionUpdate = Database['public']['Tables']['corporate_sections']['Update']

export type CorporateSectionTranslation = Database['public']['Tables']['corporate_section_translations']['Row']
export type CorporateSectionTranslationInsert = Database['public']['Tables']['corporate_section_translations']['Insert']

export type CorporateBenefit = Database['public']['Tables']['corporate_benefits']['Row']
export type CorporateBenefitInsert = Database['public']['Tables']['corporate_benefits']['Insert']

export type CorporateBenefitTranslation = Database['public']['Tables']['corporate_benefit_translations']['Row']
export type CorporateBenefitTranslationInsert = Database['public']['Tables']['corporate_benefit_translations']['Insert']

// Section type enum
export type CorporateSectionType = Database['public']['Enums']['corporate_section_type']

export const CORPORATE_SECTION_TYPES: CorporateSectionType[] = [
  'hero',
  'client_logos',
  'solution_desc',
  'stations',
  'case_study',
  'gallery',
  'inquiry_form',
  'benefits',
  'features',
  'cta',
  'text_content',
  'faq',
]

export const SECTION_TYPE_LABELS: Record<CorporateSectionType, string> = {
  hero: 'Hero sekce',
  client_logos: 'Loga klientů',
  solution_desc: 'Popis řešení',
  stations: 'Nabíjecí stanice',
  case_study: 'Case study',
  gallery: 'Galerie',
  inquiry_form: 'Poptávkový formulář',
  benefits: 'Výhody',
  features: 'Funkce',
  cta: 'Výzva k akci',
  text_content: 'Textový obsah',
  faq: 'FAQ',
}

// Extended types with relations
export interface CorporatePageWithTranslations extends CorporatePage {
  translations: CorporatePageTranslation[]
}

export interface CorporateSectionWithTranslations extends CorporateSection {
  translations: CorporateSectionTranslation[]
}

export interface CorporateBenefitWithTranslations extends CorporateBenefit {
  translations: CorporateBenefitTranslation[]
}

export interface CorporatePageFull extends CorporatePage {
  translations: CorporatePageTranslation[]
  sections: CorporateSectionWithTranslations[]
}

// Form data types for admin
export interface CorporatePageFormData {
  slug: string
  page_type: 'landing' | 'subpage'
  hero_video_url?: string | null
  hero_image_url?: string | null
  is_active: boolean
  sort_order: number
  translations: Record<string, {
    title: string
    subtitle?: string
    hero_heading?: string
    hero_subheading?: string
    seo_title?: string
    seo_description?: string
  }>
}

export interface CorporateSectionFormData {
  page_id: string
  section_type: CorporateSectionType
  sort_order: number
  is_active: boolean
  config: Record<string, unknown>
  translations: Record<string, {
    heading?: string
    subheading?: string
    content?: string // TipTap JSON as string
  }>
}

export interface CorporateBenefitFormData {
  page_id?: string
  section_id?: string
  icon?: string
  color_accent?: string
  sort_order: number
  is_active: boolean
  translations: Record<string, {
    title: string
    description?: string
  }>
}
