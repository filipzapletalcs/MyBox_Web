'use client'

import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  [
    'w-full bg-transparent',
    'text-text-primary placeholder:text-text-muted',
    'transition-all duration-200 ease-out',
    'focus:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-14 px-5 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const wrapperVariants = cva(
  [
    'relative flex items-center',
    'bg-bg-secondary',
    'border transition-all duration-200 ease-out',
    'overflow-hidden',
  ],
  {
    variants: {
      size: {
        sm: 'rounded-lg',
        md: 'rounded-xl',
        lg: 'rounded-xl',
      },
      state: {
        default: 'border-border-subtle hover:border-border-default',
        focused: 'border-green-500/50 shadow-[0_0_20px_rgba(74,222,128,0.1)]',
        error: 'border-red-500/50',
        success: 'border-emerald-500/50',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
)

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  success?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  leftAddon?: ReactNode
  rightAddon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    const state = error ? 'error' : success ? 'success' : isFocused ? 'focused' : 'default'

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className={cn(wrapperVariants({ size, state }))}>
          {/* Left addon */}
          {leftAddon && (
            <div className="flex h-full items-center border-r border-border-subtle bg-bg-tertiary px-4 text-sm text-text-muted">
              {leftAddon}
            </div>
          )}

          {/* Left icon */}
          {leftIcon && (
            <span className="pointer-events-none ml-4 flex items-center text-text-muted">
              {leftIcon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              inputVariants({ size }),
              leftIcon && 'pl-2',
              rightIcon && 'pr-2',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="pointer-events-none mr-4 flex items-center text-text-muted">
              {rightIcon}
            </span>
          )}

          {/* Right addon */}
          {rightAddon && (
            <div className="flex h-full items-center border-l border-border-subtle bg-bg-tertiary px-4 text-sm text-text-muted">
              {rightAddon}
            </div>
          )}

          {/* Focus indicator line */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-green-500"
            initial={{ width: '0%' }}
            animate={{ width: isFocused ? '100%' : '0%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {(error || success || hint) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'mt-2 text-xs',
                error && 'text-red-400',
                success && 'text-emerald-400',
                hint && !error && !success && 'text-text-muted'
              )}
            >
              {error || success || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, inputVariants }
