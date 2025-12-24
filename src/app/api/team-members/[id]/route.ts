import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateTeamMemberSchema } from '@/lib/validations/team-member'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/team-members/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('team_members')
    .select(
      `
      *,
      translations:team_member_translations(*)
    `
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// PUT /api/team-members/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = updateTeamMemberSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...memberData } = parsed.data

  // Update base member data
  if (Object.keys(memberData).length > 0) {
    const updateData: Record<string, unknown> = {}
    if (memberData.image_url !== undefined) updateData.image_url = memberData.image_url || null
    if (memberData.email !== undefined) updateData.email = memberData.email
    if (memberData.phone !== undefined) updateData.phone = memberData.phone || null
    if (memberData.linkedin_url !== undefined) updateData.linkedin_url = memberData.linkedin_url || null
    if (memberData.is_active !== undefined) updateData.is_active = memberData.is_active
    if (memberData.sort_order !== undefined) updateData.sort_order = memberData.sort_order

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('team_members')
        .update(updateData)
        .eq('id', id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }
  }

  // Update translations
  if (translations) {
    const csName = translations.cs?.name

    // Update CS translation
    if (translations.cs) {
      const { error: csError } = await supabase
        .from('team_member_translations')
        .upsert(
          {
            team_member_id: id,
            locale: 'cs',
            name: translations.cs.name,
            position: translations.cs.position,
            description: translations.cs.description || null,
          },
          { onConflict: 'team_member_id,locale' }
        )

      if (csError) {
        return NextResponse.json({ error: csError.message }, { status: 500 })
      }
    }

    // Update EN translation
    if (translations.en) {
      const { error: enError } = await supabase
        .from('team_member_translations')
        .upsert(
          {
            team_member_id: id,
            locale: 'en',
            name: translations.en.name || csName || '',
            position: translations.en.position || '',
            description: translations.en.description || null,
          },
          { onConflict: 'team_member_id,locale' }
        )

      if (enError) {
        return NextResponse.json({ error: enError.message }, { status: 500 })
      }
    }

    // Update DE translation
    if (translations.de) {
      const { error: deError } = await supabase
        .from('team_member_translations')
        .upsert(
          {
            team_member_id: id,
            locale: 'de',
            name: translations.de.name || csName || '',
            position: translations.de.position || '',
            description: translations.de.description || null,
          },
          { onConflict: 'team_member_id,locale' }
        )

      if (deError) {
        return NextResponse.json({ error: deError.message }, { status: 500 })
      }
    }
  }

  // Fetch complete member
  const { data: completeMember, error: fetchError } = await supabase
    .from('team_members')
    .select('*, translations:team_member_translations(*)')
    .eq('id', id)
    .single()

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 })
  }

  return NextResponse.json({ data: completeMember })
}

// DELETE /api/team-members/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
