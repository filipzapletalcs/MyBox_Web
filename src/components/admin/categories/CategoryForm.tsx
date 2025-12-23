'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save, ArrowLeft } from 'lucide-react'
import { Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Card } from '@/components/ui'
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'

// Form schema
const categoryFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .max(50)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug může obsahovat pouze malá písmena, čísla a pomlčky'),
  parent_id: z.string().nullable(),
  translations: z.object({
    cs: z.object({
      name: z.string().min(1, 'Název v češtině je povinný'),
      description: z.string().optional(),
    }),
    en: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    }),
    de: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    }),
  }),
})

type CategoryFormData = z.infer<typeof categoryFormSchema>

interface Category {
  id: string
  slug: string
  parent_id: string | null
  translations: {
    locale: string
    name: string
    description: string | null
  }[]
}

interface CategoryFormProps {
  category?: Category
  categories: Category[]
  onSubmit: (data: CategoryFormData) => Promise<void>
  isSubmitting?: boolean
}

export function CategoryForm({
  category,
  categories,
  onSubmit,
  isSubmitting = false,
}: CategoryFormProps) {
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')
  const isEditing = !!category

  // Transform category data to form format
  const getDefaultValues = (): CategoryFormData => {
    if (!category) {
      return {
        slug: '',
        parent_id: null,
        translations: {
          cs: { name: '', description: '' },
          en: { name: '', description: '' },
          de: { name: '', description: '' },
        },
      }
    }

    const translations: CategoryFormData['translations'] = {
      cs: { name: '', description: '' },
      en: { name: '', description: '' },
      de: { name: '', description: '' },
    }

    category.translations.forEach((t) => {
      const locale = t.locale as Locale
      if (translations[locale]) {
        translations[locale] = {
          name: t.name || '',
          description: t.description || '',
        }
      }
    })

    return {
      slug: category.slug,
      parent_id: category.parent_id,
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
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: getDefaultValues(),
  })

  const translations = watch('translations')

  // Calculate locale status
  const getLocaleStatus = (locale: Locale): LocaleStatus => {
    const t = translations[locale]
    if (!t.name) return 'empty'
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

  const getCategoryName = (cat: Category) => {
    const csTranslation = cat.translations.find((t) => t.locale === 'cs')
    return csTranslation?.name || cat.slug
  }

  // Filter out current category and its children from parent options
  const availableParents = categories.filter((cat) => {
    if (!category) return true
    return cat.id !== category.id
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/categories')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {isEditing ? 'Upravit kategorii' : 'Nová kategorie'}
            </h1>
            <p className="mt-1 text-text-secondary">
              {isEditing
                ? 'Upravte informace o kategorii'
                : 'Vytvořte novou kategorii pro články'}
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

          {/* Name */}
          <div>
            <Controller
              name={`translations.${activeLocale}.name`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Název"
                  placeholder="Zadejte název kategorie"
                  error={
                    activeLocale === 'cs'
                      ? errors.translations?.cs?.name?.message
                      : undefined
                  }
                />
              )}
            />
          </div>

          {/* Description */}
          <div>
            <Controller
              name={`translations.${activeLocale}.description`}
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  label="Popis"
                  placeholder="Krátký popis kategorie"
                  hint="Volitelný popis, který se zobrazí u kategorie"
                />
              )}
            />
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Slug */}
          <Card className="p-6">
            <Input
              {...register('slug')}
              label="URL slug"
              placeholder="url-kategorie"
              error={errors.slug?.message}
              hint="Unikátní identifikátor v URL"
            />
          </Card>

          {/* Parent category */}
          <Card className="p-6">
            <label className="mb-2 block text-sm font-medium text-text-primary">
              Nadřazená kategorie
            </label>
            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || '__none__'}
                  onValueChange={(value) =>
                    field.onChange(value === '__none__' ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Vyberte nadřazenou kategorii" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Žádná (hlavní kategorie)</SelectItem>
                    {availableParents.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {getCategoryName(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <p className="mt-2 text-xs text-text-muted">
              Volitelně vyberte nadřazenou kategorii pro vytvoření hierarchie
            </p>
          </Card>
        </div>
      </div>
    </form>
  )
}
