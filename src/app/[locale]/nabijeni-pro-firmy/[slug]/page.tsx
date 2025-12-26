import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import {
  getCorporatePage,
  getCorporateBenefits,
  getFeaturedCaseStudies,
} from '@/lib/data/corporate'
import { SectionRenderer } from '@/components/corporate'

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

  return {
    title: translation?.seo_title || translation?.title,
    description: translation?.seo_description || translation?.subtitle || undefined,
    openGraph: {
      title: translation?.seo_title || translation?.title,
      description: translation?.seo_description || translation?.subtitle || undefined,
      type: 'website',
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
  const [benefits, caseStudies] = await Promise.all([
    getCorporateBenefits(page.id),
    getFeaturedCaseStudies(),
  ])

  // Filter active sections
  const activeSections = page.sections.filter((s) => s.is_active)

  return (
    <>
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
          caseStudies={caseStudies}
        />
      ))}
    </>
  )
}
