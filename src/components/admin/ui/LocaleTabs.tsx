'use client'

import { cn } from '@/lib/utils'

export type Locale = 'cs' | 'en' | 'de'
export type LocaleStatus = 'complete' | 'partial' | 'empty'

const localeLabels: Record<Locale, string> = {
  cs: 'Čeština',
  en: 'English',
  de: 'Deutsch',
}

const localeFlags: Record<Locale, string> = {
  cs: '🇨🇿',
  en: '🇬🇧',
  de: '🇩🇪',
}

export interface LocaleTabsProps {
  activeLocale: Locale
  onLocaleChange: (locale: Locale) => void
  localeStatus?: Record<Locale, LocaleStatus>
  className?: string
}

export function LocaleTabs({
  activeLocale,
  onLocaleChange,
  localeStatus,
  className,
}: LocaleTabsProps) {
  const locales: Locale[] = ['cs', 'en', 'de']

  const getStatusColor = (status?: LocaleStatus) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500'
      case 'partial':
        return 'bg-yellow-500'
      case 'empty':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div
      className={cn(
        'inline-flex rounded-xl bg-bg-secondary p-1',
        className
      )}
    >
      {locales.map((locale) => {
        const isActive = activeLocale === locale
        const status = localeStatus?.[locale]

        return (
          <button
            key={locale}
            type="button"
            onClick={() => onLocaleChange(locale)}
            className={cn(
              'relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-green-500/15 text-green-400 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.2)]'
                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
            )}
          >
            <span>{localeFlags[locale]}</span>
            <span>{localeLabels[locale]}</span>
            {status && (
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  getStatusColor(status)
                )}
                title={
                  status === 'complete'
                    ? 'Kompletní'
                    : status === 'partial'
                      ? 'Částečně vyplněno'
                      : 'Prázdné'
                }
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
