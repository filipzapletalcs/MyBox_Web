import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateFaqSchema } from '@/lib/validations/faq'
import { checkUserRole } from '@/lib/auth/checkRole'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/faqs/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('faqs')
    .select('*, faq_translations(*)')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 })
    }
    console.error('FAQ fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// PATCH /api/faqs/[id]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
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
  const parsed = updateFaqSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation error', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { translations, ...faqData } = parsed.data

  // Aktualizace FAQ
  if (Object.keys(faqData).length > 0) {
    const { error: updateError } = await supabase
      .from('faqs')
      .update(faqData)
      .eq('id', id)

    if (updateError) {
      console.error('FAQ update error:', updateError)
      return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 })
    }
  }

  // Aktualizace překladů
  if (translations && translations.length > 0) {
    for (const translation of translations) {
      const { error: translationError } = await supabase
        .from('faq_translations')
        .upsert(
          { ...translation, faq_id: id },
          { onConflict: 'faq_id,locale' }
        )

      if (translationError) {
        console.error('FAQ translation error:', translationError)
        return NextResponse.json(
          { error: 'Failed to update FAQ translation' },
          { status: 500 }
        )
      }
    }
  }

  // Načíst aktualizovaný FAQ
  const { data: updatedFaq } = await supabase
    .from('faqs')
    .select('*, faq_translations(*)')
    .eq('id', id)
    .single()

  return NextResponse.json({ data: updatedFaq })
}

// DELETE /api/faqs/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
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

  const { error } = await supabase.from('faqs').delete().eq('id', id)

  if (error) {
    console.error('FAQ delete error:', error)
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
