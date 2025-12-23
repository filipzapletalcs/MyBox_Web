'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ArticleHeroProps {
  title: string
  excerpt?: string | null
  featuredImage?: string | null
  publishedAt?: string | null
  author?: {
    full_name?: string | null
    email: string
  } | null
  category?: {
    slug: string
    name: string
  } | null
  readingTime?: number
  locale: 'cs' | 'en' | 'de'
  backLabel?: string
}

export function ArticleHero({
  title,
  excerpt,
  featuredImage,
  publishedAt,
  author,
  category,
  readingTime,
  locale,
  backLabel = 'Zpět na blog'
}: ArticleHeroProps) {
  // Format date
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(
        locale === 'cs' ? 'cs-CZ' : locale === 'de' ? 'de-DE' : 'en-US',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }
      )
    : null

  const authorName = author?.full_name || author?.email?.split('@')[0] || 'Autor'

  return (
    <section className="relative">
      {/* Background image */}
      {featuredImage && (
        <div className="absolute inset-0 h-[60vh] min-h-[500px]">
          <Image
            src={featuredImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/60 via-bg-primary/80 to-bg-primary" />
        </div>
      )}

      {/* Content */}
      <div className={cn(
        'relative container-custom',
        featuredImage ? 'pt-32 pb-16' : 'pt-32 pb-12'
      )}>
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-green-400"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </motion.div>

        {/* Category badge */}
        {category && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6"
          >
            <Link
              href={{ pathname: '/blog/kategorie/[slug]', params: { slug: category.slug } }}
              className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-full',
                'text-xs font-medium tracking-wide uppercase',
                'bg-green-500/15 text-green-400',
                'border border-green-500/30',
                'transition-all duration-300',
                'hover:bg-green-500/25 hover:border-green-500/50'
              )}
            >
              {category.name}
            </Link>
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 max-w-4xl text-3xl font-bold leading-tight text-text-primary md:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h1>

        {/* Excerpt */}
        {excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-text-secondary md:text-xl"
          >
            {excerpt}
          </motion.p>
        )}

        {/* Meta info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center gap-6 text-sm text-text-muted"
        >
          {/* Author */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{authorName}</span>
          </div>

          {/* Date */}
          {formattedDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time>{formattedDate}</time>
            </div>
          )}

          {/* Reading time */}
          {readingTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min čtení</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
