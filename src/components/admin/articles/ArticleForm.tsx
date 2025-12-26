'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Save, Send, ArrowLeft } from 'lucide-react'
import { Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Card } from '@/components/ui'
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'
import { TranslateButton } from '@/components/admin/ui/TranslateButton'
import { FeaturedImagePicker } from '@/components/admin/ui/FeaturedImagePicker'
import { ArticleEditor } from './ArticleEditor'
import { type Locale as ConfigLocale } from '@/config/locales'

// Form schema
const articleFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug může obsahovat pouze malá písmena, čísla a pomlčky'),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']),
  category_id: z.string().nullable().optional(),
  featured_image_url: z.string().url().optional().nullable().or(z.literal('')),
  is_featured: z.boolean(),
  translations: z.object({
    cs: z.object({
      title: z.string().min(1, 'Český titulek je povinný'),
      excerpt: z.string().optional(),
      content: z.string(),
      seo_title: z.string().optional(),
      seo_description: z.string().optional(),
    }),
    en: z.object({
      title: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      seo_title: z.string().optional(),
      seo_description: z.string().optional(),
    }),
    de: z.object({
      title: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      seo_title: z.string().optional(),
      seo_description: z.string().optional(),
    }),
  }),
})

type ArticleFormData = z.infer<typeof articleFormSchema>

interface Category {
  id: string
  slug: string
  translations: { locale: string; name: string }[]
}

interface ArticleFormProps {
  article?: {
    id: string
    slug: string
    status: 'draft' | 'scheduled' | 'published' | 'archived'
    category_id: string | null
    featured_image_url: string | null
    is_featured: boolean
    translations: {
      locale: string
      title: string
      excerpt: string | null
      content: unknown
      seo_title: string | null
      seo_description: string | null
    }[]
  }
  categories?: Category[]
  onSubmit: (data: ArticleFormData, publish?: boolean) => Promise<void>
  isSubmitting?: boolean
}

const defaultTranslation = {
  title: '',
  excerpt: '',
  content: '',
  seo_title: '',
  seo_description: '',
}

