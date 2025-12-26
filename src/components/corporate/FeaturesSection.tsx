'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Zap,
  Shield,
  Clock,
  Wifi,
  BarChart3,
  CreditCard,
  Smartphone,
  Settings,
  type LucideIcon,
} from 'lucide-react'

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  shield: Shield,
  clock: Clock,
  wifi: Wifi,
  chart: BarChart3,
  card: CreditCard,
  phone: Smartphone,
  settings: Settings,
}

interface Feature {
  icon: string
  title: string
  description: string
}

export interface FeaturesSectionProps {
  heading?: string
  subheading?: string
  features?: Feature[]
  className?: string
}

export function FeaturesSection({
  heading = 'Funkce a možnosti',
  subheading = 'Vše co potřebujete pro efektivní správu nabíjecí infrastruktury',
  features,
  className,
}: FeaturesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Default features if none provided
  const displayFeatures = features || [
    {
      icon: 'wifi',
      title: 'Vzdálená správa',
      description: 'Monitorujte a spravujte všechny stanice z jednoho místa pomocí cloudu.',
    },
    {
      icon: 'chart',
      title: 'Reporting a analytika',
      description: 'Detailní přehledy o spotřebě, využití a nákladech na nabíjení.',
    },
    {
      icon: 'card',
      title: 'Flexibilní platby',
      description: 'RFID karty, mobilní aplikace nebo automatické účtování zaměstnancům.',
    },
    {
      icon: 'clock',
      title: 'Smart scheduling',
      description: 'Automatické plánování nabíjení podle tarifu a priority vozidel.',
    },
    {
      icon: 'shield',
      title: 'Bezpečnost',
      description: 'Ochrana proti přetížení, monitoring a automatická diagnostika.',
    },
    {
      icon: 'settings',
      title: 'Integrace',
      description: 'Napojení na ERP systémy, fleet management a správu budov.',
    },
  ]

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
            <Settings className="h-3 w-3 text-green-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-green-400">
              Funkce
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

        {/* Features grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayFeatures.map((feature, index) => {
            const Icon = iconMap[feature.icon.toLowerCase()] || Zap

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="group relative rounded-2xl border border-border-subtle bg-bg-secondary/50 p-6 transition-all duration-300 hover:border-green-500/30 hover:bg-bg-secondary"
              >
                {/* Icon with animated background */}
                <div className="relative mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 transition-colors duration-300 group-hover:bg-green-500/20">
                    <Icon className="h-6 w-6 text-green-400" />
                  </div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 -z-10 h-12 w-12 rounded-xl bg-green-500/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <h3 className="mb-2 text-lg font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
