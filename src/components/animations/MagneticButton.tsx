'use client'

import { type ReactNode, useRef, useState, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
  springConfig?: {
    stiffness?: number
    damping?: number
  }
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  radius = 200,
  springConfig = { stiffness: 150, damping: 15 },
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Spring values for smooth movement
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  // Transform for slight rotation based on position
  const rotateX = useTransform(y, [-20, 20], [5, -5])
  const rotateY = useTransform(x, [-20, 20], [-5, 5])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

      // Only apply effect within radius
      if (distance < radius) {
        const factor = 1 - distance / radius
        x.set(distanceX * strength * factor)
        y.set(distanceY * strength * factor)
      }
    },
    [strength, radius, x, y]
  )

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }, [x, y])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  return (
    <motion.div
      ref={ref}
      className={cn('relative inline-block', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        perspective: 1000,
      }}
    >
      {children}

      {/* Subtle glow effect on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'radial-gradient(circle at center, rgba(74, 222, 128, 0.15) 0%, transparent 70%)',
          filter: 'blur(20px)',
          transform: 'scale(1.5)',
        }}
      />
    </motion.div>
  )
}

// Simplified magnetic wrapper that only moves children
interface MagneticWrapperProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticWrapper({
  children,
  className,
  strength = 0.2,
}: MagneticWrapperProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useSpring(0, { stiffness: 200, damping: 20 })
  const y = useSpring(0, { stiffness: 200, damping: 20 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      x.set((e.clientX - centerX) * strength)
      y.set((e.clientY - centerY) * strength)
    },
    [strength, x, y]
  )

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      className={cn('inline-block', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  )
}
