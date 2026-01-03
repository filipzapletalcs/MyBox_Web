'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Logo } from './Logo'
import { Button } from '@/components/ui'
import { navigationConfig, getMenuType } from '@/data/navigation'

// Lazy load heavy menu components (contains framer-motion)
const MegaMenu = dynamic(() => import('./MegaMenu').then(mod => ({ default: mod.MegaMenu })), {
  ssr: false,
})

const MobileMenu = dynamic(() => import('./MobileMenu').then(mod => ({ default: mod.MobileMenu })), {
  ssr: false,
})

// Icons
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M4 6H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export function Header() {
  const t = useTranslations()
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  // Pages with light background (no dark hero) - need dark text in light mode
  const isLightBgPage = pathname === '/kontakt' ||
    pathname.startsWith('/blog') ||
    pathname === '/dokumenty'

  // Refs for hover timeout management
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Clear any pending close timeout
  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  // Handle entering a nav item or the menu
  const handleMenuEnter = useCallback((href: string) => {
    clearCloseTimeout()
    const menuType = getMenuType(href)
    if (menuType) {
      setActiveMenu(href)
    }
  }, [clearCloseTimeout])

  // Handle leaving - with delay to allow moving between items
  const handleMenuLeave = useCallback(() => {
    clearCloseTimeout()
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
    }, 100) // Small delay to allow moving between items
  }, [clearCloseTimeout])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => clearCloseTimeout()
  }, [clearCloseTimeout])

  // Use layout effect for hydration - this is intentional for theme detection
  useEffect(() => {
    // Intentional: needed for hydration mismatch prevention
    const timer = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(timer)
  }, [])

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  const prevPathnameRef = useRef(pathname)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname
      // Close menus when route changes
      requestAnimationFrame(() => {
        setIsMobileMenuOpen(false)
        setActiveMenu(null)
      })
    }
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
      {/* Skip to main content - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:outline-none"
      >
        {t('navigation.skipToMain')}
      </a>

      {/* Header wrapper - keeps menu open when hovering anywhere in header */}
      <div
        onMouseEnter={clearCloseTimeout}
        onMouseLeave={handleMenuLeave}
      >
        <header
          className={cn(
            'fixed left-0 right-0 top-0 z-50',
            'transition-all duration-300',
            isScrolled || activeMenu
              ? 'bg-bg-primary border-b border-border-subtle'
              : 'bg-transparent'
          )}
        >
          <div className="container-header">
            <nav className="flex h-20 items-center justify-between">
              {/* Logo */}
              <Logo
                size="sm"
                variant={
                  // On light bg pages or when scrolled in light mode, use dark logo
                  (isLightBgPage && mounted && resolvedTheme === 'light') ||
                  (isScrolled && mounted && resolvedTheme === 'light') ||
                  (activeMenu && mounted && resolvedTheme === 'light')
                    ? 'dark'
                    : !isScrolled && !activeMenu && !isLightBgPage
                      ? 'white'
                      : mounted && resolvedTheme === 'light'
                        ? 'dark'
                        : 'white'
                }
              />

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-2 lg:flex xl:gap-4 2xl:gap-6">
                {navigationConfig.main.map((item) => (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(item.href)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-1 px-2 py-2 text-xs font-medium uppercase tracking-wider whitespace-nowrap xl:px-3 2xl:px-4',
                        'transition-colors duration-200',
                        pathname === item.href || pathname.startsWith(item.href + '/')
                          ? 'text-green-500'
                          : !isScrolled && !activeMenu && !isLightBgPage
                            ? 'text-white/80 hover:text-white'
                            : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {getTranslation(item.label)}
                    </Link>
                  </div>
                ))}
              </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* CTA Button - Desktop */}
              <div className="hidden lg:block">
                <Button asChild size="sm" className="uppercase tracking-wider text-xs">
                  <Link href="/poptavka">{t('common.requestQuote')}</Link>
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg lg:hidden',
                  'transition-colors',
                  !isScrolled && !isMobileMenuOpen && !isLightBgPage ? 'text-white' : 'text-text-primary',
                  'hover:bg-white/5'
                )}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </nav>
        </div>
        </header>

        {/* Apple-style Mega Menu - inside wrapper so mouse can move freely */}
        {(() => {
          const activeItem = navigationConfig.main.find((item) => item.href === activeMenu)
          const menuType = activeMenu ? getMenuType(activeMenu) : null

          if (!activeItem || !menuType || !activeItem.children) return null

          return (
            <MegaMenu
              isOpen={!!activeMenu}
              menuType={menuType}
              items={activeItem.children}
              parentHref={activeItem.href}
              parentLabel={activeItem.label}
              getTranslation={getTranslation}
              onClose={() => setActiveMenu(null)}
            />
          )
        })()}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={navigationConfig.main}
        getTranslation={getTranslation}
      />
    </>
  )
}
