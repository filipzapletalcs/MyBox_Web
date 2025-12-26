'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Zap,
  Shield,
  Clock,
  Wallet,
  Leaf,
  Users,
  BarChart3,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { CorporateBenefitWithTranslations } from '@/types/corporate'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  clock: Clock,
  wallet: Wallet,
  leaf: Leaf,
  users: Users,
  chart: BarChart3,
  wrench: Wrench,
}

// Color accent mapping
const colorAccentMap: Record<string, { bg: string; icon: string; border: string }> = {
  green: {
    bg: 'bg-green-500/10',
    icon: 'text-green-400',
    border: 'border-green-500/20 hover:border-green-500/40',
  },
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-400',
    border: 'border-blue-500/20 hover:border-blue-500/40',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-400',
    border: 'border-purple-500/20 hover:border-purple-500/40',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-400',
    border: 'border-amber-500/20 hover:border-amber-500/40',
  },
}

interface BenefitCardProps {
  icon?: string
  colorAccent?: string
  title: string
  description?: string
  index: number
}

function BenefitCard({ icon, colorAccent = 'green', title, description, index }: BenefitCardProps) {
  const Icon = iconMap[icon?.toLowerCase() || 'zap'] || Zap
  const colors = colorAccentMap[colorAccent] || colorAccentMap.green

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border bg-bg-secondary/50 p-6 backdrop-blur-sm transition-all duration-300',
        colors.border
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          'bg-gradient-to-br from-transparent via-transparent to-green-500/5'
        )}
      />

      {/* Decorative corner accent */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-500/5 blur-2xl transition-all duration-500 group-hover:bg-green-500/10" />

      {/* Icon */}
      <div
        className={cn(
          'relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
          colors.bg
        )}
      >
        <Icon className={cn('h-6 w-6', colors.icon)} />
      </div>

      {/* Content */}
      <h3 className="relative mb-2 text-lg font-semibold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="relative text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      )}

      {/* Bottom line accent */}
      <motion.div
        className={cn('absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-green-500 to-green-400')}
        initial={{ width: 0 }}
        whileInView={{ width: '30%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      />
    </motion.div>
  )
}

export interface BenefitsGridProps {
  heading?: string
  subheading?: string
  benefits: CorporateBenefitWithTranslations[]
  locale: string
  className?: string
}

export function BenefitsGrid({
  heading = 'Výhody pro vaši firmu',
  subheading,
  benefits,
  locale,
  className,
}: BenefitsGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Sort benefits by sort_order
  const sortedBenefits = [...benefits].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return (
    <section ref={containerRef} className={cn('py-20 md:py-28', className)}>
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-medium uppercase tracking-wider text-green-400">
              Proč MyBox
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl"
          >
            {heading}
          </motion.h2>

          {subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary"
            >
              {subheading}
            </motion.p>
          )}
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedBenefits.map((benefit, index) => {
            const translation = benefit.translations.find(t => t.locale === locale)
              || benefit.translations[0]

            if (!translation) return null

            return (
              <BenefitCard
                key={benefit.id}
                icon={benefit.icon || undefined}
                colorAccent={benefit.color_accent || undefined}
                title={translation.title}
                description={translation.description || undefined}
                index={index}
              />
            )
          })}
        </div>

        {/* Fallback for empty state */}
        {sortedBenefits.length === 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { icon: 'zap', title: 'Rychlá instalace', description: 'Profesionální montáž do 14 dní od objednávky' },
              { icon: 'shield', title: 'Záruka 5 let', description: 'Spolehlivé řešení s prodlouženou zárukou' },
              { icon: 'wallet', title: 'Daňové výhody', description: 'Využijte možnosti odpočtu DPH a odpisů' },
              { icon: 'leaf', title: 'ESG reporting', description: 'Podklady pro sustainability reporting' },
            ].map((item, index) => (
              <BenefitCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
