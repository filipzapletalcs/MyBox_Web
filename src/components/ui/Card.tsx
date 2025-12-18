'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  [
    'relative overflow-hidden',
    'transition-all duration-300 ease-out',
  ],
  {
    variants: {
      variant: {
        // Default - subtle border, clean
        default: [
          'bg-bg-secondary',
          'border border-border-subtle',
          'hover:border-border-default',
        ],
        // Elevated - slight lift effect
        elevated: [
          'bg-bg-elevated',
          'border border-border-subtle',
          'shadow-lg shadow-black/20',
          'hover:shadow-xl hover:shadow-black/30',
          'hover:border-border-default',
        ],
        // Glass - frosted glass effect
        glass: [
          'bg-white/5 backdrop-blur-xl',
          'border border-white/10',
          'hover:bg-white/8 hover:border-white/20',
        ],
        // Outlined - just border, no fill
        outlined: [
          'bg-transparent',
          'border border-border-default',
          'hover:border-green-500/30',
        ],
        // Interactive - for clickable cards
        interactive: [
          'bg-bg-secondary',
          'border border-border-subtle',
          'cursor-pointer',
          'hover:bg-bg-tertiary hover:border-green-500/20',
          'hover:shadow-[0_0_30px_rgba(74,222,128,0.05)]',
          'active:scale-[0.99]',
        ],
        // Gradient - subtle gradient border
        gradient: [
          'bg-bg-secondary',
          'border border-transparent',
          'bg-clip-padding',
          '[background:linear-gradient(var(--bg-secondary),var(--bg-secondary))_padding-box,linear-gradient(135deg,rgba(74,222,128,0.3),transparent_50%,rgba(74,222,128,0.1))_border-box]',
          'hover:[background:linear-gradient(var(--bg-tertiary),var(--bg-tertiary))_padding-box,linear-gradient(135deg,rgba(74,222,128,0.5),transparent_50%,rgba(74,222,128,0.2))_border-box]',
        ],
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-lg',
        md: 'rounded-xl',
        lg: 'rounded-2xl',
        xl: 'rounded-3xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      radius: 'lg',
    },
  }
)

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof cardVariants> {
  withHover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, radius, withHover = false, children, ...props }, ref) => {
    if (withHover) {
      return (
        <motion.div
          ref={ref}
          className={cn(cardVariants({ variant, padding, radius }), className)}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, radius }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card subcomponents for composition
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold text-text-primary', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('mt-1 text-sm text-text-secondary', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-6 flex items-center gap-3', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants }
