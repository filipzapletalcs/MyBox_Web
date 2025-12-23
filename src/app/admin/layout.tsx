import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'MyBox CMS',
  description: 'Content Management System pro MyBox.eco',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cs">
      <body className="bg-neutral-50 dark:bg-neutral-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
