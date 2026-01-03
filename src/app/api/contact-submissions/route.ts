import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { contactSubmissionSchema } from '@/lib/validations/contact-submission'

// GET /api/contact-submissions (admin only)
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const isRead = searchParams.get('is_read')
  const stationType = searchParams.get('station_type')
  const segment = searchParams.get('segment')

  let query = supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (isRead === 'true') {
    query = query.eq('is_read', true)
  } else if (isRead === 'false') {
    query = query.eq('is_read', false)
  }

  if (stationType && stationType !== 'all') {
    query = query.eq('station_type', stationType)
  }

  if (segment && segment !== 'all') {
    query = query.eq('segment', segment)
  }

  const { data, error } = await query

  if (error) {
    console.error('Contact submissions fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch contact submissions' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/contact-submissions (public - from contact form)
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const body = await request.json()
  const parsed = contactSubmissionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { data: submission, error } = await supabase
    .from('contact_submissions')
    .insert({
      company: parsed.data.company,
      contact_person: parsed.data.contact_person,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      station_type: parsed.data.station_type,
      location: parsed.data.location,
      segment: parsed.data.segment,
      message: parsed.data.message,
      is_read: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Contact submission create error:', error)
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }

  return NextResponse.json({ data: submission }, { status: 201 })
}
