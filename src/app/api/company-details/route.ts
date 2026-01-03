import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createCachedResponse, CACHE_TTL } from '@/lib/utils/cache-response'

// GET /api/company-details (public)
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('company_details')
    .select('*')
    .single()

  if (error) {
    console.error('Company details fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch company details' }, { status: 500 })
  }

  // Company details rarely change - use static cache (1 day browser, 7 days CDN)
  return createCachedResponse(data, CACHE_TTL.STATIC)
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
    console.error('Company details update error:', error)
    return NextResponse.json({ error: 'Failed to update company details' }, { status: 500 })
  }

  // Invalidate cache for all pages (layout contains company info in footer)
  revalidatePath('/', 'layout')

  return NextResponse.json({ data })
}
