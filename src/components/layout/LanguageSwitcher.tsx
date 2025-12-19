'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { locales, type Locale } from '@/i18n/routing'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Globe icon
const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M2.5 10H17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 2.5C11.8333 4.5 13 7 13 10C13 13 11.8333 15.5 10 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M10 2.5C8.16667 4.5 7 7 7 10C7 13 8.16667 15.5 10 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const languageNames: Record<Locale, { short: string; full: string }> = {
  cs: { short: 'CS', full: 'Čeština' },
  en: { short: 'EN', full: 'English' },
  de: { short: 'DE', full: 'Deutsch' },
}

interface LanguageSwitcherProps {
  className?: string
  variant?: 'default' | 'minimal'
  colorVariant?: 'default' | 'light'
}

export function LanguageSwitcher({ className, variant = 'default', colorVariant = 'default' }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    // Pathname is always valid for current page, cast needed for dynamic routes
    router.replace(pathname as any, { locale: newLocale })
    setIsOpen(false)
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-1', className)}>
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLanguageChange(loc)}
            className={cn(
              'px-2 py-1 text-xs font-medium tracking-wide transition-colors',
              locale === loc
                ? 'text-green-400'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            {languageNames[loc].short}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2',
          'text-sm transition-all duration-200',
          colorVariant === 'light'
            ? 'text-white/80 hover:text-white hover:bg-white/10'
            : 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
          isOpen && (colorVariant === 'light' ? 'bg-white/10 text-white' : 'bg-white/5 text-text-primary')
        )}
      >
        <GlobeIcon className="h-5 w-5" />
        <span className="font-medium">{languageNames[locale].short}</span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
              'absolute right-0 top-full z-50 mt-2',
              'min-w-[140px] overflow-hidden',
              'rounded-xl border border-border-subtle bg-bg-elevated',
              'shadow-xl shadow-black/30'
            )}
          >
            <div className="p-1.5">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLanguageChange(loc)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm',
                    'transition-colors duration-150',
                    locale === loc
                      ? 'bg-green-500/10 text-green-400'
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  )}
                >
                  <span className="font-medium">{languageNames[loc].short}</span>
                  <span className="text-text-muted">{languageNames[loc].full}</span>
                  {locale === loc && (
                    <svg
                      className="ml-auto h-4 w-4 text-green-500"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M13.5 4.5L6.5 11.5L3 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
