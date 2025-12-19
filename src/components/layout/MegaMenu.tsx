'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/data/navigation'

// Arrow icon for links
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 8H13M13 8L9 4M13 8L9 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

interface MegaMenuProps {
  isOpen: boolean
  items: NavItem[]
  getTranslation: (key: string) => string
  parentHref?: string
}

export function MegaMenu({ isOpen, items, getTranslation, parentHref }: MegaMenuProps) {
  // Stanice mají normální text, ostatní uppercase
  const isStations = parentHref?.startsWith('/nabijeci-stanice')
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className={cn(
            'absolute left-1/2 top-full -translate-x-1/2 pt-4'
          )}
        >
          <div
            className={cn(
              'overflow-hidden rounded-2xl',
              'border border-border-subtle bg-bg-elevated',
              'shadow-2xl shadow-black/40',
              'min-w-[280px]'
            )}
          >
            {/* Gradient accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />

            <div className="p-4">
              {items.map((section) => (
                <div key={section.href} className="mb-4 last:mb-0">
                  {/* Section header */}
                  <Link
                    href={section.href}
                    className={cn(
                      'group mb-2 flex items-center gap-2 rounded-lg px-3 py-2',
                      'text-xs font-semibold tracking-wider',
                      !isStations && 'uppercase',
                      'transition-colors duration-150',
                      pathname === section.href
                        ? 'bg-green-500/10 text-green-400'
                        : 'text-text-primary hover:bg-white/5'
                    )}
                  >
                    {getTranslation(section.label)}
                    <ArrowIcon
                      className={cn(
                        'h-4 w-4 opacity-0 transition-all duration-200',
                        'group-hover:opacity-100 group-hover:translate-x-1'
                      )}
                    />
                  </Link>

                  {/* Section items */}
                  {section.children && (
                    <div className="space-y-0.5 pl-3">
                      {section.children.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'block rounded-lg px-3 py-2 text-xs tracking-wide',
                            !isStations && 'uppercase',
                            'transition-colors duration-150',
                            pathname === item.href
                              ? 'bg-green-500/10 text-green-400'
                              : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                          )}
                        >
                          {getTranslation(item.label)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Simple dropdown for items without nested children
interface SimpleDropdownProps {
  isOpen: boolean
  items: NavItem[]
  getTranslation: (key: string) => string
}

export function SimpleDropdown({ isOpen, items, getTranslation }: SimpleDropdownProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute left-0 top-full pt-4"
        >
          <div
            className={cn(
              'overflow-hidden rounded-xl',
              'border border-border-subtle bg-bg-elevated',
              'shadow-xl shadow-black/30',
              'min-w-[200px]'
            )}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
            <div className="p-1.5">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-sm',
                    'transition-colors duration-150',
                    pathname === item.href
                      ? 'bg-green-500/10 text-green-400'
                      : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                  )}
                >
                  {getTranslation(item.label)}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
