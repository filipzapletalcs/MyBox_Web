'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Package,
  HelpCircle,
  Image as ImageIcon,
  FileDown,
  LogOut,
  ChevronLeft,
  Menu,
  Users,
  Mail,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Články', href: '/admin/articles', icon: FileText },
  { name: 'Kategorie', href: '/admin/categories', icon: FolderTree },
  { name: 'Produkty', href: '/admin/products', icon: Package },
  { name: 'Dokumenty', href: '/admin/documents', icon: FileDown },
  { name: 'FAQ', href: '/admin/faqs', icon: HelpCircle },
  { name: 'Média', href: '/admin/media', icon: ImageIcon },
  { name: 'Kontakty', href: '/admin/contacts', icon: Users },
]

interface AdminSidebarProps {
  className?: string
  user?: {
    email?: string
    full_name?: string
  }
}

export function AdminSidebar({ className, user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden',
          isCollapsed ? 'hidden' : 'block lg:hidden'
        )}
        onClick={() => setIsCollapsed(true)}
      />

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className={cn(
          'fixed left-4 top-4 z-50 rounded-xl bg-bg-elevated p-2 shadow-lg lg:hidden',
          !isCollapsed && 'hidden'
        )}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col',
          'bg-bg-elevated border-r border-border-subtle',
          'transition-transform duration-300 ease-out',
          'lg:translate-x-0',
          isCollapsed ? '-translate-x-full' : 'translate-x-0',
          className
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border-subtle px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Image
              src="/images/logo-mybox--white.svg"
              alt="MyBox CMS"
              width={100}
              height={28}
              className="logo-white"
              priority
            />
            <Image
              src="/images/logo-mybox.svg"
              alt="MyBox CMS"
              width={100}
              height={28}
              className="logo-dark"
              priority
            />
            <span className="text-xs font-medium text-text-muted">CMS</span>
          </Link>
          <button
            onClick={() => setIsCollapsed(true)}
            className="rounded-lg p-1.5 text-text-muted hover:bg-white/5 hover:text-text-primary lg:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsCollapsed(true)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-green-500/15 text-green-400 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.2)]'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                )}
              >
                <item.icon
                  className={cn('h-5 w-5', active ? 'text-green-400' : '')}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border-subtle p-4">
          <div className="mb-3 px-4">
            <p className="truncate text-sm font-medium text-text-primary">
              {user?.full_name || 'Admin'}
            </p>
            <p className="truncate text-xs text-text-muted">
              {user?.email || ''}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleLogout}
            isLoading={isLoggingOut}
            leftIcon={<LogOut className="h-4 w-4" />}
            className="justify-start"
          >
            Odhlásit se
          </Button>
        </div>
      </aside>
    </>
  )
}
