'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ArticleCardProps {
  article: {
    slug: string
    featured_image_url?: string | null
    published_at?: string | null
    article_translations: { locale: string; title: string; excerpt?: string | null }[]
    categories?: { category_translations: { locale: string; name: string }[] } | null
  }
  locale: 'cs' | 'en' | 'de'
  index?: number
}

export function ArticleCard({ article, locale, index = 0 }: ArticleCardProps) {
  // Get translation for current locale, fallback to first available
  const translation = article.article_translations.find(t => t.locale === locale)
    || article.article_translations[0]

  // Get category name for current locale
  const categoryName = article.categories?.category_translations?.find(
    t => t.locale === locale
  )?.name || article.categories?.category_translations?.[0]?.name

  // Format date
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString(locale === 'cs' ? 'cs-CZ' : locale === 'de' ? 'de-DE' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : null

  if (!translation) return null

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <Link
        href={{ pathname: '/blog/[slug]', params: { slug: article.slug } }}
        className="group block h-full"
      >
        <div className={cn(
          'relative h-full overflow-hidden rounded-2xl',
          'bg-bg-secondary border border-border-subtle',
          'transition-all duration-500 ease-out',
          // Hover effects
          'hover:border-green-500/30',
          'hover:shadow-[0_8px_40px_rgba(0,0,0,0.3),0_0_60px_rgba(22,163,74,0.08)]',
          'hover:-translate-y-1'
        )}>
          {/* Image container */}
          <div className="relative aspect-[16/9] overflow-hidden bg-bg-tertiary">
            {article.featured_image_url ? (
              <>
                <Image
                  src={article.featured_image_url}
                  alt={translation.title}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-700 ease-out',
                    'group-hover:scale-105'
                  )}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Gradient overlay - stronger at bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/20 to-transparent opacity-60" />
                {/* Subtle green tint on hover */}
                <div className="absolute inset-0 bg-green-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </>
            ) : (
              // Placeholder with pattern
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <pattern id={`grid-${article.slug}`} width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border-subtle"/>
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill={`url(#grid-${article.slug})`}/>
                  </svg>
                </div>
                <div className="relative z-10 h-16 w-16 rounded-xl bg-bg-elevated flex items-center justify-center">
                  <svg className="h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Category badge */}
            {categoryName && (
              <div className="absolute left-4 top-4 z-10">
                <span className={cn(
                  'inline-flex items-center px-3 py-1.5 rounded-full',
                  'text-xs font-medium tracking-wide uppercase',
                  'bg-bg-primary/80 backdrop-blur-sm text-green-400',
                  'border border-green-500/20',
                  'transition-all duration-300',
                  'group-hover:bg-green-500/20 group-hover:border-green-500/40'
                )}>
                  {categoryName}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Date */}
            {formattedDate && (
              <div className="mb-3 flex items-center gap-2 text-text-muted">
                <Calendar className="h-3.5 w-3.5" />
                <time className="text-xs font-medium tracking-wide">
                  {formattedDate}
                </time>
              </div>
            )}

            {/* Title */}
            <h3 className={cn(
              'text-lg font-semibold leading-snug text-text-primary',
              'transition-colors duration-300',
              'group-hover:text-green-400',
              // Line clamp
              'line-clamp-2'
            )}>
              {translation.title}
            </h3>

            {/* Excerpt */}
            {translation.excerpt && (
              <p className={cn(
                'mt-3 text-sm leading-relaxed text-text-secondary',
                'line-clamp-2'
              )}>
                {translation.excerpt}
              </p>
            )}

            {/* Read more link */}
            <div className="mt-5 flex items-center gap-2">
              <span className={cn(
                'text-sm font-medium text-green-400',
                'transition-all duration-300',
                'group-hover:text-green-300'
              )}>
                Číst článek
              </span>
              <ArrowRight className={cn(
                'h-4 w-4 text-green-400',
                'transition-all duration-300',
                'group-hover:text-green-300 group-hover:translate-x-1'
              )} />
            </div>

            {/* Bottom accent line */}
            <div className={cn(
              'absolute bottom-0 left-6 right-6 h-px',
              'bg-gradient-to-r from-transparent via-green-500/50 to-transparent',
              'opacity-0 transition-opacity duration-500',
              'group-hover:opacity-100'
            )} />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
