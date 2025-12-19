'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'

// FAQ items keys
const faqKeys = [
  'acVsDc',
  'installationTime',
  'homeCharging',
  'chargingCost',
  'warranty',
  'cloudPlatform',
] as const

export function FAQSection() {
  const t = useTranslations('chargingStations.faq')
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={containerRef}
      className="relative bg-bg-primary py-20 md:py-28 overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-green-500/3 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-500/3 rounded-full blur-3xl translate-x-1/2" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
          {/* Left column - Header (sticky) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-green-500 mb-6"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('badge')}
            </motion.span>

            <h2 className="text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl mb-6">
              {t('title')}
            </h2>

            <p className="text-lg text-text-secondary leading-relaxed mb-8">
              {t('subtitle')}
            </p>

            {/* Contact hint */}
            <div className="p-6 rounded-2xl border border-border-subtle bg-bg-secondary/50">
              <p className="text-sm text-text-secondary mb-4">
                {t('notFound')}
              </p>
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 text-green-500 font-semibold text-sm hover:text-green-400 transition-colors"
              >
                {t('contactUs')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Right column - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqKeys.map((key, index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                >
                  <AccordionItem
                    value={key}
                    className={cn(
                      'rounded-2xl border border-border-subtle bg-bg-secondary/30 px-6',
                      'transition-all duration-300',
                      'hover:border-green-500/20 hover:bg-bg-secondary/50',
                      'data-[state=open]:border-green-500/30 data-[state=open]:bg-bg-secondary/60'
                    )}
                  >
                    <AccordionTrigger className="py-6 text-left">
                      <span className="flex items-start gap-4 pr-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 text-sm font-bold">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-base md:text-lg font-semibold text-text-primary">
                          {t(`items.${key}.question`)}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12">
                      <p className="text-text-secondary leading-relaxed pb-2">
                        {t(`items.${key}.answer`)}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
