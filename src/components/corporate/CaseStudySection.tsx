'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { ArrowRight, Award } from 'lucide-react'
import { CaseStudyCard } from '@/components/case-studies/CaseStudyCard'
import { CaseStudyCarousel } from '@/components/case-studies/CaseStudyCarousel'
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

export function CaseStudySection({
  heading = 'Reference',
  subheading = 'Podívejte se, jak jsme pomohli našim klientům',
  caseStudies,
  locale,
  featured = false,
  showAllLink = true,
  className,
}: CaseStudySectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

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
    <section ref={containerRef} className={cn('py-20 md:py-28', className)}>
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1"
            >
              <Award className="h-3 w-3 text-green-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                Case Studies
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl font-bold text-text-primary md:text-4xl"
            >
              {heading}
            </motion.h2>

            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-2 text-lg text-text-secondary"
              >
                {subheading}
              </motion.p>
            )}
          </div>

          {showAllLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
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
            </motion.div>
          )}
        </div>

        {/* Content */}
        {featured && sortedCaseStudies.length <= 3 ? (
          // Show carousel for featured view with few items
          <CaseStudyCarousel
            caseStudies={sortedCaseStudies}
            locale={locale}
            autoPlay
          />
        ) : sortedCaseStudies.length === 1 ? (
          // Single featured case study
          <CaseStudyCard
            caseStudy={sortedCaseStudies[0]}
            locale={locale}
            variant="featured"
          />
        ) : (
          // Grid for multiple case studies
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedCaseStudies.slice(0, 6).map((caseStudy, index) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                locale={locale}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
