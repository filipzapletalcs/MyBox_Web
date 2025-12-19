'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

// Arrow icon
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

// Dekorativní kruhy na pravé straně
function DecorativeCircles() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none hidden md:block">
      <div className="relative h-[480px] w-[480px]">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/20"
            style={{
              width: `${80 + i * 100}px`,
              height: `${80 + i * 100}px`,
              right: `${-40 - i * 50}px`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

interface CTASectionProps {
  heading?: string
  description?: string
  buttonLabel?: string
  buttonHref?: string
  className?: string
}

export function CTASection({
  heading,
  description,
  buttonLabel,
  buttonHref = '/kontakt',
  className,
}: CTASectionProps) {
  const t = useTranslations('cta')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={cn(
            'relative overflow-hidden rounded-3xl',
            'bg-gradient-to-br from-green-500 via-green-500 to-green-600',
            'px-8 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20'
          )}
        >
          {/* Dekorativní kruhy */}
          <DecorativeCircles />

          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
              className="text-3xl font-bold !text-white md:text-4xl lg:text-5xl"
            >
              {heading || t('heading')}
            </motion.h2>

            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
              className="block mt-4 pb-2 text-lg !text-white md:text-xl max-w-xl leading-relaxed"
            >
              {description || t('description')}
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
              className="mt-8"
            >
              <Button
                asChild
                size="lg"
                className={cn(
                  'group bg-neutral-900 text-white border-transparent',
                  'hover:bg-neutral-800 hover:scale-[1.02]',
                  'shadow-lg transition-all duration-200'
                )}
              >
                <Link href={buttonHref as '/kontakt'}>
                  {buttonLabel || t('button')}
                  <span
                    className={cn(
                      'ml-3 inline-flex h-6 w-6 items-center justify-center',
                      'rounded-full bg-white/20 transition-transform duration-200',
                      'group-hover:translate-x-0.5'
                    )}
                  >
                    <ArrowIcon className="h-3 w-3 text-white" />
                  </span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
