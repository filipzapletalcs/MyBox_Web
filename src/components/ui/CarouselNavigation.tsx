'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon } from './icons'

// Navigation button component
interface NavButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function NavButton({
  direction,
  onClick,
  disabled,
  size = 'md',
  className,
}: NavButtonProps) {
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center rounded-full',
        'bg-bg-secondary shadow-md border border-border-subtle',
        'text-text-secondary transition-all duration-200',
        'hover:bg-bg-tertiary hover:text-text-primary hover:shadow-lg',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-bg-secondary disabled:hover:shadow-md',
        sizeClasses[size],
        className
      )}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
    >
      {direction === 'prev' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  )
}

// Pill indicator component
interface PillIndicatorProps {
  total: number
  current: number
  accentColor?: string
  className?: string
}

export function PillIndicator({
  total,
  current,
  accentColor = 'rgb(34, 197, 94)', // green-500
  className,
}: PillIndicatorProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-full bg-bg-secondary px-3 py-2 shadow-md border border-border-subtle',
        className
      )}
    >
      {Array.from({ length: total }).map((_, index) => (
        <motion.div
          key={index}
          className="h-2 rounded-full transition-colors duration-300"
          animate={{
            width: index === current ? 24 : 8,
            backgroundColor:
              index === current ? accentColor : 'var(--color-border-subtle)',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// Combined carousel navigation component
interface CarouselNavigationProps {
  total: number
  current: number
  onPrev: () => void
  onNext: () => void
  disablePrev?: boolean
  disableNext?: boolean
  accentColor?: string
  size?: 'sm' | 'md' | 'lg'
  showIndicator?: boolean
  className?: string
}

export function CarouselNavigation({
  total,
  current,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  accentColor = 'rgb(34, 197, 94)',
  size = 'md',
  showIndicator = true,
  className,
}: CarouselNavigationProps) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <NavButton
        direction="prev"
        onClick={onPrev}
        disabled={disablePrev}
        size={size}
      />
      {showIndicator && (
        <PillIndicator total={total} current={current} accentColor={accentColor} />
      )}
      <NavButton
        direction="next"
        onClick={onNext}
        disabled={disableNext}
        size={size}
      />
    </div>
  )
}
