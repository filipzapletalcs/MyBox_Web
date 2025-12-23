'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArticleCard } from './ArticleCard'
import { FileText } from 'lucide-react'

export interface Article {
  id: string
  slug: string
  featured_image_url?: string | null
  published_at?: string | null
  article_translations: { locale: string; title: string; excerpt?: string | null }[]
  categories?: { category_translations: { locale: string; name: string }[] } | null
}

export interface ArticleGridProps {
  articles: Article[]
  locale: 'cs' | 'en' | 'de'
  emptyMessage?: string
}

export function ArticleGrid({
  articles,
  locale,
  emptyMessage = 'Žádné články k zobrazení'
}: ArticleGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Empty state
  if (articles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-border-subtle bg-bg-secondary py-20"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-tertiary">
          <FileText className="h-8 w-8 text-text-muted" />
        </div>
        <p className="mt-6 text-lg font-medium text-text-primary">{emptyMessage}</p>
        <p className="mt-2 text-sm text-text-secondary">
          Zkuste změnit filtry nebo se vraťte později.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {articles.map((article, index) => (
        <ArticleCard
          key={article.id}
          article={article}
          locale={locale}
          index={index}
        />
      ))}
    </motion.div>
  )
}
