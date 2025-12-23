'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft, Plus, Trash2, GripVertical, Image, Layers, Settings, FileText, Palette, Zap, FolderOpen } from 'lucide-react'
import { Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Card } from '@/components/ui'
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'
import { TranslateButton } from '@/components/admin/ui/TranslateButton'
import { ProductMediaSection } from './ProductMediaSection'
import { ProductGalleryManager } from './ProductGalleryManager'
import { ProductColorVariantsManager } from './ProductColorVariantsManager'
import { ProductFeaturePointsManager } from './ProductFeaturePointsManager'
import { ProductContentSectionsManager } from './ProductContentSectionsManager'
import { ProductDocumentSelector } from './ProductDocumentSelector'
import { type Locale as ConfigLocale } from '@/config/locales'

// Tabs configuration
const TABS = [
  { id: 'basic', label: 'Základní', icon: Settings },
  { id: 'media', label: 'Média', icon: Image },
  { id: 'gallery', label: 'Galerie', icon: Layers },
  { id: 'specs', label: 'Specifikace', icon: FileText },
  { id: 'variants', label: 'Varianty', icon: Palette },
  { id: 'features', label: 'Features', icon: Zap },
  { id: 'content', label: 'Content', icon: FileText },
  { id: 'documents', label: 'Dokumenty', icon: FolderOpen },
] as const

type TabId = (typeof TABS)[number]['id']

// Form schema
const productFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug může obsahovat pouze malá písmena, čísla a pomlčky'),
  type: z.enum(['ac_mybox', 'dc_alpitronic']),
  sku: z.string().max(50).optional().nullable(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  sort_order: z.number().int(),

  // Extended product fields
  hero_image: z.string().optional().nullable(),
  hero_video: z.string().optional().nullable(),
  front_image: z.string().optional().nullable(),
  datasheet_url: z.string().optional().nullable(),
  datasheet_filename: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  power: z.string().optional().nullable(),
  manufacturer_name: z.string().optional().nullable(),
  manufacturer_url: z.string().optional().nullable(),
  country_of_origin: z.string().max(2).optional().nullable(),
  product_category: z.string().optional().nullable(),

  translations: z.object({
    cs: z.object({
      name: z.string().min(1, 'Název v češtině je povinný'),
      tagline: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      seo_title: z.string().max(60).optional().nullable(),
      seo_description: z.string().max(160).optional().nullable(),
    }),
    en: z.object({
      name: z.string().optional(),
      tagline: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      seo_title: z.string().max(60).optional().nullable(),
      seo_description: z.string().max(160).optional().nullable(),
    }),
    de: z.object({
      name: z.string().optional(),
      tagline: z.string().optional().nullable(),
      description: z.string().optional().nullable(),
      seo_title: z.string().max(60).optional().nullable(),
      seo_description: z.string().max(160).optional().nullable(),
    }),
  }),
  specifications: z.array(z.object({
    spec_key: z.string().min(1, 'Klíč je povinný'),
    value: z.string().min(1, 'Hodnota je povinná'),
    unit: z.string().optional().nullable(),
    group_name: z.string().optional().nullable(),
    sort_order: z.number().int(),
    label_cs: z.string().optional().nullable(),
    label_en: z.string().optional().nullable(),
    label_de: z.string().optional().nullable(),
  })).optional(),

  // Extension fields
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional().nullable(),
    is_primary: z.boolean().optional(),
    sort_order: z.number().int().optional(),
  })).optional(),

  feature_points: z.array(z.object({
    icon: z.enum(['power', 'protocol', 'connectivity', 'protection', 'meter', 'temperature']),
    position: z.enum(['left', 'right']),
    sort_order: z.number().int().optional(),
    translations: z.array(z.object({
      locale: z.enum(['cs', 'en', 'de']),
      label: z.string(),
      value: z.string(),
    })),
  })).optional(),

  color_variants: z.array(z.object({
    color_key: z.string(),
    image_url: z.string(),
    sort_order: z.number().int().optional(),
    translations: z.array(z.object({
      locale: z.enum(['cs', 'en', 'de']),
      label: z.string(),
    })),
  })).optional(),

  content_sections: z.array(z.object({
    image_url: z.string().optional().nullable(),
    image_alt: z.string().optional().nullable(),
    sort_order: z.number().int().optional(),
    translations: z.array(z.object({
      locale: z.enum(['cs', 'en', 'de']),
      title: z.string(),
      subtitle: z.string().optional().nullable(),
      content: z.string(),
    })),
  })).optional(),

  documents: z.array(z.object({
    document_id: z.string().uuid(),
    sort_order: z.number().int().optional(),
  })).optional(),
})

type ProductFormData = z.infer<typeof productFormSchema>

