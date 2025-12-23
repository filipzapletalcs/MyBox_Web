'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/utils/documents'
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

type Locale = 'cs' | 'en' | 'de'

interface UploadedFile {
  path: string
  url: string
  filename: string
  size: number
  type: string
  locale?: string
}

interface DocumentUploaderProps {
  locale: Locale
  value?: {
    path: string
    size: number
  } | null
  onChange: (file: { path: string; size: number } | null) => void
  folder?: string
  disabled?: boolean
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

const localeLabels: Record<Locale, string> = {
  cs: 'Česká verze',
  en: 'English version',
  de: 'Deutsche Version',
}

const localeFlags: Record<Locale, string> = {
  cs: '🇨🇿',
  en: '🇬🇧',
  de: '🇩🇪',
}

export function DocumentUploader({
  locale,
  value,
  onChange,
  folder,
  disabled = false,
}: DocumentUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setStatus('uploading')
      setError(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('locale', locale)
      if (folder) {
        formData.append('folder', folder)
      }

      try {
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Upload failed')
        }

        const { data } = await response.json()
        setUploadedFile(data)
        onChange({ path: data.path, size: data.size })
        setStatus('success')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
        setStatus('error')
      }
    },
    [locale, folder, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxSize: 250 * 1024 * 1024, // 250MB
    multiple: false,
    disabled: disabled || status === 'uploading',
  })

  const handleRemove = async () => {
    if (value?.path) {
      try {
        await fetch(`/api/documents/upload?path=${encodeURIComponent(value.path)}`, {
          method: 'DELETE',
        })
      } catch {
        // Ignore delete errors
      }
    }
    onChange(null)
    setUploadedFile(null)
    setStatus('idle')
    setError(null)
  }

  const displayFile = value || uploadedFile

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
        {localeFlags[locale]} {localeLabels[locale]}
      </label>

      {displayFile ? (
        <div className="flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-secondary p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
            <FileText className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
              {uploadedFile?.filename || displayFile.path.split('/').pop()}
            </p>
            <p className="text-xs text-text-muted">
              {formatFileSize(displayFile.size)}
            </p>
          </div>
          {status === 'success' && (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={disabled}
            className="h-8 w-8 text-text-muted hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
            isDragActive
              ? 'border-green-500 bg-green-500/5'
              : 'border-border-subtle hover:border-green-500/50 hover:bg-bg-secondary',
            (disabled || status === 'uploading') &&
              'cursor-not-allowed opacity-50',
            error && 'border-red-500/50'
          )}
        >
          <input {...getInputProps()} />
          {status === 'uploading' ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              <p className="mt-2 text-sm text-text-secondary">Nahrávání...</p>
            </>
          ) : error ? (
            <>
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="mt-2 text-sm text-red-400">{error}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setError(null)
                  setStatus('idle')
                }}
                className="mt-2"
              >
                Zkusit znovu
              </Button>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-text-muted" />
              <p className="mt-2 text-sm text-text-secondary">
                {isDragActive
                  ? 'Přetáhněte soubor sem'
                  : 'Klikněte nebo přetáhněte PDF/ZIP'}
              </p>
              <p className="mt-1 text-xs text-text-muted">Max. 250 MB</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
