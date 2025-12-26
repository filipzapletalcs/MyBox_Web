'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import { LocaleTabs, type Locale } from '@/components/admin/ui/LocaleTabs'
import { TranslateButton } from '@/components/admin/ui/TranslateButton'
import { FeaturedImagePicker } from '@/components/admin/ui/FeaturedImagePicker'
import { ArticleEditor } from '@/components/admin/articles/ArticleEditor'
import { LOCALES } from '@/config/locales'
import { ArrowLeft, Save, Building2 } from 'lucide-react'
import { CASE_STUDY_INDUSTRIES, INDUSTRY_LABELS, type CaseStudyIndustry } from '@/types/case-study'

// Translation fields type
const translationSchema = z.object({
  title: z.string().min(1, 'Titulek je povinný'),
  subtitle: z.string().optional().nullable(),
  content: z.string().optional().nullable(), // TipTap JSON
  testimonial_text: z.string().optional().nullable(),
  testimonial_author: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

type TranslationFields = z.infer<typeof translationSchema>

// Form schema
const formSchema = z.object({
  slug: z.string().min(1, 'Slug je povinný').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Neplatný formát slug'),
  client_name: z.string().min(1, 'Název klienta je povinný'),
  client_logo_url: z.string().optional().nullable(),
  featured_image_url: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  station_count: z.number().optional().nullable(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number(),
  translations: z.record(z.string(), translationSchema),
})

type FormData = z.infer<typeof formSchema>

interface CaseStudyFormProps {
  caseStudy?: {
    id: string
    slug: string
    client_name: string
    client_logo_url: string | null
    featured_image_url: string | null
    industry: string | null
    station_count: number | null
    is_featured: boolean | null
    is_active: boolean | null
    sort_order: number | null
    translations: {
      locale: string
      title: string
      subtitle: string | null
      content: unknown | null
      testimonial_text: string | null
      testimonial_author: string | null
      seo_title: string | null
      seo_description: string | null
    }[]
  }
  isNew?: boolean
}

export function CaseStudyForm({ caseStudy, isNew = false }: CaseStudyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')

  // Transform translations array to record
  const translationsRecord: Record<string, TranslationFields> = {}
  LOCALES.forEach(locale => {
    const existing = caseStudy?.translations?.find(t => t.locale === locale)
    translationsRecord[locale] = existing ? {
      title: existing.title || '',
      subtitle: existing.subtitle || '',
      content: existing.content ? JSON.stringify(existing.content) : '',
      testimonial_text: existing.testimonial_text || '',
      testimonial_author: existing.testimonial_author || '',
      seo_title: existing.seo_title || '',
      seo_description: existing.seo_description || '',
    } : {
      title: '',
      subtitle: '',
      content: '',
      testimonial_text: '',
      testimonial_author: '',
      seo_title: '',
      seo_description: '',
    }
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: caseStudy?.slug || '',
      client_name: caseStudy?.client_name || '',
      client_logo_url: caseStudy?.client_logo_url || '',
      featured_image_url: caseStudy?.featured_image_url || '',
      industry: caseStudy?.industry || '',
      station_count: caseStudy?.station_count || undefined,
      is_featured: caseStudy?.is_featured ?? false,
      is_active: caseStudy?.is_active ?? true,
      sort_order: caseStudy?.sort_order ?? 0,
      translations: translationsRecord,
    },
  })

  const translations = watch('translations')
  const featuredImageUrl = watch('featured_image_url')
  const clientLogoUrl = watch('client_logo_url')

  // Get locale status for tabs
  const getLocaleStatus = () => {
    const status: Partial<Record<Locale, 'complete' | 'partial' | 'empty'>> = {}
    LOCALES.forEach(locale => {
      const t = translations?.[locale]
      if (!t?.title) {
        status[locale] = 'empty'
      } else if (t.title && t.content) {
        status[locale] = 'complete'
      } else {
        status[locale] = 'partial'
      }
    })
    return status
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Transform form data to API format
      const translationsArray = Object.entries(data.translations)
        .filter(([_, t]) => t.title) // Only include translations with title
        .map(([locale, t]) => ({
          locale,
          title: t.title,
          subtitle: t.subtitle || null,
          content: t.content ? JSON.parse(t.content) : null,
          testimonial_text: t.testimonial_text || null,
          testimonial_author: t.testimonial_author || null,
          seo_title: t.seo_title || null,
          seo_description: t.seo_description || null,
        }))

      const payload = {
        slug: data.slug,
        client_name: data.client_name,
        client_logo_url: data.client_logo_url || null,
        featured_image_url: data.featured_image_url || null,
        industry: data.industry || null,
        station_count: data.station_count || null,
        is_featured: data.is_featured,
        is_active: data.is_active,
        sort_order: data.sort_order,
        translations: translationsArray,
      }

      const url = isNew ? '/api/case-studies' : `/api/case-studies/${caseStudy?.id}`
      const method = isNew ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při ukládání')
      }

      router.refresh()
      router.push('/admin/case-studies')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle AI translation
  const handleTranslated = (locale: Locale, field: string, value: string) => {
    setValue(`translations.${locale}.${field}` as keyof FormData, value, { shouldDirty: true })
  }

  // Get source texts for translation (from Czech)
  const getSourceTexts = () => {
    const csTranslation = translations?.cs || {}
    return {
      title: csTranslation.title || '',
      subtitle: csTranslation.subtitle || '',
      testimonial_text: csTranslation.testimonial_text || '',
      testimonial_author: csTranslation.testimonial_author || '',
      seo_title: csTranslation.seo_title || '',
      seo_description: csTranslation.seo_description || '',
    }
  }

  // Auto-generate slug from client name
  const clientName = watch('client_name')
  const handleClientNameBlur = () => {
    if (isNew && clientName && !watch('slug')) {
      const slug = clientName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      setValue('slug', slug)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/case-studies')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {isNew ? 'Nová případová studie' : 'Upravit případovou studii'}
            </h1>
            {!isNew && <p className="text-text-secondary">{caseStudy?.client_name}</p>}
          </div>
        </div>
        <Button type="submit" isLoading={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isNew ? 'Vytvořit' : 'Uložit změny'}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic info */}
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Základní informace</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Název klienta"
                {...register('client_name')}
                error={errors.client_name?.message}
                onBlur={handleClientNameBlur}
              />
              <Input
                label="Slug"
                {...register('slug')}
                error={errors.slug?.message}
                placeholder="nazev-case-study"
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Odvětví
                </label>
                <Controller
                  name="industry"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Vyberte odvětví" />
                      </SelectTrigger>
                      <SelectContent>
                        {CASE_STUDY_INDUSTRIES.map(industry => (
                          <SelectItem key={industry} value={industry}>
                            {INDUSTRY_LABELS[industry as CaseStudyIndustry]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Input
                label="Počet stanic"
                type="number"
                {...register('station_count', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Content */}
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-text-primary">Obsah</h2>
              <div className="flex items-center gap-3">
                <TranslateButton
                  sourceTexts={getSourceTexts()}
                  onTranslated={handleTranslated}
                  context="Case study for corporate EV charging solutions"
                />
                <LocaleTabs
                  activeLocale={activeLocale}
                  onLocaleChange={setActiveLocale}
                  localeStatus={getLocaleStatus()}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Titulek"
                {...register(`translations.${activeLocale}.title`)}
                error={errors.translations?.[activeLocale]?.title?.message}
                placeholder="325 dobíjecích bodů pro PPL"
              />
              <Input
                label="Podtitulek (krátký popis pro karty)"
                {...register(`translations.${activeLocale}.subtitle`)}
                placeholder="Elektrifikace vozového parku doručovacích služeb"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  Obsah případové studie
                </label>
                <Controller
                  name={`translations.${activeLocale}.content`}
                  control={control}
                  render={({ field }) => (
                    <ArticleEditor
                      content={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Napište obsah případové studie..."
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Reference od klienta</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Citace
                </label>
                <textarea
                  {...register(`translations.${activeLocale}.testimonial_text`)}
                  rows={3}
                  className="w-full rounded-lg border border-border-default bg-bg-primary px-4 py-2.5 text-text-primary placeholder:text-text-muted focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Díky MyBox jsme dokázali elektrifikovat celou flotilu..."
                />
              </div>
              <Input
                label="Autor citace"
                {...register(`translations.${activeLocale}.testimonial_author`)}
                placeholder="Jan Novák, Fleet Manager, PPL"
              />
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">SEO</h2>
            <div className="space-y-4">
              <Input
                label="SEO titulek"
                {...register(`translations.${activeLocale}.seo_title`)}
                maxLength={60}
                placeholder="325 dobíjecích bodů pro PPL | MyBox Reference"
              />
              <Input
                label="SEO popis"
                {...register(`translations.${activeLocale}.seo_description`)}
                maxLength={160}
                placeholder="Případová studie elektrifikace vozového parku PPL..."
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Nastavení</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Aktivní</span>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Zvýrazněná</span>
                <Controller
                  name="is_featured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              <Input
                label="Pořadí"
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Featured image */}
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">Hlavní obrázek</h2>
            <FeaturedImagePicker
              value={featuredImageUrl || ''}
              onChange={(url) => setValue('featured_image_url', url)}
            />
          </div>

          {/* Client logo */}
          <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-text-primary">
              <Building2 className="h-5 w-5" />
              Logo klienta
            </h2>
            <FeaturedImagePicker
              value={clientLogoUrl || ''}
              onChange={(url) => setValue('client_logo_url', url)}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
