'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/ui'
import {
  myboxShowcaseProducts,
  alpitronicShowcaseProducts,
  type ShowcaseProduct,
} from '@/data/products'

// Highlight icons for MyBox
const myboxHighlightIcons = {
  czech: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21V3l9 9 9-9v18" />
    </svg>
  ),
  warranty: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  cloud: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  ),
  support: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  ),
}

// Highlight icons for Alpitronic
const alpitronicHighlightIcons = {
  power: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  modular: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    </svg>
  ),
  certified: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  ),
  partner: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
}

// Navigation button component
function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full',
        'bg-bg-secondary shadow-md border border-border-subtle',
        'text-text-secondary transition-all duration-200',
        'hover:bg-bg-tertiary hover:text-text-primary hover:shadow-lg',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-bg-secondary disabled:hover:shadow-md'
      )}
      aria-label={direction === 'prev' ? 'Předchozí produkt' : 'Další produkt'}
    >
      {direction === 'prev' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  )
}

// Pill indicator component
function PillIndicator({
  total,
  current,
  accentColor,
}: {
  total: number
  current: number
  accentColor: string
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-2 shadow-md border border-border-subtle">
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className={cn('h-2 rounded-full transition-colors duration-300')}
          animate={{
            width: index === current ? 24 : 8,
            backgroundColor: index === current ? accentColor : 'var(--color-border-subtle)',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// Product card component with detailed info
function ProductCard({
  product,
  translationKey,
}: {
  product: ShowcaseProduct
  translationKey: string
}) {
  const t = useTranslations(translationKey)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col h-full"
    >
      {/* Product image */}
      <div className="relative flex-1 min-h-[280px] md:min-h-[320px] flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>

        {/* Power badge */}
        <div className="absolute top-4 right-4 rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-lg bg-green-500">
          {product.power}
        </div>
      </div>

      {/* Product info */}
      <div className="mt-6 space-y-4">
        <h3 className="text-2xl font-bold text-text-primary md:text-3xl">
          {product.name}
        </h3>

        <p className="text-text-secondary leading-relaxed">
          {t(`products.${product.id}.description`)}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {product.features.map((feature) => (
            <span
              key={feature}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                'bg-bg-tertiary text-text-secondary border border-border-subtle'
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {t(`features.${feature}`)}
            </span>
          ))}
        </div>

        {/* CTA Link */}
        <Link
          href={product.href}
          className={cn(
            'inline-flex items-center gap-2 text-sm font-semibold transition-colors',
            'text-green-500 hover:underline underline-offset-4'
          )}
        >
          {t('moreInfo')}
          <ArrowRightIcon />
        </Link>
      </div>
    </motion.div>
  )
}

// Animation variants for highlights grid
const highlightContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const highlightItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
}

// Highlights grid component
function HighlightsGrid({
  type,
  translationKey,
}: {
  type: 'mybox' | 'alpitronic'
  translationKey: string
}) {
  const t = useTranslations(translationKey)
  const icons = type === 'mybox' ? myboxHighlightIcons : alpitronicHighlightIcons
  const highlightKeys = type === 'mybox'
    ? ['czech', 'warranty', 'cloud', 'support'] as const
    : ['power', 'modular', 'certified', 'partner'] as const

  const accentBgClass = 'bg-green-500/10 text-green-600 dark:text-green-400'
  const borderAccentClass = 'border-green-500/20'

  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={containerRef}
      variants={highlightContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="mt-10 grid grid-cols-2 gap-4"
    >
      {highlightKeys.map((key) => (
        <motion.div
          key={key}
          variants={highlightItemVariants}
          className={cn(
            'rounded-2xl border bg-bg-secondary/50 p-5 transition-shadow duration-300',
            'hover:shadow-md',
            borderAccentClass
          )}
        >
          <div className={cn('inline-flex rounded-xl p-3', accentBgClass)}>
            {icons[key as keyof typeof icons]}
          </div>
          <h4 className="mt-4 font-bold text-text-primary">
            {t(`highlights.${key}.title`)}
          </h4>
          <span className="mt-1 block text-sm text-text-secondary">
            {t(`highlights.${key}.description`)}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

// Main ProductShowcase component
interface ProductShowcaseProps {
  type: 'mybox' | 'alpitronic'
  reverse?: boolean
  className?: string
}

export function ProductShowcase({ type, reverse = false, className }: ProductShowcaseProps) {
  const translationKey = type === 'mybox' ? 'chargingStations.mybox' : 'chargingStations.alpitronic'
  const t = useTranslations(translationKey)
  const products = type === 'mybox' ? myboxShowcaseProducts : alpitronicShowcaseProducts
  const accentColor = 'rgb(34, 197, 94)'

  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }, [products.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }, [products.length])

  const currentProduct = products[currentIndex]

  return (
    <section className={cn('bg-bg-primary py-20 md:py-28', className)}>
      <div className="container-custom">
        <div
          className={cn(
            'grid gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24',
            reverse && 'lg:[&>*:first-child]:order-2'
          )}
        >
          {/* Text content side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            {/* Upper content */}
            <div>
              <h2 className="text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
                {t('title')}
              </h2>
              <p className="mt-3 text-xl font-medium text-text-secondary">
                {t('subtitle')}
              </p>
              <p className="mt-6 text-text-secondary leading-relaxed">
                {t('description')}
              </p>

              {/* Highlights grid with icons */}
              <HighlightsGrid type={type} translationKey={translationKey} />
            </div>

            {/* CTA Button - pushed to bottom to align with product card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={cn('mt-auto pt-8', reverse && 'text-right')}
            >
              <Button
                asChild
                size="lg"
                className="group bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600"
              >
                <Link href={type === 'mybox' ? '/nabijeci-stanice/ac' : '/nabijeci-stanice/dc'}>
                  {t('cta')}
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Product slider side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col"
          >
            {/* Product card */}
            <div className="relative flex-1 rounded-3xl bg-bg-secondary border border-border-subtle p-6 md:p-8 shadow-sm">
              <AnimatePresence mode="wait">
                <ProductCard
                  key={currentProduct.id}
                  product={currentProduct}
                  translationKey={translationKey}
                />
              </AnimatePresence>
            </div>

            {/* Slider controls */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <NavButton direction="prev" onClick={goToPrev} />
              <PillIndicator total={products.length} current={currentIndex} accentColor={accentColor} />
              <NavButton direction="next" onClick={goToNext} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
