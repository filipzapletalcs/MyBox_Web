'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button, ArrowRightIcon } from '@/components/ui'
import { acSelectorProducts, dcSelectorProducts, type SelectorProduct } from '@/data/products'

// Slider dot component
const SliderDot = ({
  active,
  onClick,
  index,
}: {
  active: boolean
  onClick: () => void
  index: number
}) => (
  <button
    onClick={onClick}
    className={cn(
      'h-2 rounded-full transition-all duration-300',
      active
        ? 'w-6 bg-green-500'
        : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-zinc-600 dark:hover:bg-zinc-500'
    )}
    aria-label={`Přejít na slide ${index + 1}`}
  />
)


// Main category card
interface CategoryCardProps {
  type: 'ac' | 'dc'
  products: SelectorProduct[]
  className?: string
}

function CategoryCard({ type, products, className }: CategoryCardProps) {
  const t = useTranslations('chargingStations.acdc')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused, products.length])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [])

  const handleIndexChange = useCallback((index: number) => {
    setActiveIndex(index)
    setIsPaused(true)

    // Clear any existing timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }

    // Resume auto-rotation after 8 seconds
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 8000)
  }, [])

  const isAC = type === 'ac'
  const href = isAC ? '/nabijeci-stanice/ac' : '/nabijeci-stanice/dc'
  const activeProduct = products[activeIndex]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: isAC ? 0 : 0.15 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn(
        'group relative flex min-h-[550px] flex-col overflow-hidden rounded-3xl shadow-sm transition-shadow duration-300 hover:shadow-lg md:min-h-[680px]',
        className
      )}
    >
      {/* Background - always light gray, darker in dark mode */}
      <div className="absolute inset-0 bg-bg-tertiary transition-all duration-300" />

      {/* Full-size product image - fills entire card */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative h-full w-full -translate-y-16">
              <Image
                src={activeProduct.image}
                alt={activeProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain drop-shadow-2xl scale-[0.6]"
                priority={activeIndex === 0}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
          >
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {t(`${type}.badge`)}
          </div>

          {/* Product count */}
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {activeIndex + 1}/{products.length}
          </span>
        </div>

        {/* Power badge - top right of image area */}
        <motion.div
          key={`power-${activeProduct.id}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="absolute right-6 top-20 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg bg-green-500"
        >
          {activeProduct.power}
        </motion.div>

        {/* Spacer - pushes content to bottom */}
        <div className="flex-1" />

        {/* Bottom content */}
        <div className="space-y-4 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${activeProduct.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                {activeProduct.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t(`products.${type}.${activeProduct.id}.description`)}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <Button
            asChild
            size="lg"
            className="w-full border-green-500 bg-green-500 text-white hover:bg-green-600 hover:border-green-600"
          >
            <Link href={href}>
              {t(`${type}.cta`)}
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Slider dots - centered below CTA */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {products.map((_, index) => (
              <SliderDot
                key={index}
                active={index === activeIndex}
                onClick={() => handleIndexChange(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hover border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl border-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 border-green-500/40"
      />
    </motion.div>
  )
}

// Main component
export function ACDCSelector() {
  const t = useTranslations('chargingStations.acdc')

  return (
    <section className="bg-bg-primary py-20 md:py-28">
      <div className="container-custom">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <CategoryCard type="ac" products={acSelectorProducts} />
          <CategoryCard type="dc" products={dcSelectorProducts} />
        </div>
      </div>
    </section>
  )
}
