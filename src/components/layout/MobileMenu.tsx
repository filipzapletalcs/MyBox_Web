'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { NavItem } from '@/data/navigation'

// Chevron icon
const ChevronIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7.5 5L12.5 10L7.5 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  items: NavItem[]
  getTranslation: (key: string) => string
}

export function MobileMenu({ isOpen, onClose, items, getTranslation }: MobileMenuProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Menu panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed right-0 top-0 z-50 h-full w-full max-w-sm lg:hidden',
              'bg-bg-primary border-l border-border-subtle',
              'flex flex-col'
            )}
          >
            {/* Header */}
            <div className="flex h-20 items-center justify-between border-b border-border-subtle px-6">
              <span className="text-lg font-semibold text-text-primary">Menu</span>
              <button
                onClick={onClose}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  'text-text-primary transition-colors',
                  'hover:bg-white/5'
                )}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.href}>
                    {item.children ? (
                      <>
                        {/* Expandable item */}
                        <button
                          onClick={() => toggleExpand(item.href)}
                          className={cn(
                            'flex w-full items-center justify-between rounded-xl px-4 py-3',
                            'text-base font-medium',
                            'transition-colors duration-150',
                            expandedItems.includes(item.href)
                              ? 'bg-white/5 text-text-primary'
                              : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                          )}
                        >
                          {getTranslation(item.label)}
                          <ChevronIcon
                            className={cn(
                              'h-5 w-5 transition-transform duration-200',
                              expandedItems.includes(item.href) && 'rotate-90'
                            )}
                          />
                        </button>

                        {/* Children */}
                        <AnimatePresence>
                          {expandedItems.includes(item.href) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-1 py-2 pl-4">
                                {/* Parent link */}
                                <Link
                                  href={item.href}
                                  onClick={onClose}
                                  className={cn(
                                    'block rounded-lg px-4 py-2.5 text-sm font-medium',
                                    'transition-colors duration-150',
                                    pathname === item.href
                                      ? 'bg-green-500/10 text-green-400'
                                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                  )}
                                >
                                  {t('common.seeAll')}
                                </Link>

                                {item.children.map((child) => (
                                  <div key={child.href}>
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className={cn(
                                        'block rounded-lg px-4 py-2.5 text-sm',
                                        'transition-colors duration-150',
                                        pathname === child.href
                                          ? 'bg-green-500/10 text-green-400'
                                          : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                                      )}
                                    >
                                      {getTranslation(child.label)}
                                    </Link>

                                    {/* Nested children (products) */}
                                    {child.children && (
                                      <div className="space-y-0.5 py-1 pl-4">
                                        {child.children.map((product) => (
                                          <Link
                                            key={product.href}
                                            href={product.href}
                                            onClick={onClose}
                                            className={cn(
                                              'block rounded-lg px-4 py-2 text-sm',
                                              'transition-colors duration-150',
                                              pathname === product.href
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'text-text-muted hover:bg-white/5 hover:text-text-secondary'
                                            )}
                                          >
                                            {getTranslation(product.label)}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      /* Simple link */
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          'block rounded-xl px-4 py-3 text-base font-medium',
                          'transition-colors duration-150',
                          pathname === item.href
                            ? 'bg-green-500/10 text-green-400'
                            : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                        )}
                      >
                        {getTranslation(item.label)}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-border-subtle p-6">
              {/* Language switcher */}
              <div className="mb-4">
                <LanguageSwitcher variant="minimal" className="justify-center" />
              </div>

              {/* CTA */}
              <Button asChild fullWidth size="lg">
                <Link href="/poptavka" onClick={onClose}>
                  {t('common.requestQuote')}
                </Link>
              </Button>

              {/* Contact link */}
              <Link
                href="/kontakt"
                onClick={onClose}
                className={cn(
                  'mt-3 block rounded-xl py-3 text-center text-sm font-medium',
                  'text-text-secondary transition-colors',
                  'hover:text-text-primary'
                )}
              >
                {t('navigation.contact')}
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
