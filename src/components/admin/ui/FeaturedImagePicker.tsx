'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { MediaPickerModal } from './MediaPickerModal'
import { Image as ImageIcon, X, ImagePlus } from 'lucide-react'

interface FeaturedImagePickerProps {
  value?: string | null
  onChange: (url: string | null) => void
  error?: string
  label?: string
  hint?: string
  bucket?: 'article-images' | 'product-images' | 'media'
}

export function FeaturedImagePicker({
  value,
  onChange,
  error,
  label = 'Náhledový obrázek',
  hint,
  bucket = 'article-images',
}: FeaturedImagePickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium text-text-primary">
          {label}
        </label>
      )}

      {value ? (
        // Image preview
        <div className="group relative overflow-hidden rounded-xl border border-border-subtle">
          <div className="aspect-video bg-bg-tertiary">
            <img
              src={value}
              alt="Náhled"
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          {/* Overlay actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Změnit
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300"
            >
              <X className="mr-2 h-4 w-4" />
              Odebrat
            </Button>
          </div>
        </div>
      ) : (
        // Empty state - click to select
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full rounded-xl border-2 border-dashed border-border-subtle p-8 transition-colors hover:border-green-500/50 hover:bg-green-500/5"
        >
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-bg-tertiary p-3">
              <ImageIcon className="h-6 w-6 text-text-muted" />
            </div>
            <p className="mt-3 text-sm font-medium text-text-primary">
              Vybrat obrázek
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Klikněte pro výběr z knihovny nebo nahrajte nový
            </p>
          </div>
        </button>
      )}

      {hint && !error && (
        <p className="mt-2 text-xs text-text-muted">{hint}</p>
      )}

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}

      {/* Modal */}
      <MediaPickerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(url) => {
          onChange(url)
          setIsModalOpen(false)
        }}
        bucket="media"
        uploadBucket={bucket}
        title="Vybrat náhledový obrázek"
      />
    </div>
  )
}
