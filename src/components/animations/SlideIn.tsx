'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SlideInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'left' | 'right' | 'up' | 'down'
  distance?: number | string
  once?: boolean
  threshold?: number
}

export function SlideIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  direction = 'left',
  distance = '100%',
  once = true,
  threshold = 0.1,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const directionMap = {
    left: { x: typeof distance === 'number' ? -distance : `-${distance}` },
    right: { x: typeof distance === 'number' ? distance : distance },
    up: { y: typeof distance === 'number' ? distance : distance },
    down: { y: typeof distance === 'number' ? -distance : `-${distance}` },
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...directionMap[direction],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={cn('overflow-hidden', className)}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

// Text reveal animation - character by character or word by word
interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
  mode?: 'words' | 'characters'
  once?: boolean
  threshold?: number
}

export function TextReveal({
  text,
  className,
  delay = 0,
  staggerDelay = 0.03,
  mode = 'words',
  once = true,
  threshold = 0.1,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const items = mode === 'words' ? text.split(' ') : text.split('')

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={cn('flex flex-wrap', className)}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      style={{ perspective: 1000 }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={itemVariants}
          style={{ transformOrigin: 'bottom' }}
        >
          {item}
          {mode === 'words' && index < items.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Line reveal - reveal from behind a mask
interface LineRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'left' | 'right'
  once?: boolean
  threshold?: number
}

export function LineReveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = 'left',
  once = true,
  threshold = 0.1,
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const maskVariants: Variants = {
    hidden: {
      scaleX: 0,
    },
    visible: {
      scaleX: [0, 1, 1, 0],
      transition: {
        duration: duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        times: [0, 0.4, 0.6, 1],
      },
    },
  }

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.01, delay: delay + duration * 0.5 }}
      >
        {children}
      </motion.div>

      {/* Reveal mask */}
      <motion.div
        className="absolute inset-0 bg-green-500"
        style={{ originX: direction === 'left' ? 0 : 1 }}
        variants={maskVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      />
    </div>
  )
}
