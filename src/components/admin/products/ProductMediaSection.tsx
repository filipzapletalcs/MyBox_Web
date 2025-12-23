'use client'

import { Control, Controller } from 'react-hook-form'
import { Card, Input } from '@/components/ui'
import { FeaturedImagePicker } from '@/components/admin/ui/FeaturedImagePicker'
import { HeroMediaPicker } from '@/components/admin/ui/HeroMediaPicker'

interface ProductMediaSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export function ProductMediaSection({ control }: ProductMediaSectionProps) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium text-text-primary">
          Hero sekce
        </h3>
        <Controller
          name="hero_image"
          control={control}
          render={({ field: imageField }) => (
            <Controller
              name="hero_video"
              control={control}
              render={({ field: videoField }) => (
                <HeroMediaPicker
                  imageValue={imageField.value}
                  videoValue={videoField.value}
                  onImageChange={imageField.onChange}
                  onVideoChange={videoField.onChange}
                  bucket="product-images"
                />
              )}
            />
          )}
        />
      </Card>

      {/* Front Image */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium text-text-primary">
          Přední pohled
        </h3>
        <div className="max-w-md">
          <Controller
            name="front_image"
            control={control}
            render={({ field }) => (
              <FeaturedImagePicker
                value={field.value}
                onChange={field.onChange}
                label="Front image"
                hint="Obrázek produktu zepředu pro feature showcase"
                bucket="product-images"
              />
            )}
          />
        </div>
      </Card>

      {/* Datasheet */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium text-text-primary">
          Datasheet
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            name="datasheet_url"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                label="URL datasheetu"
                placeholder="/downloads/mybox-profi-datasheet.pdf"
                hint="Cesta k PDF souboru datasheetu"
              />
            )}
          />
          <Controller
            name="datasheet_filename"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                label="Název souboru"
                placeholder="MyBox-Profi-Datasheet.pdf"
                hint="Název souboru pro stažení"
              />
            )}
          />
        </div>
      </Card>

      {/* Product Info */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium text-text-primary">
          Informace o produktu
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                label="Značka"
                placeholder="mybox nebo alpitronic"
              />
            )}
          />
          <Controller
            name="power"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                label="Výkon"
                placeholder="2×22 kW"
              />
            )}
          />
          <Controller
            name="product_category"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                label="Kategorie (schema.org)"
                placeholder="Nabíjecí stanice pro elektromobily"
              />
            )}
          />
        </div>
      </Card>

      {/* Manufacturer Info */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium text-text-primary">
          Výrobce
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Controller
            name="manufacturer_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                label="Název výrobce"
                placeholder="ELEXIM, a.s."
              />
            )}
          />
          <Controller
            name="manufacturer_url"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                label="URL výrobce"
                placeholder="https://mybox.eco"
              />
            )}
          />
          <Controller
            name="country_of_origin"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value || ''}
                label="Země původu"
                placeholder="CZ"
                hint="ISO kód země (CZ, DE, IT...)"
              />
            )}
          />
        </div>
      </Card>
    </div>
  )
}
