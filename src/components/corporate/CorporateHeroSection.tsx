'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { ArrowRight, Building2 } from 'lucide-react'

// Animated grid pattern for corporate feel
const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  </div>
)

// Floating orbs for depth
const FloatingOrbs = () => (
  <>
    <motion.div
      className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-green-500/10 blur-3xl"
      animate={{
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
    <motion.div
      className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-green-500/5 blur-3xl"
      animate={{
        x: [0, -25, 0],
        y: [0, 25, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1,
      }}
    />
  </>
)

// Scroll indicator with corporate style
const ScrollIndicator = () => (
  <motion.div
    className="absolute bottom-8 left-1/2 -translate-x-1/2"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5, duration: 0.6 }}
  >
    <motion.div
      className="flex flex-col items-center gap-2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
        Scroll
      </span>
      <div className="h-12 w-[1px] bg-gradient-to-b from-green-500/60 to-transparent" />
    </motion.div>
  </motion.div>
)

// Stats bar at bottom
const StatsBar = () => {
  const stats = [
    { value: '500+', label: 'Instalací' },
    { value: '50+', label: 'Firemních klientů' },
    { value: '24/7', label: 'Podpora' },
  ]

  return (
    <motion.div
      className="absolute bottom-24 left-0 right-0 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-center gap-8 md:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-2xl font-bold text-green-400 md:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/50">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export interface CorporateHeroSectionProps {
  videoSrc?: string
  imageSrc?: string
  posterSrc?: string
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaHref?: string
  showStats?: boolean
  className?: string
}

export function CorporateHeroSection({
  videoSrc,
  imageSrc,
  posterSrc,
  heading = 'Firemní nabíjení pro vaši flotilu',
  subheading = 'Komplexní řešení nabíjecí infrastruktury pro firmy. Od návrhu po realizaci a servis.',
  ctaLabel = 'Nezávazná poptávka',
  ctaHref = '/kontakt',
  showStats = true,
  className,
}: CorporateHeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Load handling
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 2000)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => setIsLoaded(true))
    }
  }, [videoSrc])

  useEffect(() => {
    if (imageSrc && !videoSrc) {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setIsLoaded(true)
      img.src = imageSrc
    }
  }, [imageSrc, videoSrc])

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative force-dark flex min-h-[100svh] items-center justify-center overflow-hidden bg-black pt-20',
        className
      )}
    >
      {/* Background - Video or Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: backgroundScale, opacity: backgroundOpacity }}
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
            onCanPlay={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
            className="h-full w-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : imageSrc ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageSrc})` }}
          />
        ) : (
          // Default corporate gradient background
          <div className="h-full w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
        )}

        {/* Multi-layer overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Green accent gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/20 via-transparent to-transparent" />
      </motion.div>

      {/* Decorative elements */}
      <GridPattern />
      <FloatingOrbs />

      {/* Content */}
      <motion.div
        className="container-custom relative z-10 flex flex-col items-center px-6 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-sm"
        >
          <Building2 className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium text-green-400">
            B2B řešení
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl"
        >
          {heading.split(' ').map((word, i) => (
            <span key={i}>
              {word.toLowerCase() === 'flotilu' || word.toLowerCase() === 'firmy' ? (
                <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                word
              )}{' '}
            </span>
          ))}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
        >
          {subheading}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="group bg-green-500 text-white hover:bg-green-400"
          >
            <Link href={ctaHref as '/kontakt'}>
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/30"
          >
            <Link href="/nabijeni-pro-firmy/stanice-do-firem">
              Prohlédnout řešení
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats bar */}
      {showStats && <StatsBar />}

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* Loading state */}
      {!isLoaded && (videoSrc || imageSrc) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
        </div>
      )}
    </section>
  )
}
