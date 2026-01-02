import { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { getPublishedArticles, getCategoriesWithCounts } from '@/lib/queries/article'
import type { Locale } from '@/config/locales'
import { ArticleGrid, CategoryFilter } from '@/components/blog'
import { CTASection } from '@/components/sections'
import { CollectionPageJsonLd } from '@/components/seo'

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

const baseUrl = 'https://mybox.eco'

// SEO descriptions per locale (longer, more keywords)
const seoDescriptions: Record<string, string> = {
  cs: 'Objevte novinky a zajímavosti ze světa elektromobility. Články o nabíjení elektromobilů, technologiích, trendech a případové studie od českého výrobce nabíjecích stanic MyBox.',
  en: 'Discover news and insights from the world of electromobility. Articles about EV charging, technologies, trends, and case studies from Czech charging station manufacturer MyBox.',
  de: 'Entdecken Sie Neuigkeiten und Einblicke aus der Welt der Elektromobilität. Artikel über EV-Laden, Technologien, Trends und Fallstudien vom tschechischen Ladestationshersteller MyBox.',
}

// SEO titles per locale (more descriptive)
const seoTitles: Record<string, string> = {
  cs: 'Blog o elektromobilitě',
  en: 'Electromobility Blog',
  de: 'Elektromobilität Blog',
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  const title = seoTitles[locale] || t('title')
  const description = seoDescriptions[locale] || t('subtitle')

  // Build canonical URL
  const canonicalUrl = locale === 'cs'
    ? `${baseUrl}/blog`
    : `${baseUrl}/${locale}/blog`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: `${baseUrl}/blog`,
        en: `${baseUrl}/en/blog`,
        de: `${baseUrl}/de/blog`,
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
          url: `${baseUrl}/images/og/blog-og.png`,
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
      images: [`${baseUrl}/images/og/blog-og.png`],
    },
    // Extended robots directives for optimal indexing
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // Additional meta tags for AI search and discoverability
    other: {
      // Google News optimization
      'news_keywords': locale === 'cs'
        ? 'elektromobilita, nabíjecí stanice, EV charging, elektromobily, dobíjení'
        : locale === 'de'
        ? 'Elektromobilität, Ladestationen, EV-Laden, Elektroautos'
        : 'electromobility, charging stations, EV charging, electric vehicles',
      // Content classification
      'coverage': 'Worldwide',
      'distribution': 'Global',
      'rating': 'General',
      // AI crawlers - explicitly allow (they check robots.txt primarily)
      'ai-content-declaration': 'human-created',
      // Bing specific
      'msnbot': 'index, follow',
      // Revisit suggestion
      'revisit-after': '7 days',
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('blog')

  // Use cached queries for better performance
  const [articles, categories] = await Promise.all([
    getPublishedArticles(locale as Locale),
    getCategoriesWithCounts(locale as Locale)
  ])

  // Build URL for JSON-LD
  const canonicalUrl = locale === 'cs'
    ? `${baseUrl}/blog`
    : `${baseUrl}/${locale}/blog`

  const title = seoTitles[locale] || t('title')
  const description = seoDescriptions[locale] || t('subtitle')

  return (
    <>
      {/* JSON-LD Structured Data */}
      <CollectionPageJsonLd
        title={title}
        description={description}
        url={canonicalUrl}
        locale={locale}
      />

      {/* Header section */}
      <section className="pt-32 pb-12">
        <div className="container-custom">
          {/* Title */}
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-text-primary md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 text-lg text-text-secondary">
              {t('subtitle')}
            </p>
          </div>

          {/* Category filter */}
          {categories && categories.length > 0 && (
            <div className="mt-10">
              <CategoryFilter
                categories={categories}
                locale={locale as 'cs' | 'en' | 'de'}
                allLabel={t('allCategories')}
              />
            </div>
          )}
        </div>
      </section>

      {/* Articles grid */}
      <section className="pb-20">
        <div className="container-custom">
          <ArticleGrid
            articles={articles || []}
            locale={locale as 'cs' | 'en' | 'de'}
            emptyMessage={t('noArticles')}
          />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        heading="Máte zájem o nabíjecí stanice?"
        description="Kontaktujte nás pro nezávaznou konzultaci. Rádi vám pomůžeme s výběrem správného řešení."
        buttonLabel="Kontaktujte nás"
        buttonHref="/kontakt"
      />
    </>
  )
}
