'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { NavItem } from '@/data/navigation'
import { productImages } from '@/data/navigation'
import Image from 'next/image'

// Icons
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 19L8 12L15 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M15 5L5 15M5 5L15 15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M3 17.5C3 14.186 6.134 11.5 10 11.5C13.866 11.5 17 14.186 17 17.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

// Animation variants - Apple-style smooth stagger
const menuVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

const contentVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
}

const controlsVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.3,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  items: NavItem[]
  getTranslation: (key: string) => string
}

export function MobileMenu({ isOpen, onClose, items, getTranslation }: MobileMenuProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [activeSubmenu, setActiveSubmenu] = useState<NavItem | null>(null)

  const handleItemClick = useCallback((item: NavItem) => {
    if (item.children && item.children.length > 0) {
      setActiveSubmenu(item)
    }
  }, [])

  const handleBack = useCallback(() => {
    setActiveSubmenu(null)
  }, [])

  const handleClose = useCallback(() => {
    setActiveSubmenu(null)
    onClose()
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed inset-0 z-[100] lg:hidden',
            'bg-bg-primary',
            'flex flex-col'
          )}
        >
          {/* Header with close/back button */}
          <div className="flex h-14 items-center justify-between px-4">
            {/* Back button - only visible in submenu */}
            <div className="w-10">
              <AnimatePresence mode="wait">
                {activeSubmenu && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleBack}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      'text-text-primary transition-colors',
                      'active:bg-white/5'
                    )}
                    aria-label="Zpět"
                  >
                    <ChevronLeftIcon className="h-6 w-6" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                'text-text-primary transition-colors',
                'active:bg-white/5'
              )}
              aria-label="Zavřít menu"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation content */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6">
            <AnimatePresence mode="wait">
              {!activeSubmenu ? (
                // Main menu
                <motion.nav
                  key="main-menu"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-1"
                >
                  {items.map((item) => (
                    <motion.div key={item.href} variants={itemVariants}>
                      {item.children && item.children.length > 0 ? (
                        <button
                          onClick={() => handleItemClick(item)}
                          className={cn(
                            'block w-full py-3 text-left',
                            'text-[1.75rem] font-semibold leading-tight tracking-tight',
                            'text-text-primary transition-colors',
                            'active:text-text-secondary'
                          )}
                        >
                          {getTranslation(item.label)}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={handleClose}
                          className={cn(
                            'block py-3',
                            'text-[1.75rem] font-semibold leading-tight tracking-tight',
                            pathname === item.href
                              ? 'text-green-500'
                              : 'text-text-primary active:text-text-secondary'
                          )}
                        >
                          {getTranslation(item.label)}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </motion.nav>
              ) : (
                // Submenu
                <motion.div
                  key={`submenu-${activeSubmenu.href}`}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Submenu header - parent category */}
                  <motion.div variants={itemVariants} className="mb-4">
                    <Link
                      href={activeSubmenu.href}
                      onClick={handleClose}
                      className={cn(
                        'inline-block',
                        'text-[1.75rem] font-semibold leading-tight tracking-tight',
                        pathname === activeSubmenu.href
                          ? 'text-green-500'
                          : 'text-text-primary'
                      )}
                    >
                      {getTranslation(activeSubmenu.label)}
                    </Link>
                  </motion.div>

                  {/* Special grid view for charging stations */}
                  {activeSubmenu.href === '/nabijeci-stanice' ? (
                    <div className="space-y-6">
                      {/* AC Charging Stations - items 0-3 */}
                      <motion.div variants={itemVariants}>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                          AC nabíjecí stanice
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {activeSubmenu.children?.slice(0, 4).map((product) => {
                            const imageSrc = productImages[product.href]
                            return (
                              <Link
                                key={product.href}
                                href={product.href}
                                onClick={handleClose}
                                className={cn(
                                  'flex flex-col items-center gap-2 rounded-xl p-3',
                                  'bg-bg-secondary transition-colors',
                                  'active:bg-bg-tertiary',
                                  pathname === product.href && 'ring-2 ring-green-500'
                                )}
                              >
                                <div className="relative h-20 w-20">
                                  {imageSrc ? (
                                    <Image
                                      src={imageSrc}
                                      alt={getTranslation(product.label)}
                                      fill
                                      className="object-contain"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-bg-tertiary">
                                      <span className="text-xl text-text-muted">?</span>
                                    </div>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    'text-center text-sm font-medium',
                                    pathname === product.href
                                      ? 'text-green-500'
                                      : 'text-text-primary'
                                  )}
                                >
                                  {getTranslation(product.label)}
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>

                      {/* DC Charging Stations - items 5-7 */}
                      <motion.div variants={itemVariants}>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted">
                          DC nabíjecí stanice
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {activeSubmenu.children?.slice(5, 8).map((product) => {
                            const imageSrc = productImages[product.href]
                            return (
                              <Link
                                key={product.href}
                                href={product.href}
                                onClick={handleClose}
                                className={cn(
                                  'flex flex-col items-center gap-2 rounded-xl p-3',
                                  'bg-bg-secondary transition-colors',
                                  'active:bg-bg-tertiary',
                                  pathname === product.href && 'ring-2 ring-green-500'
                                )}
                              >
                                <div className="relative h-20 w-20">
                                  {imageSrc ? (
                                    <Image
                                      src={imageSrc}
                                      alt={getTranslation(product.label)}
                                      fill
                                      className="object-contain"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-bg-tertiary">
                                      <span className="text-xl text-text-muted">?</span>
                                    </div>
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    'text-center text-sm font-medium',
                                    pathname === product.href
                                      ? 'text-green-500'
                                      : 'text-text-primary'
                                  )}
                                >
                                  {getTranslation(product.label)}
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>

                      {/* Wallbox (item 4) + Accessories (item 8) - side by side */}
                      <motion.div variants={itemVariants}>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Wallbox */}
                          {activeSubmenu.children?.[4] && (
                            <Link
                              href={activeSubmenu.children[4].href}
                              onClick={handleClose}
                              className={cn(
                                'flex items-center justify-center rounded-xl bg-bg-secondary p-4',
                                'text-sm font-medium transition-colors',
                                'active:bg-bg-tertiary',
                                pathname === activeSubmenu.children[4].href
                                  ? 'text-green-500'
                                  : 'text-text-primary'
                              )}
                            >
                              {getTranslation(activeSubmenu.children[4].label)}
                            </Link>
                          )}
                          {/* Accessories */}
                          {activeSubmenu.children?.[8] && (
                            <Link
                              href={activeSubmenu.children[8].href}
                              onClick={handleClose}
                              className={cn(
                                'flex items-center justify-center rounded-xl bg-bg-secondary p-4',
                                'text-sm font-medium transition-colors',
                                'active:bg-bg-tertiary',
                                pathname === activeSubmenu.children[8].href
                                  ? 'text-green-500'
                                  : 'text-text-primary'
                              )}
                            >
                              {getTranslation(activeSubmenu.children[8].label)}
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    /* Regular submenu items */
                    <nav className="space-y-1">
                      {activeSubmenu.children?.map((child) => (
                        <motion.div key={child.href} variants={itemVariants}>
                          <Link
                            href={child.href}
                            onClick={handleClose}
                            className={cn(
                              'block py-2.5',
                              'text-[1.5rem] font-semibold leading-tight tracking-tight',
                              pathname === child.href
                                ? 'text-green-500'
                                : 'text-text-primary active:text-text-secondary'
                            )}
                          >
                            {getTranslation(child.label)}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom section - controls and CTA */}
          <motion.div
            variants={controlsVariants}
            initial="hidden"
            animate="visible"
            className="shrink-0 px-6 pb-4"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Control buttons row */}
            <div className="flex items-center justify-center gap-3 border-t border-border-subtle py-5">
              {/* Cloud login */}
              <a
                href="https://cloud.mybox.pro"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'flex h-11 items-center gap-2 rounded-full px-4',
                  'bg-bg-secondary text-text-secondary',
                  'transition-colors active:bg-bg-tertiary'
                )}
              >
                <UserIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Cloud</span>
              </a>

              {/* Theme toggle */}
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-secondary">
                <ThemeToggle className="h-9 w-9" />
              </div>

              {/* Language switcher */}
              <LanguageSwitcher />
            </div>

            {/* CTA Button */}
            <Button asChild fullWidth size="lg" className="h-14 text-base">
              <Link href="/poptavka" onClick={handleClose}>
                {t('common.requestQuote')}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
