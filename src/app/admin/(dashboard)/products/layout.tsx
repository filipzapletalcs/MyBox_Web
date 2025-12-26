'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Package, Wrench, Cpu } from 'lucide-react'

const PRODUCT_TABS = [
  {
    id: 'stations',
    label: 'Nabíjecí stanice',
    href: '/admin/products',
    icon: Package,
    match: (path: string) => path === '/admin/products' || path.match(/^\/admin\/products\/[^/]+$/) && !path.includes('accessories') && !path.includes('technology'),
  },
  {
    id: 'accessories',
    label: 'Příslušenství',
    href: '/admin/products/accessories',
    icon: Wrench,
    match: (path: string) => path.startsWith('/admin/products/accessories'),
  },
  {
    id: 'technology',
    label: 'Technologie',
    href: '/admin/products/technology',
    icon: Cpu,
    match: (path: string) => path.startsWith('/admin/products/technology'),
  },
]

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show tabs on edit/new pages
  const isEditOrNewPage = pathname.match(/\/(new|[0-9a-f-]{36})$/)
  if (isEditOrNewPage) {
    return <>{children}</>
  }

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-border-subtle">
        <nav className="-mb-px flex space-x-1">
          {PRODUCT_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.match(pathname)
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-green-500 text-green-500'
                    : 'border-transparent text-text-muted hover:border-border-default hover:text-text-secondary'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
