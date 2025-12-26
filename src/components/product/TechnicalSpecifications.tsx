'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import type { TechnicalSpecificationsProps, SpecificationCategory } from '@/types/product'

// Icons for categories
const CategoryIcons = {
  power: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  dimensions: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3H3v7h18V3zM21 14H3v7h18v-7z" />
      <path d="M12 3v7M12 14v7" />
    </svg>
  ),
  connectivity: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
    </svg>
  ),
  certifications: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  security: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
}

// Chevron icon for expand/collapse button
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const easeOut = [0.25, 0.1, 0.25, 1] as const

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

function SpecificationCard({ category }: { category: SpecificationCategory }) {
  const IconComponent = CategoryIcons[category.icon] || CategoryIcons.power

  return (
    <Card variant="default" padding="md" radius="lg" className="h-full">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-green-500/10">
          <IconComponent className="h-5 w-5 text-green-500" />
        </div>
        <h3 className="font-semibold text-lg text-text-primary">
          {category.title}
        </h3>
      </div>

      {/* Specs List */}
      <dl className="space-y-3">
        {category.specs.map((spec) => (
          <div
            key={spec.key}
            className="flex justify-between items-baseline gap-4 py-2 border-b border-border-subtle last:border-0"
          >
            <dt className="text-text-secondary text-sm">
              {spec.label}
            </dt>
            <dd
              className={cn(
                'font-medium text-sm text-right',
                spec.highlight ? 'text-green-500' : 'text-text-primary'
              )}
            >
              {spec.value}
              {spec.unit && <span className="text-text-secondary ml-1">{spec.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

export function TechnicalSpecifications({
  specifications,
  className,
}: TechnicalSpecificationsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [visibleCount, setVisibleCount] = useState(4)

  // Detekce breakpointu pro responzivní zobrazení
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1280) {
        // xl: 4 karty - vše viditelné
        setVisibleCount(specifications.length)
      } else if (window.innerWidth >= 1024) {
        // lg: 3 karty
        setVisibleCount(3)
      } else if (window.innerWidth >= 640) {
        // sm: 2 karty
        setVisibleCount(2)
      } else {
        // mobile: 1 karta
        setVisibleCount(1)
      }
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [specifications.length])

  const displayedSpecs = isExpanded
    ? specifications
    : specifications.slice(0, visibleCount)

  const hasMore = specifications.length > visibleCount
  const remainingCount = specifications.length - visibleCount

  return (
    <section id="specifikace" className={cn('py-10 md:py-16 lg:py-24', className)}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header items-start text-left mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
            Technické parametry
          </h2>
          <p className="text-lg text-text-secondary">
            Detailní specifikace a technické údaje produktu
          </p>
        </motion.div>

        {/* Specifications Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={cn(
            'grid gap-4 md:gap-6',
            // Responzivní grid
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}
        >
          <AnimatePresence mode="popLayout">
            {displayedSpecs.map((category) => (
              <motion.div
                key={category.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <SpecificationCard category={category} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Tlačítko Zobrazit více/méně - pouze pod xl breakpoint */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center xl:hidden"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl',
                'bg-bg-tertiary hover:bg-bg-secondary',
                'border border-border-subtle',
                'text-text-primary font-medium',
                'transition-colors duration-200'
              )}
            >
              {isExpanded ? 'Zobrazit méně' : `Zobrazit více (${remainingCount})`}
              <ChevronDownIcon
                className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
