import { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { HeroVideo, ClientLogos, SolutionsGrid } from '@/components/sections'
import { getVideoUrl } from '@/lib/supabase/storage'
import { OrganizationJsonLd, WebSiteJsonLd, VideoObjectJsonLd } from '@/components/seo'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://mybox.eco'

// SEO descriptions per locale
const seoDescriptions: Record<string, string> = {
  cs: 'Český výrobce nabíjecích stanic pro elektromobily. AC a DC stanice pro domácnosti, firmy a veřejné prostory. Cloudová správa, OCPP protokol, 3 roky záruka.',
  en: 'Czech manufacturer of EV charging stations. AC and DC stations for homes, businesses and public spaces. Cloud management, OCPP protocol, 3-year warranty.',
  de: 'Tschechischer Hersteller von Ladestationen für Elektrofahrzeuge. AC- und DC-Stationen für Privathaushalte, Unternehmen und öffentliche Bereiche. Cloud-Management, OCPP-Protokoll, 3 Jahre Garantie.',
}

// SEO titles per locale
const seoTitles: Record<string, string> = {
  cs: 'Nabíjecí stanice pro elektromobily',
  en: 'Electric Vehicle Charging Stations',
  de: 'Ladestationen für Elektrofahrzeuge',
}

// Keywords per locale
const seoKeywords: Record<string, string> = {
  cs: 'nabíjecí stanice, elektromobily, wallbox, AC nabíjení, DC rychlonabíjení, MyBox, OCPP, český výrobce',
  en: 'charging stations, electric vehicles, EV charger, wallbox, AC charging, DC fast charging, MyBox, OCPP, Czech manufacturer',
  de: 'Ladestationen, Elektrofahrzeuge, Wallbox, AC-Laden, DC-Schnellladen, MyBox, OCPP, tschechischer Hersteller',
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const title = seoTitles[locale] || t('title')
  const description = seoDescriptions[locale] || t('description')
  const keywords = seoKeywords[locale]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: baseUrl,
      languages: {
        cs: baseUrl,
        en: `${baseUrl}/en`,
        de: `${baseUrl}/de`,
      },
    },
    openGraph: {
      title: `${title} | MyBox.eco`,
      description,
      url: locale === 'cs' ? baseUrl : `${baseUrl}/${locale}`,
      siteName: 'MyBox.eco',
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      images: [
        {
          url: `${baseUrl}/images/og/home-og.jpg`,
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
      images: [`${baseUrl}/images/og/home-og.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      'news_keywords': keywords,
    },
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {/* Structured Data for homepage */}
      <OrganizationJsonLd />
      <WebSiteJsonLd locale={locale} />
      <VideoObjectJsonLd
        name={seoTitles[locale] || 'MyBox - Nabíjecí stanice pro elektromobily'}
        description={seoDescriptions[locale]}
        contentUrl={getVideoUrl('videos/hero-landing.mp4')}
        thumbnailUrl="/images/og/home-og.jpg"
        locale={locale}
      />

      {/* Hero with video background */}
      <HeroVideo videoSrc={getVideoUrl('videos/hero-landing.mp4')} />

      {/* Client logos carousel */}
      <ClientLogos />

      {/* Solutions grid */}
      <SolutionsGrid />

      {/* More sections coming... */}
    </>
  )
}
