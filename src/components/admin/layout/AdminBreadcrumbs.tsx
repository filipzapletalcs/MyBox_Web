'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const pathNames: Record<string, string> = {
  admin: 'Dashboard',
  articles: 'Články',
  categories: 'Kategorie',
  products: 'Produkty',
  faqs: 'FAQ',
  media: 'Média',
  settings: 'Nastavení',
  new: 'Nový',
  edit: 'Upravit',
}

export function AdminBreadcrumbs() {
  const pathname = usePathname()

  // Split path and filter empty segments
  const segments = pathname.split('/').filter(Boolean)

  // Build breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1

    // Check if segment is UUID (for edit pages)
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        segment
      )

    const label = isUuid ? 'Detail' : pathNames[segment] || segment

    return {
      label,
      href,
      isLast,
    }
  })

  // Don't show breadcrumbs on dashboard
  if (segments.length <= 1) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-text-muted transition-colors hover:text-text-primary"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.slice(1).map((crumb, index) => (
        <div key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-text-muted" />
          {crumb.isLast ? (
            <span className="font-medium text-text-primary">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className={cn(
                'text-text-muted transition-colors hover:text-text-primary'
              )}
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
