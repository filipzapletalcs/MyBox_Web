import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { reorderTeamMembersSchema } from '@/lib/validations/team-member'

// POST /api/team-members/reorder
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = reorderTeamMembersSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { members } = parsed.data

  // Update sort_order pro všechny členy
  for (const member of members) {
    const { error } = await supabase
      .from('team_members')
      .update({ sort_order: member.sort_order })
      .eq('id', member.id)

    if (error) {
      console.error('Team member reorder error:', error)
      return NextResponse.json({ error: 'Failed to reorder team members' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
