import { setRequestLocale } from 'next-intl/server'
import { ContactForm } from './ContactForm'
import { TeamSection } from './TeamSection'
import { MapSection } from './MapSection'
import { CTASection } from '@/components/sections'
import { createClient } from '@/lib/supabase/server'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  // Načíst členy týmu z DB
  const supabase = await createClient()
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select(
      `
      id,
      image_url,
      email,
      phone,
      linkedin_url,
      translations:team_member_translations(locale, name, position, description)
    `
    )
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Transformovat data pro TeamSection
  const transformedMembers = (teamMembers || []).map((member) => {
    const translation = member.translations.find(
      (t: { locale: string }) => t.locale === locale
    ) || member.translations.find((t: { locale: string }) => t.locale === 'cs')

    return {
      id: member.id,
      name: translation?.name || '',
      position: translation?.position || '',
      email: member.email,
      phone: member.phone,
      imageUrl: member.image_url || '/images/team/placeholder.jpg',
    }
  })

  return (
    <>
      {/* Contact Form + Info Panel (includes header) */}
      <ContactForm />

      {/* Team Section */}
      <TeamSection members={transformedMembers} />

      {/* Map Section */}
      <MapSection />

      {/* CTA Section */}
      <CTASection />
    </>
  )
}
