import { createClient } from '@/lib/supabase/server'
import type {
  FullProductData,
  SpecificationCategory,
  SpecificationItem,
  FeaturePoint,
  ProductImage,
  ColorVariant,
  ContentSectionData,
} from '@/types/product'

type Locale = 'cs' | 'en' | 'de'

/**
 * Fetch product by slug and transform to FullProductData
 */
export async function getProductBySlug(
  slug: string,
  locale: Locale = 'cs'
): Promise<FullProductData | null> {
  const supabase = await createClient()

  // Fetch product with all related data
  const { data: product, error } = await supabase
    .from('products')
    .select(
      `
      *,
      product_translations(*),
      product_specifications(*),
      product_images(*),
      product_to_features(feature_id, product_features(id, slug, icon, product_feature_translations(*))),
      product_feature_points(
        id, icon, position, sort_order,
        product_feature_point_translations(*)
      ),
      product_color_variants(
        id, color_key, image_url, sort_order,
        product_color_variant_translations(*)
      ),
      product_content_sections(
        id, image_url, image_alt, sort_order,
        product_content_section_translations(*)
      )
    `
    )
    .eq('slug', slug)
    .single()

  if (error || !product) {
    console.error('Error fetching product:', error)
    return null
  }

  return transformProductData(product, locale)
}

/**
 * Transform DB product data to FullProductData interface
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformProductData(dbProduct: any, locale: Locale): FullProductData {
  // Get translation for current locale
  const translation =
    dbProduct.product_translations?.find(
      (t: { locale: string }) => t.locale === locale
    ) || dbProduct.product_translations?.[0]

  // Transform specifications
  const specifications = transformSpecifications(
    dbProduct.product_specifications || [],
    locale
  )

  // Transform feature points
  const featurePoints = transformFeaturePoints(
    dbProduct.product_feature_points || [],
    locale
  )

  // Transform gallery images
  const gallery = transformGalleryImages(dbProduct.product_images || [])

  // Transform color variants
  const colorVariants = transformColorVariants(
    dbProduct.product_color_variants || [],
    locale
  )

  // Transform content sections
  const contentSections = transformContentSections(
    dbProduct.product_content_sections || [],
    locale
  )

  // Transform features (badges)
  const features = transformFeatures(dbProduct.product_to_features || [], locale)

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: translation?.name || '',
    type: dbProduct.type === 'ac_mybox' ? 'ac' : 'dc',
    brand: dbProduct.type === 'ac_mybox' ? 'mybox' : 'alpitronic',
    power: dbProduct.power || '',
    tagline: translation?.tagline || '',
    description: translation?.description || '',

    // SEO & Structured Data
    sku: dbProduct.sku || undefined,
    category: dbProduct.product_category || undefined,
    manufacturer: dbProduct.manufacturer_name
      ? {
          name: dbProduct.manufacturer_name,
          url: dbProduct.manufacturer_url || '',
        }
      : undefined,
    countryOfOrigin: dbProduct.country_of_origin || 'CZ',

    // Hero
    heroImage: dbProduct.hero_image || '',
    heroVideo: dbProduct.hero_video || undefined,

    // Gallery
    gallery,

    // Color variants
    colorVariants: colorVariants || undefined,

    // Front image
    frontImage: dbProduct.front_image || undefined,

    // Feature points
    featurePoints: featurePoints.length > 0 ? featurePoints : undefined,

    // Specifications
    specifications,

    // Content sections
    contentSections: contentSections.length > 0 ? contentSections : undefined,

    // Datasheet
    datasheet: dbProduct.datasheet_url
      ? {
          url: dbProduct.datasheet_url,
          fileName: dbProduct.datasheet_filename || 'datasheet.pdf',
        }
      : undefined,

    // Features (badges)
    features,

    // Related products (TODO: implement if needed)
    relatedProductSlugs: [],
  }
}

/**
 * Transform specifications grouped by category
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformSpecifications(dbSpecs: any[], locale: Locale): SpecificationCategory[] {
  // Group by group_name
  const grouped = dbSpecs.reduce(
    (acc, spec) => {
      const groupName = spec.group_name || 'other'
      if (!acc[groupName]) {
        acc[groupName] = []
      }
      acc[groupName].push(spec)
      return acc
    },
    {} as Record<string, typeof dbSpecs>
  )

  // Map groups to categories
  const categoryMap: Record<
    string,
    { icon: SpecificationCategory['icon']; title: string }
  > = {
    power: { icon: 'power', title: 'Výkon' },
    dimensions: { icon: 'dimensions', title: 'Rozměry a konstrukce' },
    connectivity: { icon: 'connectivity', title: 'Konektivita' },
    security: { icon: 'security', title: 'Bezpečnost' },
    certifications: { icon: 'certifications', title: 'Certifikace' },
    other: { icon: 'power', title: 'Ostatní' },
  }

  return (Object.entries(grouped) as [string, typeof dbSpecs][])
    .map(([groupName, specs]) => {
      const category = categoryMap[groupName] || categoryMap.other
      const items: SpecificationItem[] = specs
        .sort(
          (a: { sort_order: number }, b: { sort_order: number }) =>
            (a.sort_order || 0) - (b.sort_order || 0)
        )
        .map(
          (spec: {
            spec_key: string
            value: string
            unit?: string
            label_cs?: string
            label_en?: string
            label_de?: string
          }) => ({
            key: spec.spec_key,
            label: getLocalizedLabel(spec, locale),
            value: spec.value,
            unit: spec.unit || undefined,
            highlight: false,
          })
        )

      return {
        id: groupName,
        icon: category.icon,
        title: category.title,
        specs: items,
      }
    })
    .filter((cat) => cat.specs.length > 0)
}

/**
 * Transform feature points
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformFeaturePoints(dbPoints: any[], locale: Locale): FeaturePoint[] {
  return dbPoints
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((point) => {
      const translation =
        point.product_feature_point_translations?.find(
          (t: { locale: string }) => t.locale === locale
        ) || point.product_feature_point_translations?.[0]

      return {
        id: point.id,
        icon: point.icon as FeaturePoint['icon'],
        label: translation?.label || '',
        value: translation?.value || '',
        position: point.position as 'left' | 'right',
      }
    })
}

/**
 * Transform gallery images
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformGalleryImages(dbImages: any[]): ProductImage[] {
  return dbImages
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((img) => ({
      id: img.id,
      src: img.url,
      alt: img.alt || '',
    }))
}

/**
 * Transform color variants
 */
