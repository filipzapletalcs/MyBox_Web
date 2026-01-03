import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createTeamMemberSchema } from '@/lib/validations/team-member'
import { checkUserRole } from '@/lib/auth/checkRole'
import { createCachedResponse, CACHE_TTL } from '@/lib/utils/cache-response'

// GET /api/team-members
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const activeOnly = searchParams.get('active') !== 'false'
  const locale = searchParams.get('locale')

  let query = supabase
    .from('team_members')
    .select(
      `
      *,
      translations:team_member_translations(*)
    `
    )
    .order('sort_order', { ascending: true })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Team members fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }

  // Pokud je specifikován locale, filtrujeme překlady
  if (locale && data) {
    const filteredData = data.map((member) => ({
      ...member,
      translations: member.translations.filter((t: { locale: string }) => t.locale === locale),
    }))
    // Team members rarely change - use static cache (1 day browser, 7 days CDN)
    return createCachedResponse(filteredData, CACHE_TTL.STATIC)
  }

  // Team members rarely change - use static cache (1 day browser, 7 days CDN)
  return createCachedResponse(data, CACHE_TTL.STATIC)
}

// POST /api/team-members
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RBAC check - only admin/editor can manage team members
  const { hasRole } = await checkUserRole(supabase, user.id)
  if (!hasRole) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = createTeamMemberSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...memberData } = parsed.data

  // Vytvořit člena týmu
  const { data: member, error: memberError } = await supabase
    .from('team_members')
    .insert({
      image_url: memberData.image_url || null,
      email: memberData.email,
      phone: memberData.phone || null,
      linkedin_url: memberData.linkedin_url || null,
      is_active: memberData.is_active,
      sort_order: memberData.sort_order,
    })
    .select()
    .single()

  if (memberError) {
    console.error('Team member create error:', memberError)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }

  // Překlady - jméno se kopíruje z CS do ostatních jazyků
  const csName = translations.cs.name
  const translationsToInsert = [
    {
      team_member_id: member.id,
      locale: 'cs',
      name: csName,
      position: translations.cs.position,
      description: translations.cs.description || null,
    },
    {
      team_member_id: member.id,
      locale: 'en',
      name: translations.en?.name || csName, // Kopírovat z CS pokud není vyplněno
      position: translations.en?.position || '',
      description: translations.en?.description || null,
    },
    {
      team_member_id: member.id,
      locale: 'de',
      name: translations.de?.name || csName, // Kopírovat z CS pokud není vyplněno
      position: translations.de?.position || '',
      description: translations.de?.description || null,
    },
  ]

  const { error: translationsError } = await supabase
    .from('team_member_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    console.error('Team member translations error:', translationsError)
    // Rollback - smazat člena
    await supabase.from('team_members').delete().eq('id', member.id)
    return NextResponse.json(
      { error: 'Failed to create team member translations' },
      { status: 500 }
    )
  }

  // Načíst kompletní data
  const { data: completeMember } = await supabase
    .from('team_members')
    .select('*, translations:team_member_translations(*)')
    .eq('id', member.id)
    .single()

  return NextResponse.json({ data: completeMember }, { status: 201 })
}
