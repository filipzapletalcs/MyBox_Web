'use client'

import { useState, useEffect, useCallback } from 'react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { CaseStudyFull } from '@/types/case-study'

export interface CaseStudySectionProps {
  heading?: string
  subheading?: string
  caseStudies: CaseStudyFull[]
  locale: string
  featured?: boolean
  showAllLink?: boolean
  className?: string
}

// Featured card - full width, image on one side, text on other (simplified - no metrics, no badges)
function FeaturedCard({
  caseStudy,
  locale,
}: {
  caseStudy: CaseStudyFull
  locale: string
}) {
  const translation = caseStudy.translations.find(t => t.locale === locale)
    || caseStudy.translations[0]

  if (!translation) return null

  return (
    <div className="group">
      <Link
        href={`/case-studies/${caseStudy.slug}` as '/kontakt'}
        className={cn(
          'block overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary transition-all duration-300',
          'hover:border-green-500/30 hover:shadow-[0_0_40px_rgba(74,222,128,0.08)]'
        )}
      >
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[400px] overflow-hidden bg-bg-tertiary">
            {caseStudy.featured_image_url ? (
              <Image
                src={caseStudy.featured_image_url}
                alt={translation.title}
                fill
                loading="lazy"
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

          {/* Content */}
          <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
            <h3 className="mb-3 text-2xl font-bold text-text-primary transition-colors group-hover:text-green-500 md:text-3xl">
              {translation.title}
            </h3>

            {translation.subtitle && (
              <p className="mb-6 text-text-secondary">
                {translation.subtitle}
              </p>
            )}

            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <span>Přečíst případovou studii</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// Simple carousel for featured case studies
function FeaturedCarousel({
  caseStudies,
  locale,
  autoPlayInterval = 5000,
}: {
  caseStudies: CaseStudyFull[]
  locale: string
  autoPlayInterval?: number
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const totalSlides = caseStudies.length

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Auto-play
  useEffect(() => {
    if (!isPlaying || isPaused || totalSlides <= 1) return

    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPlaying, isPaused, goToNext, autoPlayInterval, totalSlides])

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  if (totalSlides === 1) {
    return <FeaturedCard caseStudy={caseStudies[0]} locale={locale} />
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <FeaturedCard
              caseStudy={caseStudies[currentIndex]}
              locale={locale}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {caseStudies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-6 bg-green-500'
                  : 'w-2 bg-border-default hover:bg-border-default/80'
              )}
              aria-label={`Přejít na slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-10 w-10"
            aria-label={isPlaying ? 'Pozastavit' : 'Přehrát'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="h-10 w-10"
            aria-label="Předchozí"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="h-10 w-10"
            aria-label="Další"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      {isPlaying && !isPaused && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-green-500/50 rounded-b-2xl"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
          key={`progress-${currentIndex}`}
        />
      )}
    </div>
  )
}

// Simple card for grid
function SimpleCard({
  caseStudy,
  locale,
}: {
  caseStudy: CaseStudyFull
  locale: string
}) {
  const translation = caseStudy.translations.find(t => t.locale === locale)
    || caseStudy.translations[0]

  if (!translation) return null

  return (
    <div className="group">
      <Link
        href={`/case-studies/${caseStudy.slug}` as '/kontakt'}
        className={cn(
          'block overflow-hidden rounded-2xl border border-border-subtle bg-bg-secondary transition-all duration-300',
          'hover:border-green-500/30 hover:shadow-lg hover:shadow-black/20'
        )}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-bg-tertiary">
          {caseStudy.featured_image_url ? (
            <Image
              src={caseStudy.featured_image_url}
              alt={translation.title}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-tertiary">
              <Building2 className="h-12 w-12 text-text-muted" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="mb-2 text-lg font-semibold text-text-primary transition-colors group-hover:text-green-500">
            {translation.title}
          </h3>

          {translation.subtitle && (
            <p className="line-clamp-2 text-sm text-text-secondary">
              {translation.subtitle}
            </p>
          )}

          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-green-600 transition-colors group-hover:text-green-500">
            <span>Číst více</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  )
}

export function CaseStudySection({
  heading = 'Případové studie',
  subheading = 'Podívejte se, jak jsme pomohli našim klientům s elektromobilitou',
  caseStudies,
  locale,
  featured = false,
  showAllLink = true,
  className,
}: CaseStudySectionProps) {
  // Filter for featured case studies if needed
  const displayCaseStudies = featured
    ? caseStudies.filter(cs => cs.is_featured)
    : caseStudies

  // Sort by sort_order
  const sortedCaseStudies = [...displayCaseStudies].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  )

  if (sortedCaseStudies.length === 0) {
    return null
  }

  return (
    <section className={cn('py-20 md:py-28', className)} role="region" aria-label={heading}>
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
              {heading}
            </h2>

            {subheading && (
              <p className="mt-2 text-lg text-text-secondary">
                {subheading}
              </p>
            )}
          </div>

          {showAllLink && (
            <div>
              <Button
                asChild
                variant="secondary"
                className="group"
              >
                <Link href="/reference">
                  Všechny reference
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {featured && sortedCaseStudies.length <= 3 ? (
          // Carousel for featured view - auto-rotating
          <FeaturedCarousel
            caseStudies={sortedCaseStudies}
            locale={locale}
          />
        ) : sortedCaseStudies.length === 1 ? (
          // Single case study
          <FeaturedCard
            caseStudy={sortedCaseStudies[0]}
            locale={locale}
          />
        ) : (
          // Grid for multiple case studies
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedCaseStudies.slice(0, 6).map((caseStudy) => (
              <SimpleCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
