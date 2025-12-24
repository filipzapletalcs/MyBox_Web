'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, ArrowLeft, UserCircle } from 'lucide-react'
import { Button, Input, Textarea, Card, Switch, Label } from '@/components/ui'
import {
  LocaleTabs,
  type Locale,
  type LocaleStatus,
} from '@/components/admin/ui/LocaleTabs'
import { TranslateButton } from '@/components/admin/ui/TranslateButton'
import { MediaPickerModal } from '@/components/admin/ui/MediaPickerModal'
import {
  teamMemberFormSchema,
  type TeamMemberFormData,
} from '@/lib/validations/team-member'
import type { Locale as ConfigLocale } from '@/config/locales'

interface TeamMemberTranslation {
  locale: string
  name: string
  position: string
  description?: string | null
}

interface TeamMember {
  id: string
  image_url: string | null
  email: string
  phone: string | null
  linkedin_url: string | null
  sort_order: number
  is_active: boolean
  translations: TeamMemberTranslation[]
}

interface TeamMemberFormProps {
  member?: TeamMember
  onSubmit: (data: TeamMemberFormData) => Promise<void>
  isSubmitting?: boolean
}

export function TeamMemberForm({
  member,
  onSubmit,
  isSubmitting = false,
}: TeamMemberFormProps) {
  const router = useRouter()
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const isEditing = !!member

  // Transform member data to form format
  const getDefaultValues = (): TeamMemberFormData => {
    if (!member) {
      return {
        image_url: null,
        email: '',
        phone: null,
        linkedin_url: null,
        is_active: true,
        sort_order: 0,
        translations: {
          cs: { name: '', position: '', description: null },
          en: { name: '', position: '', description: null },
          de: { name: '', position: '', description: null },
        },
      }
    }

    const translations: TeamMemberFormData['translations'] = {
      cs: { name: '', position: '', description: null },
      en: { name: '', position: '', description: null },
      de: { name: '', position: '', description: null },
    }

    member.translations.forEach((t) => {
      const locale = t.locale as Locale
      if (translations[locale]) {
        translations[locale] = {
          name: t.name || '',
          position: t.position || '',
          description: t.description || null,
        }
      }
    })

    return {
      image_url: member.image_url,
      email: member.email,
      phone: member.phone,
      linkedin_url: member.linkedin_url,
      is_active: member.is_active,
      sort_order: member.sort_order,
      translations,
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: getDefaultValues(),
  })

  const translations = watch('translations')
  const imageUrl = watch('image_url')

  // Calculate locale status
  const getLocaleStatus = (locale: Locale): LocaleStatus => {
    const t = translations[locale]
    if (!t?.name && !t?.position) return 'empty'
    if (t?.name && t?.position) return 'complete'
    return 'partial'
  }

  const localeStatus: Record<Locale, LocaleStatus> = {
    cs: getLocaleStatus('cs'),
    en: getLocaleStatus('en'),
    de: getLocaleStatus('de'),
  }

  const handleImageSelect = (url: string) => {
    setValue('image_url', url)
    setIsMediaModalOpen(false)
  }

  const handleRemoveImage = () => {
    setValue('image_url', null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin/contacts/team')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zpět
          </Button>
          <h1 className="text-2xl font-bold text-text-primary">
            {isEditing ? 'Upravit člena týmu' : 'Nový člen týmu'}
          </h1>
        </div>
        <Button type="submit" isLoading={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? 'Uložit změny' : 'Vytvořit'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Basic info */}
        <div className="space-y-6">
          {/* Photo */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">
              Fotografie
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full bg-bg-tertiary">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Fotografie člena"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100"
                    >
                      <span className="text-sm text-white">Odstranit</span>
                    </button>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserCircle className="h-16 w-16 text-text-muted" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsMediaModalOpen(true)}
              >
                {imageUrl ? 'Změnit fotografii' : 'Vybrat fotografii'}
              </Button>
            </div>
          </Card>

          {/* Contact info */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">
              Kontaktní údaje
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                  placeholder="jan.novak@mybox.eco"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="+420 123 456 789"
                />
              </div>
              <div>
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  {...register('linkedin_url')}
                  error={errors.linkedin_url?.message}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>
          </Card>

          {/* Status */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-medium text-text-primary">
              Nastavení
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Zobrazit na webu</Label>
                <p className="text-sm text-text-muted">
                  Skrytí členy na stránce kontaktů
                </p>
              </div>
              <Switch
                id="is_active"
                checked={watch('is_active')}
                onCheckedChange={(checked) => setValue('is_active', checked)}
              />
            </div>
          </Card>
        </div>

        {/* Right column - Translations */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-text-primary">
                Překlady
              </h2>
              <TranslateButton
                sourceTexts={{
                  position: watch('translations.cs.position') || '',
                  description: watch('translations.cs.description') || '',
                }}
                onTranslated={(
                  locale: ConfigLocale,
                  field: string,
                  value: string
                ) => {
                  setValue(
                    `translations.${locale}.${field}` as keyof TeamMemberFormData,
                    value,
                    { shouldDirty: true }
                  )
                  // Kopírovat jméno z CS do ostatních jazyků
                  const csName = watch('translations.cs.name')
                  if (csName) {
                    setValue(`translations.${locale}.name`, csName, {
                      shouldDirty: true,
                    })
                  }
                }}
                disabled={!watch('translations.cs.position')}
                context={`Team member position in an EV charging company. Position: "${watch('translations.cs.position') || ''}"`}
                tipTapFields={[]}
              />
            </div>

            <LocaleTabs
              activeLocale={activeLocale}
              onLocaleChange={setActiveLocale}
              localeStatus={localeStatus}
            />

            <div className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <Label htmlFor={`name-${activeLocale}`}>
                  Jméno {activeLocale === 'cs' && '*'}
                </Label>
                <Input
                  id={`name-${activeLocale}`}
                  {...register(`translations.${activeLocale}.name`)}
                  error={
                    errors.translations?.[activeLocale]?.name?.message
                  }
                  placeholder="Jan Novák"
                  disabled={activeLocale !== 'cs'}
                />
                {activeLocale !== 'cs' && (
                  <p className="mt-1 text-xs text-text-muted">
                    Jméno se automaticky kopíruje z češtiny
                  </p>
                )}
              </div>

              {/* Position */}
              <div>
                <Label htmlFor={`position-${activeLocale}`}>
                  Pozice {activeLocale === 'cs' && '*'}
                </Label>
                <Input
                  id={`position-${activeLocale}`}
                  {...register(`translations.${activeLocale}.position`)}
                  error={
                    errors.translations?.[activeLocale]?.position?.message
                  }
                  placeholder={
                    activeLocale === 'cs'
                      ? 'Obchodní manažer'
                      : activeLocale === 'en'
                        ? 'Sales Manager'
                        : 'Vertriebsleiter'
                  }
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor={`description-${activeLocale}`}>Popis</Label>
                <Textarea
                  id={`description-${activeLocale}`}
                  {...register(`translations.${activeLocale}.description`)}
                  rows={4}
                  placeholder="Krátký popis člena týmu (volitelné)"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleImageSelect}
        bucket="team-images"
        uploadBucket="team-images"
        title="Vybrat fotografii"
      />
    </form>
  )
}
