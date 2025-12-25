'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Switch } from '@/components/ui'
import { LocaleTabs, type Locale } from '@/components/admin/ui/LocaleTabs'
import { TranslateButton } from '@/components/admin/ui/TranslateButton'
import { LOCALES } from '@/config/locales'
import { ArrowLeft, Save } from 'lucide-react'
import type { CorporatePage, CorporatePageTranslation } from '@/types/corporate'

// Translation fields type
const translationSchema = z.object({
  title: z.string().min(1, 'Titulek je povinný'),
  subtitle: z.string().optional().nullable(),
  hero_heading: z.string().optional().nullable(),
  hero_subheading: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
})

type TranslationFields = z.infer<typeof translationSchema>

// Form schema
const formSchema = z.object({
  slug: z.string().min(1, 'Slug je povinný'),
  page_type: z.enum(['landing', 'subpage']),
  hero_video_url: z.string().optional().nullable(),
  hero_image_url: z.string().optional().nullable(),
  is_active: z.boolean(),
  sort_order: z.number(),
  translations: z.record(z.string(), translationSchema),
})

type FormData = z.infer<typeof formSchema>

interface CorporatePageFormProps {
  page: CorporatePage & { translations: CorporatePageTranslation[] }
}

export function CorporatePageForm({ page }: CorporatePageFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')

  // Transform translations array to record
  const translationsRecord: Record<string, any> = {}
  LOCALES.forEach(locale => {
    const existing = page.translations.find(t => t.locale === locale)
    translationsRecord[locale] = existing ? {
      title: existing.title || '',
      subtitle: existing.subtitle || '',
      hero_heading: existing.hero_heading || '',
      hero_subheading: existing.hero_subheading || '',
      seo_title: existing.seo_title || '',
      seo_description: existing.seo_description || '',
    } : {
      title: '',
      subtitle: '',
      hero_heading: '',
      hero_subheading: '',
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
      slug: page.slug,
      page_type: page.page_type as 'landing' | 'subpage',
      hero_video_url: page.hero_video_url || '',
      hero_image_url: page.hero_image_url || '',
      is_active: page.is_active ?? true,
      sort_order: page.sort_order ?? 0,
      translations: translationsRecord,
    },
  })

  const translations = watch('translations')

  // Get locale status for tabs
  const getLocaleStatus = () => {
    const status: Partial<Record<Locale, 'complete' | 'partial' | 'empty'>> = {}
    LOCALES.forEach(locale => {
      const t = translations?.[locale]
      if (!t?.title) {
        status[locale] = 'empty'
      } else if (t.title && t.seo_title && t.seo_description) {
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
          hero_heading: t.hero_heading || null,
          hero_subheading: t.hero_subheading || null,
          seo_title: t.seo_title || null,
          seo_description: t.seo_description || null,
        }))

      const payload = {
        slug: data.slug,
        page_type: data.page_type,
        hero_video_url: data.hero_video_url || null,
        hero_image_url: data.hero_image_url || null,
        is_active: data.is_active,
        sort_order: data.sort_order,
        translations: translationsArray,
      }

      const response = await fetch(`/api/corporate-pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při ukládání stránky')
      }

      router.refresh()
      router.push('/admin/corporate')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle AI translation
  const handleTranslated = (locale: Locale, field: string, value: string) => {
    setValue(`translations.${locale}.${field}` as any, value, { shouldDirty: true })
  }

  // Get source texts for translation (from Czech)
  const getSourceTexts = () => {
    const csTranslation = translations?.cs || {}
    return {
      title: csTranslation.title || '',
      subtitle: csTranslation.subtitle || '',
      hero_heading: csTranslation.hero_heading || '',
      hero_subheading: csTranslation.hero_subheading || '',
      seo_title: csTranslation.seo_title || '',
      seo_description: csTranslation.seo_description || '',
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
            onClick={() => router.push('/admin/corporate')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Upravit stránku
            </h1>
            <p className="text-text-secondary">{page.slug}</p>
          </div>
        </div>
        <Button type="submit" isLoading={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          Uložit změny
        </Button>
      </div>

      {/* Basic info */}
      <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
        <h2 className="mb-4 text-lg font-medium text-text-primary">Základní informace</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Slug"
            {...register('slug')}
            error={errors.slug?.message}
            disabled
          />
          <Input
            label="Typ stránky"
            value={page.page_type === 'landing' ? 'Landing Page' : 'Podstránka'}
            disabled
          />
          <Input
            label="URL hero videa"
            {...register('hero_video_url')}
            placeholder="https://..."
          />
          <Input
            label="URL hero obrázku"
            {...register('hero_image_url')}
            placeholder="https://..."
          />
          <Input
            label="Pořadí"
            type="number"
            {...register('sort_order', { valueAsNumber: true })}
          />
          <div className="flex items-center gap-3 pt-6">
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
            <span className="text-sm text-text-secondary">Aktivní stránka</span>
          </div>
        </div>
      </div>

      {/* Translations */}
      <div className="rounded-xl border border-border-subtle bg-bg-elevated p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-text-primary">Překlady</h2>
          <TranslateButton
            sourceTexts={getSourceTexts()}
            onTranslated={handleTranslated}
            context="Corporate charging page for EV charging solutions"
          />
        </div>

        <LocaleTabs
          activeLocale={activeLocale}
          onLocaleChange={setActiveLocale}
          localeStatus={getLocaleStatus()}
        />

        <div className="mt-4 space-y-4">
          <Input
            label="Titulek"
            {...register(`translations.${activeLocale}.title`)}
            error={errors.translations?.[activeLocale]?.title?.message}
          />
          <Input
            label="Podtitulek"
            {...register(`translations.${activeLocale}.subtitle`)}
          />
          <Input
            label="Hero nadpis"
            {...register(`translations.${activeLocale}.hero_heading`)}
          />
          <Input
            label="Hero podnadpis"
            {...register(`translations.${activeLocale}.hero_subheading`)}
          />
          <div className="border-t border-border-subtle pt-4">
            <h3 className="mb-3 text-sm font-medium text-text-secondary">SEO</h3>
            <div className="space-y-4">
              <Input
                label="SEO titulek"
                {...register(`translations.${activeLocale}.seo_title`)}
                maxLength={60}
              />
              <Input
                label="SEO popis"
                {...register(`translations.${activeLocale}.seo_description`)}
                maxLength={160}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
