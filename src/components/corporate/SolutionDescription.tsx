'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { ArrowRight, ChevronRight } from 'lucide-react'

export interface SolutionDescriptionProps {
  heading?: string
  subheading?: string
  content?: string | Record<string, unknown>
  imageSrc?: string
  imageAlt?: string
  reversed?: boolean
  showProductLink?: boolean
  className?: string
}

export function SolutionDescription({
  heading,
  subheading,
  content,
  imageSrc,
  imageAlt = 'MyBox řešení',
  reversed = false,
  showProductLink = false,
  className,
}: SolutionDescriptionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Parse content if it's TipTap JSON
  const contentHtml = typeof content === 'string' ? content : null

  return (
    <section ref={containerRef} className={cn('py-20 md:py-28', className)}>
      <div className="container-custom">
        <div
          className={cn(
            'grid items-center gap-12 lg:grid-cols-2 lg:gap-16',
            reversed && 'lg:[&>*:first-child]:order-2'
          )}
        >
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Section badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-green-400">
                Řešení
              </span>
            </motion.div>

            {heading && (
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4 text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl"
              >
                {heading}
              </motion.h2>
            )}

            {subheading && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-6 text-lg text-text-secondary"
              >
                {subheading}
              </motion.p>
            )}

            {contentHtml && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="prose prose-invert prose-green max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            )}

            {/* Key points - hardcoded for now, can be made dynamic */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 space-y-3"
            >
              {[
                'Profesionální návrh a realizace',
                'Integrace se systémy správy budov',
                'Vzdálený monitoring a správa',
                'Pravidelná údržba a servis',
              ].map((point, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                    <ChevronRight className="h-4 w-4 text-green-500" />
                  </span>
                  <span className="text-text-secondary">{point}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button
                asChild
                className="group bg-green-500 text-white hover:bg-green-400"
              >
                <Link href="/kontakt">
                  Nezávazná konzultace
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              {showProductLink && (
                <Button
                  asChild
                  variant="secondary"
                  className="bg-transparent hover:bg-bg-tertiary"
                >
                  <Link href="/nabijeci-stanice">
                    Prohlédnout stanice
                  </Link>
                </Button>
              )}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-bg-secondary">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                // Placeholder with gradient and pattern
                <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary via-bg-tertiary to-bg-secondary">
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(74, 222, 128, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(74, 222, 128, 0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px',
                    }}
                  />
                  {/* Center accent */}
                  <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl" />
                </div>
              )}

              {/* Decorative frame */}
              <div className="absolute inset-0 rounded-2xl border border-white/10" />
            </div>

            {/* Floating accent element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={cn(
                'absolute -bottom-4 z-10 rounded-xl border border-green-500/20 bg-bg-elevated p-4 shadow-xl shadow-black/20',
                reversed ? '-left-4 md:-left-8' : '-right-4 md:-right-8'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <span className="text-xl font-bold text-green-400">24/7</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-text-primary">
                    Non-stop podpora
                  </div>
                  <div className="text-xs text-text-muted">
                    Vzdálená diagnostika
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
