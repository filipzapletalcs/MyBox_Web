'use client'

import { type ReactNode, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { cn } from '@/lib/utils'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down'
  offset?: ['start end' | 'center center' | 'end start', 'start end' | 'center center' | 'end start']
}

export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  direction = 'up',
  offset = ['start end', 'end start'],
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  const factor = direction === 'up' ? -1 : 1
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed * factor])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div ref={ref} className={cn(className)} style={{ y: smoothY }}>
      {children}
    </motion.div>
  )
}

// Parallax image - common pattern for hero images
interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  speed?: number
  scale?: number
}

export function ParallaxImage({
  src,
  alt,
  className,
  containerClassName,
  speed = 0.3,
  scale = 1.2,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <div ref={ref} className={cn('overflow-hidden', containerClassName)}>
      <motion.img
        src={src}
        alt={alt}
        className={cn('h-full w-full object-cover', className)}
        style={{
          y: smoothY,
          scale,
        }}
      />
    </div>
  )
}

// Parallax text - for big headlines
interface ParallaxTextProps {
  children: ReactNode
  className?: string
  speed?: number
  opacity?: boolean
}

export function ParallaxText({
  children,
  className,
  speed = 0.2,
  opacity = true,
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50 * speed])
  const opacityValue = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{
        y: smoothY,
        opacity: opacity ? opacityValue : 1,
      }}
    >
      {children}
    </motion.div>
  )
}

// Horizontal scroll section
interface HorizontalScrollProps {
  children: ReactNode
  className?: string
  containerClassName?: string
}

export function HorizontalScroll({
  children,
  className,
  containerClassName,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-100%'])
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 })

  return (
    <div ref={containerRef} className={cn('relative h-[300vh]', containerClassName)}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div className={cn('flex', className)} style={{ x: smoothX }}>
          {children}
        </motion.div>
      </div>
    </div>
  )
}

// Scale on scroll - element grows/shrinks based on scroll
interface ScaleOnScrollProps {
  children: ReactNode
  className?: string
  scaleRange?: [number, number]
  opacityRange?: [number, number]
}

export function ScaleOnScroll({
  children,
  className,
  scaleRange = [0.8, 1],
  opacityRange = [0.5, 1],
}: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], scaleRange)
  const opacity = useTransform(scrollYProgress, [0, 1], opacityRange)
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{
        scale: smoothScale,
        opacity,
      }}
    >
      {children}
    </motion.div>
  )
}
