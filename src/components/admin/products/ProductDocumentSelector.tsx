'use client'

import { useState, useEffect } from 'react'
import { useFieldArray, Control } from 'react-hook-form'
import { FileText, Plus, Trash2, GripVertical, Search, Loader2 } from 'lucide-react'
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
import { Button, Card, Input } from '@/components/ui'

interface Document {
  id: string
  slug: string
  category_id: string
  document_translations: {
    locale: string
    title: string
    description?: string
  }[]
  document_categories?: {
    id: string
    slug: string
    document_category_translations: {
      locale: string
      name: string
    }[]
  }
}

interface ProductDocument {
  document_id: string
  sort_order: number
}

interface ProductDocumentSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

// Helper to get document title
function getDocumentTitle(doc: Document, locale: string = 'cs'): string {
  const translation = doc.document_translations?.find((t) => t.locale === locale)
  return translation?.title || doc.document_translations?.[0]?.title || doc.slug
}

// Helper to get category name
function getCategoryName(doc: Document, locale: string = 'cs'): string {
  const translation = doc.document_categories?.document_category_translations?.find(
    (t) => t.locale === locale
  )
  return translation?.name || doc.document_categories?.slug || 'Bez kategorie'
}

// Sortable document item
function SortableDocumentItem({
  id,
  document,
  index,
  onRemove,
}: {
  id: string
  document: Document
  index: number
  onRemove: () => void
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
      className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-secondary p-3"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-text-muted hover:text-text-secondary"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Document icon */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-500/10">
        <FileText className="h-5 w-5 text-blue-500" />
      </div>

      {/* Document info */}
      <div className="flex-1 min-w-0">
        <p className="truncate font-medium text-text-primary">
          {getDocumentTitle(document)}
        </p>
        <p className="text-xs text-text-muted">
          {getCategoryName(document)}
        </p>
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
  )
}

export function ProductDocumentSelector({ control }: ProductDocumentSelectorProps) {
  const [availableDocuments, setAvailableDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'documents',
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Fetch available documents
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch('/api/documents?active=true')
        if (response.ok) {
          const result = await response.json()
          setAvailableDocuments(result.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDocuments()
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id)
      const newIndex = fields.findIndex((field) => field.id === over.id)
      move(oldIndex, newIndex)
    }
  }

  const selectedDocumentIds = fields.map((f) => (f as ProductDocument & { id: string }).document_id)

  const filteredDocuments = availableDocuments.filter((doc) => {
    // Filter out already selected
    if (selectedDocumentIds.includes(doc.id)) return false

    // Filter by search query
    if (searchQuery) {
      const title = getDocumentTitle(doc).toLowerCase()
      const category = getCategoryName(doc).toLowerCase()
      const query = searchQuery.toLowerCase()
      return title.includes(query) || category.includes(query)
    }

    return true
  })

  const handleAddDocument = (documentId: string) => {
    append({
      document_id: documentId,
      sort_order: fields.length,
    })
  }

  const getDocumentById = (documentId: string): Document | undefined => {
    return availableDocuments.find((d) => d.id === documentId)
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-text-primary">
            Propojené dokumenty
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Datasheety, manuály a další dokumenty k produktu
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsPickerOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Přidat dokument
        </Button>
      </div>

      {/* Selected documents */}
      {fields.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border-subtle p-8 text-center">
          <p className="text-sm text-text-muted">
            Zatím žádné propojené dokumenty.
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
            <div className="space-y-2">
              {fields.map((field, index) => {
                const productDoc = field as ProductDocument & { id: string }
                const document = getDocumentById(productDoc.document_id)
                if (!document) return null

                return (
                  <SortableDocumentItem
                    key={field.id}
                    id={field.id}
                    document={document}
                    index={index}
                    onRemove={() => remove(index)}
                  />
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Document picker modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-bg-primary p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-medium text-text-primary">
                Vybrat dokument
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsPickerOpen(false)}
              >
                Zavřít
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hledat dokumenty..."
                className="pl-10"
              />
            </div>

            {/* Document list */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <p className="py-8 text-center text-sm text-text-muted">
                  {searchQuery ? 'Žádné dokumenty nenalezeny' : 'Všechny dokumenty jsou již přidány'}
                </p>
              ) : (
                <div className="space-y-2">
                  {filteredDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => {
                        handleAddDocument(doc.id)
                        setIsPickerOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-border-subtle p-3 text-left transition-colors hover:bg-bg-secondary"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-blue-500/10">
                        <FileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-text-primary">
                          {getDocumentTitle(doc)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {getCategoryName(doc)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
