'use client'

import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export interface Category {
  id: string
  slug: string
  category_translations: { locale: string; name: string }[]
}

export interface CategoryFilterProps {
  categories: Category[]
  activeCategory?: string // slug of active category
  locale: 'cs' | 'en' | 'de'
  allLabel?: string
}

export function CategoryFilter({
  categories,
  activeCategory,
  locale,
  allLabel = 'Vše'
}: CategoryFilterProps) {
  const pathname = usePathname()
  const isAllActive = !activeCategory && pathname?.endsWith('/blog')

  // Get category name for locale
  const getCategoryName = (category: Category): string => {
    return category.category_translations.find(t => t.locale === locale)?.name
      || category.category_translations[0]?.name
      || category.slug
  }

  return (
    <div className="relative">
      {/* Fade gradient on sides for scroll indication */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-bg-primary to-transparent sm:hidden" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-bg-primary to-transparent sm:hidden" />

      {/* Scrollable container */}
      <div className="scrollbar-hide -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {/* "All" filter */}
        <Link
          href="/blog"
          className={cn(
            'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
            'border',
            isAllActive
              ? 'border-green-500/50 bg-green-500/15 text-green-400'
              : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-border-default hover:text-text-primary'
          )}
        >
          {allLabel}
        </Link>

        {/* Category filters */}
        {categories.map((category) => {
          const isActive = activeCategory === category.slug
          const name = getCategoryName(category)

          return (
            <Link
              key={category.id}
              href={{ pathname: '/blog/kategorie/[slug]', params: { slug: category.slug } }}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                'border',
                isActive
                  ? 'border-green-500/50 bg-green-500/15 text-green-400'
                  : 'border-border-subtle bg-bg-secondary text-text-secondary hover:border-border-default hover:text-text-primary'
              )}
            >
              {name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
