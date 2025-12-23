'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft } from 'lucide-react'
import { Button, Input, Textarea, Card } from '@/components/ui'
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'

// Form schema
const faqFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug může obsahovat pouze malá písmena, čísla a pomlčky'),
  category: z.string().max(50).optional().nullable(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
  translations: z.object({
    cs: z.object({
      question: z.string().min(1, 'Otázka v češtině je povinná'),
      answer: z.string().min(1, 'Odpověď v češtině je povinná'),
    }),
    en: z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
    }),
    de: z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
    }),
  }),
})

type FaqFormData = z.infer<typeof faqFormSchema>

interface Faq {
  id: string
  slug: string
  category: string | null
  sort_order: number | null
  is_active: boolean | null
  translations: {
    locale: string
    question: string
    answer: string
  }[]
}

interface FaqFormProps {
  faq?: Faq
  onSubmit: (data: FaqFormData) => Promise<void>
  isSubmitting?: boolean
}

export function FaqForm({
  faq,
  onSubmit,
  isSubmitting = false,
}: FaqFormProps) {
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')
  const isEditing = !!faq

  // Transform faq data to form format
  const getDefaultValues = (): FaqFormData => {
    if (!faq) {
      return {
        slug: '',
        category: '',
        sort_order: 0,
        is_active: true,
        translations: {
          cs: { question: '', answer: '' },
          en: { question: '', answer: '' },
          de: { question: '', answer: '' },
        },
      }
    }

    const translations: FaqFormData['translations'] = {
      cs: { question: '', answer: '' },
      en: { question: '', answer: '' },
      de: { question: '', answer: '' },
    }

    faq.translations.forEach((t) => {
      const locale = t.locale as Locale
      if (translations[locale]) {
        translations[locale] = {
          question: t.question || '',
          answer: t.answer || '',
        }
      }
    })

    return {
      slug: faq.slug,
      category: faq.category || '',
      sort_order: faq.sort_order ?? 0,
      is_active: faq.is_active ?? true,
      translations,
    }
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FaqFormData>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: getDefaultValues(),
  })

  const translations = watch('translations')

  // Calculate locale status
  const getLocaleStatus = (locale: Locale): LocaleStatus => {
    const t = translations[locale]
    if (!t.question && !t.answer) return 'empty'
    if (t.question && t.answer) return 'complete'
    return 'partial'
  }

  const localeStatus: Record<Locale, LocaleStatus> = {
    cs: getLocaleStatus('cs'),
    en: getLocaleStatus('en'),
    de: getLocaleStatus('de'),
  }

  // Auto-generate slug from Czech question
  const csQuestion = watch('translations.cs.question')
  useEffect(() => {
    if (!isEditing && csQuestion && !watch('slug')) {
      const slug = csQuestion
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50)
      setValue('slug', slug)
    }
  }, [csQuestion, isEditing, setValue, watch])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/faqs')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {isEditing ? 'Upravit FAQ' : 'Nová otázka'}
            </h1>
            <p className="mt-1 text-text-secondary">
              {isEditing
                ? 'Upravte otázku a odpověď'
                : 'Vytvořte novou otázku a odpověď'}
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
          {/* Locale tabs */}
          <LocaleTabs
            activeLocale={activeLocale}
            onLocaleChange={setActiveLocale}
            localeStatus={localeStatus}
          />

          {/* Question */}
          <Card className="p-6">
            <Controller
              name={`translations.${activeLocale}.question`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  label="Otázka"
                  placeholder="Jak funguje nabíjení elektromobilu?"
                  error={
                    activeLocale === 'cs'
                      ? errors.translations?.cs?.question?.message
                      : undefined
                  }
                />
              )}
            />
          </Card>

          {/* Answer */}
          <Card className="p-6">
            <Controller
              name={`translations.${activeLocale}.answer`}
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  label="Odpověď"
                  placeholder="Nabíjení elektromobilu je jednoduché..."
                  className="min-h-[200px]"
                  error={
                    activeLocale === 'cs'
                      ? errors.translations?.cs?.answer?.message
                      : undefined
                  }
                />
              )}
            />
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="p-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                {...register('is_active')}
                className="h-4 w-4 rounded border-border-default bg-bg-tertiary text-green-500 focus:ring-green-500/20"
              />
              <div>
                <span className="text-sm font-medium text-text-primary">Aktivní</span>
                <p className="text-xs text-text-muted">FAQ bude viditelné na webu</p>
              </div>
            </label>
          </Card>

          {/* Slug */}
          <Card className="p-6">
            <Input
              {...register('slug')}
              label="URL slug"
              placeholder="jak-funguje-nabijeni"
              error={errors.slug?.message}
              hint="Unikátní identifikátor"
            />
          </Card>

          {/* Category */}
          <Card className="p-6">
            <Input
              {...register('category')}
              label="Kategorie"
              placeholder="nabijeni"
              hint="Volitelná kategorie pro filtrování"
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
