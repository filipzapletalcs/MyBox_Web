'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

// Scroll indicator
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
      <span className="text-xs font-medium uppercase tracking-widest text-white/60">
        Scroll
      </span>
      <div className="h-12 w-[1px] bg-gradient-to-b from-white/60 to-transparent" />
    </motion.div>
  </motion.div>
)

export interface HeroSectionProps {
  /** Video source URL */
  videoSrc?: string
  /** Poster image for video */
  posterSrc?: string
  /** Use image instead of video */
  imageSrc?: string
  /** Hero height - defaults to 100svh */
  height?: 'full' | 'large' | 'medium'
  /** Show scroll indicator */
  showScrollIndicator?: boolean
  /** Content alignment */
  align?: 'center' | 'left'
  /** Custom className */
  className?: string
  /** Children - the hero content */
  children: ReactNode
}

export function HeroSection({
  videoSrc,
  posterSrc,
  imageSrc,
  height = 'full',
  showScrollIndicator = true,
  align = 'center',
  className,
  children,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Parallax effects
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  // Fallback timeout - show content after 2s even if video hasn't loaded
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  // Autoplay video
  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {
        // Autoplay was prevented - still show content
        setIsLoaded(true)
      })
    }
  }, [videoSrc])

  // Handle image load
  useEffect(() => {
    if (imageSrc && !videoSrc) {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setIsLoaded(true)
      img.src = imageSrc
    }
  }, [imageSrc, videoSrc])

  const heightClasses = {
    full: 'min-h-[100svh]',
    large: 'min-h-[85svh]',
    medium: 'min-h-[70svh]',
  }

  const alignClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start',
  }

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative force-dark flex items-center justify-center overflow-hidden bg-black pt-20',
        heightClasses[height],
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
        ) : null}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className={cn(
          'container-custom relative z-10 flex flex-col px-6',
          alignClasses[align]
        )}
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {children}
      </motion.div>

      {/* Scroll indicator */}
      {showScrollIndicator && <ScrollIndicator />}

      {/* Loading state */}
      {!isLoaded && (videoSrc || imageSrc) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
        </div>
      )}
    </section>
  )
}

// Re-export helper components for use in hero content
export { motion }
