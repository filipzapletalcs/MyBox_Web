'use client'

import { Menu, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { AdminBreadcrumbs } from './AdminBreadcrumbs'

interface AdminHeaderProps {
  onMenuClick?: () => void
  user?: {
    email?: string
    full_name?: string
  }
}

export function AdminHeader({ onMenuClick, user }: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-subtle bg-bg-primary/80 px-6 backdrop-blur-xl">
      {/* Left side - breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <AdminBreadcrumbs />
      </div>

      {/* Right side - actions */}
      <div className="flex items-center gap-2">
        {/* Notifications (placeholder) */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">
                  {user?.full_name || 'Admin'}
                </span>
                <span className="text-xs text-text-muted">
                  {user?.email || ''}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
              Nastavení
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 focus:text-red-400"
            >
              Odhlásit se
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