interface Product {
  id: string
  slug: string
  type: 'ac_mybox' | 'dc_alpitronic'
  sku: string | null
  is_active: boolean | null
  is_featured: boolean | null
  sort_order: number | null
  hero_image?: string | null
  hero_video?: string | null
  front_image?: string | null
  datasheet_url?: string | null
  datasheet_filename?: string | null
  brand?: string | null
  power?: string | null
  manufacturer_name?: string | null
  manufacturer_url?: string | null
  country_of_origin?: string | null
  product_category?: string | null
  translations: {
    locale: string
    name: string
    tagline: string | null
    description: string | null
    seo_title: string | null
    seo_description: string | null
  }[]
  specifications?: {
    spec_key: string
    value: string
    unit: string | null
    group_name: string | null
    sort_order: number | null
    label_cs: string | null
    label_en: string | null
    label_de: string | null
  }[]
  product_images?: {
    url: string
    alt: string | null
    is_primary: boolean
    sort_order: number
  }[]
  product_feature_points?: {
    id: string
    icon: string
    position: string
    sort_order: number
    product_feature_point_translations: {
      locale: string
      label: string
      value: string
    }[]
  }[]
  product_color_variants?: {
    id: string
    color_key: string
    image_url: string
    sort_order: number
    product_color_variant_translations: {
      locale: string
      label: string
    }[]
  }[]
  product_content_sections?: {
    id: string
    image_url: string | null
    image_alt: string | null
    sort_order: number
    product_content_section_translations: {
      locale: string
      title: string
      subtitle: string | null
      content: string
    }[]
  }[]
  product_documents?: {
    document_id: string
    sort_order: number
  }[]
}

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => Promise<void>
  isSubmitting?: boolean
}

