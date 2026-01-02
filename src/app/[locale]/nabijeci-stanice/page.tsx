import { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { ChargingStationsHero } from './ChargingStationsHero'
import { ACDCSelector } from './ACDCSelector'
import { ProductShowcase } from './ProductShowcase'
import { USPSection } from './USPSection'
import { FAQSection } from './FAQSection'
import { CTASection } from '@/components/sections'
import { FAQJsonLd } from '@/components/seo'

interface ChargingStationsPageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://mybox.eco'

// SEO descriptions per locale
const seoDescriptions: Record<string, string> = {
  cs: 'Kompletní portfolio AC a DC nabíjecích stanic pro elektromobily. Wallboxy MyBox pro domácnosti a firmy, rychlonabíječky Alpitronic až 400 kW. Český výrobce s 3letou zárukou.',
  en: 'Complete portfolio of AC and DC EV charging stations. MyBox wallboxes for homes and businesses, Alpitronic fast chargers up to 400 kW. Czech manufacturer with 3-year warranty.',
  de: 'Komplettes Portfolio an AC- und DC-Ladestationen für Elektrofahrzeuge. MyBox-Wallboxen für Privathaushalte und Unternehmen, Alpitronic-Schnelllader bis 400 kW. Tschechischer Hersteller mit 3 Jahren Garantie.',
}

// SEO titles per locale
const seoTitles: Record<string, string> = {
  cs: 'Nabíjecí stanice pro elektromobily',
  en: 'EV Charging Stations',
  de: 'Ladestationen für Elektrofahrzeuge',
}

// Keywords per locale
const seoKeywords: Record<string, string> = {
  cs: 'nabíjecí stanice, wallbox, AC nabíjení, DC rychlonabíjení, MyBox, Alpitronic, elektromobily, OCPP',
  en: 'charging stations, wallbox, AC charging, DC fast charging, MyBox, Alpitronic, electric vehicles, OCPP',
  de: 'Ladestationen, Wallbox, AC-Laden, DC-Schnellladen, MyBox, Alpitronic, Elektrofahrzeuge, OCPP',
}

// Localized paths
const localizedPaths: Record<string, string> = {
  cs: '/nabijeci-stanice',
  en: '/en/charging-stations',
  de: '/de/ladestationen',
}

export async function generateMetadata({ params }: ChargingStationsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'chargingStations' })

  const title = seoTitles[locale] || t('title')
  const description = seoDescriptions[locale] || t('hero.subtitle')
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
          url: `${baseUrl}/images/og/products-og.png`,
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
      images: [`${baseUrl}/images/og/products-og.png`],
    },
    other: {
      'news_keywords': keywords,
    },
  }
}

export default async function ChargingStationsPage({ params }: ChargingStationsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'chargingStations' })

  // FAQ items for JSON-LD structured data
  const faqItems = [
    { question: t('faq.items.acVsDc.question'), answer: t('faq.items.acVsDc.answer') },
    { question: t('faq.items.installationTime.question'), answer: t('faq.items.installationTime.answer') },
    { question: t('faq.items.homeCharging.question'), answer: t('faq.items.homeCharging.answer') },
    { question: t('faq.items.chargingCost.question'), answer: t('faq.items.chargingCost.answer') },
    { question: t('faq.items.warranty.question'), answer: t('faq.items.warranty.answer') },
    { question: t('faq.items.cloudPlatform.question'), answer: t('faq.items.cloudPlatform.answer') },
  ]

  return (
    <>
      {/* FAQ JSON-LD for rich snippets */}
      <FAQJsonLd items={faqItems} />

      {/* Hero section */}
      <ChargingStationsHero />

      {/* AC DC selector section */}
      <ACDCSelector />

      {/* MyBox Stations section */}
      <ProductShowcase type="mybox" />

      {/* Alpitronic section (reversed layout) */}
      <ProductShowcase type="alpitronic" reverse />

      {/* USP / SEO text section */}
      <USPSection />

      {/* FAQ section */}
      <FAQSection />

      {/* CTA section */}
      <CTASection />
    </>
  )
}
