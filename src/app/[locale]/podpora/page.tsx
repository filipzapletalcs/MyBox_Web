import { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { FAQJsonLd } from '@/components/seo'
import { SupportPageContent } from './SupportPageContent'
import { createClient } from '@/lib/supabase/server'

interface SupportPageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://mybox.eco'

const localizedPaths: Record<string, string> = {
  cs: '/podpora',
  en: '/en/support',
  de: '/de/support',
}

const seoContent: Record<string, { title: string; description: string }> = {
  cs: {
    title: 'Podpora a FAQ',
    description: 'Odpovědi na nejčastější dotazy ohledně nabíjecích stanic MyBox, mobilní aplikace, solárního managementu a RFID autorizace.',
  },
  en: {
    title: 'Support & FAQ',
    description: 'Answers to frequently asked questions about MyBox charging stations, mobile app, solar management and RFID authorization.',
  },
  de: {
    title: 'Support & FAQ',
    description: 'Antworten auf häufig gestellte Fragen zu MyBox-Ladestationen, mobiler App, Solarmanagement und RFID-Autorisierung.',
  },
}

export async function generateMetadata({ params }: SupportPageProps): Promise<Metadata> {
  const { locale } = await params
  const content = seoContent[locale] || seoContent.cs

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `${baseUrl}${localizedPaths[locale]}`,
      languages: {
        cs: `${baseUrl}${localizedPaths.cs}`,
        en: `${baseUrl}${localizedPaths.en}`,
        de: `${baseUrl}${localizedPaths.de}`,
      },
    },
    openGraph: {
      title: `${content.title} | MyBox.eco`,
      description: content.description,
      url: `${baseUrl}${localizedPaths[locale]}`,
      siteName: 'MyBox.eco',
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title: `${content.title} | MyBox.eco`,
      description: content.description,
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
  }
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  // Fetch FAQs from database
  const supabase = await createClient()
  const { data: faqs } = await supabase
    .from('faqs')
    .select(`
      id,
      slug,
      category,
      is_active,
      sort_order,
      faq_translations (
        id,
        locale,
        question,
        answer
      )
    `)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Transform FAQs for JSON-LD (use Czech translations for structured data)
  const faqItemsForJsonLd = (faqs || []).map(faq => {
    const translation = faq.faq_translations?.find(t => t.locale === locale)
      || faq.faq_translations?.find(t => t.locale === 'cs')
      || faq.faq_translations?.[0]

    return {
      question: translation?.question || '',
      answer: translation?.answer?.replace(/<[^>]*>/g, '') || '' // Strip HTML for JSON-LD
    }
  }).filter(item => item.question && item.answer)

  return (
    <>
      {/* FAQ Structured Data */}
      {faqItemsForJsonLd.length > 0 && <FAQJsonLd items={faqItemsForJsonLd} />}

      {/* Page Content */}
      <SupportPageContent locale={locale} faqs={faqs || []} />
    </>
  )
}
