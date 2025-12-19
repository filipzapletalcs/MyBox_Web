'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Link, usePathname } from '@/i18n/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/data/navigation'
import { productImages } from '@/data/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LanguageSwitcher } from './LanguageSwitcher'

// User icon for cloud login
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

// Animation variants for content
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
      ease: 'easeIn' as const,
    },
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut' as const,
    },
  },
}

const categoryVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: 'easeOut' as const,
    },
  },
}

interface MegaMenuProps {
  isOpen: boolean
  menuType: 'products' | 'categories'
  items: NavItem[]
  parentHref: string
  parentLabel: string
  getTranslation: (key: string) => string
  onClose: () => void
}

export function MegaMenu({
  isOpen,
  menuType,
  items,
  parentHref,
  parentLabel,
  getTranslation,
  onClose,
}: MegaMenuProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <>
      {/* Menu panel - stays mounted, only content animates */}
      <div
        className={cn(
          'fixed left-0 right-0 top-20 z-50',
          'border-b border-border-subtle bg-bg-primary',
          'shadow-xl shadow-black/5'
        )}
      >
        <div className="container-header pt-0 pb-10">
          {/* Controls in top-right corner */}
          <div className="mb-6 flex justify-end">
            <div className="flex items-center gap-1">
              <a
                href="https://cloud.mybox.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                aria-label="MyBox Cloud"
              >
                <UserIcon className="h-5 w-5" />
              </a>
              <ThemeToggle className="h-9 w-9" />
              <LanguageSwitcher />
            </div>
          </div>
          {/* Animate content changes using key */}
          <AnimatePresence mode="wait">
            <motion.div
              key={parentHref}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {menuType === 'products' ? (
                <ProductsMenu
                  items={items}
                  getTranslation={getTranslation}
                  pathname={pathname}
                />
              ) : (
                <CategoriesMenu
                  items={items}
                  parentHref={parentHref}
                  parentLabel={parentLabel}
                  getTranslation={getTranslation}
                  pathname={pathname}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Backdrop overlay with blur - closes menu on hover/click */}
      <div
        className="fixed inset-0 top-20 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        onMouseEnter={onClose}
      />
    </>
  )
}

// Products menu - Two sections with headers
function ProductsMenu({
  items,
  getTranslation,
  pathname,
}: {
  items: NavItem[]
  getTranslation: (key: string) => string
  pathname: string
}) {
  // AC stations - Row 1: MyBox Home, Plus, Profi, Post, [empty], Wallbox
  const acItems: (NavItem | null)[] = [
    items[0] || null, // MyBox Home
    items[1] || null, // MyBox Plus
    items[2] || null, // MyBox Profi
    items[3] || null, // MyBox Post
    null,             // Empty space
    items[4] || null, // Wallbox
  ]

  // DC stations - Row 2: HYC 400, HYC 200, HYC 50, [empty], [empty], Accessories
  const dcItems: (NavItem | null)[] = [
    items[5] || null, // HYC 400
    items[6] || null, // HYC 200
    items[7] || null, // HYC 50
    null,             // Empty space
    null,             // Empty space
    items[8] || null, // Accessories
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16"
    >
      {/* AC Charging Stations Section */}
      <div className="mb-12">
        <motion.div variants={itemVariants}>
          <Link
            href="/nabijeci-stanice/ac"
            className="group mb-10 mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-text-primary"
          >
            AC nabíjecí stanice
            <ArrowIcon className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-6 gap-x-4">
          {acItems.map((item, index) => (
            <motion.div
              key={item?.href || `ac-empty-${index}`}
              variants={itemVariants}
              className="flex justify-center"
            >
              {item ? (
                <ProductCard
                  product={item}
                  getTranslation={getTranslation}
                  isActive={pathname === item.href}
                />
              ) : (
                <div className="w-28" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* DC Fast Charging Stations Section */}
      <div>
        <motion.div variants={itemVariants}>
          <Link
            href="/nabijeci-stanice/dc"
            className="group mb-10 mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted transition-colors hover:text-text-primary"
          >
            DC nabíjecí stanice
            <ArrowIcon className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-6 gap-x-4">
          {dcItems.map((item, index) => (
            <motion.div
              key={item?.href || `dc-empty-${index}`}
              variants={itemVariants}
              className="flex justify-center"
            >
              {item ? (
                <ProductCard
                  product={item}
                  getTranslation={getTranslation}
                  isActive={pathname === item.href}
                />
              ) : (
                <div className="w-28" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Individual product card with image
function ProductCard({
  product,
  getTranslation,
  isActive,
}: {
  product: NavItem
  getTranslation: (key: string) => string
  isActive: boolean
}) {
  const imageSrc = productImages[product.href]

  return (
    <Link
      href={product.href}
      className={cn(
        'group flex flex-col items-center gap-3 rounded-xl p-4 transition-all duration-200',
        'hover:bg-bg-secondary',
        isActive && 'bg-green-500/5'
      )}
    >
      {/* Product image */}
      <div className="relative h-40 w-40 overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={getTranslation(product.label)}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-bg-secondary">
            <span className="text-2xl text-text-muted">?</span>
          </div>
        )}
      </div>

      {/* Product name */}
      <span
        className={cn(
          'text-sm font-medium transition-colors duration-150',
          isActive ? 'text-green-500' : 'text-text-secondary group-hover:text-text-primary'
        )}
      >
        {getTranslation(product.label)}
      </span>
    </Link>
  )
}

// Categories menu - Clean two-column layout
function CategoriesMenu({
  items,
  parentHref,
  parentLabel,
  getTranslation,
  pathname,
}: {
  items: NavItem[]
  parentHref: string
  parentLabel: string
  getTranslation: (key: string) => string
  pathname: string
}) {
  return (
    <motion.div
      className="grid grid-cols-[320px_1fr] gap-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left column - main category title (fixed width) */}
      <motion.div variants={categoryVariants}>
        <Link
          href={parentHref as any}
          className={cn(
            'group inline-flex items-center gap-3',
            pathname === parentHref ? 'text-green-500' : 'text-text-primary hover:text-green-500'
          )}
        >
          <span className="text-2xl font-semibold">{getTranslation(parentLabel)}</span>
          <ArrowIcon
            className={cn(
              'h-5 w-5 opacity-0 transition-all duration-200',
              'group-hover:opacity-100 group-hover:translate-x-1'
            )}
          />
        </Link>
        <p className="mt-2 text-sm text-text-muted">
          Prozkoumat všechny možnosti
        </p>
      </motion.div>

      {/* Right column - single column with all subcategories */}
      <motion.div
        className="flex flex-col gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item) => (
          <motion.div key={item.href} variants={itemVariants}>
            <Link
              href={item.href}
              className={cn(
                'group flex items-center gap-2 rounded-lg py-1.5 text-sm transition-colors duration-150',
                pathname === item.href
                  ? 'text-green-500'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {getTranslation(item.label)}
              <ArrowIcon
                className={cn(
                  'h-4 w-4 opacity-0 transition-all duration-200',
                  'group-hover:opacity-100 group-hover:translate-x-1'
                )}
              />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
