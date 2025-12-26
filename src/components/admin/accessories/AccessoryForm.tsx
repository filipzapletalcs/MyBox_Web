'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon } from 'lucide-react'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'
import { TranslateButton } from '@/components/admin/ui/TranslateButton'
import { FeaturedImagePicker } from '@/components/admin/ui/FeaturedImagePicker'

// Form schema
const accessoryFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug může obsahovat pouze malá písmena, čísla a pomlčky'),
  image_url: z.string().optional().nullable(),
  link_url: z.string().optional().nullable(),
  is_active: z.boolean(),
  sort_order: z.number().int(),
  translations: z.object({
    cs: z.object({
      name: z.string().min(1, 'Název v češtině je povinný'),
      description: z.string().optional().nullable(),
    }),
    en: z.object({
      name: z.string().optional(),
      description: z.string().optional().nullable(),
    }),
    de: z.object({
      name: z.string().optional(),
      description: z.string().optional().nullable(),
    }),
  }),
  product_ids: z.array(z.string()).optional(),
})

type AccessoryFormData = z.infer<typeof accessoryFormSchema>

interface Accessory {
  id: string
  slug: string
  image_url: string | null
  link_url: string | null
  is_active: boolean | null
  sort_order: number | null
  accessory_translations: {
    locale: string
    name: string
    description: string | null
  }[]
  product_accessories?: {
    product_id: string
  }[]
}

interface Product {
  id: string
  slug: string
  product_translations: { locale: string; name: string }[]
}

interface AccessoryFormProps {
  accessory?: Accessory | null
  products: Product[]
  onSubmit: (data: AccessoryFormData) => Promise<void>
  isSubmitting?: boolean
}

export function AccessoryForm({
  accessory,
  products,
  onSubmit,
  isSubmitting = false,
}: AccessoryFormProps) {
  const router = useRouter()
  const isEditing = !!accessory
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')

  // Transform existing accessory data to form format
  const getDefaultValues = (): AccessoryFormData => {
    if (!accessory) {
      return {
        slug: '',
        image_url: '',
        link_url: '/poptavka',
        is_active: true,
        sort_order: 0,
        translations: {
          cs: { name: '', description: '' },
          en: { name: '', description: '' },
          de: { name: '', description: '' },
        },
        product_ids: [],
      }
    }

    const translations: AccessoryFormData['translations'] = {
      cs: { name: '', description: '' },
      en: { name: '', description: '' },
      de: { name: '', description: '' },
    }

    for (const t of accessory.accessory_translations || []) {
      const locale = t.locale as Locale
      if (translations[locale]) {
        translations[locale] = {
          name: t.name || '',
          description: t.description || '',
        }
      }
    }

    return {
      slug: accessory.slug,
      image_url: accessory.image_url || '',
      link_url: accessory.link_url || '/poptavka',
      is_active: accessory.is_active ?? true,
      sort_order: accessory.sort_order ?? 0,
      translations,
      product_ids: accessory.product_accessories?.map((pa) => pa.product_id) || [],
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AccessoryFormData>({
    resolver: zodResolver(accessoryFormSchema),
    defaultValues: getDefaultValues(),
  })

  const translations = watch('translations')
  const imageUrl = watch('image_url')
  const selectedProductIds = watch('product_ids') || []

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

  const handleFormSubmit = async (data: AccessoryFormData) => {
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

    await onSubmit(apiData as unknown as AccessoryFormData)
  }

  const toggleProduct = (productId: string) => {
    const current = selectedProductIds || []
    const newIds = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    setValue('product_ids', newIds)
  }

  const getProductName = (product: Product, locale: string = 'cs') => {
    const translation = product.product_translations?.find((t) => t.locale === locale)
    return translation?.name || product.slug
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
            onClick={() => router.push('/admin/products/accessories')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {isEditing ? 'Upravit příslušenství' : 'Nové příslušenství'}
            </h1>
            <p className="mt-1 text-text-secondary">
              {isEditing
                ? 'Upravte informace o příslušenství'
                : 'Vytvořte nové příslušenství'}
            </p>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Ukládám...' : 'Uložit'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Translations */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-text-primary">Překlady</h2>
              <div className="flex items-center gap-2">
                <TranslateButton
                  sourceLocale="cs"
                  targetLocale={activeLocale}
                  sourceText={translations?.cs?.name || ''}
                  onTranslated={(text) => setValue(`translations.${activeLocale}.name`, text)}
                  disabled={activeLocale === 'cs'}
                  label="Název"
                />
                <LocaleTabs
                  activeLocale={activeLocale}
                  onLocaleChange={setActiveLocale}
                  localeStatus={localeStatus}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Název <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register(`translations.${activeLocale}.name`)}
                  placeholder="např. Držák kabelu"
                  error={errors.translations?.[activeLocale]?.name?.message}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Popis
                </label>
                <Textarea
                  {...register(`translations.${activeLocale}.description`)}
                  placeholder="Krátký popis příslušenství"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Image */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Obrázek</h2>
            <FeaturedImagePicker
              value={imageUrl || ''}
              onChange={(url) => setValue('image_url', url || null)}
              hint="Obrázek příslušenství"
              bucket="product-images"
            />
          </Card>

          {/* Products Selection */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Přiřazené produkty</h2>
            <p className="mb-4 text-sm text-text-secondary">
              Vyberte produkty, ke kterým toto příslušenství patří.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {products.map((product) => (
                <label
                  key={product.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedProductIds.includes(product.id)
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-border-subtle hover:border-border-default'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    className="h-4 w-4 rounded border-border-default text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {getProductName(product)}
                  </span>
                </label>
              ))}
            </div>
            {products.length === 0 && (
              <p className="text-sm text-text-muted">Žádné produkty k dispozici</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Nastavení</h2>
            <div className="space-y-4">
              {/* Status */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 rounded border-border-default text-green-500 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-text-primary">Aktivní</span>
              </label>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Slug <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('slug')}
                  placeholder="drzak-kabelu"
                  error={errors.slug?.message}
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  Pořadí
                </label>
                <Input
                  type="number"
                  {...register('sort_order', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-primary">
                  <LinkIcon className="mr-1 inline h-4 w-4" />
                  Odkaz
                </label>
                <Input
                  {...register('link_url')}
                  placeholder="/poptavka"
                />
                <p className="mt-1 text-xs text-text-muted">
                  Cesta pro &quot;Zjistit více&quot; odkaz
                </p>
              </div>
            </div>
          </Card>

          {/* Preview */}
          {imageUrl && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-medium text-text-primary">Náhled</h2>
              <div className="aspect-square overflow-hidden rounded-lg bg-bg-tertiary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}
