import type { Database } from './database'

// Database types
export type Accessory = Database['public']['Tables']['accessories']['Row']
export type AccessoryInsert = Database['public']['Tables']['accessories']['Insert']
export type AccessoryUpdate = Database['public']['Tables']['accessories']['Update']

export type AccessoryTranslation = Database['public']['Tables']['accessory_translations']['Row']
export type AccessoryTranslationInsert = Database['public']['Tables']['accessory_translations']['Insert']

export type ProductAccessory = Database['public']['Tables']['product_accessories']['Row']
export type ProductAccessoryInsert = Database['public']['Tables']['product_accessories']['Insert']

// Extended types with relations
export interface AccessoryWithTranslations extends Accessory {
  accessory_translations: AccessoryTranslation[]
}

export interface AccessoryWithProducts extends AccessoryWithTranslations {
  product_accessories: {
    product_id: string
    sort_order: number | null
    products: {
      id: string
      slug: string
      product_translations: { locale: string; name: string }[]
    }
  }[]
}

// Form data types for admin
export interface AccessoryFormData {
  slug: string
  image_url?: string | null
  link_url?: string | null
  is_active: boolean
  sort_order: number
  translations: Record<string, {
    name: string
    description?: string
  }>
  product_ids?: string[]
}

// List display type
export interface AccessoryListItem {
  id: string
  slug: string
  image_url: string | null
  link_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string | null
  translations: {
    locale: string
    name: string
    description: string | null
  }[]
  products?: {
    id: string
    slug: string
    name: string
  }[]
}
