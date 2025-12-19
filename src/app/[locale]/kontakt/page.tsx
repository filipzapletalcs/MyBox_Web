import { setRequestLocale } from 'next-intl/server'
import { ContactForm } from './ContactForm'
import { TeamSection } from './TeamSection'
import { MapSection } from './MapSection'
import { CTASection } from '@/components/sections'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Contact Form + Info Panel (includes header) */}
      <ContactForm />

      {/* Team Section */}
      <TeamSection />

      {/* Map Section */}
      <MapSection />

      {/* CTA Section */}
      <CTASection />
    </>
  )
}
