'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  FileText,
  FileArchive,
  Eye,
  X,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  resolveDocumentFile,
  formatFileSize,
  getFileExtension,
  LOCALE_FLAGS,
  type Locale,
} from '@/lib/utils/documents'
import { cn } from '@/lib/utils'

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
  fallback_locale: Locale | null
  document_translations: DocumentTranslation[]
}

interface DocumentCardProps {
  document: Document
  locale: Locale
  labels: {
    download: string
    unavailable: string
    preview?: string
    close?: string
  }
  index: number
}

export function DocumentCard({
  document,
  locale,
  labels,
  index,
}: DocumentCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const translation =
    document.document_translations?.find((t) => t.locale === locale) ||
    document.document_translations?.[0]

  const resolvedFile = resolveDocumentFile(document, locale)
  const fileExtension = resolvedFile ? getFileExtension(resolvedFile.path) : ''
  const isPDF = fileExtension === 'PDF'
  const isZIP = fileExtension === 'ZIP'

  if (!resolvedFile) {
    return (
      <div className="flex flex-col gap-3 px-5 py-4 opacity-50 md:flex-row md:items-center md:gap-4">
        <div className="flex items-center gap-4 md:flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-tertiary">
            <FileText className="h-5 w-5 text-text-muted" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block truncate text-text-primary">
              {translation?.title || document.slug}
            </span>
            <span className="text-sm text-text-muted">{labels.unavailable}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03, duration: 0.3 }}
        className={cn(
          'group flex flex-col gap-3 px-5 py-4',
          'transition-colors duration-200',
          'hover:bg-bg-secondary/50',
          'md:flex-row md:items-center md:gap-4'
        )}
      >
        {/* Icon + Info */}
        <div className="flex items-center gap-4 md:flex-1">
          {/* File Icon */}
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
              'transition-all duration-200',
              isZIP
                ? 'bg-purple-500/10 group-hover:bg-purple-500/15'
                : 'bg-green-500/10 group-hover:bg-green-500/15'
            )}
          >
            {isZIP ? (
              <FileArchive className="h-5 w-5 text-purple-500" />
            ) : (
              <FileText className="h-5 w-5 text-green-500" />
            )}
          </div>

          {/* Title + Meta */}
          <div className="min-w-0 flex-1">
            <span
              className={cn(
                'block truncate font-medium text-text-primary',
                'transition-colors duration-200 group-hover:text-green-400'
              )}
            >
              {translation?.title || document.slug}
            </span>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-text-muted">
              {/* File type badge */}
              <span
                className={cn(
                  'inline-flex items-center rounded px-1.5 py-0.5',
                  isZIP
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'bg-green-500/10 text-green-400'
                )}
              >
                {fileExtension}
              </span>

              {/* File size */}
              <span>{formatFileSize(resolvedFile.size)}</span>

              {/* Fallback locale indicator */}
              {resolvedFile.isFallback && (
                <span className="flex items-center gap-1">
                  <span className="text-border-default">•</span>
                  <span>{LOCALE_FLAGS[resolvedFile.locale]}</span>
                  <span className="uppercase">{resolvedFile.locale}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:shrink-0">
          {/* Preview button for PDFs */}
          {isPDF && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              {labels.preview || 'Náhled'}
            </Button>
          )}

          {/* Download button */}
          <Button variant="primary" size="sm" asChild>
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

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && isPDF && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-bg-primary"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border-subtle p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">
                      {translation?.title || document.slug}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {fileExtension} • {formatFileSize(resolvedFile.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <a
                      href={resolvedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Otevřít
                    </a>
                  </Button>
                  <Button variant="primary" size="sm" asChild>
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
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="ml-2 rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-secondary hover:text-text-primary"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* PDF Embed */}
              <div className="relative flex-1 bg-bg-tertiary">
                <iframe
                  src={`${resolvedFile.url}#toolbar=0&navpanes=0`}
                  className="h-full w-full"
                  title={translation?.title || document.slug}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
