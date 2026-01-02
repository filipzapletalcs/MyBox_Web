'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { ArrowUpRight, Building2, Zap } from 'lucide-react'
import type { CaseStudyFull } from '@/types/case-study'
import { INDUSTRY_LABELS, type CaseStudyIndustry } from '@/types/case-study'

export interface CaseStudyCardProps {
  caseStudy: CaseStudyFull
  locale: string
  index?: number
  variant?: 'default' | 'featured' | 'compact'
  className?: string
}

export function CaseStudyCard({
  caseStudy,
  locale,
  index = 0,
  variant = 'default',
  className,
}: CaseStudyCardProps) {
  const translation = caseStudy.translations.find(t => t.locale === locale)
    || caseStudy.translations[0]

  if (!translation) return null

  const industryLabel = caseStudy.industry
    ? INDUSTRY_LABELS[caseStudy.industry as CaseStudyIndustry] || caseStudy.industry
    : null

  // Get first 2 metrics for preview
  const previewMetrics = caseStudy.metrics?.slice(0, 2) || []

  const cardContent = (
    <>
      {/* Image section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-tertiary">
        {caseStudy.featured_image_url ? (
          <Image
            src={caseStudy.featured_image_url}
            alt={translation.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-tertiary">
            <Building2 className="h-12 w-12 text-text-muted" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Industry badge */}
        {industryLabel && (
          <div className="absolute left-4 top-4">
            <Badge variant="default" className="bg-black/60 backdrop-blur-sm">
              {industryLabel}
            </Badge>
          </div>
        )}

        {/* Featured badge */}
        {caseStudy.is_featured && (
          <div className="absolute right-4 top-4">
            <Badge variant="warning" className="gap-1">
              <Zap className="h-3 w-3" />
              Featured
            </Badge>
          </div>
        )}

        {/* Client logo */}
        {caseStudy.client_logo_url && (
          <div className="absolute bottom-4 left-4 h-8 w-24">
            <Image
              src={caseStudy.client_logo_url}
              alt={caseStudy.client_name}
              fill
              className="object-contain object-left opacity-90"
            />
          </div>
        )}

        {/* Metrics preview */}
        {previewMetrics.length > 0 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            {previewMetrics.map((metric) => {
              const metricTranslation = metric.translations.find(t => t.locale === locale)
                || metric.translations[0]
              return (
                <div
                  key={metric.id}
                  className="rounded-lg bg-black/60 px-3 py-1.5 backdrop-blur-sm"
                >
                  <div className="text-sm font-bold text-green-400">{metric.value}</div>
                  {metricTranslation && (
                    <div className="text-[10px] uppercase tracking-wider text-white/60">
                      {metricTranslation.label}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-5">
        {/* Client name */}
        <div className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
          {caseStudy.client_name}
          {caseStudy.station_count && (
            <span className="ml-2 text-green-500">• {caseStudy.station_count} stanic</span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold text-text-primary transition-colors group-hover:text-green-400">
          {translation.title}
        </h3>

        {/* Subtitle/excerpt */}
        {translation.subtitle && (
          <p className="line-clamp-2 text-sm text-text-secondary">
            {translation.subtitle}
          </p>
        )}

        {/* Read more link */}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-green-500 transition-colors group-hover:text-green-400">
          <span>Číst více</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </>
  )

  if (variant === 'featured') {
    return (
      <div
        className={cn('group', className)}
      >
        <Link
          href={`/case-studies/${caseStudy.slug}` as '/kontakt'}
          className={cn(
            'block overflow-hidden rounded-2xl border border-green-500/20 bg-bg-secondary transition-all duration-300',
            'hover:border-green-500/40 hover:shadow-[0_0_40px_rgba(74,222,128,0.08)]'
          )}
        >
          <div className="grid md:grid-cols-2">
            {/* Image - larger for featured */}
            <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-bg-tertiary">
              {caseStudy.featured_image_url ? (
                <Image
                  src={caseStudy.featured_image_url}
                  alt={translation.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-tertiary">
                  <Building2 className="h-16 w-16 text-text-muted" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30 md:bg-gradient-to-l" />
            </div>

            {/* Content - expanded for featured */}
            <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
              {industryLabel && (
                <Badge variant="info" className="mb-4 w-fit">
                  {industryLabel}
                </Badge>
              )}

              <div className="mb-2 text-sm font-medium text-text-muted">
                {caseStudy.client_name}
                {caseStudy.station_count && (
                  <span className="ml-2 text-green-500">• {caseStudy.station_count} stanic</span>
                )}
              </div>

              <h3 className="mb-3 text-2xl font-bold text-text-primary md:text-3xl">
                {translation.title}
              </h3>

              {translation.subtitle && (
                <p className="mb-4 text-text-secondary">
                  {translation.subtitle}
                </p>
              )}

              {/* Metrics row */}
              {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-4">
                  {caseStudy.metrics.slice(0, 3).map((metric) => {
                    const metricTranslation = metric.translations.find(t => t.locale === locale)
                      || metric.translations[0]
                    return (
                      <div key={metric.id} className="rounded-xl bg-bg-tertiary px-4 py-2">
                        <div className="text-xl font-bold text-green-400">{metric.value}</div>
                        {metricTranslation && (
                          <div className="text-xs text-text-muted">{metricTranslation.label}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="flex items-center gap-1 text-sm font-medium text-green-500">
                <span>Přečíst celou studii</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div
      className={cn('group', className)}
    >
      <Link
        href={`/case-studies/${caseStudy.slug}` as '/kontakt'}
        className={cn(
          'block overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary transition-all duration-300',
          'hover:border-green-500/30 hover:shadow-lg hover:shadow-black/20'
        )}
      >
        {cardContent}
      </Link>
    </div>
  )
}
