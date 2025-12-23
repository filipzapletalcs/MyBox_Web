'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArticleCard } from './ArticleCard'
import type { Article } from './ArticleGrid'

export interface RelatedArticlesProps {
  articles: Article[]
  locale: 'cs' | 'en' | 'de'
  title?: string
}

export function RelatedArticles({
  articles,
  locale,
  title = 'Související články'
}: RelatedArticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  if (articles.length === 0) return null

  return (
    <section ref={containerRef} className="py-16 md:py-24">
      <div className="container-custom">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10 text-2xl font-bold text-text-primary md:text-3xl"
        >
          {title}
        </motion.h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
