'use client'

import { motion } from 'framer-motion'
import { DocumentCard } from './DocumentCard'
import type { Locale } from '@/lib/utils/documents'

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

interface DocumentCategorySectionProps {
  title: string
  description?: string | null
  documents: Document[]
  locale: Locale
  labels: {
    file: string
    size: string
    download: string
    unavailable: string
    preview?: string
    close?: string
  }
}

export function DocumentCategorySection({
  title,
  description,
  documents,
  locale,
  labels,
}: DocumentCategorySectionProps) {
  if (documents.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary lg:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-text-secondary lg:text-base">
            {description}
          </p>
        )}
      </div>

      {/* Document List */}
      <div className="overflow-hidden rounded-xl border border-border-subtle">
        <div className="divide-y divide-border-subtle">
          {documents.map((doc, index) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              locale={locale}
              labels={labels}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