export function ProductForm({
  product,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')
  const [activeTab, setActiveTab] = useState<TabId>('basic')
  const isEditing = !!product

  // Transform product data to form format
  const getDefaultValues = (): ProductFormData => {
    if (!product) {
      return {
        slug: '',
        type: 'ac_mybox',
        sku: '',
        is_active: true,
        is_featured: false,
        sort_order: 0,
        hero_image: '',
        hero_video: '',
        front_image: '',
        datasheet_url: '',
        datasheet_filename: '',
        brand: '',
        power: '',
        manufacturer_name: '',
        manufacturer_url: '',
        country_of_origin: 'CZ',
        product_category: '',
        translations: {
          cs: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
          en: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
          de: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
        },
        specifications: [],
        images: [],
        feature_points: [],
        color_variants: [],
        content_sections: [],
        documents: [],
      }
    }

    const translations: ProductFormData['translations'] = {
      cs: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
      en: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
      de: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
    }

    product.translations.forEach((t) => {
      const locale = t.locale as Locale
      if (translations[locale]) {
        translations[locale] = {
          name: t.name || '',
          tagline: t.tagline || '',
          description: t.description || '',
          seo_title: t.seo_title || '',
          seo_description: t.seo_description || '',
        }
      }
    })

    // Transform images
    const images = (product.product_images || []).map((img) => ({
      url: img.url,
      alt: img.alt,
      is_primary: img.is_primary,
      sort_order: img.sort_order,
    }))

    // Transform feature points
    type FeaturePointIcon = 'power' | 'protocol' | 'connectivity' | 'protection' | 'meter' | 'temperature'
    const feature_points = (product.product_feature_points || []).map((fp) => ({
      icon: fp.icon as FeaturePointIcon,
      position: fp.position as 'left' | 'right',
      sort_order: fp.sort_order,
      translations: fp.product_feature_point_translations.map((t) => ({
        locale: t.locale as 'cs' | 'en' | 'de',
        label: t.label,
        value: t.value,
      })),
    }))

    // Transform color variants
    const color_variants = (product.product_color_variants || []).map((cv) => ({
      color_key: cv.color_key,
      image_url: cv.image_url,
      sort_order: cv.sort_order,
      translations: cv.product_color_variant_translations.map((t) => ({
        locale: t.locale as 'cs' | 'en' | 'de',
        label: t.label,
      })),
    }))

    // Transform content sections
    const content_sections = (product.product_content_sections || []).map((cs) => ({
      image_url: cs.image_url,
      image_alt: cs.image_alt,
      sort_order: cs.sort_order,
      translations: cs.product_content_section_translations.map((t) => ({
        locale: t.locale as 'cs' | 'en' | 'de',
        title: t.title,
        subtitle: t.subtitle,
        content: t.content,
      })),
    }))

    // Transform documents
    const documents = (product.product_documents || []).map((pd) => ({
      document_id: pd.document_id,
      sort_order: pd.sort_order,
    }))

    return {
      slug: product.slug,
      type: product.type,
      sku: product.sku || '',
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      sort_order: product.sort_order ?? 0,
      hero_image: product.hero_image || '',
      hero_video: product.hero_video || '',
      front_image: product.front_image || '',
      datasheet_url: product.datasheet_url || '',
      datasheet_filename: product.datasheet_filename || '',
      brand: product.brand || '',
      power: product.power || '',
      manufacturer_name: product.manufacturer_name || '',
      manufacturer_url: product.manufacturer_url || '',
      country_of_origin: product.country_of_origin || 'CZ',
      product_category: product.product_category || '',
      translations,
      specifications: (product.specifications || []).map(spec => ({
        ...spec,
        sort_order: spec.sort_order ?? 0,
      })),
      images,
      feature_points,
      color_variants,
      content_sections,
      documents,
    }
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultValues(),
  })

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control,
    name: 'specifications',
  })

  const translations = watch('translations')

  // Calculate locale status
  const getLocaleStatus = (locale: Locale): LocaleStatus => {
    const t = translations?.[locale]
    if (!t || !t.name) return 'empty'
    return 'complete'
  }

  const localeStatus: Record<Locale, LocaleStatus> = {
    cs: getLocaleStatus('cs'),
    en: getLocaleStatus('en'),
    de: getLocaleStatus('de'),
  }

  // Auto-generate slug from Czech name
  const csName = watch('translations.cs.name')
  useEffect(() => {
    if (!isEditing && csName && !watch('slug')) {
      const slug = csName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setValue('slug', slug)
    }
  }, [csName, isEditing, setValue, watch])

  const addSpecification = () => {
    appendSpec({
      spec_key: '',
      value: '',
      unit: '',
      group_name: '',
      sort_order: specFields.length,
      label_cs: '',
      label_en: '',
      label_de: '',
    })
  }

  // Transform form data to API format before submit
  const handleFormSubmit = async (data: ProductFormData) => {
    // Transform translations to array format for API
    const translationsArray = Object.entries(data.translations)
      .filter(([, t]) => t.name)
      .map(([locale, t]) => ({
        locale,
        ...t,
      }))

    const apiData = {
      ...data,
      translations: translationsArray,
    }

    await onSubmit(apiData as unknown as ProductFormData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/products')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {isEditing ? 'Upravit produkt' : 'Nový produkt'}
            </h1>
            <p className="mt-1 text-text-secondary">
              {isEditing
                ? 'Upravte informace o produktu'
                : 'Vytvořte nový produkt'}
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Ukládám...' : 'Uložit'}
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border-subtle">
        <nav className="-mb-px flex space-x-1 overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-text-muted hover:border-border-default hover:text-text-secondary'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Main content - 3 columns */}
        <div className="space-y-6 lg:col-span-3">
          {/* Basic Tab */}
          {activeTab === 'basic' && (
            <>
              {/* Locale tabs + Translate button */}
              <div className="flex items-center justify-between gap-4">
                <LocaleTabs
                  activeLocale={activeLocale}
                  onLocaleChange={setActiveLocale}
                  localeStatus={localeStatus}
                />
                <TranslateButton
                  sourceTexts={{
                    name: watch('translations.cs.name') || '',
                    tagline: watch('translations.cs.tagline') || '',
                    description: watch('translations.cs.description') || '',
                    seo_title: watch('translations.cs.seo_title') || '',
                    seo_description: watch('translations.cs.seo_description') || '',
                  }}
                  onTranslated={(locale: ConfigLocale, field: string, value: string) => {
                    setValue(`translations.${locale}.${field}` as keyof ProductFormData, value, { shouldDirty: true })
                  }}
                  disabled={!watch('translations.cs.name')}
                  context={`EV charging station product. Product name: "${watch('translations.cs.name') || ''}" Tagline: "${watch('translations.cs.tagline') || ''}"`}
                  tipTapFields={[]}
                />
              </div>

              {/* Name */}
              <Card className="p-6">
                <Controller
                  key={`name-${activeLocale}`}
                  name={`translations.${activeLocale}.name`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ''}
                      label="Název produktu"
                      placeholder="MyBox Profi"
                      error={
                        activeLocale === 'cs'
                          ? errors.translations?.cs?.name?.message
                          : undefined
                      }
                    />
                  )}
                />
              </Card>

              {/* Tagline */}
              <Card className="p-6">
                <Controller
                  key={`tagline-${activeLocale}`}
                  name={`translations.${activeLocale}.tagline`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value || ''}
                      label="Tagline"
                      placeholder="Profesionální wallbox pro 2 elektromobily"
                      hint="Krátký popis produktu (max 200 znaků)"
                    />
                  )}
                />
              </Card>

              {/* Description */}
              <Card className="p-6">
                <Controller
                  key={`description-${activeLocale}`}
                  name={`translations.${activeLocale}.description`}
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      label="Popis"
                      placeholder="Detailní popis produktu..."
                      hint="Kompletní popis produktu pro detail stránku"
                    />
                  )}
                />
              </Card>

              {/* SEO */}
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-medium text-text-primary">SEO</h3>
                <div className="space-y-4">
                  <Controller
                    key={`seo_title-${activeLocale}`}
                    name={`translations.${activeLocale}.seo_title`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ''}
                        label="SEO titulek"
                        placeholder="Titulek pro vyhledávače"
                        hint="Max 60 znaků"
                      />
                    )}
                  />
                  <Controller
                    key={`seo_description-${activeLocale}`}
                    name={`translations.${activeLocale}.seo_description`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        label="SEO popisek"
                        placeholder="Popis pro vyhledávače"
                        hint="Max 160 znaků"
                        maxLength={160}
                        showCount
                      />
                    )}
                  />
                </div>
              </Card>
            </>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <ProductMediaSection control={control} />
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <ProductGalleryManager control={control} />
          )}

          {/* Specifications Tab */}
          {activeTab === 'specs' && (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-text-primary">Specifikace</h3>
                <Button type="button" variant="secondary" size="sm" onClick={addSpecification}>
                  <Plus className="mr-2 h-4 w-4" />
                  Přidat specifikaci
                </Button>
              </div>

              {specFields.length === 0 ? (
                <p className="text-center text-text-muted py-8">
                  Zatím žádné specifikace. Klikněte na "Přidat specifikaci".
                </p>
              ) : (
                <div className="space-y-4">
                  {specFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-start gap-3 rounded-lg border border-border-subtle bg-bg-tertiary p-4"
                    >
                      <GripVertical className="mt-2 h-5 w-5 cursor-move text-text-muted" />
                      <div className="flex-1 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Input
                          {...register(`specifications.${index}.spec_key`)}
                          placeholder="Klíč (např. power)"
                          size="sm"
                        />
                        <Input
                          {...register(`specifications.${index}.value`)}
                          placeholder="Hodnota"
                          size="sm"
                        />
                        <Input
                          {...register(`specifications.${index}.unit`)}
                          placeholder="Jednotka"
                          size="sm"
                        />
                        <Input
                          {...register(`specifications.${index}.group_name`)}
                          placeholder="Skupina"
                          size="sm"
                        />
                        <Input
                          {...register(`specifications.${index}.label_cs`)}
                          placeholder="Label CS"
                          size="sm"
                        />
                        <Input
                          {...register(`specifications.${index}.label_en`)}
                          placeholder="Label EN"
                          size="sm"
                        />
                        <Input
                          {...register(`specifications.${index}.label_de`)}
                          placeholder="Label DE"
                          size="sm"
                        />
                        <Input
                          {...register(`specifications.${index}.sort_order`, { valueAsNumber: true })}
                          type="number"
                          placeholder="Pořadí"
                          size="sm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => removeSpec(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <ProductColorVariantsManager control={control} />
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <ProductFeaturePointsManager control={control} />
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <ProductContentSectionsManager control={control} />
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <ProductDocumentSelector control={control} />
          )}
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-medium text-text-primary">Stav</h3>
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 rounded border-border-default bg-bg-tertiary text-green-500 focus:ring-green-500/20"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">Aktivní</span>
                  <p className="text-xs text-text-muted">Produkt bude viditelný na webu</p>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="h-4 w-4 rounded border-border-default bg-bg-tertiary text-green-500 focus:ring-green-500/20"
                />
                <div>
                  <span className="text-sm font-medium text-text-primary">Doporučený</span>
                  <p className="text-xs text-text-muted">Zobrazit na hlavní stránce</p>
                </div>
              </label>
            </div>
          </Card>

          {/* Slug & SKU */}
          <Card className="p-6">
            <div className="space-y-4">
              <Input
                {...register('slug')}
                label="URL slug"
                placeholder="mybox-profi"
                error={errors.slug?.message}
                hint="Unikátní identifikátor v URL"
              />
              <Input
                {...register('sku')}
                label="SKU"
                placeholder="MYBOX-PROFI"
                hint="Kód produktu"
              />
            </div>
          </Card>

          {/* Type */}
          <Card className="p-6">
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Typ produktu
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte typ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ac_mybox">AC MyBox</SelectItem>
                    <SelectItem value="dc_alpitronic">DC Alpitronic</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Card>

          {/* Sort order */}
          <Card className="p-6">
            <Input
              {...register('sort_order', { valueAsNumber: true })}
              type="number"
              label="Pořadí"
              placeholder="0"
              hint="Nižší číslo = vyšší pozice"
            />
          </Card>
        </div>
      </div>
    </form>
  )
}
