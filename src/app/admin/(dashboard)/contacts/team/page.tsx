import { createClient } from '@/lib/supabase/server'
import { TeamMemberList } from '@/components/admin/team'

export const dynamic = 'force-dynamic'

export default async function TeamMembersPage() {
  const supabase = await createClient()

  const { data: members, error } = await supabase
    .from('team_members')
    .select(
      `
      *,
      translations:team_member_translations(*)
    `
    )
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching team members:', error)
    return (
      <div className="p-6">
        <p className="text-red-500">Chyba při načítání členů týmu</p>
      </div>
    )
  }

  return <TeamMemberList initialMembers={members || []} />
}
