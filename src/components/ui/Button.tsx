'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles - refined, precise
  [
    'relative inline-flex items-center justify-center gap-2',
    'font-medium tracking-wide',
    'transition-all duration-300 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
    'disabled:pointer-events-none disabled:opacity-40',
    'select-none cursor-pointer',
  ],
  {
    variants: {
      variant: {
        // Primary CTA - electric green with glow
        primary: [
          'bg-green-500 text-white',
          'shadow-[0_0_20px_rgba(74,222,128,0.3)]',
          'hover:bg-green-400 hover:shadow-[0_0_30px_rgba(74,222,128,0.5)]',
          'active:bg-green-600 active:shadow-[0_0_15px_rgba(74,222,128,0.4)]',
        ],
        // Secondary - outlined, sophisticated
        secondary: [
          'bg-transparent text-text-primary',
          'border border-border-default',
          'hover:border-green-500/50 hover:text-green-400',
          'active:border-green-500 active:bg-green-500/5',
        ],
        // Ghost - minimal, text-only feel
        ghost: [
          'bg-transparent text-text-secondary',
          'hover:text-text-primary hover:bg-white/5',
          'active:bg-white/10',
        ],
        // Dark - for light backgrounds
        dark: [
          'bg-bg-primary text-text-primary',
          'border border-border-subtle',
          'hover:bg-bg-elevated hover:border-border-default',
          'active:bg-bg-tertiary',
        ],
        // Danger - for destructive actions
        danger: [
          'bg-red-500/10 text-red-400',
          'border border-red-500/20',
          'hover:bg-red-500/20 hover:border-red-500/40',
          'active:bg-red-500/30',
        ],
      },
      size: {
        sm: 'h-[var(--input-height-sm)] px-[var(--button-px-sm)] text-[length:var(--text-sm)] rounded-lg',
        md: 'h-[var(--input-height-md)] px-[var(--button-px-md)] text-[length:var(--text-sm)] rounded-xl',
        lg: 'h-[var(--input-height-lg)] px-[var(--button-px-lg)] text-[length:var(--text-base)] rounded-xl',
        xl: 'h-16 px-[var(--button-px-xl)] text-[length:var(--text-lg)] rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  withMotion?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      withMotion = false, // Default false when asChild might be used
      ...props
    },
    ref
  ) => {
    // When asChild is true, render as Slot (passes styles to child)
    if (asChild) {
      return (
        <Slot
          ref={ref as any}
          className={cn(buttonVariants({ variant, size, fullWidth }), className)}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    const content = (
      <>
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}

        {/* Content */}
        <span
          className={cn(
            'inline-flex items-center gap-2',
            isLoading && 'invisible'
          )}
        >
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </>
    )

    if (withMotion) {
      return (
        <motion.button
          ref={ref}
          className={cn(buttonVariants({ variant, size, fullWidth }), className)}
          disabled={disabled || isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          {...(props as HTMLMotionProps<'button'>)}
        >
          {content}
        </motion.button>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
