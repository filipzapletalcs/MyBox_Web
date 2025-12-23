'use client'

import { forwardRef, type TextareaHTMLAttributes, useState, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  showCount?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      success,
      hint,
      showCount,
      maxLength,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [charCount, setCharCount] = useState(
      typeof props.value === 'string' ? props.value.length : 0
    )
    const generatedId = useId()
    // Use provided id, or name-based id, or fallback to generated id
    const textareaId = id || (props.name ? `textarea-${props.name.replace(/\./g, '-')}` : generatedId)

    const state = error ? 'error' : success ? 'success' : isFocused ? 'focused' : 'default'

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        {/* Textarea wrapper */}
        <div
          className={cn(
            'relative overflow-hidden rounded-xl border bg-bg-secondary transition-all duration-200',
            state === 'default' && 'border-border-subtle hover:border-border-default',
            state === 'focused' && 'border-green-500/50 shadow-[0_0_20px_rgba(74,222,128,0.1)]',
            state === 'error' && 'border-red-500/50',
            state === 'success' && 'border-emerald-500/50'
          )}
        >
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              'min-h-[120px] w-full resize-y bg-transparent',
              'px-[var(--input-px-md)] py-[var(--input-py-md)]',
              'text-[length:var(--text-sm)] text-text-primary',
              'placeholder:text-text-muted',
              'focus:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
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
            onChange={(e) => {
              setCharCount(e.target.value.length)
              props.onChange?.(e)
            }}
            {...props}
          />

          {/* Focus indicator line */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-green-500"
            initial={{ width: '0%' }}
            animate={{ width: isFocused ? '100%' : '0%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>

        {/* Bottom row: messages + counter */}
        <div className="mt-2 flex items-start justify-between gap-4">
          {/* Messages */}
          <AnimatePresence mode="wait">
            {(error || success || hint) && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'text-xs',
                  error && 'text-red-400',
                  success && 'text-emerald-400',
                  hint && !error && !success && 'text-text-muted'
                )}
              >
                {error || success || hint}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Character count */}
          {showCount && maxLength && (
            <span
              className={cn(
                'ml-auto text-xs text-text-muted',
                charCount >= maxLength && 'text-red-400'
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
