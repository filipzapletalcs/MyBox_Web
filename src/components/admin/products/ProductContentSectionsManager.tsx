'use client'

import { useState } from 'react'
import { useFieldArray, Control } from 'react-hook-form'
import { Plus, Trash2, GripVertical, FileText } from 'lucide-react'
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
import { Button, Card, Input, Textarea } from '@/components/ui'
import { FeaturedImagePicker } from '@/components/admin/ui/FeaturedImagePicker'
import { LocaleTabs, type Locale, type LocaleStatus } from '@/components/admin/ui/LocaleTabs'

interface ContentSectionTranslation {
  locale: 'cs' | 'en' | 'de'
  title: string
  subtitle?: string | null
  content: string
}

interface ContentSection {
  image_url?: string | null
  image_alt?: string | null
  sort_order: number
  translations: ContentSectionTranslation[]
}

interface ProductContentSectionsManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

// Sortable content section item
function SortableContentSectionItem({
  id,
  section,
  index,
  onRemove,
  onUpdate,
}: {
  id: string
  section: ContentSection & { id: string }
  index: number
  onRemove: () => void
  onUpdate: (data: Partial<ContentSection>) => void
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>('cs')
  const [isExpanded, setIsExpanded] = useState(true)

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
    return section.translations?.find((t) => t.locale === locale)
  }

  const updateTranslation = (locale: Locale, field: 'title' | 'subtitle' | 'content', fieldValue: string) => {
    const existingTranslations = section.translations || []
    const existingIndex = existingTranslations.findIndex((t) => t.locale === locale)

    let newTranslations: ContentSectionTranslation[]
    if (existingIndex >= 0) {
      newTranslations = existingTranslations.map((t, i) =>
        i === existingIndex ? { ...t, [field]: fieldValue } : t
      )
    } else {
      newTranslations = [
        ...existingTranslations,
        {
          locale,
          title: field === 'title' ? fieldValue : '',
          subtitle: field === 'subtitle' ? fieldValue : '',
          content: field === 'content' ? fieldValue : '',
        },
      ]
    }

    onUpdate({ translations: newTranslations })
  }

  const getLocaleStatus = (locale: Locale): LocaleStatus => {
    const translation = getTranslation(locale)
    if (!translation || !translation.title || !translation.content) return 'empty'
    return 'complete'
  }

  const localeStatus: Record<Locale, LocaleStatus> = {
    cs: getLocaleStatus('cs'),
    en: getLocaleStatus('en'),
    de: getLocaleStatus('de'),
  }

  const currentTranslation = getTranslation(activeLocale)
  const sectionTitle = getTranslation('cs')?.title || `Sekce ${index + 1}`

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-border-subtle bg-bg-secondary"
    >
      {/* Header - always visible */}
      <div className="flex items-center gap-4 p-4">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-text-muted hover:text-text-secondary"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Section number */}
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-green-500/10 text-sm font-medium text-green-500">
          {index + 1}
        </div>

        {/* Section title */}
        <div className="flex-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-left"
          >
            <h4 className="font-medium text-text-primary">{sectionTitle}</h4>
            <p className="text-xs text-text-muted">
              {section.image_url ? 'S obrázkem' : 'Bez obrázku'}
            </p>
          </button>
        </div>

        {/* Expand/collapse button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Sbalit' : 'Rozbalit'}
        </Button>

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

      {/* Content - expandable */}
      {isExpanded && (
        <div className="border-t border-border-subtle p-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Image */}
            <div>
              <FeaturedImagePicker
                value={section.image_url}
                onChange={(url) => onUpdate({ image_url: url })}
                label="Obrázek sekce"
                bucket="product-images"
              />
              <div className="mt-2">
                <Input
                  value={section.image_alt || ''}
                  onChange={(e) => onUpdate({ image_alt: e.target.value })}
                  placeholder="Alt text obrázku"
                  size="sm"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="lg:col-span-2 space-y-4">
              <LocaleTabs
                activeLocale={activeLocale}
                onLocaleChange={setActiveLocale}
                localeStatus={localeStatus}
              />

              <Input
                value={currentTranslation?.title || ''}
                onChange={(e) => updateTranslation(activeLocale, 'title', e.target.value)}
                label="Titulek"
                placeholder={`Titulek sekce (${activeLocale.toUpperCase()})`}
              />

              <Input
                value={currentTranslation?.subtitle || ''}
                onChange={(e) => updateTranslation(activeLocale, 'subtitle', e.target.value)}
                label="Podtitulek (volitelný)"
                placeholder={`Podtitulek (${activeLocale.toUpperCase()})`}
              />

              <Textarea
                value={currentTranslation?.content || ''}
                onChange={(e) => updateTranslation(activeLocale, 'content', e.target.value)}
                label="Obsah"
                placeholder={`Text sekce (${activeLocale.toUpperCase()})`}
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function ProductContentSectionsManager({ control }: ProductContentSectionsManagerProps) {
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: 'content_sections',
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

  const handleAddSection = () => {
    append({
      image_url: null,
      image_alt: null,
      sort_order: fields.length,
      translations: [
        { locale: 'cs', title: '', subtitle: '', content: '' },
      ],
    })
  }

  const handleUpdateSection = (index: number, data: Partial<ContentSection>) => {
    const currentField = fields[index] as ContentSection & { id: string }
    update(index, { ...currentField, ...data })
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-text-primary">
            Content Sections
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            SEO sekce s obrázky a textem pro produktovou stránku
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddSection}
        >
          <Plus className="mr-2 h-4 w-4" />
          Přidat sekci
        </Button>
      </div>

      {fields.length === 0 ? (
        <button
          type="button"
          onClick={handleAddSection}
          className="w-full rounded-xl border-2 border-dashed border-border-subtle p-12 transition-colors hover:border-green-500/50 hover:bg-green-500/5"
        >
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-bg-tertiary p-4">
              <FileText className="h-8 w-8 text-text-muted" />
            </div>
            <p className="mt-4 text-sm font-medium text-text-primary">
              Zatím žádné content sekce
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Klikněte pro přidání první sekce
            </p>
          </div>
        </button>
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
                <SortableContentSectionItem
                  key={field.id}
                  id={field.id}
                  section={field as ContentSection & { id: string }}
                  index={index}
                  onRemove={() => remove(index)}
                  onUpdate={(data) => handleUpdateSection(index, data)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </Card>
  )
}