export function ArticleForm({
  article,
  categories = [],
  onSubmit,
  isSubmitting = false,
}: ArticleFormProps) {
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')
  const isEditing = !!article

  // Transform article data to form format
  const getDefaultValues = (): ArticleFormData => {
    if (!article) {
      return {
        slug: '',
        status: 'draft',
        category_id: null,
        featured_image_url: '',
        is_featured: false,
        translations: {
          cs: { ...defaultTranslation },
          en: { ...defaultTranslation },
          de: { ...defaultTranslation },
        },
      }
    }

    const translations = {
      cs: { ...defaultTranslation },
      en: { ...defaultTranslation },
      de: { ...defaultTranslation },
    }

    article.translations.forEach((t) => {
      const locale = t.locale as Locale
      if (translations[locale]) {
        translations[locale] = {
          title: t.title || '',
          excerpt: t.excerpt || '',
          content: t.content ? JSON.stringify(t.content) : '',
          seo_title: t.seo_title || '',
          seo_description: t.seo_description || '',
        }
      }
    })

    return {
      slug: article.slug,
      status: article.status,
      category_id: article.category_id,
      featured_image_url: article.featured_image_url || '',
      is_featured: article.is_featured,
      translations,
    }
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: getDefaultValues(),
  })

  const translations = watch('translations')

  // Calculate locale status
  const getLocaleStatus = (locale: Locale): LocaleStatus => {
    const t = translations?.[locale]
    if (!t || (!t.title && !t.content)) return 'empty'
    if (t.title && t.content) return 'complete'
    return 'partial'
  }

  const localeStatus: Record<Locale, LocaleStatus> = {
    cs: getLocaleStatus('cs'),
    en: getLocaleStatus('en'),
    de: getLocaleStatus('de'),
  }

  // Auto-generate slug from Czech title
  const csTitle = watch('translations.cs.title')
  useEffect(() => {
    if (!isEditing && csTitle && !watch('slug')) {
      const slug = csTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [csTitle, isEditing, setValue, watch])

  const handleFormSubmit = async (data: ArticleFormData, publish = false) => {
    if (publish) {
      data.status = 'published'
    }
    await onSubmit(data, publish)
  }

  const onValidationError = (errors: FieldErrors<ArticleFormData>) => {
    // Collect all error messages - deep traverse errors object
    const messages: string[] = []

    const flattenErrors = (obj: any, prefix = ''): void => {
      if (!obj) return
      for (const key of Object.keys(obj)) {
        const value = obj[key]
        const path = prefix ? `${prefix}.${key}` : key
        if (value?.message) {
          messages.push(`${path}: ${value.message}`)
        } else if (typeof value === 'object') {
          flattenErrors(value, path)
        }
      }
    }

    flattenErrors(errors)

    if (messages.length > 0) {
      toast.error('Validační chyby', {
        description: messages.join('\n'),
      })
    } else {
      // If no specific error messages, try to get raw zod error
      const formValues = getValues()
      const result = articleFormSchema.safeParse(formValues)
      if (!result.success) {
        const zodMessages = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`)
        toast.error('Validační chyby', {
          description: zodMessages.join('\n'),
        })
      } else {
        toast.error('Formulář obsahuje chyby')
      }
    }
  }

  const getCategoryName = (category: Category, locale = 'cs') => {
    const t = category.translations.find((tr) => tr.locale === locale)
    return t?.name || category.translations[0]?.name || category.slug
  }

  return (
    <form onSubmit={handleSubmit((data) => handleFormSubmit(data, false), onValidationError)}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/articles')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět
          </Button>
          <h1 className="text-2xl font-semibold text-text-primary">
            {isEditing ? 'Upravit článek' : 'Nový článek'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="secondary"
            isLoading={isSubmitting}
            disabled={!isDirty && isEditing}
          >
            <Save className="mr-2 h-4 w-4" />
            Uložit koncept
          </Button>
          <Button
            type="button"
            variant="primary"
            isLoading={isSubmitting}
            onClick={handleSubmit((data) => handleFormSubmit(data, true), onValidationError)}
          >
            <Send className="mr-2 h-4 w-4" />
            Publikovat
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Locale tabs + Translate button */}
          <div className="flex items-center justify-between gap-4">
            <LocaleTabs
              activeLocale={activeLocale}
              onLocaleChange={setActiveLocale}
              localeStatus={localeStatus}
            />
            <TranslateButton
              sourceTexts={{
                title: watch('translations.cs.title') || '',
                excerpt: watch('translations.cs.excerpt') || '',
                content: watch('translations.cs.content') || '',
                seo_title: watch('translations.cs.seo_title') || '',
                seo_description: watch('translations.cs.seo_description') || '',
              }}
              onTranslated={(locale: ConfigLocale, field: string, value: string) => {
                setValue(`translations.${locale}.${field}` as keyof ArticleFormData, value, { shouldDirty: true })
              }}
              disabled={!watch('translations.cs.title')}
              context={`Blog article about EV charging stations. Title: "${watch('translations.cs.title') || ''}" Excerpt: "${watch('translations.cs.excerpt') || ''}"`}
              tipTapFields={['content']}
            />
          </div>

          {/* Title */}
          <div>
            <Controller
              key={`title-${activeLocale}`}
              name={`translations.${activeLocale}.title`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Titulek"
                  placeholder="Zadejte titulek článku"
                  error={
                    activeLocale === 'cs'
                      ? errors.translations?.cs?.title?.message
                      : undefined
                  }
                />
              )}
            />
          </div>

          {/* Excerpt */}
          <div>
            <Controller
              key={`excerpt-${activeLocale}`}
              name={`translations.${activeLocale}.excerpt`}
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  label="Perex"
                  placeholder="Krátký popis článku"
                  hint="Zobrazí se v náhledu článku"
                />
              )}
            />
          </div>

          {/* Content editor */}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Obsah
            </label>
            <Controller
              key={`content-${activeLocale}`}
              name={`translations.${activeLocale}.content`}
              control={control}
              render={({ field }) => (
                <ArticleEditor
                  content={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Začněte psát obsah článku..."
                />
              )}
            />
          </div>

          {/* SEO Section */}
          <Card className="p-6">
            <h3 className="mb-4 text-lg font-medium text-text-primary">
              SEO nastavení
            </h3>
            <div className="space-y-4">
              <Controller
                key={`seo_title-${activeLocale}`}
                name={`translations.${activeLocale}.seo_title`}
                control={control}
                render={({ field }) => {
                  const length = field.value?.length || 0
                  const isOverLimit = length > 60
                  return (
                    <div>
                      <Input
                        {...field}
                        value={field.value || ''}
                        label="SEO titulek"
                        placeholder="Titulek pro vyhledávače (doporučeno max 60 znaků)"
                        hint="Pokud nevyplníte, použije se hlavní titulek"
                      />
                      {isOverLimit && (
                        <p className="mt-1 text-sm text-yellow-500">
                          Upozornění: Titulek má {length} znaků, doporučeno je max 60 znaků
                        </p>
                      )}
                    </div>
                  )
                }}
              />
              <Controller
                key={`seo_description-${activeLocale}`}
                name={`translations.${activeLocale}.seo_description`}
                control={control}
                render={({ field }) => {
                  const length = field.value?.length || 0
                  const isOverLimit = length > 160
                  return (
                    <div>
                      <Textarea
                        {...field}
                        value={field.value || ''}
                        label="SEO popisek"
                        placeholder="Popis pro vyhledávače (doporučeno max 160 znaků)"
                        showCount
                      />
                      {isOverLimit && (
                        <p className="mt-1 text-sm text-yellow-500">
                          Upozornění: Popis má {length} znaků, doporučeno je max 160 znaků
                        </p>
                      )}
                    </div>
                  )
                }}
              />
            </div>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Slug */}
          <Card className="p-6">
            <Input
              {...register('slug')}
              label="URL slug"
              placeholder="url-clanku"
              error={errors.slug?.message}
              hint="Adresa článku na webu"
            />
          </Card>

          {/* Category */}
          <Card className="p-6">
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Kategorie
            </label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || '__none__'}
                  onValueChange={(value) =>
                    field.onChange(value === '__none__' ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte kategorii" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Bez kategorie</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {getCategoryName(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Card>

          {/* Featured image */}
          <Card className="p-6">
            <Controller
              name="featured_image_url"
              control={control}
              render={({ field }) => (
                <FeaturedImagePicker
                  value={field.value}
                  onChange={(url) => field.onChange(url || '')}
                  error={errors.featured_image_url?.message}
                  hint="Obrázek pro náhled článku v seznamu"
                  bucket="article-images"
                />
              )}
            />
          </Card>

          {/* Featured toggle */}
          <Card className="p-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                {...register('is_featured')}
                className="h-5 w-5 rounded border-border-default bg-bg-tertiary text-green-500 focus:ring-green-500/50"
              />
              <div>
                <span className="block text-sm font-medium text-text-primary">
                  Hlavní článek
                </span>
                <span className="text-xs text-text-muted">
                  Zobrazit na homepage
                </span>
              </div>
            </label>
          </Card>

          {/* Status (for editing) */}
          {isEditing && (
            <Card className="p-6">
              <label className="mb-2 block text-sm font-medium text-text-primary">
                Stav
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Koncept</SelectItem>
                      <SelectItem value="published">Publikováno</SelectItem>
                      <SelectItem value="archived">Archivováno</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </Card>
          )}
        </div>
      </div>
    </form>
  )
}
