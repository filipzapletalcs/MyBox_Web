'use client'

import { useState, useCallback, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Upload, X, Check, AlertCircle, Image as ImageIcon, File } from 'lucide-react'

interface UploadFile {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  url?: string
}

interface MediaUploaderProps {
  bucket: string
  onClose: () => void
  onUploadComplete: () => void
}

export function MediaUploader({ bucket, onClose, onUploadComplete }: MediaUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const uploadFiles: UploadFile[] = Array.from(newFiles).map(file => ({
      file,
      status: 'pending',
      progress: 0,
    }))
    setFiles(prev => [...prev, ...uploadFiles])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const uploadFile = async (uploadFile: UploadFile, index: number) => {
    setFiles(prev => prev.map((f, i) =>
      i === index ? { ...f, status: 'uploading' as const, progress: 0 } : f
    ))

    const formData = new FormData()
    formData.append('file', uploadFile.file)
    formData.append('bucket', bucket)

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setFiles(prev => prev.map((f, i) =>
        i === index ? { ...f, status: 'success' as const, progress: 100, url: data.data.url } : f
      ))
    } catch (error) {
      setFiles(prev => prev.map((f, i) =>
        i === index ? {
          ...f,
          status: 'error' as const,
          progress: 0,
          error: error instanceof Error ? error.message : 'Upload failed'
        } : f
      ))
    }
  }

  const uploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        await uploadFile(files[i], i)
      }
    }
  }

  const handleClose = () => {
    const hasUploaded = files.some(f => f.status === 'success')
    if (hasUploaded) {
      onUploadComplete()
    } else {
      onClose()
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const isImage = (file: File): boolean => {
    return file.type.startsWith('image/')
  }

  const pendingCount = files.filter(f => f.status === 'pending').length
  const uploadingCount = files.filter(f => f.status === 'uploading').length
  const successCount = files.filter(f => f.status === 'success').length

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nahrát soubory</DialogTitle>
        </DialogHeader>

        {/* Drop zone */}
        <div
          className={`relative rounded-xl border-2 border-dashed p-8 transition-colors ${
            isDragging
              ? 'border-green-500 bg-green-500/5'
              : 'border-border-subtle hover:border-border-default'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <div className="flex flex-col items-center text-center">
            <Upload className="h-10 w-10 text-text-muted" />
            <p className="mt-4 text-text-primary">
              Přetáhněte soubory sem, nebo{' '}
              <button
                type="button"
                className="text-green-400 hover:underline"
                onClick={() => fileInputRef.current?.click()}
              >
                vyberte z počítače
              </button>
            </p>
            <p className="mt-1 text-sm text-text-muted">
              Podporované formáty: JPG, PNG, GIF, WebP, SVG, PDF
            </p>
          </div>
        </div>

        {/* Files list */}
        {files.length > 0 && (
          <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
            {files.map((uploadFile, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-tertiary p-3"
              >
                {/* Thumbnail */}
                <div className="flex h-10 w-10 items-center justify-center rounded bg-bg-secondary">
                  {isImage(uploadFile.file) ? (
                    <ImageIcon className="h-5 w-5 text-text-muted" />
                  ) : (
                    <File className="h-5 w-5 text-text-muted" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-text-primary">{uploadFile.file.name}</p>
                  <p className="text-xs text-text-muted">
                    {formatFileSize(uploadFile.file.size)}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {uploadFile.status === 'pending' && (
                    <span className="text-sm text-text-muted">Čeká</span>
                  )}
                  {uploadFile.status === 'uploading' && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                  )}
                  {uploadFile.status === 'success' && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {uploadFile.status === 'error' && (
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs">{uploadFile.error}</span>
                    </div>
                  )}

                  {/* Remove button */}
                  {(uploadFile.status === 'pending' || uploadFile.status === 'error') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4">
          <div className="text-sm text-text-muted">
            {successCount > 0 && <span className="text-green-400">{successCount} nahráno</span>}
            {pendingCount > 0 && <span className="ml-2">{pendingCount} čeká</span>}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleClose}>
              {successCount > 0 ? 'Hotovo' : 'Zrušit'}
            </Button>
            {pendingCount > 0 && (
              <Button onClick={uploadAll} disabled={uploadingCount > 0}>
                <Upload className="mr-2 h-4 w-4" />
                Nahrát {pendingCount} {pendingCount === 1 ? 'soubor' : pendingCount < 5 ? 'soubory' : 'souborů'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
