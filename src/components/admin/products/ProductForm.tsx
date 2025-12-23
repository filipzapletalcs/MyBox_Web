'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react'
import { Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Card } from '@/components/ui'
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'
import { TranslateButton } from '@/components/admin/ui/TranslateButton'
import { type Locale as ConfigLocale } from '@/config/locales'

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
        translations: {
          cs: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
          en: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
          de: { name: '', tagline: '', description: '', seo_title: '', seo_description: '' },
        },
        specifications: [],
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

    return {
      slug: product.slug,
      type: product.type,
      sku: product.sku || '',
      is_active: product.is_active ?? true,
      is_featured: product.is_featured ?? false,
      sort_order: product.sort_order ?? 0,
      translations,
      specifications: (product.specifications || []).map(spec => ({
        ...spec,
        sort_order: spec.sort_order ?? 0,
      })),
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content - 2 columns */}
        <div className="space-y-6 lg:col-span-2">
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

          {/* Specifications */}
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
