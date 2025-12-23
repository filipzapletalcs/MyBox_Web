'use client'

import { useState } from 'react'
import { useFieldArray, Control } from 'react-hook-form'
import { Plus, Trash2, GripVertical, Zap, Wifi, Shield, Thermometer, Gauge, Cable } from 'lucide-react'
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
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'

interface FeaturePointTranslation {
  locale: 'cs' | 'en' | 'de'
  label: string
  value: string
}

interface FeaturePoint {
  icon: 'power' | 'protocol' | 'connectivity' | 'protection' | 'meter' | 'temperature'
  position: 'left' | 'right'
  sort_order: number
  translations: FeaturePointTranslation[]
}

interface ProductFeaturePointsManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

const ICON_OPTIONS = [
  { value: 'power', label: 'Výkon', icon: Zap },
  { value: 'protocol', label: 'Protokol', icon: Cable },
  { value: 'connectivity', label: 'Konektivita', icon: Wifi },
  { value: 'protection', label: 'Ochrana', icon: Shield },
  { value: 'meter', label: 'Elektroměr', icon: Gauge },
  { value: 'temperature', label: 'Teplota', icon: Thermometer },
]

const POSITION_OPTIONS = [
  { value: 'left', label: 'Vlevo' },
  { value: 'right', label: 'Vpravo' },
]

// Get icon component
function getIconComponent(iconKey: string) {
  const option = ICON_OPTIONS.find((o) => o.value === iconKey)
  return option?.icon || Zap
}

// Sortable feature point item
function SortableFeaturePointItem({
  id,
  point,
  index,
  onRemove,
  onUpdate,
}: {
  id: string
  point: FeaturePoint & { id: string }
  index: number
  onRemove: () => void
  onUpdate: (data: Partial<FeaturePoint>) => void
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
    return point.translations?.find((t) => t.locale === locale)
  }

  const updateTranslation = (locale: Locale, field: 'label' | 'value', fieldValue: string) => {
    const existingTranslations = point.translations || []
    const existingIndex = existingTranslations.findIndex((t) => t.locale === locale)

    let newTranslations: FeaturePointTranslation[]
    if (existingIndex >= 0) {
      newTranslations = existingTranslations.map((t, i) =>
        i === existingIndex ? { ...t, [field]: fieldValue } : t
      )
    } else {
      newTranslations = [
        ...existingTranslations,
        { locale, label: field === 'label' ? fieldValue : '', value: field === 'value' ? fieldValue : '' },
      ]
    }

    onUpdate({ translations: newTranslations })
  }

  const getLocaleStatus = (locale: Locale): LocaleStatus => {
    const translation = getTranslation(locale)
    if (!translation || !translation.label || !translation.value) return 'empty'
    return 'complete'
  }

  const localeStatus: Record<Locale, LocaleStatus> = {
    cs: getLocaleStatus('cs'),
    en: getLocaleStatus('en'),
    de: getLocaleStatus('de'),
  }

  const IconComponent = getIconComponent(point.icon)

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

        {/* Icon preview */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10">
          <IconComponent className="h-6 w-6 text-green-500" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Icon and position selectors */}
          <div className="flex items-center gap-4">
            <div className="w-48">
              <Select
                value={point.icon}
                onValueChange={(value) => onUpdate({ icon: value as FeaturePoint['icon'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte ikonu" />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <Select
                value={point.position}
                onValueChange={(value) => onUpdate({ position: value as 'left' | 'right' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pozice" />
                </SelectTrigger>
                <SelectContent>
                  {POSITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Translations */}
          <div>
            <LocaleTabs
              activeLocale={activeLocale}
              onLocaleChange={setActiveLocale}
              localeStatus={localeStatus}
            />
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <Input
                value={getTranslation(activeLocale)?.label || ''}
                onChange={(e) => updateTranslation(activeLocale, 'label', e.target.value)}
                placeholder={`Label (${activeLocale.toUpperCase()})`}
                size="sm"
              />
              <Input
                value={getTranslation(activeLocale)?.value || ''}
                onChange={(e) => updateTranslation(activeLocale, 'value', e.target.value)}
                placeholder={`Hodnota (${activeLocale.toUpperCase()})`}
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

export function ProductFeaturePointsManager({ control }: ProductFeaturePointsManagerProps) {
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: 'feature_points',
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

  const handleAddFeaturePoint = () => {
    append({
      icon: 'power',
      position: 'left',
      sort_order: fields.length,
      translations: [
        { locale: 'cs', label: '', value: '' },
      ],
    })
  }

  const handleUpdateFeaturePoint = (index: number, data: Partial<FeaturePoint>) => {
    const currentField = fields[index] as FeaturePoint & { id: string }
    update(index, { ...currentField, ...data })
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-text-primary">
            Feature Points
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Klíčové vlastnosti zobrazené na obrázku produktu (max 6)
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddFeaturePoint}
          disabled={fields.length >= 6}
        >
          <Plus className="mr-2 h-4 w-4" />
          Přidat bod
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border-subtle p-8 text-center">
          <p className="text-sm text-text-muted">
            Zatím žádné feature points. Klikněte na "Přidat bod".
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
                <SortableFeaturePointItem
                  key={field.id}
                  id={field.id}
                  point={field as FeaturePoint & { id: string }}
                  index={index}
                  onRemove={() => remove(index)}
                  onUpdate={(data) => handleUpdateFeaturePoint(index, data)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {fields.length > 0 && fields.length < 6 && (
        <p className="mt-4 text-center text-xs text-text-muted">
          {6 - fields.length} zbývajících slotů
        </p>
      )}
    </Card>
  )
}
