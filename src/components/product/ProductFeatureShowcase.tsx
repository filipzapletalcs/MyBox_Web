'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { ProductFeatureShowcaseProps, FeaturePoint } from '@/types/product'

// Feature icons
const FeatureIcons = {
  power: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  protocol: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  connectivity: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
    </svg>
  ),
  protection: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  meter: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  ),
  temperature: (props: { className?: string }) => (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
}

const easeOut = [0.25, 0.1, 0.25, 1] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

// Desktop feature item - pro layout vlevo/vpravo od produktu
function DesktopFeatureItem({ feature }: { feature: FeaturePoint }) {
  const IconComponent = FeatureIcons[feature.icon] || FeatureIcons.power
  const isLeft = feature.position === 'left'

  return (
    <motion.div
      variants={featureVariants}
      className={cn(
        'flex items-center gap-4',
        isLeft ? 'flex-row-reverse text-right' : 'flex-row text-left'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
        <IconComponent className="w-7 h-7 text-green-500" />
      </div>

      {/* Text */}
      <div className={cn('flex-1', isLeft ? 'pr-4' : 'pl-4')}>
        <div className="text-xl font-bold text-text-primary">
          {feature.value}
        </div>
        <div className="text-sm text-text-secondary">
          {feature.label}
        </div>
      </div>

      {/* Connector line */}
      <div
        className={cn(
          'w-8 xl:w-12 h-px bg-gradient-to-r',
          isLeft
            ? 'from-transparent to-border-default'
            : 'from-border-default to-transparent'
        )}
      />
    </motion.div>
  )
}

// Mobile feature item - vertikální layout, zarovnané na střed
function MobileFeatureItem({ feature }: { feature: FeaturePoint }) {
  const IconComponent = FeatureIcons[feature.icon] || FeatureIcons.power

  return (
    <motion.div
      variants={featureVariants}
      className="flex flex-col items-center text-center py-4"
    >
      {/* Icon - nahoře, větší */}
      <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-3">
        <IconComponent className="w-7 h-7 text-green-500" />
      </div>

      {/* Text - pod ikonkou */}
      <div className="text-base font-bold text-text-primary leading-tight">
        {feature.value}
      </div>
      <div className="text-sm text-text-secondary mt-1">
        {feature.label}
      </div>
    </motion.div>
  )
}

export function ProductFeatureShowcase({
  productImage,
  productAlt,
  features,
  className,
}: ProductFeatureShowcaseProps) {
  const leftFeatures = features.filter(f => f.position === 'left')
  const rightFeatures = features.filter(f => f.position === 'right')

  return (
    <section className={cn('py-10 md:py-16 lg:py-24 overflow-hidden', className)}>
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-header mb-8 md:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary">
            Klíčové vlastnosti
          </h2>
          <p className="text-lg text-text-secondary">
            Přehled nejdůležitějších parametrů nabíjecí stanice
          </p>
        </motion.div>

        {/* MOBILE: Grid 2x3 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-2 mb-8 lg:hidden"
        >
          {features.map((feature) => (
            <MobileFeatureItem key={feature.id} feature={feature} />
          ))}
        </motion.div>

        {/* MOBILE: Velký produktový obrázek pod gridem */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mx-auto lg:hidden"
        >
          <div className="absolute inset-0 bg-gradient-radial from-green-500/5 via-transparent to-transparent blur-3xl scale-125" />
          <div className="relative w-full max-w-sm mx-auto aspect-[3/4]">
            <Image
              src={productImage}
              alt={productAlt}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 80vw, 400px"
              priority
            />
          </div>
        </motion.div>

        {/* DESKTOP: Původní layout - features vlevo a vpravo od produktu */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] gap-4 xl:gap-8 items-center"
        >
          {/* Left Features */}
          <div className="space-y-8">
            {leftFeatures.map((feature) => (
              <DesktopFeatureItem key={feature.id} feature={feature} />
            ))}
          </div>

          {/* Center Product Image */}
          <motion.div variants={imageVariants} className="relative mx-4 xl:mx-8">
            <div className="relative w-[360px] xl:w-[400px] aspect-[3/4]">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent blur-3xl scale-150" />

              {/* Product Image */}
              <div className="relative w-full h-full">
                <Image
                  src={productImage}
                  alt={productAlt}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="400px"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Right Features */}
          <div className="space-y-8">
            {rightFeatures.map((feature) => (
              <DesktopFeatureItem key={feature.id} feature={feature} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
