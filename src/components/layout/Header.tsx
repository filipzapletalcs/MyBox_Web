'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui'
import { navigationConfig } from '@/data/navigation'

// Icons
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ChevronIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function Header() {
  const t = useTranslations()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveMenu(null)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Helper function to get nested translation
  const getTranslation = (key: string) => {
    try {
      const parts = key.split('.')
      if (parts.length === 2) {
        return t(`${parts[0]}.${parts[1]}` as any)
      }
      if (parts.length === 3) {
        return t(`${parts[0]}.${parts[1]}.${parts[2]}` as any)
      }
      return t(key as any)
    } catch {
      return key
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50',
          'transition-all duration-300',
          isScrolled
            ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle'
            : 'bg-transparent'
        )}
      >
        <div className="container-custom">
          <nav className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {navigationConfig.main.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveMenu(item.href)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-sm font-medium',
                      'transition-colors duration-200',
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'text-green-400'
                        : 'text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {getTranslation(item.label)}
                    {item.children && (
                      <ChevronIcon
                        className={cn(
                          'h-4 w-4 transition-transform duration-200',
                          activeMenu === item.href && 'rotate-180'
                        )}
                      />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  {item.children && (
                    <MegaMenu
                      isOpen={activeMenu === item.href}
                      items={item.children}
                      getTranslation={getTranslation}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language Switcher - Desktop */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

              {/* CTA Button - Desktop */}
              <div className="hidden lg:block">
                <Button asChild size="md">
                  <Link href="/poptavka">{t('common.requestQuote')}</Link>
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg lg:hidden',
                  'text-text-primary transition-colors',
                  'hover:bg-white/5'
                )}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={navigationConfig.main}
        getTranslation={getTranslation}
      />

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  )
}
