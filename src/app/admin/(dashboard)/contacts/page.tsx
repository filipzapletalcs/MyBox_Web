import Link from 'next/link'
import { Users, Mail, Building2, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ContactsDashboardPage() {
  const supabase = await createClient()

  // Načíst statistiky
  const [teamResult, submissionsResult, unreadResult] = await Promise.all([
    supabase.from('team_members').select('id', { count: 'exact', head: true }),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
    supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('is_read', false),
  ])

  const teamCount = teamResult.count || 0
  const submissionsCount = submissionsResult.count || 0
  const unreadCount = unreadResult.count || 0

  const sections = [
    {
      title: 'Členové týmu',
      description: 'Spravujte členy týmu zobrazované na kontaktní stránce',
      href: '/admin/contacts/team',
      icon: Users,
      stat: `${teamCount} členů`,
      color: 'green',
    },
    {
      title: 'Zprávy z formuláře',
      description: 'Přehled zpráv odeslaných přes kontaktní formulář',
      href: '/admin/contacts/submissions',
      icon: Mail,
      stat: unreadCount > 0 ? `${unreadCount} nepřečtených` : `${submissionsCount} zpráv`,
      color: unreadCount > 0 ? 'orange' : 'blue',
    },
    {
      title: 'Firemní údaje',
      description: 'Upravte kontaktní informace a otevírací dobu',
      href: '/admin/contacts/settings',
      icon: Building2,
      stat: 'Nastavení',
      color: 'purple',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Kontakty</h1>
        <p className="mt-1 text-text-muted">
          Správa kontaktů, členů týmu a firemních údajů
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="group h-full p-6 transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/5">
              <div className="flex items-start justify-between">
                <div
                  className={`rounded-xl p-3 ${
                    section.color === 'green'
                      ? 'bg-green-500/10'
                      : section.color === 'orange'
                        ? 'bg-orange-500/10'
                        : section.color === 'blue'
                          ? 'bg-blue-500/10'
                          : 'bg-purple-500/10'
                  }`}
                >
                  <section.icon
                    className={`h-6 w-6 ${
                      section.color === 'green'
                        ? 'text-green-400'
                        : section.color === 'orange'
                          ? 'text-orange-400'
                          : section.color === 'blue'
                            ? 'text-blue-400'
                            : 'text-purple-400'
                    }`}
                  />
                </div>
                <ArrowRight className="h-5 w-5 text-text-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-text-primary">
                {section.title}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {section.description}
              </p>
              <div className="mt-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    section.color === 'green'
                      ? 'bg-green-500/10 text-green-400'
                      : section.color === 'orange'
                        ? 'bg-orange-500/10 text-orange-400'
                        : section.color === 'blue'
                          ? 'bg-blue-500/10 text-blue-400'
                          : 'bg-purple-500/10 text-purple-400'
                  }`}
                >
                  {section.stat}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
