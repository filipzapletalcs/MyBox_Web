'use client'

import { motion } from 'framer-motion'
import { Download, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  resolveDocumentFile,
  formatFileSize,
  getFileExtension,
  LOCALE_FLAGS,
  type Locale,
} from '@/lib/utils/documents'

interface DocumentTranslation {
  locale: string
  title: string
  description: string | null
}

interface Document {
  id: string
  slug: string
  file_cs: string | null
  file_en: string | null
  file_de: string | null
  file_size_cs: number | null
  file_size_en: number | null
  file_size_de: number | null
  fallback_locale: string | null
  document_translations: DocumentTranslation[]
}

interface DocumentRowProps {
  document: Document
  locale: Locale
  labels: {
    download: string
    unavailable: string
  }
  index: number
}

export function DocumentRow({ document, locale, labels, index }: DocumentRowProps) {
  const translation = document.document_translations?.find(
    (t) => t.locale === locale
  ) || document.document_translations?.[0]

  const resolvedFile = resolveDocumentFile(document, locale)
  const fileExtension = resolvedFile ? getFileExtension(resolvedFile.path) : ''

  const getFileIcon = () => {
    if (fileExtension === 'ZIP') {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
          <FileText className="h-5 w-5 text-purple-500" />
        </div>
      )
    }
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
        <FileText className="h-5 w-5 text-green-500" />
      </div>
    )
  }

  if (!resolvedFile) {
    return (
      <div className="flex flex-col gap-3 px-6 py-4 opacity-50 md:grid md:grid-cols-[1fr_100px_140px] md:items-center md:gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-secondary">
            <FileText className="h-5 w-5 text-text-muted" />
          </div>
          <span className="text-text-primary">
            {translation?.title || document.slug}
          </span>
        </div>
        <span className="text-text-muted text-sm md:text-right">—</span>
        <div className="flex md:justify-end">
          <span className="flex items-center gap-1 text-sm text-text-muted">
            <AlertCircle className="h-4 w-4" />
            {labels.unavailable}
          </span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-bg-secondary/50 md:grid md:grid-cols-[1fr_100px_140px] md:items-center md:gap-4"
    >
      <div className="flex items-center gap-3">
        {getFileIcon()}
        <div className="min-w-0 flex-1">
          <span className="block truncate text-text-primary">
            {translation?.title || document.slug}
          </span>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="uppercase">{fileExtension}</span>
            {resolvedFile.isFallback && (
              <>
                <span className="text-border-default">•</span>
                <span className="flex items-center gap-1">
                  {LOCALE_FLAGS[resolvedFile.locale]}
                  {resolvedFile.locale.toUpperCase()}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <span className="text-sm text-text-muted md:text-right">
        {formatFileSize(resolvedFile.size)}
      </span>

      <div className="flex md:justify-end">
        <Button variant="secondary" size="sm" asChild>
          <a
            href={resolvedFile.url}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="mr-2 h-4 w-4" />
            {labels.download}
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
