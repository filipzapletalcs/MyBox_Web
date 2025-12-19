'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Client logos data
const clients = [
  { name: 'Volvo', logo: '/images/logos/volvo_logo.svg' },
  { name: 'ČEZ', logo: '/images/logos/cez_group_logo.svg' },
  { name: 'Zentiva', logo: '/images/logos/zentiva.svg' },
  { name: 'DPD', logo: '/images/logos/dpd_logo_2015.svg' },
  { name: 'Sonepar', logo: '/images/logos/sonepar_logo.svg' },
  { name: 'Gebrüder Weiss', logo: '/images/logos/transport-and-logistics-_-gebruder-weiss-1.svg' },
  { name: 'Signal Chain', logo: '/images/logos/signal-chain.svg' },
  { name: 'WSM', logo: '/images/logos/wsm-czech-republic-s-r-o.svg' },
]

interface ClientLogosProps {
  className?: string
}

export function ClientLogos({ className }: ClientLogosProps) {
  const t = useTranslations('homepage.clients')
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Duplicate for seamless scroll
  const allLogos = [...clients, ...clients]

  return (
    <section
      ref={containerRef}
      className={cn(
        'flex flex-col overflow-hidden border-y border-border-subtle bg-bg-secondary pt-6 pb-8 lg:pt-8 lg:pb-10',
        className
      )}
    >
      {/* Section title - explicitly first in flex column */}
      <div className="w-full pb-4 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block text-xs font-semibold uppercase tracking-widest text-text-muted"
        >
          {t('title')}
        </motion.span>
      </div>

      {/* Logos container - second in flex column */}
      <div className="relative w-full">
        {/* Fade gradient - left side */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 md:w-40"
          style={{
            background: 'linear-gradient(to right, var(--color-bg-secondary) 0%, var(--color-bg-secondary) 20%, transparent 100%)'
          }}
        />

        {/* Fade gradient - right side */}
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 md:w-40"
          style={{
            background: 'linear-gradient(to left, var(--color-bg-secondary) 0%, var(--color-bg-secondary) 20%, transparent 100%)'
          }}
        />

        {/* Scrolling logos */}
        <motion.div
          className="flex items-center gap-12 md:gap-20"
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            x: {
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {allLogos.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="relative h-12 w-32 flex-shrink-0 md:h-14 md:w-44"
            >
              <Image
                src={client.logo}
                alt={client.name}
                fill
                sizes="(max-width: 768px) 128px, 176px"
                className="object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
