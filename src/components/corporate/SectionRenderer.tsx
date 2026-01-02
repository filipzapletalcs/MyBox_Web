'use client'

import dynamic from 'next/dynamic'
import type { CorporateSectionWithTranslations, CorporateBenefitWithTranslations } from '@/types/corporate'

// Dynamically import section components to reduce initial bundle
const CorporateHeroSection = dynamic(() => import('./CorporateHeroSection').then(m => ({ default: m.CorporateHeroSection })))
const BenefitsGrid = dynamic(() => import('./BenefitsGrid').then(m => ({ default: m.BenefitsGrid })))
const SolutionDescription = dynamic(() => import('./SolutionDescription').then(m => ({ default: m.SolutionDescription })))
const FeaturesSection = dynamic(() => import('./FeaturesSection').then(m => ({ default: m.FeaturesSection })))
const CTASection = dynamic(() => import('@/components/sections/CTASection').then(m => ({ default: m.CTASection })))
const TextContentSection = dynamic(() => import('./TextContentSection').then(m => ({ default: m.TextContentSection })))
const FAQSection = dynamic(() => import('./FAQSection').then(m => ({ default: m.FAQSection })))
const GallerySection = dynamic(() => import('./GallerySection').then(m => ({ default: m.GallerySection })))
const InquiryFormSection = dynamic(() => import('./InquiryFormSection').then(m => ({ default: m.InquiryFormSection })))

// Re-use existing components
import { ClientLogos } from '@/components/sections/ClientLogos'

export interface SectionRendererProps {
  section: CorporateSectionWithTranslations
  locale: string
  pageData?: {
    hero_video_url?: string | null
    hero_image_url?: string | null
  }
  benefits?: CorporateBenefitWithTranslations[]
}

export function SectionRenderer({
  section,
  locale,
  pageData,
  benefits,
}: SectionRendererProps) {
  // Get translation for current locale
  const translation = section.translations.find(t => t.locale === locale)
    || section.translations[0]

  // Config from section
  const config = (section.config || {}) as Record<string, unknown>

  // Common props for sections
  const sectionProps = {
    heading: translation?.heading || undefined,
    subheading: translation?.subheading || undefined,
    content: translation?.content ?? undefined,
    config,
  }

  switch (section.section_type) {
    case 'hero':
      return (
        <CorporateHeroSection
          videoSrc={pageData?.hero_video_url || undefined}
          imageSrc={pageData?.hero_image_url || undefined}
          heading={sectionProps.heading}
          subheading={sectionProps.subheading}
        />
      )

    case 'client_logos':
      return <ClientLogos />

    case 'solution_desc':
      return (
        <SolutionDescription
          heading={sectionProps.heading}
          subheading={sectionProps.subheading}
          content={sectionProps.content as string | Record<string, unknown> | undefined}
          imageSrc={config.image_url as string | undefined}
          reversed={config.reversed as boolean | undefined}
        />
      )

    case 'stations':
      // This will link to existing product showcase
      return (
        <SolutionDescription
          heading={sectionProps.heading}
          subheading={sectionProps.subheading}
          content={sectionProps.content as string | Record<string, unknown> | undefined}
          imageSrc={config.image_url as string | undefined}
          showProductLink
        />
      )

    case 'gallery':
      return (
        <GallerySection
          heading={sectionProps.heading}
          subheading={sectionProps.subheading}
          images={config.images as { url: string; alt?: string }[] | undefined}
        />
      )

    case 'inquiry_form':
      return (
        <InquiryFormSection
          heading={sectionProps.heading}
          subheading={sectionProps.subheading}
        />
      )

    case 'benefits':
      return (
        <BenefitsGrid
          heading={sectionProps.heading}
          subheading={sectionProps.subheading}
          benefits={benefits || []}
          locale={locale}
        />
      )

    case 'features':
      return (
        <FeaturesSection
          heading={sectionProps.heading}
          subheading={sectionProps.subheading}
          features={config.features as { icon: string; title: string; description: string }[] | undefined}
        />
      )

    case 'cta':
      return (
        <CTASection
          heading={sectionProps.heading}
          description={sectionProps.subheading}
          buttonLabel={config.button_label as string | undefined}
          buttonHref={config.button_href as string | undefined}
        />
      )

    case 'text_content':
      return (
        <TextContentSection
          heading={sectionProps.heading}
          content={sectionProps.content as string | Record<string, unknown> | undefined}
        />
      )

    case 'faq':
      return (
        <FAQSection
          heading={sectionProps.heading}
          subheading={sectionProps.subheading}
          items={config.items as { question: string; answer: string }[] | undefined}
        />
      )

    default:
      // Fallback for unknown section types
      return null
  }
}
