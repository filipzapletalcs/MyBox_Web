'use client'

import { useState } from 'react'
import { useFieldArray, Control, useWatch } from 'react-hook-form'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button, Card, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui'
import { FeaturedImagePicker } from '@/components/admin/ui/FeaturedImagePicker'
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'

interface ColorVariantTranslation {
  locale: 'cs' | 'en' | 'de'
  label: string
}

interface ColorVariant {
  color_key: string
  image_url: string
  sort_order: number
  translations: ColorVariantTranslation[]
}

interface ProductColorVariantsManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

const COLOR_OPTIONS = [
  { value: 'black', label: 'Černá' },
  { value: 'white', label: 'Bílá' },
  { value: 'silver', label: 'Stříbrná' },
  { value: 'red', label: 'Červená' },
  { value: 'blue', label: 'Modrá' },
  { value: 'green', label: 'Zelená' },
  { value: 'custom', label: 'Vlastní' },
]

// Sortable variant item
function SortableVariantItem({
  id,
  variant,
  index,
  onRemove,
  onUpdate,
}: {
  id: string
  variant: ColorVariant & { id: string }
  index: number
  onRemove: () => void
  onUpdate: (data: Partial<ColorVariant>) => void
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getTranslation = (locale: Locale) => {
    return variant.translations?.find((t) => t.locale === locale)
  }

  const updateTranslation = (locale: Locale, label: string) => {
    const existingTranslations = variant.translations || []
    const existingIndex = existingTranslations.findIndex((t) => t.locale === locale)

    let newTranslations: ColorVariantTranslation[]
    if (existingIndex >= 0) {
      newTranslations = existingTranslations.map((t, i) =>
        i === existingIndex ? { ...t, label } : t
      )
    } else {
      newTranslations = [...existingTranslations, { locale, label }]
    }

    onUpdate({ translations: newTranslations })
  }

  const getLocaleStatus = (locale: Locale): LocaleStatus => {
    const translation = getTranslation(locale)
    if (!translation || !translation.label) return 'empty'
    return 'complete'
  }

  const localeStatus: Record<Locale, LocaleStatus> = {
    cs: getLocaleStatus('cs'),
    en: getLocaleStatus('en'),
    de: getLocaleStatus('de'),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-border-subtle bg-bg-secondary p-4"
    >
      <div className="flex items-start gap-4">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab text-text-muted hover:text-text-secondary"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Image */}
        <div className="w-32 flex-shrink-0">
          <FeaturedImagePicker
            value={variant.image_url}
            onChange={(url) => onUpdate({ image_url: url || '' })}
            label=""
            bucket="product-images"
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Color key */}
          <div className="flex items-center gap-4">
            <div className="w-48">
              <Select
                value={variant.color_key}
                onValueChange={(value) => onUpdate({ color_key: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte barvu" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {variant.color_key === 'custom' && (
              <Input
                value={variant.color_key}
                onChange={(e) => onUpdate({ color_key: e.target.value })}
                placeholder="Vlastní klíč barvy"
                className="w-48"
              />
            )}
          </div>

          {/* Translations */}
          <div>
            <LocaleTabs
              activeLocale={activeLocale}
              onLocaleChange={setActiveLocale}
              localeStatus={localeStatus}
            />
            <div className="mt-2">
              <Input
                value={getTranslation(activeLocale)?.label || ''}
                onChange={(e) => updateTranslation(activeLocale, e.target.value)}
                placeholder={`Label (${activeLocale.toUpperCase()})`}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Remove button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function ProductColorVariantsManager({ control }: ProductColorVariantsManagerProps) {
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: 'color_variants',
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)
      move(oldIndex, newIndex)
    }
  }

  const handleAddVariant = () => {
    append({
      color_key: 'black',
      image_url: '',
      sort_order: fields.length,
      translations: [
        { locale: 'cs', label: '' },
      ],
    })
  }

  const handleUpdateVariant = (index: number, data: Partial<ColorVariant>) => {
    const currentField = fields[index] as ColorVariant & { id: string }
    update(index, { ...currentField, ...data })
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-text-primary">
            Barevné varianty
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Přidejte barevné varianty produktu (černá/bílá atd.)
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddVariant}
        >
          <Plus className="mr-2 h-4 w-4" />
          Přidat variantu
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border-subtle p-8 text-center">
          <p className="text-sm text-text-muted">
            Zatím žádné barevné varianty. Klikněte na "Přidat variantu".
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {fields.map((field, index) => (
                <SortableVariantItem
                  key={field.id}
                  id={field.id}
                  variant={field as ColorVariant & { id: string }}
                  index={index}
                  onRemove={() => remove(index)}
                  onUpdate={(data) => handleUpdateVariant(index, data)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </Card>
  )
}
