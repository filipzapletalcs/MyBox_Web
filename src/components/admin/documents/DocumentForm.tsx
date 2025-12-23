'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { LocaleTabs, type Locale } from '@/components/admin/ui/LocaleTabs'
import { DocumentUploader } from './DocumentUploader'
import { toast } from 'sonner'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

interface Category {
  id: string
  slug: string
  document_category_translations: {
    locale: string
    name: string
  }[]
}

interface DocumentFormData {
  slug: string
  category_id: string
  sort_order: number
  is_active: boolean
  fallback_locale: Locale | null
  file_cs: { path: string; size: number } | null
  file_en: { path: string; size: number } | null
  file_de: { path: string; size: number } | null
  translations: {
    cs: { title: string; description: string }
    en: { title: string; description: string }
    de: { title: string; description: string }
  }
}

interface DocumentFormProps {
  document?: {
    id: string
    slug: string
    category_id: string
    sort_order: number | null
    is_active: boolean | null
    fallback_locale: string | null
    file_cs: string | null
    file_en: string | null
    file_de: string | null
    file_size_cs: number | null
    file_size_en: number | null
    file_size_de: number | null
    document_translations: {
      locale: string
      title: string
      description: string | null
    }[]
  }
  categories: Category[]
}

const defaultTranslation = { title: '', description: '' }

export function DocumentForm({ document, categories }: DocumentFormProps) {
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = !!document

  // Transform document data to form data
  const getDefaultValues = (): DocumentFormData => {
    if (!document) {
      return {
        slug: '',
        category_id: categories[0]?.id || '',
        sort_order: 0,
        is_active: true,
        fallback_locale: null,
        file_cs: null,
        file_en: null,
        file_de: null,
        translations: {
          cs: { ...defaultTranslation },
          en: { ...defaultTranslation },
          de: { ...defaultTranslation },
        },
      }
    }

    const translations: DocumentFormData['translations'] = {
      cs: { ...defaultTranslation },
      en: { ...defaultTranslation },
      de: { ...defaultTranslation },
    }

    document.document_translations.forEach((t) => {
      if (t.locale === 'cs' || t.locale === 'en' || t.locale === 'de') {
        translations[t.locale] = {
          title: t.title,
          description: t.description || '',
        }
      }
    })

    return {
      slug: document.slug,
      category_id: document.category_id,
      sort_order: document.sort_order || 0,
      is_active: document.is_active ?? true,
      fallback_locale: (document.fallback_locale as Locale) || null,
      file_cs: document.file_cs
        ? { path: document.file_cs, size: document.file_size_cs || 0 }
        : null,
      file_en: document.file_en
        ? { path: document.file_en, size: document.file_size_en || 0 }
        : null,
      file_de: document.file_de
        ? { path: document.file_de, size: document.file_size_de || 0 }
        : null,
      translations,
    }
  }

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DocumentFormData>({
    defaultValues: getDefaultValues(),
  })

  const watchTitle = watch(`translations.cs.title`)

  // Auto-generate slug from Czech title
  useEffect(() => {
    if (!isEditing && watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setValue('slug', slug)
    }
  }, [watchTitle, isEditing, setValue])

  const getCategoryName = (cat: Category, locale: string = 'cs') => {
    const translation = cat.document_category_translations.find(
      (t) => t.locale === locale
    )
    return translation?.name || cat.slug
  }

  const onSubmit = async (data: DocumentFormData) => {
    setIsSubmitting(true)

    // Validate at least one file
    if (!data.file_cs && !data.file_en && !data.file_de) {
      toast.error('Musíte nahrát alespoň jeden soubor')
      setIsSubmitting(false)
      return
    }

    // Prepare translations array
    const translations = Object.entries(data.translations)
      .filter(([, t]) => t.title.trim())
      .map(([locale, t]) => ({
        locale,
        title: t.title,
        description: t.description || null,
      }))

    if (translations.length === 0) {
      toast.error('Musíte vyplnit alespoň jeden název')
      setIsSubmitting(false)
      return
    }

    const payload = {
      slug: data.slug,
      category_id: data.category_id,
      sort_order: data.sort_order,
      is_active: data.is_active,
      fallback_locale: data.fallback_locale,
      file_cs: data.file_cs?.path || null,
      file_en: data.file_en?.path || null,
      file_de: data.file_de?.path || null,
      file_size_cs: data.file_cs?.size || null,
      file_size_en: data.file_en?.size || null,
      file_size_de: data.file_de?.size || null,
      translations,
    }

    try {
      const url = isEditing ? `/api/documents/${document.id}` : '/api/documents'
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

      toast.success(isEditing ? 'Dokument byl upraven' : 'Dokument byl vytvořen')
      router.push('/admin/documents')
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
            onClick={() => router.push('/admin/documents')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              {isEditing ? 'Upravit dokument' : 'Nový dokument'}
            </h1>
            <p className="mt-1 text-text-secondary">
              {isEditing
                ? 'Upravte informace o dokumentu'
                : 'Vytvořte nový dokument ke stažení'}
            </p>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isEditing ? 'Uložit změny' : 'Vytvořit dokument'}
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
                  Název dokumentu
                </label>
                <Input
                  {...register(`translations.${activeLocale}.title`)}
                  placeholder="např. Katalog produktů 2024"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Popis (volitelný)
                </label>
                <Textarea
                  {...register(`translations.${activeLocale}.description`)}
                  placeholder="Stručný popis dokumentu..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* File uploads */}
          <div className="rounded-xl border border-border-subtle bg-bg-primary p-6">
            <h3 className="mb-4 text-lg font-medium text-text-primary">
              Soubory
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Controller
                name="file_cs"
                control={control}
                render={({ field }) => (
                  <DocumentUploader
                    locale="cs"
                    value={field.value}
                    onChange={field.onChange}
                    folder="cs"
                  />
                )}
              />
              <Controller
                name="file_en"
                control={control}
                render={({ field }) => (
                  <DocumentUploader
                    locale="en"
                    value={field.value}
                    onChange={field.onChange}
                    folder="en"
                  />
                )}
              />
              <Controller
                name="file_de"
                control={control}
                render={({ field }) => (
                  <DocumentUploader
                    locale="de"
                    value={field.value}
                    onChange={field.onChange}
                    folder="de"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings */}
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
                  placeholder="katalog-2024"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Kategorie
                </label>
                <select
                  {...register('category_id', { required: true })}
                  className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-3 py-2 text-text-primary focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryName(cat)}
                    </option>
                  ))}
                </select>
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

              <div>
                <label className="mb-2 block text-sm font-medium text-text-primary">
                  Fallback jazyk
                </label>
                <select
                  {...register('fallback_locale')}
                  className="w-full rounded-lg border border-border-subtle bg-bg-secondary px-3 py-2 text-text-primary focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  <option value="">Žádný</option>
                  <option value="cs">Čeština</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
                <p className="mt-1 text-xs text-text-muted">
                  Použije se, pokud dokument není v požadovaném jazyce
                </p>
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
                  Aktivní (viditelný na webu)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
