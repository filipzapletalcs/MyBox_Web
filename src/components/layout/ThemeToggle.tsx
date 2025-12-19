'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Sun icon
const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 16V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 10H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15.657 4.343L14.243 5.757" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5.757 14.243L4.343 15.657" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15.657 15.657L14.243 14.243" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5.757 5.757L4.343 4.343" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

// Moon icon
const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M17.5 10.833a7.5 7.5 0 01-9.167-9.166A7.5 7.5 0 1017.5 10.833z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface ThemeToggleProps {
  className?: string
  variant?: 'default' | 'light'
}

export function ThemeToggle({ className, variant = 'default' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={cn('h-10 w-10 rounded-lg bg-white/5', className)} />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-lg',
        'transition-colors duration-200',
        variant === 'light'
          ? 'text-white/80 hover:text-white hover:bg-white/10'
          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <MoonIcon className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <SunIcon className="h-5 w-5" />
      </motion.div>
    </button>
  )
}
