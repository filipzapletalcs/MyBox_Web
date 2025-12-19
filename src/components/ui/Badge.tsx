'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-medium tracking-wide',
    'transition-colors duration-200',
  ],
  {
    variants: {
      variant: {
        // Default - subtle, neutral
        default: [
          'bg-white/10 text-text-secondary',
          'border border-white/5',
        ],
        // Primary - green accent
        primary: [
          'bg-green-500/15 text-green-400',
          'border border-green-500/20',
        ],
        // Success - for positive states
        success: [
          'bg-emerald-500/15 text-emerald-400',
          'border border-emerald-500/20',
        ],
        // Warning - for alerts
        warning: [
          'bg-amber-500/15 text-amber-400',
          'border border-amber-500/20',
        ],
        // Danger - for errors
        danger: [
          'bg-red-500/15 text-red-400',
          'border border-red-500/20',
        ],
        // Info - informational
        info: [
          'bg-blue-500/15 text-blue-400',
          'border border-blue-500/20',
        ],
        // Outline - just border
        outline: [
          'bg-transparent text-text-secondary',
          'border border-border-default',
        ],
        // Solid - strong presence
        solid: [
          'bg-green-500 text-black',
          'border border-transparent',
        ],
      },
      size: {
        sm: 'h-5 px-[var(--space-2)] text-[length:var(--text-2xs)] rounded-md gap-[var(--gap-xs)]',
        md: 'h-6 px-[var(--space-2-5)] text-[length:var(--text-xs)] rounded-lg gap-[var(--space-1-5)]',
        lg: 'h-7 px-[var(--space-3)] text-[length:var(--text-sm)] rounded-lg gap-[var(--gap-sm)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  icon?: React.ReactNode
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              variant === 'primary' && 'bg-green-400',
              variant === 'success' && 'bg-emerald-400',
              variant === 'warning' && 'bg-amber-400',
              variant === 'danger' && 'bg-red-400',
              variant === 'info' && 'bg-blue-400',
              variant === 'solid' && 'bg-black',
              (!variant || variant === 'default' || variant === 'outline') && 'bg-text-secondary'
            )}
          />
        )}
        {icon}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
