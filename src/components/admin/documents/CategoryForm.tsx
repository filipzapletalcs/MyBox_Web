'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { LocaleTabs, type Locale } from '@/components/admin/ui/LocaleTabs'
import { toast } from 'sonner'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

interface CategoryFormData {
  slug: string
  sort_order: number
  is_active: boolean
  translations: {
    cs: { name: string; description: string }
    en: { name: string; description: string }
    de: { name: string; description: string }
  }
}

interface CategoryFormProps {
  category?: {
    id: string
    slug: string
    sort_order: number | null
    is_active: boolean | null
    document_category_translations: {
      locale: string
      name: string
      description: string | null
    }[]
  }
}

const defaultTranslation = { name: '', description: '' }

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!category

  const getDefaultValues = (): CategoryFormData => {
    if (!category) {
      return {
        slug: '',
        sort_order: 0,
        is_active: true,
        translations: {
          cs: { ...defaultTranslation },
          en: { ...defaultTranslation },
          de: { ...defaultTranslation },
        },
      }
    }

    const translations: CategoryFormData['translations'] = {
      cs: { ...defaultTranslation },
      en: { ...defaultTranslation },
      de: { ...defaultTranslation },
    }

    category.document_category_translations.forEach((t) => {
      if (t.locale === 'cs' || t.locale === 'en' || t.locale === 'de') {
        translations[t.locale] = {
          name: t.name,
          description: t.description || '',
        }
      }
    })

    return {
      slug: category.slug,
      sort_order: category.sort_order || 0,
      is_active: category.is_active ?? true,
      translations,
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: getDefaultValues(),
  })

  const watchName = watch('translations.cs.name')

  // Auto-generate slug from Czech name
  useEffect(() => {
    if (!isEditing && watchName) {
      const slug = watchName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [watchName, isEditing, setValue])

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true)

    // Prepare translations array
    const translations = Object.entries(data.translations)
      .filter(([, t]) => t.name.trim())
      .map(([locale, t]) => ({
        locale,
        name: t.name,
        description: t.description || null,
      }))

    if (translations.length === 0) {
      toast.error('Musíte vyplnit alespoň jeden název')
      setIsSubmitting(false)
      return
    }

    const payload = {
      slug: data.slug,
      sort_order: data.sort_order,
      is_active: data.is_active,
      translations,
    }

    try {
      const url = isEditing
        ? `/api/documents/categories/${category.id}`
        : '/api/documents/categories'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Chyba při ukládání')
      }

      toast.success(
        isEditing ? 'Kategorie byla upravena' : 'Kategorie byla vytvořena'
      )
      router.push('/admin/documents/categories')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsSubmitting(false)
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
            size="icon"
            onClick={() => router.push('/admin/documents/categories')}
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
                : 'Vytvořte novou kategorii dokumentů'}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditing ? 'Uložit změny' : 'Vytvořit kategorii'}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Translations */}
          <div className="rounded-xl border border-border-subtle bg-bg-primary p-6">
            <LocaleTabs
              activeLocale={activeLocale}
              onLocaleChange={setActiveLocale}
              className="mb-6"
            />

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Název kategorie
                </label>
                <Input
                  {...register(`translations.${activeLocale}.name`)}
                  placeholder="např. Katalogové listy"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Popis (volitelný)
                </label>
                <Textarea
                  {...register(`translations.${activeLocale}.description`)}
                  placeholder="Stručný popis kategorie..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border-subtle bg-bg-primary p-6">
            <h3 className="mb-4 text-lg font-medium text-text-primary">
              Nastavení
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Slug (URL)
                </label>
                <Input
                  {...register('slug', { required: 'Slug je povinný' })}
                  placeholder="katalogove-listy"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Pořadí
                </label>
                <Input
                  type="number"
                  {...register('sort_order', { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  {...register('is_active')}
                  className="h-4 w-4 rounded border-border-subtle bg-bg-secondary text-green-500 focus:ring-green-500"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-text-primary"
                >
                  Aktivní (viditelná na webu)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
