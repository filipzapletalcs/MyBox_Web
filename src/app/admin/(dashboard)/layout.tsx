import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { AdminHeader } from '@/components/admin/layout/AdminHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  const userData = {
    email: user.email,
    full_name: profile?.full_name || undefined,
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Sidebar */}
      <AdminSidebar user={userData} />

      {/* Main content area */}
      <div className="lg:pl-[280px]">
        {/* Header */}
        <AdminHeader user={userData} />

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
