'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { MediaUploader } from './MediaUploader'
import {
  Image as ImageIcon,
  File,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  Grid3X3,
  List,
  Upload
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

type Bucket = 'media' | 'article-images' | 'product-images'
type ViewMode = 'grid' | 'list'

const bucketLabels: Record<Bucket, string> = {
  media: 'Všechna média',
  'article-images': 'Obrázky článků',
  'product-images': 'Obrázky produktů',
}

export function MediaLibrary() {
  const router = useRouter()
  const [files, setFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bucket, setBucket] = useState<Bucket>('media')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [deleteFile, setDeleteFile] = useState<MediaFile | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [showUploader, setShowUploader] = useState(false)

  const fetchFiles = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/media?bucket=${bucket}`)
      const data = await response.json()

      if (response.ok) {
        setFiles(data.data || [])
      } else {
        console.error('Error fetching files:', data.error)
        setFiles([])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      setFiles([])
    } finally {
      setIsLoading(false)
    }
  }, [bucket])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleDelete = async () => {
    if (!deleteFile) return

    setIsDeleting(true)
    try {
      const response = await fetch(
        `/api/media?bucket=${deleteFile.bucket}&path=${encodeURIComponent(deleteFile.path)}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Nepodařilo se smazat soubor')
      }

      setFiles(files.filter(f => f.path !== deleteFile.path))
      setSelectedFile(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Neznámá chyba')
    } finally {
      setIsDeleting(false)
      setDeleteFile(null)
    }
  }

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const handleUploadComplete = () => {
    setShowUploader(false)
    fetchFiles()
  }

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isImage = (file: MediaFile): boolean => {
    return file.metadata?.mimetype?.startsWith('image/') ||
           file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Média</h1>
          <p className="mt-1 text-text-secondary">
            Spravujte obrázky a soubory
          </p>
        </div>
        <Button onClick={() => setShowUploader(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Nahrát soubory
        </Button>
      </div>

      {/* Filters & View */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Select value={bucket} onValueChange={(v) => setBucket(v as Bucket)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(bucketLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={fetchFiles}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border-subtle p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Files */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="h-8 w-8 animate-spin text-text-muted" />
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-secondary py-16">
          <ImageIcon className="h-12 w-12 text-text-muted" />
          <h3 className="mt-4 text-lg font-medium text-text-primary">Žádné soubory</h3>
          <p className="mt-1 text-text-secondary">Nahrajte první soubor.</p>
          <Button className="mt-4" onClick={() => setShowUploader(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Nahrát soubory
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {files.map((file) => (
            <Card
              key={file.path}
              className={`group relative cursor-pointer overflow-hidden transition-all hover:border-green-500/50 ${
                selectedFile?.path === file.path ? 'border-green-500 ring-2 ring-green-500/20' : ''
              }`}
              onClick={() => setSelectedFile(selectedFile?.path === file.path ? null : file)}
            >
              <div className="aspect-square bg-bg-tertiary">
                {isImage(file) ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <File className="h-12 w-12 text-text-muted" />
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-text-primary">{file.name}</p>
                <p className="text-xs text-text-muted">
                  {formatFileSize(file.metadata?.size)}
                </p>
              </div>
              {/* Hover actions */}
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyUrl(file.url)
                  }}
                >
                  {copiedUrl === file.url ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 text-red-400 hover:text-red-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteFile(file)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-border-subtle">
            {files.map((file) => (
              <div
                key={file.path}
                className={`flex items-center gap-4 p-4 transition-colors hover:bg-bg-tertiary ${
                  selectedFile?.path === file.path ? 'bg-green-500/5' : ''
                }`}
                onClick={() => setSelectedFile(selectedFile?.path === file.path ? null : file)}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-bg-tertiary">
                  {isImage(file) ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <File className="h-6 w-6 text-text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
                  <p className="text-xs text-text-muted">{file.path}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-muted">
                    {formatFileSize(file.metadata?.size)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyUrl(file.url)
                    }}
                  >
                    {copiedUrl === file.url ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeleteFile(file)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Selected file details */}
      {selectedFile && (
        <Card className="mt-6 p-6">
          <h3 className="mb-4 text-lg font-medium text-text-primary">Detail souboru</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-text-muted">Název</label>
              <p className="text-text-primary">{selectedFile.name}</p>
            </div>
            <div>
              <label className="text-sm text-text-muted">Velikost</label>
              <p className="text-text-primary">{formatFileSize(selectedFile.metadata?.size)}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-text-muted">URL</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded bg-bg-tertiary px-2 py-1 text-sm text-text-primary">
                  {selectedFile.url}
                </code>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopyUrl(selectedFile.url)}
                >
                  {copiedUrl === selectedFile.url ? (
                    <>
                      <Check className="mr-1 h-3 w-3" />
                      Zkopírováno
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1 h-3 w-3" />
                      Kopírovat
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Upload modal */}
      {showUploader && (
        <MediaUploader
          bucket={bucket}
          onClose={() => setShowUploader(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteFile}
        onOpenChange={(open) => !open && setDeleteFile(null)}
        title="Smazat soubor"
        description={`Opravdu chcete smazat soubor "${deleteFile?.name}"? Tato akce je nevratná.`}
        variant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  )
}
