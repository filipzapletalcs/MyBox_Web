import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import {
  getCorporatePage,
  getCorporateBenefits,
} from '@/lib/data/corporate'
import { SectionRenderer } from '@/components/corporate'
import { VideoObjectJsonLd } from '@/components/seo'

interface CorporateLandingPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: CorporateLandingPageProps): Promise<Metadata> {
  const { locale } = await params
  const page = await getCorporatePage('landing')

  if (!page) {
    return {
      title: 'Nabíjení pro firmy | MyBox',
    }
  }

  const translation =
    page.translations.find((t) => t.locale === locale) || page.translations[0]

  return {
    title: translation?.seo_title || translation?.title || 'Nabíjení pro firmy',
    description:
      translation?.seo_description ||
      translation?.subtitle ||
      'Kompletní řešení nabíjecí infrastruktury pro firemní zákazníky',
    openGraph: {
      title: translation?.seo_title || translation?.title || undefined,
      description: translation?.seo_description || translation?.subtitle || undefined,
      type: 'website',
    },
  }
}

export default async function CorporateLandingPage({
  params,
}: CorporateLandingPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  // Fetch page data
  const page = await getCorporatePage('landing')

  if (!page) {
    notFound()
  }

  // Fetch related data
  const benefits = await getCorporateBenefits(page.id)

  // Filter active sections
  const activeSections = page.sections.filter((s) => s.is_active)

  // Get translation for current locale
  const translation =
    page.translations.find((t) => t.locale === locale) || page.translations[0]

  return (
    <>
      {/* Video JSON-LD if page has hero video */}
      {page.hero_video_url && translation && (
        <VideoObjectJsonLd
          name={translation.title}
          description={translation.seo_description || translation.subtitle || translation.title}
          contentUrl={page.hero_video_url}
          thumbnailUrl={page.hero_image_url}
          locale={locale}
        />
      )}

      {activeSections.map((section) => (
        <SectionRenderer
          key={section.id}
          section={section}
          locale={locale}
          pageData={{
            hero_video_url: page.hero_video_url,
            hero_image_url: page.hero_image_url,
          }}
          benefits={benefits}
        />
      ))}
    </>
  )
}
