'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

// Icons for solutions
const icons = {
  developers: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  architects: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
  logistics: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  energy: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  residential: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
    </svg>
  ),
  hospitality: (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
}

// Solutions data
const solutions = [
  {
    key: 'developers',
    icon: icons.developers,
    href: '/reseni-nabijeni/developeri',
    color: 'from-blue-500/20 to-blue-600/5',
    accent: 'group-hover:text-blue-400',
  },
  {
    key: 'architects',
    icon: icons.architects,
    href: '/reseni-nabijeni/architekti',
    color: 'from-purple-500/20 to-purple-600/5',
    accent: 'group-hover:text-purple-400',
  },
  {
    key: 'logistics',
    icon: icons.logistics,
    href: '/reseni-nabijeni/logistika',
    color: 'from-orange-500/20 to-orange-600/5',
    accent: 'group-hover:text-orange-400',
  },
  {
    key: 'energySector',
    icon: icons.energy,
    href: '/reseni-nabijeni/energetika',
    color: 'from-yellow-500/20 to-yellow-600/5',
    accent: 'group-hover:text-yellow-400',
  },
  {
    key: 'residential',
    icon: icons.residential,
    href: '/reseni-nabijeni/bytove-domy',
    color: 'from-green-500/20 to-green-600/5',
    accent: 'group-hover:text-green-400',
  },
  {
    key: 'hospitality',
    icon: icons.hospitality,
    href: '/reseni-nabijeni/hotely-restaurace',
    color: 'from-rose-500/20 to-rose-600/5',
    accent: 'group-hover:text-rose-400',
  },
]

interface SolutionsGridProps {
  className?: string
}

export function SolutionsGrid({ className }: SolutionsGridProps) {
  const t = useTranslations('homepage.solutions')
  const tSolutions = useTranslations('chargingSolutions')
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={containerRef}
      className={cn('section-padding bg-bg-primary', className)}
    >
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col items-center text-center md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-2xl text-lg">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.key}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={solution.href as any}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border border-border-subtle p-6 transition-all duration-300',
                  'bg-bg-secondary hover:border-border-default hover:bg-bg-tertiary',
                  'min-h-[180px]'
                )}
              >
                {/* Background gradient */}
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                    solution.color
                  )}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className={cn(
                      'mb-4 text-text-muted transition-colors duration-300',
                      solution.accent
                    )}
                  >
                    {solution.icon}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-text-primary">
                    {tSolutions(solution.key)}
                  </h3>

                  <p className="text-sm text-text-secondary line-clamp-2">
                    Kompletní řešení nabíjecí infrastruktury
                  </p>
                </div>

                {/* Arrow */}
                <div className="relative z-10 mt-auto pt-4">
                  <span
                    className={cn(
                      'inline-flex items-center text-sm font-medium text-text-muted transition-all duration-300',
                      'group-hover:text-green-400 group-hover:translate-x-1'
                    )}
                  >
                    Zjistit více
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
