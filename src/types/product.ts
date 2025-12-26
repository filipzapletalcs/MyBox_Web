// Product presentation types

// Gallery
export interface ProductImage {
  id: string
  src: string
  alt: string
}

// Color variants (MyBox only)
export interface ColorVariant {
  id: 'black' | 'white'
  label: string
  image: string
}

// Technical specifications
export interface SpecificationItem {
  key: string
  label: string
  value: string
  unit?: string
  highlight?: boolean
}

export interface SpecificationCategory {
  id: string
  icon: 'power' | 'dimensions' | 'connectivity' | 'certifications' | 'security'
  title: string
  specs: SpecificationItem[]
}

// Feature point for ProductFeatureShowcase
export interface FeaturePoint {
  id: string
  icon: 'power' | 'protocol' | 'connectivity' | 'protection' | 'meter' | 'temperature'
  label: string
  value: string
  position: 'left' | 'right'
}

// Content section
export interface ContentSectionData {
  title: string
  subtitle?: string
  content: string
  image: {
    src: string
    alt: string
  }
}

// Accessory item
export interface AccessoryItem {
  id: string
  name: string
  description: string
  image: string
  link?: string
}

// Manufacturer info for structured data
export interface ManufacturerInfo {
  name: string
  url: string
}

// Full product data
export interface FullProductData {
  id: string
  slug: string
  name: string
  type: 'ac' | 'dc'
  brand: 'mybox' | 'alpitronic'
  power: string
  tagline: string
  description: string

  // SEO & Structured Data
  sku?: string                    // Product identifier (product family)
  category?: string               // Product category for schema.org
  manufacturer?: ManufacturerInfo // Manufacturer details
  countryOfOrigin?: string        // ISO country code (CZ, DE, etc.)

  // Hero
  heroImage: string
  heroVideo?: string

  // Gallery
  gallery: ProductImage[]

  // Color variants (MyBox only)
  colorVariants?: {
    black: ColorVariant
    white: ColorVariant
  }

  // Front view for feature showcase
  frontImage?: string

  // Features for showcase
  featurePoints?: FeaturePoint[]

  // Technical specifications
  specifications: SpecificationCategory[]

  // SEO content sections
  contentSections?: ContentSectionData[]

  // Accessories
  accessories?: AccessoryItem[]

  // Datasheet
  datasheet?: {
    url: string
    fileName: string
  }

  // Features badges
  features: string[]

  // Related products
  relatedProductSlugs: string[]
}

// Component Props
export interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
  className?: string
}

export interface ColorVariantSliderProps {
  blackVariant: ColorVariant
  whiteVariant: ColorVariant
  productName: string
  className?: string
}

export interface TechnicalSpecificationsProps {
  specifications: SpecificationCategory[]
  className?: string
}

export interface ContentSectionProps {
  title: string
  subtitle?: string
  content: string | React.ReactNode
  image: {
    src: string
    alt: string
  }
  reverse?: boolean
  className?: string
}

export interface ProductFeatureShowcaseProps {
  productImage: string
  productAlt: string
  features: FeaturePoint[]
  className?: string
}

export interface DownloadButtonProps {
  href: string
  label?: string
  fileName?: string
  className?: string
}
