'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Save, Building2, Phone, MapPin, Clock, Globe } from 'lucide-react'
import { Button, Input, Card, Label } from '@/components/ui'
import { toast } from 'sonner'

interface CompanyDetails {
  id: string
  name: string
  division: string | null
  address: string
  city: string
  zip: string
  country: string | null
  ico: string
  dic: string | null
  sales_phone: string | null
  sales_email: string | null
  service_phone: string | null
  service_email: string | null
  hours_weekdays: string | null
  hours_saturday: string | null
  hours_sunday: string | null
  facebook_url: string | null
  instagram_url: string | null
  linkedin_url: string | null
  youtube_url: string | null
}

interface CompanyDetailsFormProps {
  initialData: CompanyDetails
}

export function CompanyDetailsForm({ initialData }: CompanyDetailsFormProps) {
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<CompanyDetails>({
    defaultValues: initialData,
  })

  const onSubmit = async (data: CompanyDetails) => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/company-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save')
      }

      toast.success('Firemní údaje byly uloženy')
    } catch {
      toast.error('Nepodařilo se uložit změny')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Firemní údaje</h1>
          <p className="mt-1 text-text-muted">
            Kontaktní informace zobrazované na webu
          </p>
        </div>
        <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
          <Save className="mr-2 h-4 w-4" />
          Uložit změny
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Základní údaje */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-green-500/10 p-3">
              <Building2 className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Společnost
              </h2>
              <p className="text-sm text-text-muted">Základní údaje</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Název společnosti *</Label>
              <Input id="name" {...register('name')} />
            </div>
            <div>
              <Label htmlFor="division">Divize</Label>
              <Input id="division" {...register('division')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ico">IČ *</Label>
                <Input id="ico" {...register('ico')} />
              </div>
              <div>
                <Label htmlFor="dic">DIČ</Label>
                <Input id="dic" {...register('dic')} />
              </div>
            </div>
          </div>
        </Card>

        {/* Adresa */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-blue-500/10 p-3">
              <MapPin className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Adresa</h2>
              <p className="text-sm text-text-muted">Sídlo společnosti</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Ulice a číslo *</Label>
              <Input id="address" {...register('address')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">Město *</Label>
                <Input id="city" {...register('city')} />
              </div>
              <div>
                <Label htmlFor="zip">PSČ *</Label>
                <Input id="zip" {...register('zip')} />
              </div>
            </div>
          </div>
        </Card>

        {/* Kontakty */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-purple-500/10 p-3">
              <Phone className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Kontakty
              </h2>
              <p className="text-sm text-text-muted">Telefony a emaily</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2">Obchod</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sales_phone">Telefon</Label>
                  <Input id="sales_phone" {...register('sales_phone')} />
                </div>
                <div>
                  <Label htmlFor="sales_email">E-mail</Label>
                  <Input id="sales_email" type="email" {...register('sales_email')} />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-muted mb-2">Servis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service_phone">Telefon</Label>
                  <Input id="service_phone" {...register('service_phone')} />
                </div>
                <div>
                  <Label htmlFor="service_email">E-mail</Label>
                  <Input id="service_email" type="email" {...register('service_email')} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Otevírací doba */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-orange-500/10 p-3">
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Otevírací doba
              </h2>
              <p className="text-sm text-text-muted">Provozní hodiny</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="hours_weekdays">Pracovní dny (Po–Pá)</Label>
              <Input
                id="hours_weekdays"
                {...register('hours_weekdays')}
                placeholder="8:00–16:30"
              />
            </div>
            <div>
              <Label htmlFor="hours_saturday">Sobota</Label>
              <Input
                id="hours_saturday"
                {...register('hours_saturday')}
                placeholder="Zavřeno"
              />
            </div>
            <div>
              <Label htmlFor="hours_sunday">Neděle</Label>
              <Input
                id="hours_sunday"
                {...register('hours_sunday')}
                placeholder="Zavřeno"
              />
            </div>
          </div>
        </Card>

        {/* Sociální sítě */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-cyan-500/10 p-3">
              <Globe className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Sociální sítě
              </h2>
              <p className="text-sm text-text-muted">Odkazy na profily</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label htmlFor="facebook_url">Facebook</Label>
              <Input
                id="facebook_url"
                {...register('facebook_url')}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label htmlFor="instagram_url">Instagram</Label>
              <Input
                id="instagram_url"
                {...register('instagram_url')}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label htmlFor="linkedin_url">LinkedIn</Label>
              <Input
                id="linkedin_url"
                {...register('linkedin_url')}
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <Label htmlFor="youtube_url">YouTube</Label>
              <Input
                id="youtube_url"
                {...register('youtube_url')}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </Card>
      </div>
    </form>
  )
}
