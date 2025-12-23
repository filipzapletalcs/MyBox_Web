import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { ArticleGrid, CategoryFilter } from '@/components/blog'
import { CTASection } from '@/components/sections'

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('slug, category_translations(locale, name, description)')
    .eq('slug', slug)
    .single()

  if (!category) {
    return { title: 'Kategorie nenalezena' }
  }

  const translation = category.category_translations?.find(t => t.locale === locale)
    || category.category_translations?.[0]

  const title = translation?.name || 'Kategorie'
  const description = translation?.description || `Články v kategorii ${title}`

  return {
    title: `${title} | Blog`,
    description,
    openGraph: {
      title: `${title} | Blog | MyBox.eco`,
      description,
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      siteName: 'MyBox.eco',
    },
    twitter: {
      card: 'summary',
      title: `${title} | Blog`,
      description,
    },
    alternates: {
      canonical: `https://mybox.eco/blog/kategorie/${slug}`,
      languages: {
        cs: `https://mybox.eco/blog/kategorie/${slug}`,
        en: `https://mybox.eco/en/blog/category/${slug}`,
        de: `https://mybox.eco/de/blog/kategorie/${slug}`,
      },
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const t = await getTranslations('blog')
  const supabase = await createClient()

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('id, slug, category_translations(locale, name, description)')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  // Get translation for current locale
  const categoryTranslation = category.category_translations?.find(t => t.locale === locale)
    || category.category_translations?.[0]

  if (!categoryTranslation) {
    notFound()
  }

  // Fetch articles in this category
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
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })

  // Fetch all categories for filter
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
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-green-400">
              {t('category')}
            </p>
            <h1 className="text-4xl font-bold text-text-primary md:text-5xl">
              {categoryTranslation.name}
            </h1>
            {categoryTranslation.description && (
              <p className="mt-4 text-lg text-text-secondary">
                {categoryTranslation.description}
              </p>
            )}
          </div>

          {/* Category filter */}
          {categories && categories.length > 0 && (
            <div className="mt-10">
              <CategoryFilter
                categories={categories}
                activeCategory={slug}
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
