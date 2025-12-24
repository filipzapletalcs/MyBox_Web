import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/company-details (public)
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('company_details')
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// PUT /api/company-details (admin only)
export async function PUT(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Najít existující záznam
  const { data: existing } = await supabase
    .from('company_details')
    .select('id')
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Company details not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('company_details')
    .update({
      name: body.name,
      division: body.division,
      address: body.address,
      city: body.city,
      zip: body.zip,
      country: body.country,
      ico: body.ico,
      dic: body.dic,
      sales_phone: body.sales_phone,
      sales_email: body.sales_email,
      service_phone: body.service_phone,
      service_email: body.service_email,
      hours_weekdays: body.hours_weekdays,
      hours_saturday: body.hours_saturday,
      hours_sunday: body.hours_sunday,
      facebook_url: body.facebook_url,
      instagram_url: body.instagram_url,
      linkedin_url: body.linkedin_url,
      youtube_url: body.youtube_url,
    })
    .eq('id', existing.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
