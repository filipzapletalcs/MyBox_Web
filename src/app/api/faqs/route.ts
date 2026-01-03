import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createFaqSchema } from '@/lib/validations/faq'
import { checkUserRole } from '@/lib/auth/checkRole'

// GET /api/faqs - Seznam FAQs
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const active = searchParams.get('active')

  let query = supabase
    .from('faqs')
    .select('*, faq_translations(*)')
    .order('sort_order', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  if (active !== null) {
    query = query.eq('is_active', active === 'true')
  }

  const { data, error } = await query

  if (error) {
    console.error('FAQs fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/faqs - Vytvoření FAQ
export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RBAC check - only admin/editor can manage FAQs
  const { hasRole } = await checkUserRole(supabase, user.id)
  if (!hasRole) {
    return NextResponse.json({ error: 'Forbidden - insufficient permissions' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = createFaqSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...faqData } = parsed.data

  // Vytvoření FAQ
  const { data: faq, error: faqError } = await supabase
    .from('faqs')
    .insert(faqData)
    .select()
    .single()

  if (faqError) {
    console.error('FAQ create error:', faqError)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }

  // Překlady
  const translationsToInsert = translations.map((t) => ({
    ...t,
    faq_id: faq.id,
  }))

  const { error: translationsError } = await supabase
    .from('faq_translations')
    .insert(translationsToInsert)

  if (translationsError) {
    console.error('FAQ translations error:', translationsError)
    await supabase.from('faqs').delete().eq('id', faq.id)
    return NextResponse.json(
      { error: 'Failed to create FAQ translations' },
      { status: 500 }
    )
  }

  // Načíst kompletní FAQ
  const { data: completeFaq } = await supabase
    .from('faqs')
    .select('*, faq_translations(*)')
    .eq('id', faq.id)
    .single()

  return NextResponse.json({ data: completeFaq }, { status: 201 })
}
