import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import {
  getCorporatePage,
  getCorporateBenefits,
} from '@/lib/data/corporate'
import { SectionRenderer } from '@/components/corporate'
import { VideoObjectJsonLd } from '@/components/seo'

// Valid subpage slugs
const VALID_SLUGS = [
  'stanice-do-firem',
  'sprava-fleetu',
  'domaci-nabijeni-pro-zamestnance',
  'uctovani-nakladu',
  'danove-vyhody',
  'esg-a-elektromobilita',
] as const

interface CorporateSubpageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: CorporateSubpageProps): Promise<Metadata> {
  const { locale, slug } = await params

  if (!VALID_SLUGS.includes(slug as typeof VALID_SLUGS[number])) {
    return { title: 'Stránka nenalezena' }
  }

  const page = await getCorporatePage(slug)

  if (!page) {
    return { title: 'Stránka nenalezena' }
  }

  const translation =
    page.translations.find((t) => t.locale === locale) || page.translations[0]

  const baseUrl = 'https://mybox.eco'
  const localizedPaths: Record<string, string> = {
    cs: `/nabijeni-pro-firmy/${slug}`,
    en: `/corporate-charging/${slug}`,
    de: `/firmenladen/${slug}`,
  }

  return {
    title: translation?.seo_title || translation?.title,
    description: translation?.seo_description || translation?.subtitle || undefined,
    openGraph: {
      title: translation?.seo_title || translation?.title,
      description: translation?.seo_description || translation?.subtitle || undefined,
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      siteName: 'MyBox.eco',
    },
    twitter: {
      card: 'summary',
      title: translation?.seo_title || translation?.title,
      description: translation?.seo_description || translation?.subtitle || undefined,
    },
    alternates: {
      canonical: `${baseUrl}${localizedPaths[locale]}`,
      languages: {
        cs: `${baseUrl}${localizedPaths.cs}`,
        en: `${baseUrl}${localizedPaths.en}`,
        de: `${baseUrl}${localizedPaths.de}`,
      },
    },
  }
}

export default async function CorporateSubpage({
  params,
}: CorporateSubpageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  // Validate slug
  if (!VALID_SLUGS.includes(slug as typeof VALID_SLUGS[number])) {
    notFound()
  }

  // Fetch page data
  const page = await getCorporatePage(slug)

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
