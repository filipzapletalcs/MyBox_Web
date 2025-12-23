'use client'

import { useState } from 'react'
import { useFieldArray, Control } from 'react-hook-form'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2, ImageIcon } from 'lucide-react'
import { Button, Card, Input } from '@/components/ui'
import { MediaPickerModal } from '@/components/admin/ui/MediaPickerModal'

interface GalleryImage {
  url: string
  alt?: string | null
  is_primary?: boolean
  sort_order?: number
}

interface ProductGalleryManagerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

// Sortable image item component
function SortableImageItem({
  id,
  image,
  index,
  onRemove,
  onAltChange,
}: {
  id: string
  image: GalleryImage
  index: number
  onRemove: () => void
  onAltChange: (alt: string) => void
}) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden rounded-lg border border-border-subtle bg-bg-secondary"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-2 z-10 cursor-grab rounded bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4 text-white" />
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 z-10 rounded bg-red-500/80 p-1 opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4 text-white" />
      </button>

      {/* Image index badge */}
      <div className="absolute left-2 bottom-2 z-10 rounded bg-black/50 px-2 py-0.5 text-xs text-white">
        {index + 1}
      </div>

      {/* Image preview */}
      <div className="aspect-[4/3] bg-bg-tertiary">
        <img
          src={image.url}
          alt={image.alt || `Obrázek ${index + 1}`}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>

      {/* Alt text input */}
      <div className="p-2">
        <Input
          value={image.alt || ''}
          onChange={(e) => onAltChange(e.target.value)}
          placeholder="Popis obrázku (alt)"
          size="sm"
        />
      </div>
    </div>
  )
}

export function ProductGalleryManager({ control }: ProductGalleryManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: 'images',
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

  const handleAddImage = (url: string) => {
    append({
      url,
      alt: '',
      is_primary: fields.length === 0,
      sort_order: fields.length,
    })
    setIsModalOpen(false)
  }

  const handleRemoveImage = (index: number) => {
    remove(index)
  }

  const handleAltChange = (index: number, alt: string) => {
    const currentField = fields[index] as GalleryImage & { id: string }
    update(index, { ...currentField, alt })
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-text-primary">
            Galerie obrázků
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Přetažením změníte pořadí obrázků
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Přidat obrázek
        </Button>
      </div>

      {fields.length === 0 ? (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full rounded-xl border-2 border-dashed border-border-subtle p-12 transition-colors hover:border-green-500/50 hover:bg-green-500/5"
        >
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-bg-tertiary p-4">
              <ImageIcon className="h-8 w-8 text-text-muted" />
            </div>
            <p className="mt-4 text-sm font-medium text-text-primary">
              Zatím žádné obrázky v galerii
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Klikněte pro přidání prvního obrázku
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
            strategy={rectSortingStrategy}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {fields.map((field, index) => (
                <SortableImageItem
                  key={field.id}
                  id={field.id}
                  image={field as GalleryImage & { id: string }}
                  index={index}
                  onRemove={() => handleRemoveImage(index)}
                  onAltChange={(alt) => handleAltChange(index, alt)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleAddImage}
        bucket="product-images"
        uploadBucket="product-images"
        title="Přidat obrázek do galerie"
      />
    </Card>
  )
}