function transformColorVariants(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dbVariants: any[],
  locale: Locale
): { black: ColorVariant; white: ColorVariant } | null {
  if (dbVariants.length < 2) return null

  const blackVariant = dbVariants.find((v) => v.color_key === 'black')
  const whiteVariant = dbVariants.find((v) => v.color_key === 'white')

  if (!blackVariant || !whiteVariant) return null

  const getLabel = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variant: any
  ) => {
    const translation =
      variant.product_color_variant_translations?.find(
        (t: { locale: string }) => t.locale === locale
      ) || variant.product_color_variant_translations?.[0]
    return translation?.label || variant.color_key
  }

  return {
    black: {
      id: 'black',
      label: getLabel(blackVariant),
      image: blackVariant.image_url,
    },
    white: {
      id: 'white',
      label: getLabel(whiteVariant),
      image: whiteVariant.image_url,
    },
  }
}

/**
 * Transform content sections
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformContentSections(dbSections: any[], locale: Locale): ContentSectionData[] {
  return dbSections
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((section) => {
      const translation =
        section.product_content_section_translations?.find(
          (t: { locale: string }) => t.locale === locale
        ) || section.product_content_section_translations?.[0]

      return {
        title: translation?.title || '',
        subtitle: translation?.subtitle || undefined,
        content: translation?.content || '',
        image: {
          src: section.image_url || '',
          alt: section.image_alt || '',
        },
      }
    })
}

/**
 * Transform features (badges)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformFeatures(dbFeatures: any[], _locale: Locale): string[] {
  return dbFeatures
    .map((f) => f.product_features?.slug)
    .filter(Boolean) as string[]
}

/**
 * Get localized label from spec
 */
function getLocalizedLabel(
  spec: {
    label_cs?: string
    label_en?: string
    label_de?: string
    spec_key: string
  },
  locale: Locale
): string {
  switch (locale) {
    case 'en':
      return spec.label_en || spec.label_cs || spec.spec_key
    case 'de':
      return spec.label_de || spec.label_cs || spec.spec_key
    default:
      return spec.label_cs || spec.spec_key
  }
}
