import { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { ContactForm } from './ContactForm'
import { TeamSection } from './TeamSection'
import { MapSection } from './MapSection'
import { CTASection } from '@/components/sections'
import { LocalBusinessJsonLd } from '@/components/seo'
import { createClient } from '@/lib/supabase/server'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://mybox.eco'

// SEO descriptions per locale
const seoDescriptions: Record<string, string> = {
  cs: 'Kontaktujte MyBox – českého výrobce nabíjecích stanic pro elektromobily. Obchodní oddělení: +420 734 597 699, servis: +420 739 407 006. Sídlo v Kroměříži.',
  en: 'Contact MyBox – Czech manufacturer of EV charging stations. Sales: +420 734 597 699, service: +420 739 407 006. Headquarters in Kroměříž, Czech Republic.',
  de: 'Kontaktieren Sie MyBox – tschechischer Hersteller von Ladestationen für Elektrofahrzeuge. Vertrieb: +420 734 597 699, Service: +420 739 407 006. Hauptsitz in Kroměříž, Tschechien.',
}

// SEO titles per locale
const seoTitles: Record<string, string> = {
  cs: 'Kontakt',
  en: 'Contact',
  de: 'Kontakt',
}

// Keywords per locale
const seoKeywords: Record<string, string> = {
  cs: 'kontakt MyBox, nabíjecí stanice, ELEXIM, Kroměříž, poptávka, servis nabíjecích stanic',
  en: 'contact MyBox, charging stations, ELEXIM, Kroměříž, quote request, charging station service',
  de: 'Kontakt MyBox, Ladestationen, ELEXIM, Kroměříž, Angebotsanfrage, Ladestationen-Service',
}

// Localized paths
const localizedPaths: Record<string, string> = {
  cs: '/kontakt',
  en: '/en/contact',
  de: '/de/kontakt',
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  const title = seoTitles[locale] || t('title')
  const description = seoDescriptions[locale] || t('subtitle')
  const keywords = seoKeywords[locale]
  const canonicalUrl = `${baseUrl}${localizedPaths[locale]}`

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: `${baseUrl}${localizedPaths.cs}`,
        en: `${baseUrl}${localizedPaths.en}`,
        de: `${baseUrl}${localizedPaths.de}`,
      },
    },
    openGraph: {
      title: `${title} | MyBox.eco`,
      description,
      url: canonicalUrl,
      siteName: 'MyBox.eco',
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      images: [
        {
          url: `${baseUrl}/images/og/contact-og.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | MyBox.eco`,
      description,
      images: [`${baseUrl}/images/og/contact-og.jpg`],
    },
    other: {
      'news_keywords': keywords,
    },
  }
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
      {/* LocalBusiness JSON-LD for SEO */}
      <LocalBusinessJsonLd locale={locale} />

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
