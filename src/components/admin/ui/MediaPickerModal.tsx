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
  LayoutGrid,
  Package,
  FileImage,
  FolderOpen,
  Layers,
  Play,
  Video as VideoIcon,
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

type ViewMode = 'small' | 'large'
type BucketFilter = 'all' | 'product-images' | 'article-images'

const BUCKET_TABS: { id: BucketFilter; label: string; icon: typeof Package }[] = [
  { id: 'all', label: 'Vše', icon: Layers },
  { id: 'product-images', label: 'Produkty', icon: Package },
  { id: 'article-images', label: 'Články', icon: FileImage },
]

type MediaType = 'image' | 'video' | 'all'

interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  bucket?: 'article-images' | 'product-images' | 'media' | 'team-images'
  uploadBucket?: 'article-images' | 'product-images' | 'media' | 'team-images'
  title?: string
  mediaType?: MediaType
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  bucket = 'media', // 'media' = show all files
  uploadBucket = 'article-images', // where to upload new files
  title = 'Vybrat obrázek',
  mediaType = 'all',
}: MediaPickerModalProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('small')
  const [bucketFilter, setBucketFilter] = useState<BucketFilter>('all')
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
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
      setFailedImages(new Set())
    }
  }, [open, fetchFiles])

  // Helper functions - must be defined before filteredFiles
  const isImage = (file: MediaFile): boolean => {
    return (
      file.metadata?.mimetype?.startsWith('image/') ||
      file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
    )
  }

  const isVideo = (file: MediaFile): boolean => {
    return (
      file.metadata?.mimetype?.startsWith('video/') ||
      file.name.match(/\.(mp4|webm|mov|avi|mkv|m4v)$/i) !== null
    )
  }

  const matchesMediaType = (file: MediaFile): boolean => {
    if (mediaType === 'all') return true
    if (mediaType === 'image') return isImage(file)
    if (mediaType === 'video') return isVideo(file)
    return true
  }

  // Filter files by search, bucket and media type
  const filteredFiles = files.filter((file) => {
    // Media type filter (image/video)
    if (!matchesMediaType(file)) {
      return false
    }
    // Bucket filter
    if (bucketFilter !== 'all' && file.bucket !== bucketFilter) {
      return false
    }
    // Search filter
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleImageError = (fileId: string) => {
    setFailedImages((prev) => new Set([...prev, fileId]))
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
    // Filter files based on mediaType
    let validFiles: File[]
    if (mediaType === 'video') {
      validFiles = newFiles.filter((f) => f.type.startsWith('video/'))
    } else if (mediaType === 'image') {
      validFiles = newFiles.filter((f) => f.type.startsWith('image/'))
    } else {
      // 'all' - accept both images and videos
      validFiles = newFiles.filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'))
    }
    if (validFiles.length === 0) return

    // Add to uploading list
    const uploadFiles: UploadingFile[] = validFiles.map((file) => ({
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

  const gridCols = viewMode === 'large'
    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
    : 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8'

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle pb-4">
          {/* Bucket tabs */}
          <div className="flex rounded-lg bg-bg-tertiary p-1">
            {BUCKET_TABS.map((tab) => {
              const Icon = tab.icon
              const count = tab.id === 'all'
                ? files.length
                : files.filter(f => f.bucket === tab.id).length
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBucketFilter(tab.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    bucketFilter === tab.id
                      ? 'bg-bg-secondary text-text-primary shadow-sm'
                      : 'text-text-muted hover:text-text-secondary'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                  <span className="ml-1 rounded-full bg-bg-secondary px-1.5 py-0.5 text-[10px]">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hledat..."
              className="pl-10 h-9"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex rounded-lg bg-bg-tertiary p-1">
            <button
              type="button"
              onClick={() => setViewMode('small')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'small'
                  ? 'bg-bg-secondary text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
              title="Malá mřížka"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('large')}
              className={`rounded-md p-1.5 transition-colors ${
                viewMode === 'large'
                  ? 'bg-bg-secondary text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
              title="Velká mřížka"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={mediaType === 'video' ? 'video/*' : mediaType === 'image' ? 'image/*' : 'image/*,video/*'}
            className="hidden"
            onChange={(e) =>
              e.target.files && handleFilesSelected(Array.from(e.target.files))
            }
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Nahrát
          </Button>
          <Button variant="ghost" size="icon" onClick={fetchFiles} className="h-9 w-9">
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Files grid */}
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
                      {file.file.type.startsWith('video/') ? (
                        <VideoIcon className="h-4 w-4 text-purple-400" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-text-muted" />
                      )}
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
            <div className="overflow-y-auto max-h-[55vh] pr-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <RefreshCw className="h-8 w-8 animate-spin text-text-muted" />
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FolderOpen className="h-12 w-12 text-text-muted" />
                  <h3 className="mt-4 text-lg font-medium text-text-primary">
                    {searchQuery ? 'Nic nenalezeno' : mediaType === 'video' ? 'Žádná videa' : mediaType === 'image' ? 'Žádné obrázky' : 'Žádné soubory'}
                  </h3>
                  <p className="mt-1 text-text-secondary">
                    {searchQuery
                      ? 'Zkuste jiný vyhledávací dotaz'
                      : mediaType === 'video'
                        ? 'Nahrajte první video přetažením nebo tlačítkem'
                        : 'Nahrajte první obrázek přetažením nebo tlačítkem'}
                  </p>
                  {!searchQuery && (
                    <Button
                      className="mt-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {mediaType === 'video' ? 'Nahrát video' : 'Nahrát obrázek'}
                    </Button>
                  )}
                </div>
              ) : (
                <div className={`grid gap-2 ${gridCols}`}>
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFile?.id === file.id
                    const hasFailed = failedImages.has(file.id)
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
                        {isImage(file) && !hasFailed ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onError={() => handleImageError(file.id)}
                          />
                        ) : isVideo(file) ? (
                          <div className="relative h-full w-full bg-bg-tertiary">
                            <video
                              src={file.url}
                              className="h-full w-full object-cover"
                              muted
                              playsInline
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause()
                                e.currentTarget.currentTime = 0
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="rounded-full bg-black/50 p-2">
                                <Play className="h-4 w-4 text-white" fill="white" />
                              </div>
                            </div>
                            <div className="absolute top-1 right-1">
                              <span className="rounded bg-purple-600 px-1.5 py-0.5 text-[9px] font-medium text-white">
                                VIDEO
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center bg-bg-tertiary p-2">
                            <ImageIcon className="h-6 w-6 text-text-muted" />
                            <span className="mt-1 text-[10px] text-text-muted truncate w-full text-center">
                              {file.name.slice(0, 15)}
                            </span>
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
                            <div className="rounded-full bg-green-500 p-1.5">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                        {/* Hover info */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="truncate text-[10px] text-white">
                            {file.name}
                          </p>
                          {file.metadata?.size && (
                            <p className="text-[9px] text-white/60">
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

          {/* Preview panel */}
          {selectedFile && (
            <div className="w-64 shrink-0 rounded-xl border border-border-subtle bg-bg-tertiary p-4">
              <h4 className="text-xs font-medium text-text-muted mb-3">Náhled</h4>

              {/* Large preview */}
              <div className="aspect-square rounded-lg overflow-hidden bg-bg-secondary mb-3">
                {isImage(selectedFile) && !failedImages.has(selectedFile.id) ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.name}
                    className="h-full w-full object-contain"
                  />
                ) : isVideo(selectedFile) ? (
                  <div className="relative h-full w-full">
                    <video
                      src={selectedFile.url}
                      className="h-full w-full object-contain"
                      controls
                      muted
                    />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <VideoIcon className="h-12 w-12 text-text-muted" />
                  </div>
                )}
              </div>

              {/* File type badge */}
              {isVideo(selectedFile) && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 rounded bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-400">
                    <VideoIcon className="h-3 w-3" />
                    Video
                  </span>
                </div>
              )}

              {/* File info */}
              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-text-muted">Název</p>
                  <p className="text-text-primary truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                </div>
                {selectedFile.metadata?.size && (
                  <div>
                    <p className="text-text-muted">Velikost</p>
                    <p className="text-text-primary">
                      {formatFileSize(selectedFile.metadata.size)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-text-muted">Bucket</p>
                  <p className="text-text-primary">{selectedFile.bucket}</p>
                </div>
                <div>
                  <p className="text-text-muted">Cesta</p>
                  <p className="text-text-primary truncate text-[10px]" title={selectedFile.path}>
                    {selectedFile.path}
                  </p>
                </div>
              </div>

              {/* Quick select button */}
              <Button
                className="w-full mt-4"
                size="sm"
                onClick={handleSelect}
              >
                <Check className="mr-2 h-4 w-4" />
                {isVideo(selectedFile) ? 'Použít toto video' : 'Použít tento obrázek'}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-subtle pt-4">
          <div className="text-sm text-text-muted">
            {filteredFiles.length} {filteredFiles.length === 1 ? 'soubor' : 'souborů'}
            {selectedFile && (
              <span className="ml-2 text-text-primary">
                • Vybráno: {selectedFile.name}
              </span>
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
