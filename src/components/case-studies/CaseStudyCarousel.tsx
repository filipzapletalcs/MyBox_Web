'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { CaseStudyCard } from './CaseStudyCard'
import type { CaseStudyFull } from '@/types/case-study'

export interface CaseStudyCarouselProps {
  caseStudies: CaseStudyFull[]
  locale: string
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export function CaseStudyCarousel({
  caseStudies,
  locale,
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: CaseStudyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || isPaused || totalSlides <= 1) return

    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPlaying, isPaused, goToNext, autoPlayInterval, totalSlides])

  // Pause on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  if (totalSlides === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        <p className="text-text-muted">Žádné case studies k zobrazení</p>
      </div>
    )
  }

  // For single item, just show the card
  if (totalSlides === 1) {
    return (
      <div className={cn('mx-auto max-w-2xl', className)}>
        <CaseStudyCard
          caseStudy={caseStudies[0]}
          locale={locale}
          variant="featured"
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <CaseStudyCard
              caseStudy={caseStudies[currentIndex]}
              locale={locale}
              variant="featured"
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
          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-10 w-10"
            aria-label={isPlaying ? 'Pozastavit' : 'Přehrát'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          {/* Prev/Next */}
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
          className="absolute bottom-0 left-0 h-1 bg-green-500/50"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
          key={`progress-${currentIndex}`}
        />
      )}
    </div>
  )
}

// Grid variant for multiple case studies
export interface CaseStudyGridProps {
  caseStudies: CaseStudyFull[]
  locale: string
  columns?: 2 | 3 | 4
  className?: string
}

export function CaseStudyGrid({
  caseStudies,
  locale,
  columns = 3,
  className,
}: CaseStudyGridProps) {
  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-6', columnClasses[columns], className)}>
      {caseStudies.map((caseStudy, index) => (
        <CaseStudyCard
          key={caseStudy.id}
          caseStudy={caseStudy}
          locale={locale}
          index={index}
        />
      ))}
    </div>
  )
}
