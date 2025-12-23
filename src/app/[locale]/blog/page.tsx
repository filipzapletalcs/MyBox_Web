import { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { ArticleGrid, CategoryFilter } from '@/components/blog'
import { CTASection } from '@/components/sections'

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | MyBox.eco`,
      description: t('subtitle'),
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('blog')
  const supabase = await createClient()

  // Fetch published articles
  const { data: articles } = await supabase
    .from('articles')
    .select(`
      id,
      slug,
      featured_image_url,
      published_at,
      article_translations(locale, title, excerpt),
      categories(slug, category_translations(locale, name))
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Fetch categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug, category_translations(locale, name)')
    .order('sort_order', { ascending: true })

  return (
    <>
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
