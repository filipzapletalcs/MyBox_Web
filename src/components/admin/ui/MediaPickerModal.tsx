'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Upload,
  Search,
  Check,
  RefreshCw,
  Image as ImageIcon,
  AlertCircle,
  Grid3X3,
} from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  url: string
  bucket: string
  path: string
  created_at: string
  metadata?: {
    size?: number
    mimetype?: string
  }
}

interface UploadingFile {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  url?: string
}

interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  bucket?: 'article-images' | 'product-images' | 'media'
  uploadBucket?: 'article-images' | 'product-images' | 'media'
  title?: string
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  bucket = 'media', // 'media' = show all files
  uploadBucket = 'article-images', // where to upload new files
  title = 'Vybrat obrázek',
}: MediaPickerModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/media?bucket=${bucket}`)
      const data = await response.json()
      if (response.ok) {
        setFiles(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setIsLoading(false)
    }
  }, [bucket])

  useEffect(() => {
    if (open) {
      fetchFiles()
      setSelectedFile(null)
      setSearchQuery('')
    }
  }, [open, fetchFiles])

  const filteredFiles = files.filter((file) => {
    if (!searchQuery) return true
    return file.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const isImage = (file: MediaFile): boolean => {
    return (
      file.metadata?.mimetype?.startsWith('image/') ||
      file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
    )
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Handle file upload
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFilesSelected(Array.from(e.dataTransfer.files))
      }
    },
    []
  )

  const handleFilesSelected = async (newFiles: File[]) => {
    // Filter only images
    const imageFiles = newFiles.filter((f) => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    // Add to uploading list
    const uploadFiles: UploadingFile[] = imageFiles.map((file) => ({
      file,
      status: 'pending' as const,
      progress: 0,
    }))
    setUploadingFiles(uploadFiles)

    // Upload each file
    for (let i = 0; i < uploadFiles.length; i++) {
      setUploadingFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: 'uploading' as const } : f
        )
      )

      const formData = new FormData()
      formData.append('file', uploadFiles[i].file)
      formData.append('bucket', uploadBucket)

      try {
        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed')
        }

        setUploadingFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: 'success' as const, url: data.data.url }
              : f
          )
        )
      } catch (error) {
        setUploadingFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : f
          )
        )
      }
    }

    // Refresh file list after all uploads
    await fetchFiles()
    setUploadingFiles([])
  }

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile.url)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Search and Upload */}
        <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hledat obrázky..."
              className="pl-10"
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files && handleFilesSelected(Array.from(e.target.files))
            }
          />
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Nahrát
          </Button>
          <Button variant="ghost" size="icon" onClick={fetchFiles}>
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        {/* Drop zone overlay when dragging */}
        <div
          className="relative flex-1 overflow-hidden"
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setIsDragging(false)
          }}
        >
          {isDragging && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed border-green-500 bg-green-500/10">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-green-400" />
                <p className="mt-2 text-lg font-medium text-green-400">
                  Pusťte pro nahrání
                </p>
              </div>
            </div>
          )}

          {/* Uploading files */}
          {uploadingFiles.length > 0 && (
            <div className="mb-4 space-y-2">
              {uploadingFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-tertiary p-2"
                >
                  <div className="h-8 w-8 rounded bg-bg-secondary flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-text-muted" />
                  </div>
                  <span className="flex-1 truncate text-sm">
                    {file.file.name}
                  </span>
                  {file.status === 'uploading' && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                  )}
                  {file.status === 'success' && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Files grid */}
          <div className="overflow-y-auto max-h-[50vh] pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="h-8 w-8 animate-spin text-text-muted" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Grid3X3 className="h-12 w-12 text-text-muted" />
                <h3 className="mt-4 text-lg font-medium text-text-primary">
                  {searchQuery ? 'Nic nenalezeno' : 'Žádné obrázky'}
                </h3>
                <p className="mt-1 text-text-secondary">
                  {searchQuery
                    ? 'Zkuste jiný vyhledávací dotaz'
                    : 'Nahrajte první obrázek přetažením nebo tlačítkem'}
                </p>
                {!searchQuery && (
                  <Button
                    className="mt-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Nahrát obrázek
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFile?.id === file.id
                  return (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => setSelectedFile(file)}
                      onDoubleClick={() => {
                        setSelectedFile(file)
                        onSelect(file.url)
                        onClose()
                      }}
                      className={`group relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-green-500 ring-2 ring-green-500/20'
                          : 'border-transparent hover:border-border-default'
                      }`}
                    >
                      {isImage(file) ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-bg-tertiary">
                          <ImageIcon className="h-8 w-8 text-text-muted" />
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                          <div className="rounded-full bg-green-500 p-1">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                      {/* Hover info */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="truncate text-xs text-white">
                          {file.name}
                        </p>
                        {file.metadata?.size && (
                          <p className="text-xs text-white/60">
                            {formatFileSize(file.metadata.size)}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-subtle pt-4">
          <div className="text-sm text-text-muted">
            {selectedFile ? (
              <span className="text-text-primary">{selectedFile.name}</span>
            ) : (
              'Vyberte obrázek nebo přetáhněte nový'
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Zrušit
            </Button>
            <Button onClick={handleSelect} disabled={!selectedFile}>
              <Check className="mr-2 h-4 w-4" />
              Vybrat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
